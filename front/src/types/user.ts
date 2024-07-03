import { z } from "zod";
import { postSchema } from "@/types/post.ts";

export const userSchema = z.object({
	address: z.string(),
	username: z.string(),
	posts: z.array(postSchema),
});
export const usersSchema = z.array(userSchema);
export type User = z.infer<typeof userSchema>;
