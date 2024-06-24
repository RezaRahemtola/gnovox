import { FC, useMemo, useState } from "react";
import { AdenaService } from "../services/adena/adena";
import { IAccountInfo } from "../services/adena/adena.types";
import { constants } from "../constants";
import { useAccountStore } from "@/stores/account";
import { displayBalance } from "@/utils";
import { useToast } from "@/components/ui/use-toast.ts";
import { Button } from "@/components/ui/button.tsx";

const WalletButton: FC = () => {
	const { toast } = useToast();
	const { setChainID, setAddress } = useAccountStore();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [accountInfo, setAccountInfo] = useState<IAccountInfo | null>(null);

	const ugnots = useMemo<number>(() => {
		if (!accountInfo) return 0;
		return +accountInfo.coins.split("u")[0];
	}, [accountInfo]);

	const handleWalletConnect = async () => {
		setIsLoading(true);

		try {
			// Attempt to establish a connection
			await AdenaService.establishConnection("gnovox");

			// Make sure the network is valid
			await AdenaService.switchNetwork(constants.chainID);

			// Get the account info
			const accountInfo: IAccountInfo = await AdenaService.getAccountInfo();

			// Update the account context
			setAddress(accountInfo.address);
			setAccountInfo(accountInfo);
			setChainID(constants.chainID);

			toast({
				title: "Connected to Adena",
				description: `Connected to ${accountInfo.address}`,
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
			<Button onClick={handleWalletConnect} disabled={accountInfo !== null || isLoading}>
				{accountInfo === null ? "Connect wallet" : displayBalance(ugnots)}
			</Button>
		</>
	);
};

export default WalletButton;
