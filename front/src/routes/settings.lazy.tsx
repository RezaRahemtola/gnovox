import { createLazyFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdenaService } from "@/services/adena/adena.ts";
import { EMessageType } from "@/services/adena/adena.types.ts";
import { constants } from "@/constants.ts";
import { useAccountStore } from "@/stores/account.ts";

const profileFormSchema = z.object({
	username: z.string().min(3).max(50),
});
type ProfileFormSchema = z.infer<typeof profileFormSchema>;

const Settings = () => {
	const { address, username, setUsername } = useAccountStore();

	const form = useForm<ProfileFormSchema>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			username: username ?? undefined,
		},
	});

	const onSubmit = async (values: ProfileFormSchema) => {
		// TODO: check that username changed to avoid useless transactions
		await AdenaService.sendTransaction(
			[
				{
					type: EMessageType.MSG_CALL,
					value: {
						caller: address!,
						send: "",
						pkg_path: constants.realmPath,
						func: "UpdateUser",
						args: [values.username],
					},
				},
			],
			5000000,
		);
		setUsername(values.username);
	};

	return (
		<div className="flex min-h-screen w-full flex-col">
			<main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
				<div className="mx-auto grid w-full max-w-6xl gap-2">
					<h1 className="text-3xl font-semibold">Settings</h1>
				</div>
				<div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
					<nav className="grid gap-4 text-sm text-muted-foreground">
						<span className="font-semibold text-primary">General</span>
					</nav>
					<div className="grid gap-6">
						<Card x-chunk="dashboard-04-chunk-1">
							<CardHeader>
								<CardTitle>Profile</CardTitle>
								<CardDescription>Update your information</CardDescription>
							</CardHeader>
							<CardContent>
								<Form {...form}>
									<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
										<FormField
											control={form.control}
											name="username"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Username</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</form>
								</Form>
							</CardContent>
							<CardFooter className="border-t px-6 py-4">
								<Button onClick={form.handleSubmit(onSubmit)}>Save</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
};

export const Route = createLazyFileRoute("/settings")({
	component: Settings,
});
