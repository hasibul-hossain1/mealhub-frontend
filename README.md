# Tyme2eat Frontend

Tyme2eat is a role-based food ordering frontend built with Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui. It lets customers browse meals and restaurants, place orders, and track order history, while sellers and admins get their own dashboards for managing meals, orders, users, and categories.

This repository is the frontend only. It depends on a separate backend API for authentication, meals, orders, seller data, user management, and email verification.

## About the Project

The app is organized around three user roles:

- `CUSTOMER` can sign up, sign in, browse meals, filter by category/price/availability, add items to cart, place orders, track order history, update profile details, and review meals they have ordered.
- `SELLER` can create a seller account, complete a restaurant profile, add/edit/delete meals, view incoming orders, and manage seller-side order progress.
- `ADMIN` can review users, manage categories, and see all orders from the admin dashboard.

The public site also includes:

- Home page with featured meals and categories
- Restaurant listing and restaurant detail pages
- About, Contact, and Careers pages
- Light, dark, and system theme support

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- `better-auth` client for authentication
- `next-themes` for theme switching
- `sonner` for toast notifications
- ImageBB for image uploads

## Main Features

- Public meal browsing with filters, sorting, pagination, and search
- Meal details with ratings, reviews, and add-to-cart support
- Cart stored in browser `localStorage`
- Checkout flow that sends orders to the backend
- Customer dashboard for profile, cart, and order history
- Seller onboarding with required restaurant profile completion
- Seller dashboard for meal management and order management
- Admin dashboard for user, category, and order oversight
- Route protection and role-based redirects using Next.js proxy middleware

## Environment Variables

Create a `.env` file from `.env.example`.

```env
BACKEND_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_IMAGEBB_API_KEY=your_imgbb_api_key
```

What each variable does:

- `BACKEND_URL`: Server-side API base URL. This app expects the versioned API path here, for example `http://localhost:5000/api/v1`.
- `NEXT_PUBLIC_BACKEND_URL`: Public backend origin used by the auth client. This should be the backend origin without `/api/v1`.
- `NEXT_PUBLIC_IMAGEBB_API_KEY`: Used in the browser to upload profile and meal images to ImageBB.

## Installation and Run Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

```bash
cp .env.example .env
```

Update the values if your backend is not running on the default local URLs, and set your own ImageBB API key.

### 3. Start the backend

This frontend needs the Tyme2eat backend running first. By default, the frontend expects:

- API base: `http://localhost:5000/api/v1`
- Auth base origin: `http://localhost:5000`

If the backend is not running, pages that load meals, restaurants, authentication, orders, or dashboard data will fail.

### 4. Start the frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

- `npm run dev`: Start the development server
- `npm run build`: Create a production build
- `npm run start`: Run the production build
- `npm run lint`: Run ESLint

## Important Routes

- `/` - Home page
- `/meals` - Browse meals
- `/meals/[id]` - Meal details and reviews
- `/restaurants` - Browse restaurants
- `/restaurants/[id]` - Restaurant details and meal list
- `/signin` - Sign in
- `/signup` - Customer registration
- `/seller-signup` - Seller registration
- `/complete-profile` - Seller restaurant profile completion
- `/dashboard` - Customer dashboard
- `/seller-dashboard` - Seller dashboard
- `/admin-dashboard` - Admin dashboard

## Project Structure

```text
src/
  app/                 App Router pages and layouts
  action/              Server actions
  components/          Shared UI and dashboard components
  providers/           React context providers
  services/            Backend API calls
  lib/                 Auth client and utilities
  types/               Shared TypeScript types
  constant/            Role and order status constants
```

## How the Frontend Works

- Authentication is handled through the backend using `better-auth`.
- Protected server requests forward cookies from Next.js to the backend.
- Seller users are redirected to `/complete-profile` until their restaurant profile is completed.
- Banned users are redirected to the `/banned` page.
- Image uploads happen from the browser directly to ImageBB before the returned URL is saved.

## Notes

- This project currently has no dedicated test setup in the repository.
- Remote images are allowed through Next.js image configuration.
- The Contact and Careers pages are present as frontend pages and can be connected to real backend logic later.
