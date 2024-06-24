import { Toaster } from "@/components/ui/toaster.tsx";
import ConnectWalletButton from "@/components/ConnectWalletButton.tsx";
import { constants } from "@/constants.ts";
import { useProviderStore } from "@/stores/provider.ts";
import { useEffect, useState } from "react";
import { z } from "zod";

const blogsSchema = z.array(
	z.object({
		name: z.string(),
	}),
);
type Blogs = z.infer<typeof blogsSchema>;

function App() {
	const [blogs, setBlogs] = useState<Blogs>([]);
	const { provider } = useProviderStore();

	useEffect(() => {
		(async () => {
			const response = await provider.evaluateExpression(constants.realmPath, "GetBlogs()");
			console.log(response);
			const responseWithoutType = response.slice(2, -9).replace(/\\/g, "");
			const parsedBlogs = blogsSchema.parse(JSON.parse(responseWithoutType));
			// TODO: handle error
			setBlogs(parsedBlogs);
		})();
	}, [provider]);

	return (
		<>
			<ConnectWalletButton />
			{blogs.map((blog) => (
				<p key={blog.name}>{blog.name}</p>
			))}
			<Toaster />
		</>
	);
}

export default App;
