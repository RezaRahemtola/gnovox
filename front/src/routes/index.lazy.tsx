import { createLazyFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState } from "react";
import { constants } from "@/constants.ts";
import { useProviderStore } from "@/stores/provider.ts";
import { parseGnoEvaluateJsonResponse } from "@/utils";

export const Route = createLazyFileRoute("/")({
	component: Index,
});

const usersSchema = z.array(
	z.object({
		address: z.string(),
		username: z.string(),
	}),
);
type Users = z.infer<typeof usersSchema>;

function Index() {
	const [users, setUsers] = useState<Users>([]);
	const { provider } = useProviderStore();

	useEffect(() => {
		(async () => {
			const response = await provider.evaluateExpression(constants.realmPath, "GetUsers()");
			const parsedResponse = parseGnoEvaluateJsonResponse(response);
			const parsedBlogs = usersSchema.parse(parsedResponse);
			// TODO: handle error
			setUsers(parsedBlogs);
		})();
	}, [provider]);

	return (
		<>
			{users.length === 0
				? "No users"
				: users.map((user) => (
						<div key={user.address}>
							<p>Address: {user.address}</p>
							<p>Username: {user.username}</p>
						</div>
					))}
		</>
	);
}
