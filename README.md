# Parichay 🎓

A centralized campus directory and community platform built for colleges to help incoming and existing batches discover fellow students, explore societies & clubs, find official batch groups, and navigate campus life.

---

## Features

- **Student Directory (`/directory`)**: Search and filter student profiles by name, branch, hometown, or batch year.
- **Student Profile Pages (`/student/[id]`)**: Detailed individual student profile cards with bios, club affiliations, social links, and shareable URLs.
- **Clubs & Societies (`/clubs`)**: Categorized directory of college clubs, technical societies, cultural bodies, and sports teams with active links and recruitment details.
- **Peer & Batch Groups (`/groups`)**: Verified directory of WhatsApp, Telegram, and Discord groups for batches, departments, and hostels.
- **Interactive Campus Map (`/map`)**: Guide to academic blocks, hostels, cafeterias, and key campus spots.
- **Team / About Page (`/about`)**: Team member showcase with an interactive member viewer.
- **Admin Portal (`/admin`)**: Internal management dashboard to perform CRUD operations on students, clubs, groups, team members, and site copy (CMS).

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components + ISR)
- **Frontend Library**: [React 19](https://react.dev/)
- **Styling**: Vanilla CSS Modules with custom theme variables
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + PostgREST)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Language**: TypeScript

---

## Project Structure

```text
parichay/
├── app/
│   ├── about/              # About page & team showcase
│   ├── admin/              # CMS & data management dashboards
│   │   ├── clubs/          # Club management
│   │   ├── cms/            # Dynamic homepage & page copy settings
│   │   ├── groups/         # Group links management
│   │   ├── students/       # Student record management
│   │   └── team/           # Core team member management
│   ├── clubs/              # Clubs & societies directory
│   ├── directory/          # Searchable student directory
│   ├── groups/             # Community & batch group links
│   ├── map/                # Campus map and location highlights
│   ├── student/[id]/       # Dynamic individual student profiles
│   ├── globals.css         # Global styling & CSS custom properties
│   ├── layout.tsx          # Root layout with Navbar and Footer
│   └── page.tsx            # Homepage with hero, stats, and highlights
├── components/             # Reusable UI components (Cards, Navbar, Footer, etc.)
├── lib/
│   ├── clientCache.ts      # Client-side in-memory cache with TTL
│   ├── mockData.ts         # Fallback data & branch constants
│   ├── supabase.ts         # Supabase client initialization
│   └── utils.ts            # Formatting & utility helpers
└── public/                 # Static assets and images
```

---

## Getting Started

### 1. Prerequisites

- Node.js 18.18+ or Node.js 20+
- npm, yarn, or pnpm

### 2. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd parichay-main
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Tables (Supabase)

The application expects the following tables in your Supabase database:

1. `students`: `id`, `name`, `branch`, `batch_year`, `hometown`, `bio`, `avatar_url`, `instagram`, `linkedin`, `github`, `clubs` (array)
2. `clubs`: `id`, `name`, `category`, `description`, `logo_url`, `instagram`, `website`, `member_count`
3. `groups`: `id`, `name`, `category`, `description`, `link`, `platform`
4. `team_members`: `id`, `name`, `role`, `image_url`, `linkedin`, `github`, `display_order`
5. `site_content`: `key` (text, primary key), `value` (text)

---

## Production Build

To build and test the production bundle locally:

```bash
npm run build
npm run start
```

---

## Deployment

The easiest way to deploy this project is via [Vercel](https://vercel.com/):

1. Push your repository to GitHub / GitLab.
2. Import the project into Vercel.
3. Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` under **Project Settings > Environment Variables**.
4. Deploy.
