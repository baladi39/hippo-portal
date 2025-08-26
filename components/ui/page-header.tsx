import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

export interface HeaderAction {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: ReactNode;
  actions?: HeaderAction[];
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumb,
  actions = [],
  className = "",
}: PageHeaderProps) {
  const renderAction = (action: HeaderAction) => {
    const buttonElement = (
      <Button
        key={action.id}
        variant={action.variant || "ghost"}
        size={action.size || "default"}
        onClick={action.onClick}
        className={action.className}
        disabled={action.disabled}
      >
        {action.label}
      </Button>
    );

    if (action.href && !action.disabled) {
      return (
        <Link key={action.id} href={action.href}>
          {buttonElement}
        </Link>
      );
    }

    return buttonElement;
  };

  return (
    <div className={`bg-white border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {breadcrumb}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          {actions.length > 0 && (
            <div className="flex gap-2">{actions.map(renderAction)}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Common header action presets for quick usage
export const createBackAction = (
  href: string,
  label: string = "Back"
): HeaderAction => ({
  id: "back",
  label,
  href,
  variant: "ghost",
  size: "sm",
});

export const createSignOutAction = (
  href: string = "/login",
  label: string = "Sign Out"
): HeaderAction => ({
  id: "signout",
  label,
  href,
  variant: "ghost",
});

export const createPrimaryAction = (
  label: string,
  href?: string,
  onClick?: () => void
): HeaderAction => ({
  id: "primary",
  label,
  href,
  onClick,
  variant: "default",
});

export const createOutlineAction = (
  label: string,
  href?: string,
  onClick?: () => void
): HeaderAction => ({
  id: "outline",
  label,
  href,
  onClick,
  variant: "outline",
});

// Preset configurations for common page types
export const createAccountsPageActions = (): HeaderAction[] => [
  createSignOutAction(),
];

export const createAccountDashboardActions = (
  accountName?: string
): HeaderAction[] => [
  createBackAction("/accounts", "Back to Accounts"),
  createSignOutAction(),
];

export const createPlanConfigActions = (
  account: string,
  replaceId?: string | null
): HeaderAction[] => [
  createBackAction(
    replaceId
      ? `/replace-plan?account=${encodeURIComponent(
          account
        )}&planId=${replaceId}`
      : `/add-plan?account=${encodeURIComponent(account)}`,
    "Back to Plan Selection"
  ),
  createSignOutAction(),
];
