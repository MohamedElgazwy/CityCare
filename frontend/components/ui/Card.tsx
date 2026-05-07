"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
};

export default function Card({ children, className = "", hoverable = false }: Props) {
  return (
    <div
      className={`
        rounded-2xl bg-white border border-gray-100 shadow-md
        ${hoverable ? "hover:shadow-xl hover:-translate-y-1 transition-all duration-300" : ""}
        p-6
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}
