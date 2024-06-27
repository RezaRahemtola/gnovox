import { createLazyFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form.tsx";
import { Button } from "@/components/ui/button.tsx";
import { AdenaService } from "@/services/adena/adena.ts";
import { EMessageType } from "@/services/adena/adena.types.ts";
import { useAccountStore } from "@/stores/account.ts";
import { constants } from "@/constants.ts";

const signupFormSchema = z.object({
	username: z.string().min(3).max(50),
});
type SignupFormSchema = z.infer<typeof signupFormSchema>;

const Signup = () => {
	const { address } = useAccountStore();

	const form = useForm<SignupFormSchema>({
		resolver: zodResolver(signupFormSchema),
		defaultValues: {
			username: "",
		},
	});

	const onSubmit = async (values: SignupFormSchema) => {
		await AdenaService.sendTransaction(
			[
				{
					type: EMessageType.MSG_CALL,
					value: {
						caller: address!,
						send: "",
						pkg_path: constants.realmPath,
						func: "AddUser",
						args: [values.username],
					},
				},
			],
			5000000,
		);
	};

	return (
		<>
			{/*TODO: check that wallet is connected*/}
			<h2 className="text-2xl font-semibold">Welcome to gnovox!</h2>
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
					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</>
	);
};

export const Route = createLazyFileRoute("/signup")({
	component: Signup,
});
