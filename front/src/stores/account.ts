import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAccountStore = create<{
	address: string | null;
	chainID: string | null;
	setAddress: (address: string) => void;
	setChainID: (chainID: string) => void;
}>()(
	persist(
		(set) => ({
			address: null,
			chainID: null,
			setAddress: (address: string) => set({ address }),
			setChainID: (chainID: string) => set({ chainID }),
		}),
		{
			name: "account-storage",
		},
	),
);

export { useAccountStore };
