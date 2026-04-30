"use client";

import React from "react";

type Props = {
	children: React.ReactNode;
	className?: string;
};

export default function Card({ children, className = "" }: Props) {
	return (
		<div className={`rounded-lg border p-4 bg-white ${className}`.trim()}>
			{children}
		</div>
	);
}

