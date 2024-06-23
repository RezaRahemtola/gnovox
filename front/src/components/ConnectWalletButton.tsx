import { FC, useMemo, useState } from "react";
import { AdenaService } from "../services/adena/adena";
import { IAccountInfo } from "../services/adena/adena.types";
import { constants } from "../constants";
import { useAccountStore } from "@/stores/account";
import { displayBalance } from "../utils";
import { useToast } from "@/components/ui/use-toast.ts";
import { Button } from "@/components/ui/button.tsx";
import { GnoWSProvider } from "@gnolang/gno-js-client";

const WalletButton: FC = () => {
	const { toast } = useToast();
	const { setChainID, setAddress } = useAccountStore();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [accountInfo, setAccountInfo] = useState<IAccountInfo | null>(null);

	const fetchBalance = async () => {
		const accountInfo = await AdenaService.getAccountInfo();
		setAccountInfo(accountInfo);
	};

	const ugnots = useMemo<number>(() => {
		if (!accountInfo) return 0;
		return +accountInfo.coins.split("u")[0];
	}, [accountInfo]);

	const handleWalletConnect = async () => {
		setIsLoading(true);

		try {
			// Attempt to establish a connection
			await AdenaService.establishConnection("meme.land");

			// Get the account info
			const info: IAccountInfo = await AdenaService.getAccountInfo();

			// Make sure the network is valid
			await AdenaService.switchNetwork(constants.chainID);

			// Update the account context
			setAddress(info.address);
			setChainID(constants.chainID);

			await fetchBalance();

			const p = new GnoWSProvider(constants.chainRPC);
			console.log(p);
			// const a = await p.getFileContent(constants.realmPath);
			// console.log(a);
			const response = await p.evaluateExpression(constants.realmPath, "GetBlogs()");
			console.log(response);

			toast({
				title: "Connected to Adena",
				description: `Connected to ${info.address}`,
			});
		} catch (e) {
			console.error(e);

			toast({
				title: "Failed to connect to Adena",
				description: "Please make sure you have the Adena wallet installed",
				variant: "destructive",
			});
		}

		setIsLoading(false);
	};
	return (
		<>
			<Button onClick={handleWalletConnect} disabled={isLoading}>
				{accountInfo === null ? "Connect wallet" : displayBalance(ugnots)}
			</Button>
		</>
	);
};

export default WalletButton;
