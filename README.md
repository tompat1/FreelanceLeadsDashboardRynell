# FreelanceLeadsDashboardRynell

A lightweight, static dashboard UI for tracking freelance leads.

## Getting Started

### Static usage

Open `index.html` in your browser to view the dashboard UI.

### Development server (auto-refresh)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server with hot reload:
   ```bash
   npm run dev
   ```

Vite will print the local URL to open in your browser.

## Backend setup (Cloudflare Pages Functions + D1)

This dashboard uses Cloudflare Pages Functions for CRUD and a D1 database for storage.

### Database schema

Apply the schema in `db/schema.sql` to your D1 database:
```bash
wrangler d1 execute <db-name> --file db/schema.sql
```

### Cloudflare Pages configuration

1. Create a D1 database in your Cloudflare account.
2. Bind it to your Pages project as `DB`.
3. Deploy the app (Pages Functions live in `functions/`).

### API routes

* `GET /api/contacts` - list contacts
* `POST /api/contacts` - create a contact
* `GET /api/contacts/:id` - fetch one contact
* `PUT /api/contacts/:id` - update a contact
* `DELETE /api/contacts/:id` - delete a contact
