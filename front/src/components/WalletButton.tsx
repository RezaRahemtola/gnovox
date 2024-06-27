import { FC, useState } from "react";
import { AdenaService } from "../services/adena/adena";
import { IAccountInfo } from "../services/adena/adena.types";
import { constants } from "../constants";
import { useAccountStore } from "@/stores/account";
import { useToast } from "@/components/ui/use-toast.ts";
import { Button } from "@/components/ui/button.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";

const WalletButton: FC = () => {
	const { toast } = useToast();
	const { setAddress, setChainID } = useAccountStore();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [accountInfo, setAccountInfo] = useState<IAccountInfo | null>(null);

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

	const onLogout = () => {
		setAddress(null);
		setAccountInfo(null);
		setChainID(null);
	};

	return (
		<>
			{accountInfo === null ? (
				<Button onClick={handleWalletConnect} disabled={isLoading}>
					Connect wallet
				</Button>
			) : (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="icon" className="overflow-hidden rounded-full">
							<img
								src="/assets/user.png"
								width={36}
								height={36}
								alt="Avatar"
								className="overflow-hidden rounded-full"
							/>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem disabled>Settings</DropdownMenuItem>
						<DropdownMenuItem disabled>Support</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</>
	);
};

export default WalletButton;
