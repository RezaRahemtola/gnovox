import { create } from "zustand";
import { User } from "@/types/user.ts";

type AccountUser = Omit<User, "address">;

type AccountState = {
	address: string | null;
	user: AccountUser | null;
};

type AccountActions = {
	setAddress: (address: string | null) => void;
	setUser: (user: AccountUser | null) => void;
};

const useAccountStore = create<AccountState & AccountActions>((set) => ({
	address: null,
	user: null,
	setAddress: (address) => set(() => ({ address })),
	setUser: (user) => set(() => ({ user })),
}));

export { useAccountStore };
