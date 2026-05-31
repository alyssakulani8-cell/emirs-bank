var SUPABASE_URL = 'https://iuhhgzaogmhamyetmqzy.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1aGhnemFvZ21oYW15ZXRtcXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxODkwMTUsImV4cCI6MjA5NTc2NTAxNX0.4nqsxlVa0Sz3Z_8wFCjGo6koeKdb9ixXP4XCpIRi_oM';

var sb = {
  headers: function() {
    return {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  },

  list: function(table) {
    return fetch(SUPABASE_URL + '/rest/v1/' + table + '?select=*', {
      method: 'GET',
      headers: this.headers()
    }).then(function(r) {
      if (!r.ok) throw new Error('Supabase list failed: ' + r.status);
      return r.json();
    });
  },

  getById: function(table, idColumn, idValue) {
    return fetch(SUPABASE_URL + '/rest/v1/' + table + '?' + idColumn + '=eq.' + encodeURIComponent(idValue) + '&select=*', {
      method: 'GET',
      headers: this.headers()
    }).then(function(r) {
      if (!r.ok) throw new Error('Supabase getById failed: ' + r.status);
      return r.json().then(function(rows) { return rows.length ? rows[0] : null; });
    });
  },

  insert: function(table, data) {
    return fetch(SUPABASE_URL + '/rest/v1/' + table, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(data)
    }).then(function(r) {
      if (!r.ok) throw new Error('Supabase insert failed: ' + r.status);
      return r.json().then(function(rows) { return rows.length ? rows[0] : null; });
    });
  },

  update: function(table, idColumn, idValue, data) {
    return fetch(SUPABASE_URL + '/rest/v1/' + table + '?' + idColumn + '=eq.' + encodeURIComponent(idValue), {
      method: 'PATCH',
      headers: this.headers(),
      body: JSON.stringify(data)
    }).then(function(r) {
      if (!r.ok) throw new Error('Supabase update failed: ' + r.status);
      return r.json().then(function(rows) { return rows.length ? rows[0] : null; });
    });
  },

  upsert: function(table, data, idColumn) {
    return fetch(SUPABASE_URL + '/rest/v1/' + table, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(data)
    }).then(function(r) {
      if (!r.ok) throw new Error('Supabase upsert failed: ' + r.status);
      return r.json().then(function(rows) { return rows.length ? rows[0] : null; });
    });
  }
};
