import { createLazyFileRoute } from "@tanstack/react-router";
import "@mdxeditor/editor/style.css";
import { useEffect, useState } from "react";
import { constants } from "@/constants.ts";
import { parseGnoEvaluateJsonResponse } from "@/utils";
import { useProviderStore } from "@/stores/provider.ts";
import { useToast } from "@/components/ui/use-toast.ts";
import { User, userSchema } from "@/types/user.ts";

const UserPage = () => {
	const { provider } = useProviderStore();
	const { toast } = useToast();
	const { username } = Route.useParams();
	const [pageUser, setPageUser] = useState<User | null>(null);

	useEffect(() => {
		(async () => {
			try {
				// TODO: Get by username instead
				const response = await provider.evaluateExpression(constants.realmPath, `GetUserByAddress("${username}")`);
				const jsonResponse = parseGnoEvaluateJsonResponse(response);
				const parsedResponse = userSchema.parse(jsonResponse);
				setPageUser(parsedResponse);
			} catch (error) {
				// TODO: redirect to 404
				toast({
					title: "User not found",
					variant: "destructive",
				});
			}
		})();
	}, []);

	if (pageUser !== null) {
		return (
			<>
				<p>Address: {pageUser.address}</p>
				<p>Username: {pageUser.username}</p>
				{pageUser.posts.map((post) => (
					<div key={post.slug}>
						<p>{post.title}</p>
						<p>{post.slug}</p>
					</div>
				))}
			</>
		);
	}
};

export const Route = createLazyFileRoute("/user/$username")({
	component: UserPage,
});
