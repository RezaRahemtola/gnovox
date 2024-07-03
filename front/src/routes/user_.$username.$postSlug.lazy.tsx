import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/user/$username/$postSlug")({
	component: () => <div>Hello /user/$username/$postSlug!</div>,
});
