import { createLazyFileRoute } from "@tanstack/react-router";
import {
	BoldItalicUnderlineToggles,
	diffSourcePlugin,
	DiffSourceToggleWrapper,
	headingsPlugin,
	linkPlugin,
	listsPlugin,
	markdownShortcutPlugin,
	MDXEditor,
	MDXEditorMethods,
	quotePlugin,
	tablePlugin,
	thematicBreakPlugin,
	toolbarPlugin,
	UndoRedo,
} from "@mdxeditor/editor";
import { useRef } from "react";
import { AdenaService } from "@/services/adena/adena.ts";
import { EMessageType } from "@/services/adena/adena.types.ts";
import { constants } from "@/constants.ts";
import { useAccountStore } from "@/stores/account.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import "@mdxeditor/editor/style.css";

const newPostSchema = z.object({
	title: z.string(),
	slug: z.string(),
});
type NewPostSchema = z.infer<typeof newPostSchema>;

const WritePage = () => {
	const editorRef = useRef<MDXEditorMethods>(null);
	const { address } = useAccountStore();

	const form = useForm<NewPostSchema>({
		resolver: zodResolver(newPostSchema),
		defaultValues: {
			slug: "",
			title: "",
		},
	});

	const onSubmit = async (values: NewPostSchema) => {
		const content = editorRef.current!.getMarkdown();

		await AdenaService.sendTransaction(
			[
				{
					type: EMessageType.MSG_CALL,
					value: {
						caller: address!,
						send: "",
						pkg_path: constants.realmPath,
						func: "NewPost",
						args: [values.slug, values.title, content],
					},
				},
			],
			5000000,
		);
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>General information</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="title"
								rules={{ required: true }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input placeholder="My super post" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="slug"
								rules={{ required: true }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Slug</FormLabel>
										<FormControl>
											<Input placeholder="my-super-post" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button disabled={!form.formState.isDirty} type="submit">
								Publish
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
			<MDXEditor
				ref={editorRef}
				className="mx-5"
				contentEditableClassName="prose"
				markdown="# Hello World"
				plugins={[
					headingsPlugin(),
					quotePlugin(),
					listsPlugin(),
					thematicBreakPlugin(),
					linkPlugin(),
					tablePlugin(),
					markdownShortcutPlugin(),
					diffSourcePlugin(),
					toolbarPlugin({
						toolbarContents: () => (
							<>
								<DiffSourceToggleWrapper>
									<UndoRedo />
									<BoldItalicUnderlineToggles />
								</DiffSourceToggleWrapper>
							</>
						),
					}),
				]}
			/>
		</>
	);
};

export const Route = createLazyFileRoute("/write")({
	component: WritePage,
});
