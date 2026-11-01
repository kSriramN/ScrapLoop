# ScrapLoop POC

A mobile-friendly, front-end proof of concept for a neighbourhood scrap collection workflow.

## Demo workflow

1. **Customer** — create a request, select scrap type, estimated quantity, upload a photo, and enter a pickup address or use browser GPS.
2. **Admin** — review the order and assign a pickup person.
3. **Pickup Boy** — open Google Maps directions, enter actual weight and rate, choose payment mode, and complete the collection.
4. **Invoice** — a receipt is generated in the browser and can be printed or saved as PDF.

## Run locally

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

Create a production build:

```bash
npm run build
```

The deployable static site is generated in the `dist/` folder.

## Deploy to Netlify

### Easiest method: Netlify manual deploy

1. Run `npm install`.
2. Run `npm run build`.
3. Open https://app.netlify.com/drop and sign in.
4. Drag the generated `dist` folder onto the Netlify Drop page.
5. Netlify will provide a public URL you can share with your client.

### Deploy from GitHub

1. Push this project to a GitHub repository.
2. In Netlify, choose **Add new site → Import an existing project**.
3. Select the repository.
4. Set **Build command** to `npm run build`.
5. Set **Publish directory** to `dist`.
6. Deploy.

## Important POC limitations

- This is a front-end demonstration. It does **not** use a shared backend or real user accounts.
- Demo order data is saved in the browser's local storage on the device/browser used. Different client devices will not share order updates.
- The photo is stored locally in the same browser and is limited to 4 MB.
- GPS requires browser permission and a secure context (HTTPS or localhost).
- Google Maps opens an external directions/search page; no live tracking is implemented.
- Invoice is a browser print view; choose **Save as PDF** in the print dialog.
- Payment is simulated. No money is collected and no payment gateway is connected.
- The sample scrap rates are illustrative only. Confirm actual local rates before using commercially.
- This prototype has no authentication, role-based security, audit trail, or admin access control. Do not use real customer personal data.

## Suggested next production steps

- Supabase database with row-level security and separate customer/admin/collector authentication.
- Supabase Storage for customer and collection photos.
- Order assignment and status notifications.
- Verified GPS pin and editable map marker.
- Server-generated invoice numbers and downloadable PDF receipts.
- Audit log, consent/privacy notice, and secure handling of phone numbers and addresses.
