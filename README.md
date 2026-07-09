# ACM 2026-27 Portal

This is the main web portal for the ACM 2026-27 Core selections reveal. It is built using Next.js, React, Tailwind CSS, and Framer Motion.

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine. The project uses `pnpm` as its primary package manager, but `npm` works as well.

### Installation

1. Open your terminal and navigate to this `acm` directory:
   ```bash
   cd acm
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```
   *(If you have `pnpm` installed, you can run `pnpm install` instead to respect the lockfile).*

> **Note**: If you see TypeScript errors in your editor like `JSX element implicitly has type 'any'`, it is simply because the dependencies (`node_modules`) are missing. Running `npm install` will download the necessary `@types/react` packages and resolve these errors. After installing, you may need to restart your code editor.

### Running the Development Server

Start the local development server by running:
```bash
npm run dev
```

The portal will be available at [http://localhost:3000](http://localhost:3000).

---

## Adding Assets (Photos, Audio, Videos)

All static assets in a Next.js project must be placed inside the `public/` folder. Right now, there are several placeholder variables defined in the code for the newly added assets.

### 1. Where to put the files
Add your actual media files into the `public/` directory (e.g., `acm/public/vault-member.jpg`).

### 2. Where to update the code
Once the files are in the `public/` directory, update the paths in the respective components.

**In `components/reveal-intro.tsx`**:
At the top of the file, you will find these variables:
```typescript
const VAULT_MEMBER_PHOTO = "/vault-member-placeholder.jpg"; // Replace with your member photo path
const GATEKEEPER_PRESIDENT_PHOTO = "/president-placeholder.jpg"; // Replace with the president photo path
const GATEKEEPER_BG_AUDIO = "/gatekeeper-bg-audio.mp3"; // Replace with the background audio path
const GATEKEEPER_BRIBE_REACTION_PHOTO = "/bribe-placeholder.jpg"; // Replace with the bribe reaction photo path
```

**In `components/batman-tribute.tsx`**:
At the top of the file, update:
```typescript
const BATMAN_SECTION_PHOTO = "/batman-placeholder.jpg"; // Replace with your Batman photo path
```

Because the files are in the `public/` directory, you only need to reference them starting with a forward slash `/` (e.g., `/my-photo.jpg`).

---

## Known Behaviors

- **Autoplay Audio/Video**: The browser might block the reveal video or gatekeeper audio from autoplaying unless the user interacts with the page. The code includes fallbacks so the visual sequence continues properly even if autoplay fails.
- **Scroll Lock**: The page scrolling is intentionally disabled during the Vault and Gatekeeper sequences to ensure the user fully experiences the cinematic intro. Scrolling is unlocked only after the final vault doors slide open.
