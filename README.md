# Task Management Application

A full-stack task management web application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- Email + Password Authentication
- Create, Read, Update, Delete tasks
- User-specific task isolation (users can only see their own tasks)
- Responsive design (mobile + desktop)
- Optimistic UI updates for instant feedback
- Modern glassmorphism UI design
- Row Level Security at database level

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel

## Gectting Started

1. **Install dependencies**:

```bash
npm install
```

2. **Set up Supabase**:
   - Create project at [supabase.com](https://supabase.com)
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase URL and anon key
   - Run `supabase-schema.sql` in SQL Editor
   - Enable Email auth in dashboard

3. **Run development server**:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

---

## Design & Technical Decisions

### 1. Why did you choose Supabase for this assignment?

I went with Supabase mainly because of PostgreSQL. For a task management app, having a proper relational database just made more sense than NoSQL. I needed clear relationships between users and tasks, and SQL queries are way more straightforward for this kind of structured data.

The Row Level Security feature was a big plus too - instead of writing a bunch of authorization logic in my application code, I could just set up RLS policies once and know that users can only access their own tasks at the database level. That's pretty solid security-wise.

Also, the developer experience is really good. The TypeScript support is first-class, and I could use regular SQL which I'm already comfortable with. The free tier is generous enough for this project, and the documentation is clear. Plus, being open source means I'm not completely locked into a proprietary system if I needed to migrate later.

### 2. What factors would make you choose Firebase over Supabase in a real production system?

I'd probably go with Firebase if I was building a mobile-first app, especially for iOS and Android. Firebase's offline support is just better - it's built into the SDK and handles sync automatically when you come back online. For something like a mobile task app that needs to work without internet, that's huge.

Also, if I needed to integrate heavily with other Google services (Analytics, Cloud Functions, ML Kit, etc.), Firebase makes that really easy since it's all in the same ecosystem. The auto-scaling is another thing - Firebase handles massive scale automatically without me having to think about connection pooling or read replicas.

The real-time database in Firebase is also more optimized for live collaboration features. If I was building something like a chat app or multiplayer game where multiple users are updating the same data constantly, Firebase would probably be the better choice.

That said, Firebase can get expensive at scale and you're pretty locked into Google's ecosystem, so it's definitely a tradeoff.

### 3. If this app suddenly gets 10,000 active users, what are the first 3 problems or bottlenecks you expect, and how would you address them?

**Problem 1: Database Connection Limits**

Right now I'm on Supabase's free tier which has around 60 concurrent connections. With 10,000 active users, I'd hit that limit pretty quickly and users would start seeing connection errors.

To fix this, I'd first upgrade to Supabase Pro which includes connection pooling with PgBouncer. I'd also implement some client-side optimizations like debouncing requests and adding a caching layer (maybe Redis or Vercel KV) so we're not hitting the database for every single request. Could also look into using Supabase Edge Functions to reduce direct database connections.

**Problem 2: Loading All Tasks Without Pagination**

Currently, I'm loading all tasks for a user at once. This works fine when someone has 10-20 tasks, but if users have hundreds or thousands of tasks, the queries would get really slow and we'd be sending way too much data over the network.

I'd implement cursor-based pagination (load 20-50 tasks at a time) and add infinite scroll or "load more" buttons. Would also add some caching with stale-while-revalidate so we're not re-fetching the same data constantly. Maybe implement virtual scrolling for really long lists too.

**Problem 3: No Caching Strategy**

Every time someone loads the dashboard, we're hitting the database. With 10,000 users, that's a lot of unnecessary queries, especially since task data doesn't change that often.

I'd add a proper caching layer - probably React Query or SWR for client-side caching with background revalidation. On the server side, I'd implement Redis caching for frequently accessed data and add proper cache headers. Would also look into using Vercel's Edge Network to cache responses closer to users geographically.

### 4. One design or technical decision you made that you know is not ideal, but accepted due to time constraints

The state management is pretty basic - I'm just using `useState` and manually updating the UI after server actions. This works, but it's not ideal because:

- I'm manually managing cache invalidation (calling `setTasks` after every mutation)
- There's no request deduplication, so if a user clicks multiple times quickly, we make multiple requests
- State isn't shared across components, so if I added more features, I'd have prop drilling issues
- No automatic background refetching or stale data handling

In a production app, I'd definitely use React Query or SWR. They handle all of this automatically - caching, background refetching, optimistic updates with automatic rollback, request deduplication, etc. I did implement optimistic updates manually with `useOptimistic`, but a proper data fetching library would make this cleaner and more robust.

I also didn't add any tests due to time constraints, which I know is not great. In production, I'd have unit tests for the server actions, integration tests for the API calls, and probably some E2E tests with Playwright to make sure the critical flows work.

### 5. How would you modify the system if:

#### a) Firebase/Supabase is removed

I'd need to build a custom backend, probably using Next.js API routes or a separate Express server. Here's what I'd do:

**Database**: Set up PostgreSQL (maybe on Railway, DigitalOcean, or AWS RDS). I'd use Prisma as the ORM since it gives me type safety and handles migrations nicely.

**Authentication**: Implement JWT-based auth with NextAuth.js or Passport.js. I'd need to:

- Hash passwords with bcrypt
- Generate JWT tokens with access + refresh tokens
- Store sessions in Redis or the database
- Implement email verification and password reset flows
- Add middleware to protect routes

**API Layer**: Create REST endpoints:

- `POST /api/auth/register` - Sign up
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

**Security**: Since I'd lose RLS, I'd need to implement authorization checks in every API route to make sure users can only access their own data. Would also add rate limiting, input validation with Zod, and CSRF protection.

The main challenge would be managing all the infrastructure myself - database backups, monitoring, scaling, security updates, etc. With Supabase, all of that is handled for me.

#### b) Role-based access is introduced

I'd need to add a few things to support different user roles (like Admin, Manager, Member):

**Database changes**:

```sql
-- Add roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  permissions JSONB
);

-- Link users to roles
CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id),
  role_id UUID REFERENCES roles(id),
  organization_id UUID
);

-- Add organization/team concept to tasks
ALTER TABLE tasks ADD COLUMN organization_id UUID;
ALTER TABLE tasks ADD COLUMN visibility VARCHAR(20) DEFAULT 'private';
```

**Application changes**:

- Create middleware to check user roles before allowing actions
- Update RLS policies to check role permissions
- Add UI changes to show/hide features based on role (like an admin panel)
- Implement task assignment (managers can assign tasks to team members)
- Add organization/team management

For example, an Admin could see all tasks in the organization, a Manager could see their team's tasks and assign work, and a Member could only see their own tasks and tasks assigned to them.

#### c) Activity/audit logs are required

I'd add an audit log system to track what users are doing:

**Database**:

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID,
  action VARCHAR(50),  -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', etc.
  resource_type VARCHAR(50),  -- 'task', 'user', etc.
  resource_id UUID,
  old_values JSONB,  -- What it was before
  new_values JSONB,  -- What it is now
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Implementation**:

- Create a logging utility function that gets called after every mutation
- Log authentication events (login, logout, failed login attempts)
- Log all CRUD operations with before/after state
- Store IP address and user agent for security analysis
- Add indexes on user_id and created_at for fast queries

**Features**:

- Admin dashboard to view logs (filter by user, action, date range)
- Export logs for compliance requirements
- Real-time alerts for suspicious activity (like multiple failed logins)
- Retention policy (maybe archive logs after 90 days)

Would need to be careful about privacy - anonymize sensitive data in logs and make sure it's GDPR compliant (users should be able to request deletion of their audit logs).

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── (main)/
│   │   └── dashboard/page.tsx
│   ├── actions/
│   │   └── tasks.ts          # Server actions for CRUD
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── DashboardHeader.tsx
│   ├── TaskItem.tsx
│   └── TaskList.tsx
├── lib/
│   └── supabase/
│       ├── client.ts          # Browser client
│       ├── server.ts          # Server client
│       └── proxy.ts           # Middleware client
└── types/
    └── task.ts
```

## License

MIT
