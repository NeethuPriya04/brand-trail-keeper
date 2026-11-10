# Brand Trail Keeper

Build "BrandTrail", an AI-assisted brand governance and content trust platform. Tagline: "Keep every message on-brand. Keep every claim traceable."

STACK: React + TypeScript + Tailwind + my EXISTING Supabase project and tables exactly as they are. Never create, alter or drop tables. Never hardcode API keys.

DESIGN: Professional SaaS look. Navy sidebar (#14243A), accent blue (#2D659B), light neutral background, rounded cards, clear typography, meaningful empty states. Severity colours: critical red, high orange, medium amber, low blue, info grey. Responsive and keyboard accessible.

AUTH: A /login page with email and password, AND three prominent buttons "Continue as Manager", "Continue as Creator", "Continue as Reviewer". They sign in with manager@brandtrail.demo, creator@brandtrail.demo and reviewer@brandtrail.demo (password Demo@12345). Add one line explaining these are demo accounts. Protect all other routes.

SHELL: After login, a left sidebar with role-based items. Everyone sees Dashboard and Knowledge Hub. Creator also sees New Submission and My Submissions. Reviewer also sees Review Centre. Manager and Reviewer also see Evidence Ledger, Change Impact and Guideline Insights. The header shows the organisation name, user name, a coloured role badge and a sign-out button. Load the signed-in user's row from the profiles table to get role and organisation.

Create all routes with simple placeholder pages. Do not build page contents yet.

ACCEPTANCE: I click "Continue as Manager" and land on a dashboard with the manager sidebar. Signing out and clicking "Continue as Creator" shows a different sidebar.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/25dd992c-0702-4181-992f-682e872f9abc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
