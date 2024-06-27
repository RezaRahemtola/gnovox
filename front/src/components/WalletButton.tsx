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
import { useProviderStore } from "@/stores/provider.ts";
import { parseGnoEvaluateJsonResponse } from "@/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { LogOut, Settings } from "lucide-react";

const userSchema = z.object({
	address: z.string(),
	username: z.string(),
});

const WalletButton: FC = () => {
	const { provider } = useProviderStore();
	const navigate = useNavigate();

	const { toast } = useToast();
	const { setAddress, setUsername, setChainID } = useAccountStore();
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

			try {
				const response = await provider.evaluateExpression(
					constants.realmPath,
					`GetUserByAddress("${accountInfo.address}")`,
				);
				const jsonResponse = parseGnoEvaluateJsonResponse(response);
				const parsedResponse = userSchema.parse(jsonResponse);
				setUsername(parsedResponse.username);
			} catch (error) {
				await navigate({ to: "/signup" });
			}

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
						<DropdownMenuItem>
							<Link to="/settings" className="flex gap-1">
								<Settings />
								<span className="my-auto">Settings</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={onLogout} className="cursor-pointer gap-1">
							<LogOut />
							<span className="my-auto">Logout</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</>
	);
};

export default WalletButton;
