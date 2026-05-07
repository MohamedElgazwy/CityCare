"use client";

import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({ variant = "primary", size = "md", className = "", children, ...rest }: Props) {
  const base = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500",
    secondary: "bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md focus:ring-gray-500",
    outline: "bg-transparent border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500",
  };

  return (
    <button
      className={`${base} ${sizeClasses[size]} ${variants[variant]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
