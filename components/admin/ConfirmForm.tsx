"use client";

import type { ReactNode } from "react";

export function ConfirmForm({
  action,
  confirmMessage,
  children,
  className,
}: {
  action: (formData: FormData) => void | Promise<void>;
  confirmMessage: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
      className={className}
    >
      {children}
    </form>
  );
}
