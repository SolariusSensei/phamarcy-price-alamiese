import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// =========================================================
// 1. CONFIG — fill these in from Supabase: Project Settings > API
// =========================================================
const SUPABASE_URL = 'https://terygqwslkadqmfczbze.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcnlncXdzbGthZHFtZmN6YnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NDMwNDYsImV4cCI6MjA5OTExOTA0Nn0.tr82mAycYbM5kQdDMjNLg7UtRTuCE7X5qAlslpvU0uU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const app = document.getElementById('app');
let state = {
  session: null,
  profile: null,
  medications: [],
  cart: [],       // { medication_id, name, qty_type, unit_price, quantity }
  tab: 'sell',
  search: '',
  category: 'All',
  lastReceipt: null,
};

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------
const money = (n) => 'NGN ' + Number(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

async function loadMedications() {
  const { data, error } = await supabase.from('medications').select('*').order('name');
  if (!error) state.medications = data;
}

async function loadProfile() {
  const { data } = await supabase.from('profiles').select('*').eq('id', state.session.user.id).single();
  state.profile = data;
}

function isOwner() {
  return state.profile?.role === 'owner';
}

// ---------------------------------------------------------
// Auth screen
// ---------------------------------------------------------
function renderAuth() {
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center">
      <div class="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-black/5 p-8">
        <h1 class="font-display text-2xl text-tealDark mb-1">Shelf Price</h1>
        <p class="text-sm text-ink/60 mb-6">Sign in to look up prices and ring up sales.</p>
        <form id="auth-form" class="space-y-3">
          <input id="email" type="email" required placeholder="Email"
            class="w-full border border-black/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal" />
          <input id="password" type="password" required placeholder="Password" minlength="6"
            class="w-full border border-black/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal" />
          <button type="submit" class="w-full bg-teal hover:bg-tealDark text-white rounded-lg py-2 font-medium transition">
            Sign in
          </button>
          <button type="button" id="signup-btn" class="w-full text-teal text-sm py-1 hover:underline">
            First time here? Create an account
          </button>
        </form>
        <p id="auth-msg" class="text-sm text-clay mt-3"></p>
      </div>
    </div>
  `;
  document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) document.getElementById('auth-msg').textContent = error.message;
  });
  document.getElementById('signup-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!email || !password) {
      document.getElementById('auth-msg').textContent = 'Type an email and password above first, then tap this again.';
      return;
    }
    const { error } = await supabase.auth.signUp({ email, password });
    document.getElementById('auth-msg').textContent = error ? error.message : 'Account created — check your email if confirmation is required, then sign in.';
  });
}

// ---------------------------------------------------------
// Shell / nav
// ---------------------------------------------------------
function renderShell(innerHtml) {
  const tabs = [
    { id: 'sell', label: 'Sell' },
    { id: 'history', label: 'Sales History' },
    { id: 'suggestions', label: 'Suggestions' },
  ];
  if (isOwner()) tabs.push({ id: 'admin', label: 'Price List (Admin)' });

  app.innerHTML = `
    <header class="flex items-center justify-between py-5">
      <div>
        <h1 class="font-display text-xl text-tealDark">Shelf Price</h1>
        <p class="text-xs text-ink/50">${state.profile?.email || ''} · ${isOwner() ? 'Owner' : 'Staff'}</p>
      </div>
      <button id="signout" class="text-sm text-ink/50 hover:text-clay">Sign out</button>
    </header>
    <nav class="flex gap-1 mb-6 bg-white/60 p-1 rounded-xl border border-black/5 w-fit">
      ${tabs.map(t => `
        <button data-tab="${t.id}" class="tab-btn px-4 py-2 rounded-lg text-sm font-medium transition ${state.tab === t.id ? 'bg-teal text-white' : 'text-ink/60 hover:bg-black/5'}">
          ${t.label}
        </button>`).join('')}
    </nav>
    <div id="tab-content">${innerHtml}</div>
  `;
  document.getElementById('signout').addEventListener('click', () => supabase.auth.signOut());
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => { state.tab = btn.dataset.tab; render(); });
  });
}

// ---------------------------------------------------------
// SELL tab
// ---------------------------------------------------------
function renderSell() {
  const categories = ['All', ...new Set(state.medications.map(m => m.category))];
  const filtered = state.medications.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(state.search.toLowerCase());
    const matchesCat = state.category === 'All' || m.category === state.category;
    return matchesSearch && matchesCat;
  });

  const cartTotal = state.cart.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

  renderShell(`
    <div class="grid md:grid-cols-3 gap-6">
      <div class="md:col-span-2">
        <div class="flex flex-col sm:flex-row gap-2 mb-4">
          <input id="search" placeholder="Search a medicine…" value="${state.search}"
            class="flex-1 border border-black/10 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal" />
          <select id="category" class="border border-black/10 rounded-lg px-3 py-2 bg-white">
            ${categories.map(c => `<option value="${c}" ${c === state.category ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </div>
        <div class="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          ${filtered.length === 0 ? `<p class="text-ink/50 text-sm py-8 text-center">No medicine matches that search.</p>` : ''}
          ${filtered.map(m => `
            <div class="bg-white border border-black/5 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="font-medium">${m.name}</p>
                <p class="text-xs text-ink/50">${m.category}</p>
              </div>
              <div class="flex gap-2 flex-wrap">
                ${['packet','box','card','bottle','tube','counting'].map(qt => {
                  const price = m['price_' + qt];
                  if (price === null || price === undefined) return '';
                  return `<button class="add-btn text-sm border border-teal text-teal rounded-lg px-3 py-1.5 hover:bg-teal hover:text-white transition"
                    data-id="${m.id}" data-name="${m.name.replace(/"/g, '&quot;')}" data-type="${qt}" data-price="${price}">
                    ${qt.charAt(0).toUpperCase() + qt.slice(1)} · ${money(price)}
                  </button>`;
                }).join('') || `<span class="text-xs text-ink/40 italic">no price set yet</span>`}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <div class="bg-white border border-black/5 rounded-xl p-4 sticky top-4">
          <h2 class="font-display text-lg mb-3">Current sale</h2>
          ${state.cart.length === 0 ? `<p class="text-sm text-ink/50">Tap a price above to add it here.</p>` : ''}
          <div class="space-y-2 mb-3">
            ${state.cart.map((item, idx) => `
              <div class="flex items-center justify-between text-sm gap-2">
                <div class="flex-1">
                  <p class="font-medium">${item.name}</p>
                  <p class="text-xs text-ink/50">${item.qty_type} · ${money(item.unit_price)}</p>
                </div>
                <div class="flex items-center gap-1">
                  <button data-idx="${idx}" class="qty-btn w-6 h-6 rounded bg-black/5 hover:bg-black/10" data-dir="-1">–</button>
                  <span class="w-5 text-center">${item.quantity}</span>
                  <button data-idx="${idx}" class="qty-btn w-6 h-6 rounded bg-black/5 hover:bg-black/10" data-dir="1">+</button>
                  <button data-idx="${idx}" class="remove-btn text-clay text-xs ml-1">✕</button>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="border-t border-black/10 pt-3 flex justify-between font-medium">
            <span>Total</span><span>${money(cartTotal)}</span>
          </div>
          <button id="checkout-btn" ${state.cart.length === 0 ? 'disabled' : ''}
            class="w-full mt-4 bg-teal hover:bg-tealDark disabled:opacity-40 disabled:hover:bg-teal text-white rounded-lg py-2 font-medium transition">
            Complete sale & print receipt
          </button>
        </div>
      </div>
    </div>
  `);

  document.getElementById('search').addEventListener('input', (e) => { state.search = e.target.value; renderSell(); });
  document.getElementById('search').focus();
  document.getElementById('search').selectionStart = document.getElementById('search').value.length;
  document.getElementById('category').addEventListener('change', (e) => { state.category = e.target.value; renderSell(); });

  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { id, name, type, price } = btn.dataset;
      const existing = state.cart.find(i => i.medication_id === id && i.qty_type === type);
      if (existing) existing.quantity += 1;
      else state.cart.push({ medication_id: id, name, qty_type: type, unit_price: Number(price), quantity: 1 });
      renderSell();
    });
  });

  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      const dir = Number(btn.dataset.dir);
      state.cart[idx].quantity = Math.max(1, state.cart[idx].quantity + dir);
      renderSell();
    });
  });
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.cart.splice(Number(btn.dataset.idx), 1);
      renderSell();
    });
  });

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', completeSale);
}

async function completeSale() {
  const total = state.cart.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const { data: sale, error } = await supabase.from('sales').insert({
    sold_by: state.session.user.id,
    sold_by_email: state.session.user.email,
    total,
  }).select().single();

  if (error) { alert('Could not save the sale: ' + error.message); return; }

  const items = state.cart.map(i => ({
    sale_id: sale.id,
    medication_id: i.medication_id,
    medication_name: i.name,
    qty_type: i.qty_type,
    unit_price: i.unit_price,
    quantity: i.quantity,
    subtotal: i.unit_price * i.quantity,
  }));
  const { error: itemsError } = await supabase.from('sale_items').insert(items);
  if (itemsError) { alert('Could not save the receipt items: ' + itemsError.message); return; }

  state.lastReceipt = { sale, items };
  state.cart = [];
  renderReceipt();
}

function renderReceipt() {
  const { sale, items } = state.lastReceipt;
  renderShell(`
    <div id="receipt-print" class="bg-white border border-black/5 rounded-xl p-6 max-w-md mx-auto">
      <h2 class="font-display text-xl text-center mb-1">Receipt</h2>
      <p class="text-xs text-center text-ink/50 mb-4">${new Date(sale.created_at).toLocaleString()}</p>
      <div class="space-y-1 text-sm mb-4">
        ${items.map(i => `
          <div class="flex justify-between">
            <span>${i.medication_name} (${i.qty_type}) × ${i.quantity}</span>
            <span>${money(i.subtotal)}</span>
          </div>
        `).join('')}
      </div>
      <div class="border-t border-black/10 pt-2 flex justify-between font-medium">
        <span>Total</span><span>${money(sale.total)}</span>
      </div>
      <p class="text-xs text-center text-ink/40 mt-4">Served by ${sale.sold_by_email}</p>
    </div>
    <div class="no-print flex gap-3 justify-center mt-6">
      <button id="print-btn" class="bg-teal hover:bg-tealDark text-white rounded-lg px-4 py-2 font-medium">Print</button>
      <button id="new-sale-btn" class="border border-teal text-teal rounded-lg px-4 py-2 font-medium">New sale</button>
    </div>
  `);
  document.getElementById('print-btn').addEventListener('click', () => window.print());
  document.getElementById('new-sale-btn').addEventListener('click', () => { state.tab = 'sell'; renderSell(); });
}

// ---------------------------------------------------------
// HISTORY tab
// ---------------------------------------------------------
async function renderHistory() {
  const { data: sales } = await supabase.from('sales').select('*').order('created_at', { ascending: false }).limit(100);
  const { data: items } = await supabase.from('sale_items').select('*');
  const itemsBySale = {};
  (items || []).forEach(i => { (itemsBySale[i.sale_id] ||= []).push(i); });

  renderShell(`
    <div class="space-y-3">
      <h2 class="font-display text-lg mb-2">All sales</h2>
      ${(sales || []).length === 0 ? `<p class="text-sm text-ink/50">No sales recorded yet.</p>` : ''}
      ${(sales || []).map(s => `
        <div class="bg-white border border-black/5 rounded-xl p-4">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="text-xs text-ink/50">${new Date(s.created_at).toLocaleString()}</p>
              <p class="text-xs text-ink/50">Served by ${s.sold_by_email}</p>
            </div>
            <p class="font-medium">${money(s.total)}</p>
          </div>
          <div class="text-sm text-ink/70 space-y-0.5">
            ${(itemsBySale[s.id] || []).map(i => `<div class="flex justify-between"><span>${i.medication_name} (${i.qty_type}) × ${i.quantity}</span><span>${money(i.subtotal)}</span></div>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `);
}

// ---------------------------------------------------------
// SUGGESTIONS tab
// ---------------------------------------------------------
async function renderSuggestions() {
  const { data: suggestions } = await supabase.from('suggestions').select('*').order('created_at', { ascending: false });
  const categories = [...new Set(state.medications.map(m => m.category))];

  renderShell(`
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <h2 class="font-display text-lg mb-3">Suggest a change</h2>
        <form id="suggestion-form" class="bg-white border border-black/5 rounded-xl p-4 space-y-3">
          <div class="flex gap-2 text-sm">
            <label class="flex items-center gap-1"><input type="radio" name="s-type" value="price_change" checked> Price change</label>
            <label class="flex items-center gap-1"><input type="radio" name="s-type" value="new_med"> New medicine</label>
          </div>
          <select id="s-medication" class="w-full border border-black/10 rounded-lg px-3 py-2">
            <option value="">— pick existing medicine (for price change) —</option>
            ${state.medications.map(m => `<option value="${m.id}" data-name="${m.name.replace(/"/g, '&quot;')}">${m.name}</option>`).join('')}
          </select>
          <input id="s-name" placeholder="Medicine name (required for new medicine)" class="w-full border border-black/10 rounded-lg px-3 py-2" />
          <input id="s-category" list="cat-list" placeholder="Category (e.g. Pain Relief)" class="w-full border border-black/10 rounded-lg px-3 py-2" />
          <datalist id="cat-list">${categories.map(c => `<option value="${c}">`).join('')}</datalist>
          <div class="grid grid-cols-4 gap-2">
            <input id="s-packet" type="number" step="0.01" placeholder="Packet ₦" class="border border-black/10 rounded-lg px-2 py-2" />
            <input id="s-box" type="number" step="0.01" placeholder="Box ₦" class="border border-black/10 rounded-lg px-2 py-2" />
            <input id="s-card" type="number" step="0.01" placeholder="Card ₦" class="border border-black/10 rounded-lg px-2 py-2" />
            <input id="s-bottle" type="number" step="0.01" placeholder="Bottle ₦" class="border border-black/10 rounded-lg px-2 py-2" />
          </div>
          <textarea id="s-note" placeholder="Note (optional — why this change?)" class="w-full border border-black/10 rounded-lg px-3 py-2"></textarea>
          <button type="submit" class="w-full bg-teal hover:bg-tealDark text-white rounded-lg py-2 font-medium">Submit suggestion</button>
        </form>
      </div>

      <div>
        <h2 class="font-display text-lg mb-3">${isOwner() ? 'Review suggestions' : 'Suggestion status'}</h2>
        <div class="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
          ${(suggestions || []).length === 0 ? `<p class="text-sm text-ink/50">No suggestions yet.</p>` : ''}
          ${(suggestions || []).map(s => `
            <div class="bg-white border border-black/5 rounded-xl p-4">
              <div class="flex justify-between items-start gap-2">
                <div>
                  <p class="font-medium">${s.name} <span class="text-xs text-ink/40">(${s.type === 'new_med' ? 'new medicine' : 'price change'})</span></p>
                  <p class="text-xs text-ink/50">${s.category || ''} · by ${s.suggested_by_email}</p>
                  <p class="text-sm mt-1">
                    ${s.price_packet != null ? `Packet: ${money(s.price_packet)} ` : ''}
                    ${s.price_box != null ? `Box: ${money(s.price_box)} ` : ''}
                    ${s.price_card != null ? `Card: ${money(s.price_card)} ` : ''}
                    ${s.price_bottle != null ? `Bottle: ${money(s.price_bottle)} ` : ''}
${s.price_tube != null ? `Tube: ${money(s.price_tube)} ` : ''}
${s.price_counting != null ? `Counting: ${money(s.price_counting)}` : ''}
                  </p>
                  ${s.note ? `<p class="text-xs text-ink/50 italic mt-1">"${s.note}"</p>` : ''}
                </div>
                <span class="text-xs px-2 py-1 rounded-full ${s.status === 'pending' ? 'bg-amber-100 text-amber-700' : s.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                  ${s.status}
                </span>
              </div>
              ${isOwner() && s.status === 'pending' ? `
                <div class="flex gap-2 mt-3">
                  <button data-id="${s.id}" data-approve="true" class="decide-btn flex-1 bg-teal hover:bg-tealDark text-white rounded-lg py-1.5 text-sm">Approve</button>
                  <button data-id="${s.id}" data-approve="false" class="decide-btn flex-1 border border-clay text-clay rounded-lg py-1.5 text-sm">Reject</button>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `);

  document.getElementById('suggestion-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.querySelector('input[name="s-type"]:checked').value;
    const medSelect = document.getElementById('s-medication');
    const medicationId = medSelect.value || null;
    const medName = medSelect.selectedOptions[0]?.dataset.name;
    const name = type === 'new_med' ? document.getElementById('s-name').value.trim() : (medName || document.getElementById('s-name').value.trim());

    if (!name) { alert('Please give the medicine a name, or pick one from the list.'); return; }
    if (type === 'price_change' && !medicationId) { alert('Pick which existing medicine this price change is for.'); return; }

    const payload = {
      type,
      medication_id: type === 'price_change' ? medicationId : null,
      name,
      category: document.getElementById('s-category').value.trim() || 'Other',
      price_packet: document.getElementById('s-packet').value ? Number(document.getElementById('s-packet').value) : null,
      price_box: document.getElementById('s-box').value ? Number(document.getElementById('s-box').value) : null,
      price_card: document.getElementById('s-card').value ? Number(document.getElementById('s-card').value) : null,
      price_bottle: document.getElementById('s-bottle').value ? Number(document.getElementById('s-bottle').value) : null,
price_tube: document.getElementById('s-tube').value ? Number(document.getElementById('s-tube').value) : null,
price_counting: document.getElementById('s-counting').value ? Number(document.getElementById('s-counting').value) : null,
      note: document.getElementById('s-note').value.trim() || null,
      suggested_by: state.session.user.id,
      suggested_by_email: state.session.user.email,
    };
    const { error } = await supabase.from('suggestions').insert(payload);
    if (error) alert('Could not submit: ' + error.message);
    else renderSuggestions();
  });

  document.querySelectorAll('.decide-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const { error } = await supabase.rpc('decide_suggestion', {
        p_suggestion_id: btn.dataset.id,
        p_approve: btn.dataset.approve === 'true',
      });
      if (error) alert('Could not decide: ' + error.message);
      else { await loadMedications(); renderSuggestions(); }
    });
  });
}

// ---------------------------------------------------------
// ADMIN tab (owner only) — edit the price list directly
// ---------------------------------------------------------
function renderAdmin() {
  if (!isOwner()) { state.tab = 'sell'; return renderSell(); }

  renderShell(`
    <h2 class="font-display text-lg mb-3">Full price list</h2>
    <p class="text-sm text-ink/50 mb-4">Edit any price and press Save on that row. Leave a box blank if that medicine isn't sold that way.</p>
    <div class="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
      ${state.medications.map(m => `
        <div class="bg-white border border-black/5 rounded-xl p-3 flex flex-wrap items-center gap-2" data-row="${m.id}">
          <div class="flex-1 min-w-[160px]">
            <p class="font-medium text-sm">${m.name}</p>
            <p class="text-xs text-ink/50">${m.category}</p>
          </div>
          <input class="price-input w-24 border border-black/10 rounded-lg px-2 py-1 text-sm" data-field="price_packet" placeholder="Packet" value="${m.price_packet ?? ''}" />
          <input class="price-input w-24 border border-black/10 rounded-lg px-2 py-1 text-sm" data-field="price_box" placeholder="Box" value="${m.price_box ?? ''}" />
          <input class="price-input w-24 border border-black/10 rounded-lg px-2 py-1 text-sm" data-field="price_card" placeholder="Card" value="${m.price_card ?? ''}" />
          <input class="price-input w-24 border border-black/10 rounded-lg px-2 py-1 text-sm" data-field="price_bottle" placeholder="Bottle" value="${m.price_bottle ?? ''}" />
          <button class="save-med-btn text-sm bg-teal hover:bg-tealDark text-white rounded-lg px-3 py-1.5" data-id="${m.id}">Save</button>
        </div>
      `).join('')}
    </div>
  `);

  document.querySelectorAll('.save-med-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const row = document.querySelector(`[data-row="${btn.dataset.id}"]`);
      const update = {};
      row.querySelectorAll('.price-input').forEach(inp => {
        update[inp.dataset.field] = inp.value === '' ? null : Number(inp.value);
      });
      const { error } = await supabase.from('medications').update(update).eq('id', btn.dataset.id);
      if (error) alert('Could not save: ' + error.message);
      else { await loadMedications(); renderAdmin(); }
    });
  });
}

// ---------------------------------------------------------
// Router
// ---------------------------------------------------------
function render() {
  if (!state.session) return renderAuth();
  if (state.tab === 'sell') return renderSell();
  if (state.tab === 'history') return renderHistory();
  if (state.tab === 'suggestions') return renderSuggestions();
  if (state.tab === 'admin') return renderAdmin();
}

supabase.auth.onAuthStateChange(async (_event, session) => {
  state.session = session;
  if (session) {
    await loadProfile();
    await loadMedications();
  }
  render();
});

render();
