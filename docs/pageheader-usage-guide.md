# PageHeader Component Usage Guide

The `PageHeader` component provides a consistent, reusable header across all pages in the Hippo Portal application.

## Basic Usage

```tsx
import { PageHeader } from "@/components/ui/page-header";

<PageHeader title="Page Title" actions={[]} />;
```

## Props

### `PageHeaderProps`

| Prop         | Type             | Required | Description                            |
| ------------ | ---------------- | -------- | -------------------------------------- |
| `title`      | `string`         | Yes      | Main page title                        |
| `subtitle`   | `string`         | No       | Optional subtitle below the title      |
| `breadcrumb` | `ReactNode`      | No       | Optional breadcrumb navigation element |
| `actions`    | `HeaderAction[]` | No       | Array of action buttons                |
| `className`  | `string`         | No       | Additional CSS classes                 |

### `HeaderAction`

| Prop        | Type           | Required | Description                             |
| ----------- | -------------- | -------- | --------------------------------------- |
| `id`        | `string`       | Yes      | Unique identifier for the action        |
| `label`     | `string`       | Yes      | Button text                             |
| `href`      | `string`       | No       | Link destination (creates Link wrapper) |
| `onClick`   | `() => void`   | No       | Click handler for buttons without links |
| `variant`   | Button variant | No       | Button style variant                    |
| `size`      | Button size    | No       | Button size                             |
| `className` | `string`       | No       | Additional CSS classes                  |
| `disabled`  | `boolean`      | No       | Disable the button                      |

## Examples

### 1. Simple Page with Sign Out

```tsx
import { PageHeader, createSignOutAction } from "@/components/ui/page-header";

<PageHeader title="Accounts" actions={[createSignOutAction()]} />;
```

### 2. Page with Back Navigation

```tsx
import {
  PageHeader,
  createBackAction,
  createSignOutAction,
} from "@/components/ui/page-header";

<PageHeader
  title="Account Dashboard"
  actions={[
    createBackAction("/accounts", "Back to Accounts"),
    createSignOutAction(),
  ]}
/>;
```

### 3. Page with Custom Actions

```tsx
import { PageHeader, HeaderAction } from "@/components/ui/page-header";

const customActions: HeaderAction[] = [
  {
    id: "save",
    label: "Save Changes",
    onClick: handleSave,
    variant: "default",
  },
  {
    id: "cancel",
    label: "Cancel",
    href: "/accounts",
    variant: "outline",
  },
  {
    id: "signout",
    label: "Sign Out",
    href: "/login",
    variant: "ghost",
  },
];

<PageHeader
  title="Edit Plan"
  subtitle="Configure plan settings"
  actions={customActions}
/>;
```

### 4. Page with Breadcrumb

```tsx
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const breadcrumb = (
  <Link href="/accounts">
    <Button variant="ghost" size="sm">
      ← Back to Accounts
    </Button>
  </Link>
);

<PageHeader
  title="Plan Configuration"
  breadcrumb={breadcrumb}
  actions={[createSignOutAction()]}
/>;
```

## Preset Action Creators

The component includes several preset functions for common actions:

### `createSignOutAction(href?, label?)`

Creates a standard sign-out button.

```tsx
createSignOutAction(); // Default: goes to "/login"
createSignOutAction("/auth/logout", "Logout");
```

### `createBackAction(href, label?)`

Creates a back navigation button.

```tsx
createBackAction("/accounts"); // Default label: "Back"
createBackAction("/plans", "Back to Plans");
```

### `createPrimaryAction(label, href?, onClick?)`

Creates a primary action button.

```tsx
createPrimaryAction("Save", undefined, handleSave);
createPrimaryAction("Continue", "/next-step");
```

### `createOutlineAction(label, href?, onClick?)`

Creates an outline style button.

```tsx
createOutlineAction("Cancel", "/accounts");
createOutlineAction("Reset", undefined, handleReset);
```

## Preset Page Configurations

For common page types, use these preset configurations:

### `createAccountsPageActions()`

Standard actions for the accounts listing page.

### `createAccountDashboardActions(accountName?)`

Standard actions for account dashboard pages.

### `createPlanConfigActions(account, replaceId?)`

Standard actions for plan configuration pages.

## Migration Examples

### Before (Manual Header)

```tsx
<div className="bg-white border-b">
  <div className="max-w-7xl mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">Page Title</h1>
      <div className="flex gap-2">
        <Link href="/back">
          <Button variant="outline">Back</Button>
        </Link>
        <Link href="/login">
          <Button variant="ghost">Sign Out</Button>
        </Link>
      </div>
    </div>
  </div>
</div>
```

### After (PageHeader Component)

```tsx
<PageHeader
  title="Page Title"
  actions={[createBackAction("/back"), createSignOutAction()]}
/>
```

## Advanced Usage

### Dynamic Actions Based on State

```tsx
const [isEditing, setIsEditing] = useState(false);

const getActions = (): HeaderAction[] => {
  if (isEditing) {
    return [
      {
        id: "save",
        label: "Save",
        onClick: handleSave,
        variant: "default",
      },
      {
        id: "cancel",
        label: "Cancel",
        onClick: () => setIsEditing(false),
        variant: "outline",
      },
    ];
  }

  return [
    {
      id: "edit",
      label: "Edit",
      onClick: () => setIsEditing(true),
      variant: "outline",
    },
    createSignOutAction(),
  ];
};

<PageHeader title="Plan Details" actions={getActions()} />;
```

### Conditional Actions

```tsx
const actions: HeaderAction[] = [
  createBackAction("/accounts"),
  ...(userCanEdit
    ? [
        {
          id: "edit",
          label: "Edit",
          href: `/edit/${planId}`,
          variant: "outline" as const,
        },
      ]
    : []),
  createSignOutAction(),
];
```

## Best Practices

1. **Consistent Actions**: Use preset action creators for common buttons
2. **Logical Order**: Place primary actions on the right, navigation on the left
3. **State Management**: Update actions based on component state when needed
4. **Accessibility**: Ensure all actions have meaningful labels
5. **Performance**: Memoize complex action arrays if they cause re-renders

## Styling

The component uses consistent styling that matches the existing design system:

- White background with bottom border
- Max width container with horizontal padding
- Responsive flex layout
- Standard text sizing and colors

Additional styling can be applied via the `className` prop on both the component and individual actions.
