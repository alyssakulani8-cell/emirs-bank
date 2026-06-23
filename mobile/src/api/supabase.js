const SUPABASE_URL = 'https://iuhhgzaogmhamyetmqzy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1aGhnemFvZ21oYW15ZXRtcXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxODkwMTUsImV4cCI6MjA5NTc2NTAxNX0.4nqsxlVa0Sz3Z_8wFCjGo6koeKdb9ixXP4XCpIRi_oM';

const headers = () => ({
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
});

export const sb = {
  list: async (table, filters = {}) => {
    let url = `${SUPABASE_URL}/rest/v1/${table}?select=*`;
    Object.entries(filters).forEach(([col, val]) => {
      url += `&${col}=eq.${encodeURIComponent(val)}`;
    });
    const res = await fetch(url, {
      method: 'GET', headers: headers(),
    });
    if (!res.ok) throw new Error(`Supabase list failed: ${res.status}`);
    return res.json();
  },
  getById: async (table, idColumn, idValue) => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${idColumn}=eq.${encodeURIComponent(idValue)}&select=*`, {
      method: 'GET', headers: headers(),
    });
    if (!res.ok) throw new Error(`Supabase getById failed: ${res.status}`);
    const rows = await res.json();
    return rows.length ? rows[0] : null;
  },
  insert: async (table, data) => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST', headers: headers(), body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Supabase insert failed: ${res.status}`);
    const rows = await res.json();
    return rows.length ? rows[0] : null;
  },
  update: async (table, idColumn, idValue, data) => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${idColumn}=eq.${encodeURIComponent(idValue)}`, {
      method: 'PATCH', headers: headers(), body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Supabase update failed: ${res.status}`);
    const rows = await res.json();
    return rows.length ? rows[0] : null;
  },
  delete: async (table, idColumn, idValue) => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${idColumn}=eq.${encodeURIComponent(idValue)}`, {
      method: 'DELETE', headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) throw new Error(`Supabase delete failed: ${res.status}`);
    return true;
  },
  upsert: async (table, data, idColumn) => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: { ...headers(), 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Supabase upsert failed: ${res.status}`);
    const rows = await res.json();
    return rows.length ? rows[0] : null;
  },
};
