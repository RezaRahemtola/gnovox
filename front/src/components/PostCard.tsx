import { Post } from "@/types/post.ts";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "@tanstack/react-router";

type PostCardProps = {
	author: string;
	post: Post;
};

export const PostCard = ({ author, post }: PostCardProps) => {
	const navigate = useNavigate();

	return (
		<div className="w-fit overflow-hidden rounded p-4 shadow-lg">
			<div className="px-6 py-4">
				<div className="mb-2 text-center text-xl font-bold">{post.title}</div>
				<Button onClick={() => navigate({ to: `/user/${author}/${post.slug}` })}>Read</Button>
			</div>
		</div>
	);
};
