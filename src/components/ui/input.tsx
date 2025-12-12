import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-gray-400 selection:bg-blue-200 selection:text-gray-900 bg-white border-gray-200 flex h-10 w-full min-w-0 rounded-xl border px-4 py-2 text-base text-gray-900 transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm shadow-sm",
        "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
        "hover:border-gray-300",
        className,
      )}
      {...props}
    />
  );
}

export { Input };