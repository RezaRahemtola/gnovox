import { Toaster } from "@/components/ui/toaster.tsx";
import ConnectWalletButton from "@/components/ConnectWalletButton.tsx";

function App() {
	return (
		<>
			<ConnectWalletButton />
			<Toaster />
		</>
	);
}

export default App;
