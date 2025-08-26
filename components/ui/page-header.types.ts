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

// Preset action configurations
export type ActionPreset =
  | "signOut"
  | "back"
  | "save"
  | "cancel"
  | "edit"
  | "delete";

export interface PresetActionOptions {
  label?: string;
  href?: string;
  onClick?: () => void;
  variant?: HeaderAction["variant"];
  disabled?: boolean;
}

// Page-specific configurations
export interface AccountsPageConfig {
  showSearch?: boolean;
  customActions?: HeaderAction[];
}

export interface AccountDashboardConfig {
  accountName?: string;
  showBackButton?: boolean;
  customActions?: HeaderAction[];
}

export interface PlanConfigConfig {
  account: string;
  replaceId?: string | null;
  mode?: "create" | "edit" | "replace";
  customActions?: HeaderAction[];
}
