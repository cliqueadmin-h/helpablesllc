const MAX_ROWS = 500;
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function normalize(value) {
  return value.trim().toLowerCase();
}

function readRows(value, label, fields) {
  if (!Array.isArray(value) || value.length > MAX_ROWS) {
    throw new Error(`${label} must be an array with no more than ${MAX_ROWS} rows.`);
  }
  for (const [index, row] of value.entries()) {
    if (!row || typeof row !== 'object' ||
        fields.some(field => typeof row[field] !== 'string' || !row[field].trim() || row[field].length > 120) ||
        !Number.isSafeInteger(row.amountCents) || row.amountCents <= 0 || row.amountCents > 100_000_000_000) {
      throw new Error(`${label} row ${index + 1} needs valid text fields and a positive amount in cents.`);
    }
  }
  return value;
}

function reviewInvoices(input) {
  const orders = readRows(input?.orders, 'Purchase orders', ['reference', 'supplier']);
  const invoices = readRows(input?.invoices, 'Invoices', ['reference', 'supplier', 'orderReference']);
  const orderByReference = new Map();
  for (const order of orders) {
    const key = normalize(order.reference);
    if (orderByReference.has(key)) {
      throw new Error('Purchase order references must be unique.');
    }
    orderByReference.set(key, order);
  }

  const keyFor = invoice => JSON.stringify([normalize(invoice.supplier), normalize(invoice.reference)]);
  const counts = new Map();
  for (const invoice of invoices) {
    const key = keyFor(invoice);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return invoices.map(invoice => {
    const order = orderByReference.get(normalize(invoice.orderReference));
    const flags = [];
    if (counts.get(keyFor(invoice)) > 1) flags.push('Duplicate invoice');
    if (!order) flags.push('Order not found');
    if (order && normalize(order.supplier) !== normalize(invoice.supplier)) flags.push('Supplier mismatch');
    if (order && order.amountCents !== invoice.amountCents) flags.push('Amount mismatch');
    return {
      ...Object.fromEntries(['reference', 'supplier', 'orderReference', 'amountCents'].map(key => [key, invoice[key]])),
      orderAmountCents: order?.amountCents ?? null,
      flags,
    };
  });
}

const sample = {
  orders: [
    { reference: 'PO-104', supplier: 'Northline Supply', amountCents: 184500 },
    { reference: 'PO-105', supplier: 'Evergreen Mechanical', amountCents: 322000 },
    { reference: 'PO-106', supplier: 'Claywater Electrical', amountCents: 76500 },
    { reference: 'PO-107', supplier: 'Evergreen Mechanical', amountCents: 218000 },
  ],
  invoices: [
    { reference: 'NL-481', supplier: 'Northline Supply', orderReference: 'PO-104', amountCents: 184500 },
    { reference: 'EM-073', supplier: 'Evergreen Mechanical', orderReference: 'PO-105', amountCents: 352000 },
    { reference: 'CE-104', supplier: 'Claywater Electrical', orderReference: 'PO-106', amountCents: 76500 },
    { reference: 'CE-104', supplier: 'Claywater Electrical', orderReference: 'PO-106', amountCents: 76500 },
    { reference: 'NC-281', supplier: 'Northline Supply', orderReference: 'PO-107', amountCents: 218000 },
    { reference: 'EM-081', supplier: 'Evergreen Mechanical', orderReference: 'PO-108', amountCents: 109500 },
  ],
};

if (typeof module === 'object') module.exports = { reviewInvoices, sample };

if (typeof document !== 'undefined') {
  const get = id => document.getElementById(id);
  let results = [];

  function paint() {
    const flags = results.filter(row => row.flags.length);
    get('total').textContent = results.length;
    get('matched').textContent = results.length - flags.length;
    get('exceptions').textContent = flags.length;
    const rows = get('body');
    rows.replaceChildren();
    for (const row of get('only-flags').checked ? flags : results) {
      const tr = document.createElement('tr');
      const cells = [row.reference, row.supplier, row.orderReference, usd.format(row.amountCents / 100),
        row.orderAmountCents === null ? '—' : usd.format(row.orderAmountCents / 100),
        row.flags.join(', ') || 'Matched'];
      for (const [index, value] of cells.entries()) {
        const td = document.createElement('td');
        td.textContent = value;
        if (index === 5) td.className = row.flags.length ? 'exception' : 'matched';
        tr.append(td);
      }
      rows.append(tr);
    }
    get('empty').hidden = rows.children.length !== 0;
  }

  function load(data, label) {
    results = reviewInvoices(data);
    get('source').textContent = label;
    get('error').textContent = '';
    paint();
  }

  get('sample').addEventListener('click', () => load(sample, 'Sample data'));
  get('only-flags').addEventListener('change', paint);
  get('upload').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 1_000_000) throw new Error('Choose a JSON file under 1 MB.');
      load(JSON.parse(await file.text()), file.name);
    } catch (error) {
      get('error').textContent = error instanceof SyntaxError ? 'This file is not valid JSON.' : error.message;
    } finally {
      event.target.value = '';
    }
  });

  load(sample, 'Sample data');
}
