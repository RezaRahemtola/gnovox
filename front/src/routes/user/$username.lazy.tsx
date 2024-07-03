import { createLazyFileRoute } from "@tanstack/react-router";
import "@mdxeditor/editor/style.css";
import { useEffect, useState } from "react";
import { constants } from "@/constants.ts";
import { parseGnoEvaluateJsonResponse } from "@/utils";
import { useProviderStore } from "@/stores/provider.ts";
import { useToast } from "@/components/ui/use-toast.ts";
import { User, userSchema } from "@/types/user.ts";
import { UserCard } from "@/components/UserCard.tsx";
import { PostCard } from "@/components/PostCard.tsx";

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
		// 	eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (pageUser !== null) {
		return (
			<>
				<UserCard user={pageUser} className="mx-auto" />
				<h2 className="mt-5 text-3xl font-bold">Posts</h2>
				{pageUser.posts.map((post) => (
					<PostCard author={pageUser.address} post={post} key={post.slug} />
				))}
			</>
		);
	}
};

export const Route = createLazyFileRoute("/user/$username")({
	component: UserPage,
});
