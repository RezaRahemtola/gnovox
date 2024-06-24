import { create } from "zustand";
import { GnoWSProvider } from "@gnolang/gno-js-client";
import { constants } from "@/constants.ts";

const useProviderStore = create(() => ({
	provider: new GnoWSProvider(constants.chainRPC),
}));

export { useProviderStore };
