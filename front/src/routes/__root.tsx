import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import WalletButton from "@/components/WalletButton.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";
import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useAccountStore } from "@/stores/account.ts";

const RootLayout = () => {
	const { address } = useAccountStore();

	return (
		<>
			<div className="flex justify-between p-2">
				<div className="flex items-center">
					<Link to="/">
						<p className="cursor-pointer font-semibold">gnovox</p>
					</Link>
				</div>
				<div className="flex items-center gap-4">
					<Link to="/write">
						<Button variant="ghost" className="gap-2" disabled={address === null}>
							<SquarePen />
							Write
						</Button>
					</Link>

					<WalletButton />
				</div>
			</div>
			<hr />
			<Outlet />
			<Toaster />
		</>
	);
};

export const Route = createRootRoute({
	component: RootLayout,
});
