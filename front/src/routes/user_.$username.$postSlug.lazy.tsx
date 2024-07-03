import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { constants } from "@/constants.ts";
import { parseGnoEvaluateJsonResponse } from "@/utils";
import { useProviderStore } from "@/stores/provider.ts";
import { useToast } from "@/components/ui/use-toast.ts";
import { Post, postSchema } from "@/types/post.ts";
import {
	diffSourcePlugin,
	headingsPlugin,
	linkPlugin,
	listsPlugin,
	markdownShortcutPlugin,
	MDXEditor,
	quotePlugin,
	tablePlugin,
	thematicBreakPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

const PostPage = () => {
	const { provider } = useProviderStore();
	const { toast } = useToast();
	const { username, postSlug } = Route.useParams();
	const [pagePost, setPagePost] = useState<Post | null>(null);

	useEffect(() => {
		(async () => {
			try {
				// TODO: Get by username instead
				const response = await provider.evaluateExpression(
					constants.realmPath,
					`GetPost("${username}", "${postSlug}")`,
				);
				const jsonResponse = parseGnoEvaluateJsonResponse(response);
				const parsedResponse = postSchema.parse(jsonResponse);
				setPagePost(parsedResponse);
			} catch (error) {
				// TODO: redirect to 404
				toast({
					title: "Post not found",
					variant: "destructive",
				});
			}
		})();
		// 	eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (pagePost === null) {
		return "Post not found";
	}
	return (
		<MDXEditor
			readOnly
			className="mx-5"
			contentEditableClassName="prose"
			markdown={pagePost.body.replace(/\\n|\\r\\n|\\n\\r|\\r/g, "\n")}
			plugins={[
				headingsPlugin(),
				quotePlugin(),
				listsPlugin(),
				thematicBreakPlugin(),
				linkPlugin(),
				tablePlugin(),
				markdownShortcutPlugin(),
				diffSourcePlugin(),
			]}
		/>
	);
};

export const Route = createLazyFileRoute("/user/$username/$postSlug")({
	component: PostPage,
});
