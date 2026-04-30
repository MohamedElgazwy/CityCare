"use client";

import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: "primary" | "secondary";
	className?: string;
};

export default function Button({ variant = "primary", className = "", children, ...rest }: Props) {
	const base = "inline-flex items-center justify-center rounded px-3 py-1 text-sm";
	const style = variant === "primary"
		? "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
		: "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50";

	return (
		<button className={`${base} ${style} ${className}`.trim()} {...rest}>
			{children}
		</button>
	);
}

