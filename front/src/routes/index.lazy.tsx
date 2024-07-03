import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { constants } from "@/constants.ts";
import { useProviderStore } from "@/stores/provider.ts";
import { parseGnoEvaluateJsonResponse } from "@/utils";
import { User, usersSchema } from "@/types/user.ts";
import { UserCard } from "@/components/UserCard.tsx";

export const Route = createLazyFileRoute("/")({
	component: Index,
});

function Index() {
	const [users, setUsers] = useState<User[]>([]);
	const { provider } = useProviderStore();
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			const response = await provider.evaluateExpression(constants.realmPath, "GetUsers()");
			const parsedResponse = parseGnoEvaluateJsonResponse(response);
			const parsedBlogs = usersSchema.parse(parsedResponse);
			// TODO: handle error
			setUsers(parsedBlogs);
		})();
	}, [provider]);

	if (users.length === 0) return "No users";

	return (
		<>
			{users.map((user) => (
				<UserCard
					user={user}
					key={user.address}
					onClick={() => navigate({ to: `/user/${user.address}` })}
					className="cursor-pointer"
				/>
			))}
		</>
	);
}
