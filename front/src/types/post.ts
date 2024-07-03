import { z } from "zod";

export const postSchema = z.object({
	slug: z.string(),
	title: z.string(),
	body: z.string(),
});

export type Post = z.infer<typeof postSchema>;
