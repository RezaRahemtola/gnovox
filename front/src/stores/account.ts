import { create } from "zustand";

type AccountState = {
	address: string | null;
	chainID: string | null;
};

type AccountActions = {
	setAddress: (address: string | null) => void;
	setChainID: (chainID: string | null) => void;
};

const useAccountStore = create<AccountState & AccountActions>((set) => ({
	address: null,
	chainID: null,
	setAddress: (address) => set(() => ({ address })),
	setChainID: (address) => set(() => ({ address })),
}));

export { useAccountStore };
