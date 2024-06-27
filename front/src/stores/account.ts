import { create } from "zustand";

type AccountState = {
	address: string | null;
	username: string | null;
	chainID: string | null;
};

type AccountActions = {
	setAddress: (address: string | null) => void;
	setUsername: (username: string | null) => void;
	setChainID: (chainID: string | null) => void;
};

const useAccountStore = create<AccountState & AccountActions>((set) => ({
	address: null,
	username: null,
	chainID: null,
	setAddress: (address) => set(() => ({ address })),
	setUsername: (username) => set(() => ({ username })),
	setChainID: (chainID) => set(() => ({ chainID })),
}));

export { useAccountStore };
