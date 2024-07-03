import { User } from "@/types/user.ts";
import { HTMLAttributes } from "react";

type UserCardProps = {
	user: User;
} & HTMLAttributes<HTMLDivElement>;

export const UserCard = ({ user, className, ...props }: UserCardProps) => {
	const containerClass = (className ?? "") + " shadow-lg w-fit overflow-hidden rounded p-6";

	return (
		<div className={containerClass} {...props}>
			<img className="mx-auto w-32" src="/assets/user.png" alt="User" />
			<div className="px-6 py-4">
				<div className="mb-2 text-xl font-bold">{user.username}</div>
				<p className="text-base text-gray-700">{user.address}</p>
			</div>
		</div>
	);
};
