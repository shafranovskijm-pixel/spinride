
## Fix Quick Action Buttons on Admin Dashboard

### Problem
The "Quick Actions" section on the admin dashboard has three buttons that don't work correctly:

1. **"Добавить товар"** -- links to `/admin/products/new`, a route that does not exist. Product creation now uses a dialog on the `/admin/products` page.
2. **"Обработать заказы"** and **"Настройки"** -- these routes exist (`/admin/orders`, `/admin/settings`), but likely also have issues with click handling.

### Solution

Update the quick action buttons in `src/pages/admin/AdminDashboard.tsx` (lines 394-413):

1. **"Добавить товар"** -- change the link from `/admin/products/new` to `/admin/products` (the product list page, where the user can click "Add Product" to open the dialog).
2. **"Обработать заказы"** -- keep link to `/admin/orders` (already correct).
3. **"Настройки"** -- keep link to `/admin/settings` (already correct).

All three buttons use `Button asChild` with `Link` inside, which is the correct pattern. The main fix is the broken route for "Добавить товар".

### Technical Details

**File:** `src/pages/admin/AdminDashboard.tsx`, lines 395-400

Change:
```tsx
<Link to="/admin/products/new">
```
To:
```tsx
<Link to="/admin/products">
```

This is a one-line fix. The other two buttons point to valid routes and should work correctly once the page is deployed/previewed with the latest code.
