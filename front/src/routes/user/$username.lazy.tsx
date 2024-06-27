import { createLazyFileRoute } from "@tanstack/react-router";

const UserPage = () => {
	return <div>Hello /user/$userId!</div>;
};

export const Route = createLazyFileRoute("/user/$username")({
	component: UserPage,
});
