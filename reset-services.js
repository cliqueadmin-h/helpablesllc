const STRAPI_URL = 'https://helpablesllc-production.up.railway.app';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

const LEADDOCK = {
  title: 'Helpables LeadDock',
  slug: 'helpables-leaddock',
  icon: '🎯',
  order: 1,
  description: `Helpables LeadDock is a lightweight lead capture system for small businesses that want a simple way to collect, organize, and respond to new inquiries without setting up a full CRM.

It is ideal for businesses that are just getting started, do not need complex automation yet, but still want to make sure every inquiry is captured and followed up properly.

Starting at $49/month · One-time setup: $199`,

  shortSummary: `$49/month + $199 setup
Simple lead capture for small businesses that want to organize inquiries, get instant notifications, send basic auto-replies, and connect leads to a booking link.

Includes:
Lead form setup
Google Sheet/Airtable tracker
Email notifications
Simple auto-reply
Booking link connection
End-to-end testing
Light monthly support

Best for: small businesses not ready for a full CRM yet.`,

  whatWeOffer: `## Never lose a lead again

Many small businesses miss opportunities because leads come from different places — website forms, emails, social media, referrals, or manual messages.

LeadDock gives you a simple system where new inquiries are captured, organized, and sent directly to you so you can respond quickly.

---

## What's included

### Lead capture setup
We connect your website form or create a simple lead capture form so inquiries are collected in one place.

### Lead tracker
Your leads are stored in a simple tracker such as Google Sheets or Airtable. Typical fields include:

- Name
- Email
- Phone number
- Service requested
- Message
- Lead source
- Date received
- Status

### Instant owner notification
You receive an email notification whenever a new lead comes in, so you can respond quickly.

### Simple auto-reply
We set up a basic confirmation email so your lead knows their inquiry was received.

> *Thanks for reaching out. We received your inquiry and will get back to you soon.*

### Booking link connection
We connect your Calendly or booking link so interested leads can easily schedule time with you.

### End-to-end testing
We test the full flow to make sure:

- The form works
- The lead is captured
- The notification is delivered
- The auto-reply is sent
- The booking link works correctly

### Monthly light support
Includes light monthly support for small updates, basic troubleshooting, and simple adjustments.

---

## Best for

- Solo consultants
- Small local businesses
- Service providers
- Early-stage businesses
- Coaches and advisors
- Freelancers
- Small agencies
- Businesses not ready for a full CRM yet`,

  whatDifferentiatesUs: `## How it works

1. Visitor submits website form
2. Lead is saved in your tracker
3. You receive an email notification
4. Lead receives a simple auto-reply
5. Lead can book a call using your booking link

---

## What this helps you do

With LeadDock, you can:

- Stop losing website inquiries
- Respond to leads faster
- Keep all leads organized
- Track who contacted you
- Give leads a better first impression
- Start building a simple sales process without CRM complexity

---

## Pricing

**$49/month** — Includes light ongoing support, simple monitoring, and minor updates.

**$199 one-time setup** — Covers the initial setup work:

- Connecting or creating the lead form
- Setting up the lead tracker
- Configuring email notifications
- Creating the auto-reply
- Connecting the booking link
- Testing the full lead flow

---

## What's not included

LeadDock is intentionally simple. It does not include:

- Full CRM setup
- Advanced sales pipeline
- AI lead scoring
- SMS automation
- WhatsApp automation
- Multi-step nurture campaigns
- Advanced reporting dashboard
- Paid ads management
- Full website redesign

Businesses that need these features can upgrade to Helpables ReplyDesk, PipelinePilot, or BookMore AI.

---

## Who this is not for

LeadDock may not be the right fit if you need a complete CRM, sales team management, advanced automation, AI-powered follow-up, complex integrations, or multiple lead pipelines. For those needs, we recommend one of our higher automation packages.`,

  videoUrl: null,
};

async function run() {
  // Login
  console.log('Logging in...');
  const loginRes = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!loginRes.ok) { console.error('Login failed:', loginRes.status, await loginRes.text()); process.exit(1); }
  const jwt = (await loginRes.json()).data?.token;
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}` };
  console.log('Login successful\n');

  // Fetch all existing services
  console.log('Fetching existing services...');
  const listRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::service.service?pageSize=100`, { headers });
  const listData = await listRes.json();
  const existing = listData.results || [];
  console.log(`Found ${existing.length} services: ${existing.map(s => `ID ${s.id} "${s.title}"`).join(', ')}\n`);

  // Delete all existing services
  for (const svc of existing) {
    const delRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::service.service/${svc.id}`, {
      method: 'DELETE', headers,
    });
    console.log(`Deleted ID ${svc.id} "${svc.title}" — ${delRes.status} ${delRes.statusText}`);
  }

  // Create LeadDock
  console.log('\nCreating Helpables LeadDock...');
  const createRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::service.service`, {
    method: 'POST',
    headers,
    body: JSON.stringify(LEADDOCK),
  });
  if (!createRes.ok) { console.error('Create failed:', createRes.status, await createRes.text()); process.exit(1); }
  const created = await createRes.json();
  const newId = created.id || created.data?.id;
  console.log(`Created LeadDock with ID ${newId}\n`);

  // Publish it
  console.log('Publishing...');
  const pubRes = await fetch(`${STRAPI_URL}/content-manager/collection-types/api::service.service/${newId}/actions/publish`, {
    method: 'POST', headers,
  });
  if (!pubRes.ok) { console.error('Publish failed:', pubRes.status, await pubRes.text()); process.exit(1); }
  console.log(`Published successfully — Status ${pubRes.status}`);
  console.log('\nDone! LeadDock is now live as service 1.');
}

run().catch(console.error);
