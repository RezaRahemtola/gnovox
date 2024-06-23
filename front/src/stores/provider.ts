import { create } from "zustand";
import { GnoWSProvider } from "@gnolang/gno-js-client";
import { persist } from "zustand/middleware";
import { constants } from "@/constants.ts";

const useProviderStore = create<{
	provider: GnoWSProvider;
}>()(
	persist(
		() => ({
			provider: new GnoWSProvider(constants.chainRPC),
		}),
		{
			name: "provider-storage",
		},
	),
);

export { useProviderStore };
