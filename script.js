import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  DISCLAIMER,
  UNIT_TYPES,
  esc,
  money,
  fuzzyScore,
  matchDrugReference,
  inferGenericAndCompany,
  findSameDrugBrands,
  calculateSellingPriceOptions,
  isBelowCost,
  getAllAvailablePrices,
  analyzeInventoryVelocity,
  askPharmacyAI,
  formatAiMarkdownHtml,
  stripMarkdownForSpeech,
  STANDARD_CATEGORIES,
  getCanonicalCategoryList,
  autoCategorizeMedication,
  batchAutoCategorizeMedications,
} from './ai-knowledge.js';

// =========================================================
// 1. CONFIG — Supabase Project
// =========================================================
const SUPABASE_URL = 'https://terygqwslkadqmfczbze.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcnlncXdzbGthZHFtZmN6YnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NDMwNDYsImV4cCI6MjA5OTExOTA0Nn0.tr82mAycYbM5kQdDMjNLg7UtRTuCE7X5qAlslpvU0uU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const A11Y_STORAGE_KEY = 'shelfprice_a11y_v1';

const app = document.getElementById('app');
const srAnnouncer = document.getElementById('sr-announcer');
const toastRegion = document.getElementById('toast-region');
const modalRoot = document.getElementById('modal-root');

// Inline SVG Icons (clean, sharp, zero external dependency)
const ICONS = {
  cross: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z"/></svg>`,
  sell: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  purchase: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  restock: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  ai: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/></svg>`,
  suggestions: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  history: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  admin: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  search: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  eye: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  sliders: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
  shield: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  layers: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
};

function loadA11yPrefs() {
  try {
    const raw = JSON.parse(localStorage.getItem(A11Y_STORAGE_KEY) || '{}');
    return {
      textSize: ['normal', 'large', 'xlarge'].includes(raw.textSize) ? raw.textSize : 'normal',
      contrast: raw.contrast === 'high' ? 'high' : 'normal',
      readable: Boolean(raw.readable),
      showCost: false,
    };
  } catch {
    return { textSize: 'normal', contrast: 'normal', readable: false, showCost: false };
  }
}

const state = {
  session: null,
  profile: null,
  shellKey: null,
  a11yDrawerOpen: false,
  medications: [],
  purchaseEntries: [],
  suggestions: [],
  sales: [],
  saleItems: [],
  cart: [],
  tab: 'sell',
  viewingReceipt: false,
  lastReceipt: null,

  sellSearch: '',
  sellCategory: 'All',
  sellCompany: 'All',

  pbSearch: '',
  pbCompany: 'All',
  pbSelectedMedId: '',

  restockFilter: 'restock_now',
  restockSearch: '',

  historyPeriod: '30',
  historySearch: '',

  adminSearch: '',
  adminCategory: 'All',
  adminCompany: 'All',
  adminMissingOnly: false,

  aiPrompt: '',
  aiLoading: false,
  aiMessages: [], // chronological chat messages { role: 'user'|'model', ... }
  aiGeminiConfigured: null,
  aiActiveModel: null,

  a11y: loadA11yPrefs(),
  modalTriggerEl: null,
  suggestionDraft: null,
};

// ---------------------------------------------------------
// Accessibility, Announcements, Toasts & Speech Helpers
// ---------------------------------------------------------
function saveA11yPrefs() {
  try {
    localStorage.setItem(
      A11Y_STORAGE_KEY,
      JSON.stringify({
        textSize: state.a11y.textSize,
        contrast: state.a11y.contrast,
        readable: state.a11y.readable,
      }),
    );
  } catch {
    // Ignore storage errors
  }
}

function applyA11yAttrs() {
  const root = document.documentElement;
  root.dataset.textSize = state.a11y.textSize;
  root.dataset.contrast = state.a11y.contrast;
  root.dataset.readable = state.a11y.readable ? 'true' : 'false';
}

function announce(message) {
  if (!srAnnouncer) return;
  srAnnouncer.textContent = '';
  setTimeout(() => {
    srAnnouncer.textContent = message;
  }, 30);
}

function showToast(message, type = 'info') {
  if (!toastRegion) return;
  const styles = {
    info: 'bg-ink text-white border-black/20',
    success: 'bg-tealDark text-white border-teal',
    warn: 'bg-amber-800 text-white border-amber-900',
    error: 'bg-red-800 text-white border-red-950',
  };
  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.className = `pointer-events-auto rounded-xl border px-4 py-3 text-sm font-medium shadow-xl flex items-start justify-between gap-3 ${styles[type] || styles.info}`;
  el.innerHTML = `
    <span class="leading-snug">${esc(message)}</span>
    <button type="button" class="touch-target -my-2 -mr-2 px-2 text-white/90 hover:text-white rounded-lg" aria-label="Dismiss notification">✕</button>
  `;
  const remove = () => el.remove();
  el.querySelector('button').addEventListener('click', remove);
  toastRegion.appendChild(el);
  announce(message);
  setTimeout(remove, 4800);
}

function supportsVoiceRecognition() {
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function startVoiceInput(onTranscript, buttonEl = null) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    showToast('Voice input is not supported in this browser. Please type instead.', 'warn');
    return;
  }
  try {
    const rec = new SR();
    rec.lang = 'en-NG';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    if (buttonEl) {
      buttonEl.setAttribute('aria-pressed', 'true');
      buttonEl.dataset.origLabel = buttonEl.textContent;
      buttonEl.textContent = 'Listening…';
    }
    announce('Listening for voice search');
    rec.onresult = (event) => {
      const text = event.results?.[0]?.[0]?.transcript || '';
      if (text) onTranscript(text.trim());
    };
    rec.onerror = () => {
      showToast('Could not capture voice cleanly. Please try again or type.', 'warn');
    };
    rec.onend = () => {
      if (buttonEl) {
        buttonEl.setAttribute('aria-pressed', 'false');
        if (buttonEl.dataset.origLabel) buttonEl.textContent = buttonEl.dataset.origLabel;
      }
    };
    rec.start();
  } catch {
    showToast('Microphone access unavailable.', 'warn');
  }
}

function speakText(text) {
  if (!('speechSynthesis' in window)) {
    showToast('Read aloud is not supported in this browser.', 'warn');
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(String(text || '').slice(0, 1400));
  utter.rate = 0.96;
  window.speechSynthesis.speak(utter);
}

// ---------------------------------------------------------
// Accessible Modal System (Escape, Backdrop, Focus Restore)
// ---------------------------------------------------------
function closeModal() {
  if (!modalRoot) return;
  modalRoot.innerHTML = '';
  if (state.modalTriggerEl && typeof state.modalTriggerEl.focus === 'function') {
    state.modalTriggerEl.focus();
  }
  state.modalTriggerEl = null;
}

function openModal({ title, bodyHtml, triggerEl = null, onMount = null }) {
  state.modalTriggerEl = triggerEl || document.activeElement;
  modalRoot.innerHTML = `
    <div id="modal-backdrop" class="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title"
        class="card-surface bg-white text-ink rounded-2xl border border-black/15 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div class="flex items-center justify-between gap-3 px-5 py-4 border-b border-black/10 bg-mint/40">
          <h2 id="modal-title" class="font-display text-lg font-semibold text-tealDark">${esc(title)}</h2>
          <button type="button" id="modal-close-btn"
            class="touch-target inline-flex items-center justify-center rounded-xl border border-black/15 bg-white px-3.5 py-2 text-sm font-semibold hover:bg-black/5"
            aria-label="Close dialog">
            Close ✕
          </button>
        </div>
        <div id="modal-body" class="p-5 overflow-y-auto space-y-4">
          ${bodyHtml}
        </div>
      </div>
    </div>
  `;
  const closeBtn = document.getElementById('modal-close-btn');
  const backdrop = document.getElementById('modal-backdrop');
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });
  closeBtn.focus();
  if (typeof onMount === 'function') onMount(document.getElementById('modal-body'));
}

function confirmModal({ title, message, confirmLabel = 'Confirm', danger = false, triggerEl = null }) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (val) => {
      if (settled) return;
      settled = true;
      closeModal();
      resolve(val);
    };
    openModal({
      title,
      triggerEl,
      bodyHtml: `
        <p class="text-sm leading-relaxed">${esc(message)}</p>
        <div class="flex flex-wrap justify-end gap-2 pt-2">
          <button type="button" id="confirm-cancel" class="touch-target px-4 py-2 rounded-xl border border-black/20 font-medium hover:bg-black/5">Cancel</button>
          <button type="button" id="confirm-ok" class="touch-target px-4 py-2 rounded-xl font-semibold text-white ${danger ? 'bg-red-700 hover:bg-red-800' : 'bg-teal hover:bg-tealDark'}">${esc(confirmLabel)}</button>
        </div>
      `,
      onMount: (body) => {
        body.querySelector('#confirm-cancel').addEventListener('click', () => finish(false));
        body.querySelector('#confirm-ok').addEventListener('click', () => finish(true));
        document.getElementById('modal-close-btn').onclick = () => finish(false);
        document.getElementById('modal-backdrop').onclick = (e) => {
          if (e.target.id === 'modal-backdrop') finish(false);
        };
      },
    });
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalRoot?.innerHTML.trim()) {
    e.preventDefault();
    closeModal();
    return;
  }
  if (e.altKey && e.key.toLowerCase() === 'c' && state.session) {
    e.preventDefault();
    toggleShowCost();
  }
});

// ---------------------------------------------------------
// Data Loading
// ---------------------------------------------------------
function isOwner() {
  return state.profile?.role === 'owner';
}

async function loadProfile() {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', state.session.user.id)
    .single();
  state.profile = data;
}

async function loadMedications() {
  const { data, error } = await supabase.from('medications').select('*').order('name');
  if (error) showToast('Could not load medications: ' + error.message, 'error');
  else state.medications = data || [];
}

async function loadPurchaseEntries() {
  const { data, error } = await supabase
    .from('purchase_entries')
    .select('*')
    .order('purchased_at', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(300);
  if (error) showToast('Could not load Purchase Book: ' + error.message, 'warn');
  else state.purchaseEntries = data || [];
}

async function loadSuggestions() {
  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (!error) state.suggestions = data || [];
}

async function loadSalesAndItems() {
  const [{ data: sales }, { data: items }] = await Promise.all([
    supabase.from('sales').select('*').order('created_at', { ascending: false }).limit(150),
    supabase.from('sale_items').select('*').order('id', { ascending: false }).limit(600),
  ]);
  state.sales = sales || [];
  const saleCreatedMap = new Map(state.sales.map((s) => [s.id, s.created_at]));
  state.saleItems = (items || []).map((it) => ({
    ...it,
    created_at: it.created_at || saleCreatedMap.get(it.sale_id) || null,
  }));
}

async function loadAllData() {
  await Promise.all([
    loadMedications(),
    loadPurchaseEntries(),
    loadSuggestions(),
    loadSalesAndItems(),
  ]);
}

// ---------------------------------------------------------
// Stylized Auth Screen
// ---------------------------------------------------------
function renderAuth() {
  state.shellKey = null;
  applyA11yAttrs();
  app.innerHTML = `
    <main id="main-content" class="min-h-screen flex items-center justify-center py-10">
      <div class="card-surface w-full max-w-md bg-white rounded-3xl border border-black/10 overflow-hidden shadow-xl">
        <div class="bg-gradient-to-r from-tealDark to-teal text-white px-7 py-6">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center">
                ${ICONS.cross}
              </div>
              <div>
                <h1 class="font-display text-2xl font-bold tracking-tight">Shelf Price</h1>
                <p class="text-xs text-white/85">Pharmacy Counter &amp; Inventory Studio</p>
              </div>
            </div>
            <button type="button" id="auth-contrast-btn"
              class="touch-target px-3 py-1.5 rounded-xl border border-white/30 bg-white/10 text-xs font-semibold text-white hover:bg-white/20"
              aria-pressed="${state.a11y.contrast === 'high'}">
              ${state.a11y.contrast === 'high' ? 'Contrast: High' : 'High Contrast'}
            </button>
          </div>
        </div>

        <div class="p-7 space-y-5">
          <p class="text-sm text-ink/80 leading-relaxed">Sign in to look up counter prices, check Uncle's Purchase Book, track restock priorities, and consult the AI Counter Pharmacist.</p>
          <form id="auth-form" class="space-y-4">
            <div>
              <label for="email" class="block text-xs font-bold uppercase tracking-wide text-ink/75 mb-1.5">Email address</label>
              <input id="email" type="email" required autocomplete="email" placeholder="you@pharmacy.com"
                class="touch-target w-full border border-black/20 rounded-xl px-3.5 py-2.5 bg-porcelain/50 focus:bg-white" />
            </div>
            <div>
              <label for="password" class="block text-xs font-bold uppercase tracking-wide text-ink/75 mb-1.5">Password</label>
              <input id="password" type="password" required autocomplete="current-password" minlength="6" placeholder="Minimum 6 characters"
                class="touch-target w-full border border-black/20 rounded-xl px-3.5 py-2.5 bg-porcelain/50 focus:bg-white" />
            </div>
            <button type="submit" class="touch-target w-full bg-gradient-to-r from-teal to-tealDark hover:opacity-95 text-white rounded-xl py-3 font-semibold shadow-sm transition">
              Sign in to Counter
            </button>
            <button type="button" id="signup-btn" class="touch-target w-full text-tealDark font-semibold text-sm py-2.5 rounded-xl border border-teal/30 hover:bg-mint/50">
              First time here? Create an account
            </button>
          </form>
          <p id="auth-msg" role="alert" class="text-sm font-medium text-clay min-h-[1.25rem]"></p>
        </div>
      </div>
    </main>
  `;

  document.getElementById('auth-contrast-btn').addEventListener('click', () => {
    state.a11y.contrast = state.a11y.contrast === 'high' ? 'normal' : 'high';
    saveA11yPrefs();
    renderAuth();
  });

  document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('auth-msg');
    msg.textContent = 'Signing in…';
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) msg.textContent = error.message;
  });

  document.getElementById('signup-btn').addEventListener('click', async () => {
    const msg = document.getElementById('auth-msg');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    if (!email || !password) {
      msg.textContent = 'Type your email and password above first, then select Create an account.';
      return;
    }
    const { error } = await supabase.auth.signUp({ email, password });
    msg.textContent = error
      ? error.message
      : 'Account created — check your email if confirmation is required, then sign in.';
  });
}

// ---------------------------------------------------------
// Modern Header, Collapsible A11y Drawer & Iconized Pill Tabs
// ---------------------------------------------------------
function getTabs() {
  const pendingCount = state.suggestions.filter((s) => s.status === 'pending').length;
  const vel = analyzeInventoryVelocity(state.medications, state.saleItems, state.purchaseEntries);
  const tabs = [
    { id: 'sell', label: 'Sell', icon: ICONS.sell },
    { id: 'purchase', label: 'Purchase Book', icon: ICONS.purchase },
    { id: 'restock', label: 'Restock', icon: ICONS.restock, badge: vel.urgentItems.length || null },
    { id: 'ai', label: 'AI Assistant', icon: ICONS.ai },
    { id: 'suggestions', label: 'Suggestions', icon: ICONS.suggestions, badge: pendingCount || null },
    { id: 'history', label: 'Sales History', icon: ICONS.history },
  ];
  if (isOwner()) tabs.push({ id: 'admin', label: 'Admin', icon: ICONS.admin });
  return tabs;
}

function updateA11yButtons() {
  const textBtn = document.getElementById('a11y-text-btn');
  const contrastBtn = document.getElementById('a11y-contrast-btn');
  const readBtn = document.getElementById('a11y-readable-btn');
  const costBtn = document.getElementById('cost-toggle-btn');
  const drawerBtn = document.getElementById('a11y-drawer-toggle');
  const drawer = document.getElementById('a11y-drawer');
  const medBadge = document.getElementById('header-med-count');

  if (medBadge) {
    medBadge.textContent = `${state.medications.length} Meds`;
  }
  if (textBtn) {
    const labels = { normal: 'Text: Normal (A)', large: 'Text: Large (A+)', xlarge: 'Text: Extra (A++)' };
    textBtn.textContent = labels[state.a11y.textSize];
    textBtn.setAttribute('aria-label', `Cycle text size, currently ${state.a11y.textSize}`);
  }
  if (contrastBtn) {
    contrastBtn.setAttribute('aria-pressed', String(state.a11y.contrast === 'high'));
    contrastBtn.textContent = state.a11y.contrast === 'high' ? 'High Contrast: On' : 'High Contrast: Off';
  }
  if (readBtn) {
    readBtn.setAttribute('aria-pressed', String(state.a11y.readable));
    readBtn.textContent = state.a11y.readable ? 'Easy-Read: On' : 'Easy-Read: Off';
  }
  if (costBtn) {
    costBtn.setAttribute('aria-pressed', String(state.a11y.showCost));
    costBtn.innerHTML = `${ICONS.eye}<span>${state.a11y.showCost ? 'Buy Cost: Visible' : 'Buy Cost: Hidden'}</span>`;
    costBtn.className = `touch-target inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition ${
      state.a11y.showCost
        ? 'bg-amber-700 border-amber-800 text-white shadow-sm'
        : 'bg-white border-black/15 text-ink hover:bg-black/5'
    }`;
  }
  if (drawerBtn && drawer) {
    drawerBtn.setAttribute('aria-expanded', String(state.a11yDrawerOpen));
    drawer.classList.toggle('hidden', !state.a11yDrawerOpen);
  }
  const sellCostToggle = document.getElementById('sell-cost-toggle');
  if (sellCostToggle) sellCostToggle.checked = state.a11y.showCost;
}

function toggleShowCost() {
  state.a11y.showCost = !state.a11y.showCost;
  updateA11yButtons();
  announce(state.a11y.showCost ? 'Wholesale buy costs shown on cards' : 'Wholesale buy costs hidden for customer privacy');
  if (state.tab === 'sell' && !state.viewingReceipt) updateSellResults();
}

function refreshTabBar() {
  const nav = document.getElementById('main-tablist');
  if (!nav) return;
  const tabs = getTabs();
  nav.innerHTML = tabs
    .map((t) => {
      const active = state.tab === t.id && !state.viewingReceipt;
      const badgeHtml = t.badge
        ? `<span class="ml-1 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
            active ? 'bg-white text-tealDark' : 'bg-amber-100 text-amber-900'
          }">${t.badge}</span>`
        : '';
      return `
        <button type="button" role="tab" id="tab-${t.id}" data-tab="${t.id}"
          aria-selected="${active}" aria-controls="tab-panel" tabindex="${active ? '0' : '-1'}"
          class="tab-btn touch-target inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
            active
              ? 'bg-gradient-to-r from-teal to-tealDark text-white shadow-sm'
              : 'text-ink/80 hover:bg-mint/60 hover:text-tealDark'
          }">
          ${t.icon}
          <span>${esc(t.label)}</span>${badgeHtml}
        </button>`;
    })
    .join('');

  nav.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab, { moveFocus: true }));
    btn.addEventListener('keydown', (e) => {
      const list = [...nav.querySelectorAll('[role="tab"]')];
      const idx = list.indexOf(btn);
      let nextIdx = null;
      if (e.key === 'ArrowRight') nextIdx = (idx + 1) % list.length;
      else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + list.length) % list.length;
      else if (e.key === 'Home') nextIdx = 0;
      else if (e.key === 'End') nextIdx = list.length - 1;
      if (nextIdx !== null) {
        e.preventDefault();
        const target = list[nextIdx];
        switchTab(target.dataset.tab, { moveFocus: false });
        document.getElementById(`tab-${target.dataset.tab}`)?.focus();
      }
    });
  });
}

function mountShell() {
  applyA11yAttrs();
  const key = `${state.session.user.id}:${state.profile?.role || 'staff'}`;
  if (state.shellKey === key && document.getElementById('tab-panel')) {
    refreshTabBar();
    updateA11yButtons();
    return;
  }

  state.shellKey = key;
  app.innerHTML = `
    <header class="no-print glass-header rounded-2xl px-4 py-3.5 mt-4 mb-4 space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-tealDark text-white flex items-center justify-center shadow-sm">
            ${ICONS.cross}
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="font-display text-xl font-bold text-tealDark tracking-tight">Shelf Price</h1>
              <span id="header-med-count" class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-mint text-tealDark">${state.medications.length} Meds</span>
              <span class="text-[11px] font-bold px-2 py-0.5 rounded-full ${isOwner() ? 'bg-indigo-100 text-indigo-900' : 'bg-black/5 text-ink/80'}">${isOwner() ? 'Owner' : 'Counter Staff'}</span>
            </div>
            <p class="text-xs text-ink/75 truncate max-w-[260px] sm:max-w-none">${esc(state.profile?.email || state.session.user.email)}</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button type="button" id="cost-toggle-btn" title="Shortcut: Alt+C"></button>
          <button type="button" id="a11y-drawer-toggle" aria-expanded="false" aria-controls="a11y-drawer"
            class="touch-target inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-black/15 bg-white text-xs font-semibold hover:bg-black/5">
            ${ICONS.sliders}
            <span>Display &amp; Accessibility</span>
          </button>
        </div>
      </div>

      <div id="a11y-drawer" class="hidden pt-3 border-t border-black/10 flex flex-wrap items-center justify-between gap-2" role="region" aria-label="Display and accessibility settings">
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" id="a11y-text-btn" class="touch-target px-3.5 py-2 rounded-xl border border-black/15 bg-white text-xs font-semibold hover:bg-black/5"></button>
          <button type="button" id="a11y-contrast-btn" class="touch-target px-3.5 py-2 rounded-xl border border-black/15 bg-white text-xs font-semibold hover:bg-black/5"></button>
          <button type="button" id="a11y-readable-btn" class="touch-target px-3.5 py-2 rounded-xl border border-black/15 bg-white text-xs font-semibold hover:bg-black/5"></button>
        </div>
        <button type="button" id="signout" class="touch-target px-4 py-2 rounded-xl border border-clay/40 text-clay text-xs font-semibold hover:bg-clay/10">Sign out</button>
      </div>
    </header>

    <nav aria-label="Primary sections" class="no-print mb-5 overflow-x-auto no-scrollbar pb-1">
      <div id="main-tablist" role="tablist" class="card-surface inline-flex gap-1 bg-white p-1.5 rounded-2xl border border-black/10 min-w-max"></div>
    </nav>

    <main id="main-content">
      <div id="tab-panel" role="tabpanel" aria-live="polite"></div>
    </main>
  `;

  document.getElementById('a11y-drawer-toggle').addEventListener('click', () => {
    state.a11yDrawerOpen = !state.a11yDrawerOpen;
    updateA11yButtons();
  });

  document.getElementById('a11y-text-btn').addEventListener('click', () => {
    const order = ['normal', 'large', 'xlarge'];
    const idx = order.indexOf(state.a11y.textSize);
    state.a11y.textSize = order[(idx + 1) % order.length];
    applyA11yAttrs();
    saveA11yPrefs();
    updateA11yButtons();
    announce(`Text size set to ${state.a11y.textSize}`);
  });

  document.getElementById('a11y-contrast-btn').addEventListener('click', () => {
    state.a11y.contrast = state.a11y.contrast === 'high' ? 'normal' : 'high';
    applyA11yAttrs();
    saveA11yPrefs();
    updateA11yButtons();
    announce(`High contrast ${state.a11y.contrast === 'high' ? 'enabled' : 'disabled'}`);
  });

  document.getElementById('a11y-readable-btn').addEventListener('click', () => {
    state.a11y.readable = !state.a11y.readable;
    applyA11yAttrs();
    saveA11yPrefs();
    updateA11yButtons();
    announce(`Easy-read spacing ${state.a11y.readable ? 'enabled' : 'disabled'}`);
  });

  document.getElementById('cost-toggle-btn').addEventListener('click', toggleShowCost);
  document.getElementById('signout').addEventListener('click', () => supabase.auth.signOut());

  refreshTabBar();
  updateA11yButtons();
}

function switchTab(tabId, { moveFocus = true } = {}) {
  if (tabId === 'admin' && !isOwner()) tabId = 'sell';
  state.tab = tabId;
  state.viewingReceipt = false;
  refreshTabBar();
  renderActiveTabPanel();
  if (moveFocus) {
    const heading = document.querySelector('#tab-panel h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
    }
  }
}

// ---------------------------------------------------------
// Reusable Modals: Compare Brands & Drug Safety Info
// ---------------------------------------------------------
function openBrandComparisonModal(medicationId, triggerEl = null) {
  const med = state.medications.find((m) => m.id === medicationId);
  if (!med) return;
  const brands = findSameDrugBrands(med, state.medications);
  const meta = inferGenericAndCompany(med);

  const rowsHtml = brands
    .map((b) => {
      const bm = inferGenericAndCompany(b);
      const prices = getAllAvailablePrices(b);
      const stockText =
        b.stock_qty === null || b.stock_qty === undefined
          ? 'Stock not tracked'
          : `${b.stock_qty} ${b.stock_unit || 'unit'} in shelf`;
      const isLow = b.stock_qty !== null && b.stock_qty <= (b.reorder_level ?? 5);
      return `
        <div class="card-surface rounded-2xl border border-black/10 p-4 space-y-3 ${b.id === med.id ? 'bg-mint/40 border-teal/30' : 'bg-white'}">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p class="font-semibold text-base">${esc(b.name)}</p>
              <p class="text-xs text-ink/80 mt-0.5">
                Company: <strong>${esc(bm.company || 'Unlabeled / House')}</strong>
                · Ingredient: <strong>${esc(bm.generic || 'Not grouped')}</strong>
              </p>
            </div>
            <span class="text-xs font-bold px-2.5 py-1 rounded-full ${
              b.stock_qty === null ? 'bg-slate-100 text-slate-800' : isLow ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
            }">${esc(stockText)}</span>
          </div>
          <div class="flex flex-wrap gap-2">
            ${
              prices
                .map(
                  (p) => `
                  <button type="button" class="cmp-add-btn price-tile"
                    data-id="${esc(b.id)}" data-name="${esc(b.name)}" data-type="${esc(p.qtyType)}" data-price="${p.unitPrice}"
                    aria-label="Add ${esc(b.name)} ${esc(p.qtyType)} ${esc(money(p.unitPrice))} to sale">
                    <span class="price-tile-unit">${esc(p.qtyType)}</span>
                    <span class="price-tile-val">${esc(money(p.unitPrice))}</span>
                  </button>`,
                )
                .join('') || '<span class="text-sm text-ink/70 italic">No selling price set yet</span>'
            }
          </div>
        </div>`;
    })
    .join('');

  openModal({
    title: `Same-Drug Companies: ${meta.generic || med.name}`,
    triggerEl,
    bodyHtml: `
      <p class="text-sm text-ink/80">Showing all ${brands.length} stocked item(s) sharing <strong>${esc(meta.generic || med.name)}</strong> so you can compare companies side by side:</p>
      <div class="space-y-3">${rowsHtml}</div>
    `,
    onMount: (body) => {
      body.querySelectorAll('.cmp-add-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          addToCart({
            id: btn.dataset.id,
            name: btn.dataset.name,
            qtyType: btn.dataset.type,
            unitPrice: Number(btn.dataset.price),
          });
          showToast(`Added ${btn.dataset.name} (${btn.dataset.type}) to sale`, 'success');
        });
      });
    },
  });
}

function openDrugInfoModal(medicationId, triggerEl = null) {
  const med = state.medications.find((m) => m.id === medicationId);
  if (!med) return;
  const meta = inferGenericAndCompany(med);
  const ref = meta.ref || matchDrugReference(med);

  const infoHtml = ref
    ? `
      <div class="rounded-2xl bg-mint/50 border border-teal/25 p-4 space-y-1">
        <p class="text-xs font-bold uppercase tracking-wide text-tealDark">${esc(ref.drugClass)}</p>
        <p class="text-base font-bold">${esc(ref.generic)}</p>
        <p class="text-sm leading-relaxed">${esc(ref.whatItTreats)}</p>
      </div>
      <div class="space-y-2">
        <h3 class="font-semibold text-base text-tealDark">Age-Group Guidance</h3>
        <ul class="text-sm space-y-2 list-disc pl-5">
          <li><strong>Infants &amp; Children:</strong> ${esc(ref.ageGuidance.infantsChildren)}</li>
          <li><strong>Adults:</strong> ${esc(ref.ageGuidance.adults)}</li>
          <li><strong>Elderly:</strong> ${esc(ref.ageGuidance.elderly)}</li>
          <li><strong>Pregnancy &amp; Breastfeeding:</strong> ${esc(ref.ageGuidance.pregnancyBreastfeeding)}</li>
        </ul>
      </div>
      <div class="rounded-2xl bg-red-50 border border-red-300 p-4 space-y-1">
        <h3 class="font-semibold text-sm text-red-900">Allergies &amp; Who Should NOT Take It</h3>
        <p class="text-sm text-red-950 leading-relaxed">${esc(ref.allergiesAndAvoid)}</p>
      </div>
      <div class="rounded-2xl bg-amber-50 border border-amber-300 p-4 space-y-1">
        <h3 class="font-semibold text-sm text-amber-950">Key Warnings</h3>
        <p class="text-sm text-amber-950 leading-relaxed">${esc(ref.warnings)}</p>
      </div>
    `
    : `
      <div class="rounded-2xl bg-amber-50 border border-amber-300 p-4">
        <p class="text-sm font-medium text-amber-950">No offline reference card matched "${esc(med.name)}" automatically. Tap "Ask AI More About This Drug" below to get full clinical, age, allergy, and brand details from Gemini Cloud AI.</p>
      </div>
    `;

  openModal({
    title: `Drug Info & Safety — ${med.name}`,
    triggerEl,
    bodyHtml: `
      ${infoHtml}
      <p class="text-xs text-ink/80 border-t border-black/10 pt-3">${esc(DISCLAIMER)}</p>
      <div class="flex flex-wrap gap-2 pt-1">
        ${
          ref
            ? `<button type="button" id="speak-drug-info" class="touch-target px-4 py-2 rounded-xl border border-black/20 text-sm font-semibold hover:bg-black/5">Read Safety Info Aloud</button>`
            : ''
        }
        <button type="button" id="ask-ai-med" class="touch-target px-4 py-2 rounded-xl bg-gradient-to-r from-teal to-tealDark text-white text-sm font-semibold">Ask AI More About This Drug</button>
      </div>
    `,
    onMount: (body) => {
      const speakBtn = body.querySelector('#speak-drug-info');
      if (speakBtn && ref) {
        speakBtn.addEventListener('click', () => {
          speakText(
            `${med.name}. ${ref.whatItTreats}. Allergies and who should not take it: ${ref.allergiesAndAvoid}. Children: ${ref.ageGuidance.infantsChildren}. Pregnancy: ${ref.ageGuidance.pregnancyBreastfeeding}`,
          );
        });
      }
      body.querySelector('#ask-ai-med').addEventListener('click', () => {
        closeModal();
        const prompt = `Tell me about ${med.name}: what it treats, dosing guidance across ages, allergies/who should not take it, and other brands circulating in Nigeria.`;
        state.aiPrompt = '';
        switchTab('ai', { moveFocus: true });
        runAiQuestion(prompt, med);
      });
    },
  });
}

// ---------------------------------------------------------
// Cart Operations (Surgical DOM Update — Preserves Search Focus!)
// ---------------------------------------------------------
function addToCart({ id, name, qtyType, unitPrice }) {
  const existing = state.cart.find((i) => i.medication_id === id && i.qty_type === qtyType);
  if (existing) existing.quantity += 1;
  else {
    state.cart.push({
      medication_id: id,
      name,
      qty_type: qtyType,
      unit_price: Number(unitPrice),
      quantity: 1,
    });
  }
  announce(`Added ${name} ${qtyType} ${money(unitPrice)} to current sale`);
  if (state.tab === 'sell' && !state.viewingReceipt) updateCartPanel();
}

function updateCartPanel() {
  const cartPanel = document.getElementById('cart-panel');
  if (!cartPanel) return;

  const cartTotal = state.cart.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const totalCount = state.cart.reduce((sum, i) => sum + i.quantity, 0);
  const medById = new Map(state.medications.map((m) => [m.id, m]));
  const belowCostItems = state.cart.filter((i) => {
    const m = medById.get(i.medication_id);
    return m && isBelowCost(i.unit_price, m.last_buy_unit_price);
  });

  cartPanel.innerHTML = `
    <div class="bg-gradient-to-r from-tealDark to-teal text-white px-4 py-3.5 rounded-t-2xl flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        ${ICONS.sell}
        <h3 class="font-display text-base font-semibold">POS Sale Terminal</h3>
        <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20">${totalCount}</span>
      </div>
      ${
        state.cart.length > 0
          ? `<button type="button" id="clear-cart-btn" class="touch-target px-2.5 py-1 text-xs font-semibold bg-white/15 hover:bg-white/25 rounded-lg">Clear</button>`
          : ''
      }
    </div>

    <div class="p-4 space-y-4">
      ${
        state.cart.length === 0
          ? `<div class="rounded-xl bg-porcelain border border-dashed border-black/15 p-5 text-center text-sm text-ink/75">
              Tap any unit price tile on the left to ring up an item here.
            </div>`
          : `<div class="space-y-3 max-h-[42vh] overflow-y-auto pr-1">
              ${state.cart
                .map((item, idx) => {
                  const m = medById.get(item.medication_id);
                  const below = m && isBelowCost(item.unit_price, m.last_buy_unit_price);
                  return `
                    <div class="flex items-center justify-between text-sm gap-2 pb-2.5 border-b border-black/10">
                      <div class="flex-1 min-w-0">
                        <p class="font-semibold truncate">${esc(item.name)}</p>
                        <p class="text-xs text-ink/75">${esc(item.qty_type)} · ${esc(money(item.unit_price))}</p>
                        ${
                          below
                            ? `<p class="text-xs font-bold text-red-700 mt-0.5">⚠ At/below buy cost (${esc(money(m.last_buy_unit_price))})</p>`
                            : ''
                        }
                      </div>
                      <div class="flex items-center gap-1">
                        <button type="button" data-idx="${idx}" data-dir="-1"
                          class="qty-btn touch-target rounded-xl bg-porcelain hover:bg-black/10 font-bold border border-black/15"
                          aria-label="Decrease quantity of ${esc(item.name)}">–</button>
                        <span class="w-7 text-center font-bold" aria-live="polite">${item.quantity}</span>
                        <button type="button" data-idx="${idx}" data-dir="1"
                          class="qty-btn touch-target rounded-xl bg-porcelain hover:bg-black/10 font-bold border border-black/15"
                          aria-label="Increase quantity of ${esc(item.name)}">+</button>
                        <button type="button" data-idx="${idx}"
                          class="remove-btn touch-target rounded-xl text-clay hover:bg-clay/10 font-bold border border-transparent"
                          aria-label="Remove ${esc(item.name)} from sale">✕</button>
                      </div>
                    </div>`;
                })
                .join('')}
            </div>`
      }

      ${
        belowCostItems.length > 0
          ? `<div role="alert" class="rounded-xl bg-red-50 border border-red-300 px-3 py-2.5 text-xs font-semibold text-red-900">
              Uncle's Rule Check: ${belowCostItems.length} item(s) priced at or below recorded purchase cost!
            </div>`
          : ''
      }

      <div class="rounded-xl bg-mint/50 border border-teal/20 px-4 py-3 flex justify-between items-center">
        <span class="text-sm font-semibold text-ink/80">Total Due</span>
        <span class="text-lg font-bold text-tealDark">${esc(money(cartTotal))}</span>
      </div>

      <div class="space-y-2">
        <button type="button" id="checkout-btn" ${state.cart.length === 0 ? 'disabled' : ''}
          class="touch-target w-full bg-gradient-to-r from-teal to-tealDark hover:opacity-95 disabled:opacity-40 text-white rounded-xl py-3 px-4 font-semibold shadow-sm transition">
          Complete Sale &amp; Print Receipt
        </button>
        ${
          state.cart.length > 0
            ? `<button type="button" id="speak-cart-btn" class="touch-target w-full border border-black/20 rounded-xl py-2 px-3 text-sm font-semibold hover:bg-black/5">
                Read Total Aloud
              </button>`
            : ''
        }
      </div>
    </div>
  `;

  cartPanel.querySelector('#clear-cart-btn')?.addEventListener('click', () => {
    state.cart = [];
    updateCartPanel();
    announce('Cleared current sale');
  });

  cartPanel.querySelectorAll('.qty-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      const dir = Number(btn.dataset.dir);
      if (!state.cart[idx]) return;
      state.cart[idx].quantity = Math.max(1, state.cart[idx].quantity + dir);
      updateCartPanel();
    });
  });

  cartPanel.querySelectorAll('.remove-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      const removed = state.cart.splice(idx, 1)[0];
      updateCartPanel();
      if (removed) announce(`Removed ${removed.name}`);
    });
  });

  cartPanel.querySelector('#speak-cart-btn')?.addEventListener('click', () => {
    const itemsText = state.cart.map((i) => `${i.quantity} ${i.name}`).join(', ');
    speakText(`Current sale total is ${Math.round(cartTotal)} Naira for ${itemsText}`);
  });

  cartPanel.querySelector('#checkout-btn')?.addEventListener('click', completeSale);
}

async function completeSale() {
  if (state.cart.length === 0) return;
  const total = state.cart.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const btn = document.getElementById('checkout-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Saving sale…';
  }

  const { data: sale, error } = await supabase
    .from('sales')
    .insert({
      sold_by: state.session.user.id,
      sold_by_email: state.session.user.email,
      total,
    })
    .select()
    .single();

  if (error) {
    showToast('Could not save the sale: ' + error.message, 'error');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Complete Sale & Print Receipt';
    }
    return;
  }

  const items = state.cart.map((i) => ({
    sale_id: sale.id,
    medication_id: i.medication_id,
    medication_name: i.name,
    qty_type: i.qty_type,
    unit_price: i.unit_price,
    quantity: i.quantity,
    subtotal: i.unit_price * i.quantity,
  }));

  const { error: itemsError } = await supabase.from('sale_items').insert(items);
  if (itemsError) {
    showToast('Could not save receipt items: ' + itemsError.message, 'error');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Complete Sale & Print Receipt';
    }
    return;
  }

  state.lastReceipt = { sale, items };
  state.cart = [];
  state.viewingReceipt = true;
  await Promise.all([loadMedications(), loadSalesAndItems()]);
  refreshTabBar();
  renderReceiptView();
  showToast('Sale saved! Receipt ready to print.', 'success');
}

function renderReceiptView() {
  const { sale, items } = state.lastReceipt || {};
  if (!sale) return switchTab('sell');
  document.body.dataset.printTarget = 'receipt';
  const panel = document.getElementById('tab-panel');
  panel.innerHTML = `
    <div id="receipt-print" class="card-surface bg-white border border-black/15 rounded-2xl p-6 max-w-md mx-auto">
      <div class="text-center border-b border-black/10 pb-3 mb-4">
        <h2 class="font-display text-xl font-bold text-tealDark">Shelf Price Receipt</h2>
        <p class="text-xs text-ink/75 mt-0.5">${esc(new Date(sale.created_at).toLocaleString())}</p>
      </div>
      <div class="space-y-2 text-sm mb-4">
        ${items
          .map(
            (i) => `
          <div class="flex justify-between gap-2">
            <span>${esc(i.medication_name)} (${esc(i.qty_type)}) × ${i.quantity}</span>
            <span class="font-semibold">${esc(money(i.subtotal))}</span>
          </div>`,
          )
          .join('')}
      </div>
      <div class="border-t border-black/15 pt-3 flex justify-between font-bold text-base">
        <span>Total</span><span class="text-tealDark">${esc(money(sale.total))}</span>
      </div>
      <p class="text-xs text-center text-ink/75 mt-4">Served by ${esc(sale.sold_by_email)}</p>
    </div>
    <div class="no-print flex flex-wrap gap-3 justify-center mt-6">
      <button type="button" id="print-btn" class="touch-target bg-gradient-to-r from-teal to-tealDark text-white rounded-xl px-5 py-2.5 font-semibold shadow-sm">Print Receipt</button>
      <button type="button" id="new-sale-btn" class="touch-target border border-teal text-tealDark bg-white rounded-xl px-5 py-2.5 font-semibold hover:bg-mint/50">New Sale</button>
    </div>
  `;
  document.getElementById('print-btn').addEventListener('click', () => {
    document.body.dataset.printTarget = 'receipt';
    window.print();
  });
  document.getElementById('new-sale-btn').addEventListener('click', () => switchTab('sell', { moveFocus: true }));
}

// ---------------------------------------------------------
// TAB 1: SELL (Zero Focus Loss, POS Price Tiles, Cost Privacy)
// ---------------------------------------------------------
function getAllCompaniesList() {
  const set = new Set();
  state.medications.forEach((m) => {
    const meta = inferGenericAndCompany(m);
    if (meta.company) set.add(meta.company);
  });
  return ['All', ...[...set].sort((a, b) => a.localeCompare(b))];
}

function updateSellResults() {
  const resultsEl = document.getElementById('med-results');
  const countEl = document.getElementById('med-count');
  if (!resultsEl || !countEl) return;

  const q = state.sellSearch.trim();
  const brandCountByGeneric = new Map();
  state.medications.forEach((m) => {
    const g = inferGenericAndCompany(m).generic;
    if (g) {
      const k = g.toLowerCase();
      brandCountByGeneric.set(k, (brandCountByGeneric.get(k) || 0) + 1);
    }
  });

  const scored = state.medications
    .map((m) => {
      const meta = inferGenericAndCompany(m);
      if (state.sellCategory !== 'All' && m.category !== state.sellCategory) return null;
      if (state.sellCompany !== 'All' && meta.company !== state.sellCompany) return null;
      const score = q ? fuzzyScore(q, m) : 1;
      if (q && score < 55) return null;
      return { med: m, meta, score };
    })
    .filter(Boolean);

  if (q) {
    scored.sort((a, b) => b.score - a.score || a.med.name.localeCompare(b.med.name));
  }

  countEl.textContent = `Showing ${scored.length} of ${state.medications.length} medicines`;

  if (scored.length === 0) {
    resultsEl.innerHTML = `
      <div class="card-surface bg-white border border-black/10 rounded-2xl p-8 text-center space-y-3">
        <p class="text-sm font-medium text-ink/80">No shelf medicine matched "${esc(q)}".</p>
        <button type="button" id="sell-ask-ai-fallback" class="touch-target px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal to-tealDark text-white text-sm font-semibold">
          Ask AI Assistant about "${esc(q)}"
        </button>
      </div>
    `;
    resultsEl.querySelector('#sell-ask-ai-fallback')?.addEventListener('click', () => {
      state.aiPrompt = '';
      switchTab('ai', { moveFocus: true });
      runAiQuestion(q);
    });
    return;
  }

  resultsEl.innerHTML = scored
    .map(({ med: m, meta }) => {
      const prices = getAllAvailablePrices(m);
      const noPrices = prices.length === 0;
      const sameDrugCount = meta.generic ? brandCountByGeneric.get(meta.generic.toLowerCase()) || 1 : 1;
      const hasBuyCost = m.last_buy_unit_price !== null && m.last_buy_unit_price !== undefined;
      const showCostBox = state.a11y.showCost || noPrices;

      let stockBadge = `<span class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">Stock untracked</span>`;
      if (m.stock_qty !== null && m.stock_qty !== undefined) {
        if (m.stock_qty === 0) {
          stockBadge = `<span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-900">Out of stock</span>`;
        } else if (m.stock_qty <= (m.reorder_level ?? 5)) {
          stockBadge = `<span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">Low: ${m.stock_qty} ${esc(m.stock_unit || 'unit')}</span>`;
        } else {
          stockBadge = `<span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">In stock: ${m.stock_qty}</span>`;
        }
      }

      let costHelperHtml = '';
      if (showCostBox) {
        if (hasBuyCost) {
          const calc = calculateSellingPriceOptions(m.last_buy_unit_price, m.default_markup_pct ?? 25);
          const rec25 = calc.options.find((o) => o.pct === 25) || calc.options[0];
          const anyBelow = prices.some((p) => isBelowCost(p.unitPrice, m.last_buy_unit_price));
          costHelperHtml = `
            <div class="mt-3 pt-3 border-t border-black/10 text-xs space-y-1.5 ${anyBelow ? 'bg-red-50 -mx-1 px-3 py-2.5 rounded-xl border border-red-300' : 'bg-mint/30 -mx-1 px-3 py-2.5 rounded-xl'}">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span>
                  <strong>Last Buy Cost:</strong> ${esc(money(m.last_buy_unit_price))}
                  ${m.last_buy_pack_label ? `(${esc(m.last_buy_pack_label)})` : ''}
                  · <strong>Safe +25% Sell:</strong> ${esc(money(rec25?.price || calc.minProfitPrice))}
                </span>
                <button type="button" class="prefill-suggest-btn touch-target px-3 py-1 rounded-lg border border-teal bg-white text-tealDark font-semibold hover:bg-teal hover:text-white"
                  data-id="${esc(m.id)}" data-rec="${rec25?.price || ''}">
                  ${isOwner() ? 'Set Sell Price' : 'Suggest Sell Price'}
                </button>
              </div>
              ${
                anyBelow
                  ? `<p class="font-bold text-red-800">⚠ Warning: A selling price on this card is AT OR BELOW Uncle's buy cost (${esc(money(m.last_buy_unit_price))})!</p>`
                  : ''
              }
            </div>`;
        } else if (noPrices) {
          costHelperHtml = `
            <div class="mt-3 pt-3 border-t border-black/10 text-xs flex flex-wrap items-center justify-between gap-2 bg-amber-50/70 -mx-1 px-3 py-2 rounded-xl">
              <span class="text-amber-900 font-semibold">No selling price or Purchase Book buy cost yet.</span>
              <button type="button" class="log-buy-btn touch-target px-3 py-1 rounded-lg border border-amber-700 bg-white text-amber-900 font-semibold hover:bg-amber-100"
                data-id="${esc(m.id)}">
                Log Buy Cost
              </button>
            </div>`;
        }
      }

      return `
        <article class="card-surface bg-white border border-black/10 rounded-2xl p-4 space-y-3">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="space-y-1.5">
              <h3 class="font-semibold text-base text-ink">${esc(m.name)}</h3>
              <div class="flex flex-wrap items-center gap-1.5 text-xs">
                <span class="px-2.5 py-0.5 rounded-full bg-porcelain border border-black/10 font-semibold text-ink/80">${esc(m.category)}</span>
                ${meta.company ? `<span class="px-2.5 py-0.5 rounded-full bg-mint text-tealDark font-bold">${esc(meta.company)}</span>` : ''}
                ${meta.generic ? `<span class="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-900 font-semibold">${esc(meta.generic)}</span>` : ''}
                ${stockBadge}
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5">
              ${
                sameDrugCount > 1
                  ? `<button type="button" class="compare-btn touch-target inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal/35 bg-mint/40 text-tealDark text-xs font-semibold hover:bg-mint" data-id="${esc(m.id)}">
                      ${ICONS.layers}<span>Compare (${sameDrugCount})</span>
                    </button>`
                  : ''
              }
              <button type="button" class="info-btn touch-target inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/15 bg-porcelain/60 text-xs font-semibold hover:bg-black/5" data-id="${esc(m.id)}">
                ${ICONS.shield}<span>Drug Info &amp; Safety</span>
              </button>
            </div>
          </div>

          <div class="flex gap-2 flex-wrap">
            ${
              prices
                .map((p) => {
                  const below = hasBuyCost && isBelowCost(p.unitPrice, m.last_buy_unit_price);
                  const label = p.qtyType.charAt(0).toUpperCase() + p.qtyType.slice(1);
                  return `
                    <button type="button"
                      class="add-btn price-tile ${below ? 'price-tile-warn' : ''}"
                      data-id="${esc(m.id)}"
                      data-name="${esc(m.name)}"
                      data-type="${esc(p.qtyType)}"
                      data-price="${p.unitPrice}"
                      aria-label="Add ${esc(m.name)} ${esc(label)} ${esc(money(p.unitPrice))} to current sale">
                      <span class="price-tile-unit">${esc(label)}</span>
                      <span class="price-tile-val">${esc(money(p.unitPrice))}</span>
                    </button>`;
                })
                .join('') || `<span class="text-sm text-ink/75 italic">No selling price set yet</span>`
            }
          </div>
          ${costHelperHtml}
        </article>`;
    })
    .join('');

  resultsEl.querySelectorAll('.add-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      addToCart({
        id: btn.dataset.id,
        name: btn.dataset.name,
        qtyType: btn.dataset.type,
        unitPrice: Number(btn.dataset.price),
      });
    });
  });

  resultsEl.querySelectorAll('.compare-btn').forEach((btn) => {
    btn.addEventListener('click', () => openBrandComparisonModal(btn.dataset.id, btn));
  });

  resultsEl.querySelectorAll('.info-btn').forEach((btn) => {
    btn.addEventListener('click', () => openDrugInfoModal(btn.dataset.id, btn));
  });

  resultsEl.querySelectorAll('.log-buy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.pbSelectedMedId = btn.dataset.id;
      switchTab('purchase', { moveFocus: true });
    });
  });

  resultsEl.querySelectorAll('.prefill-suggest-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const medId = btn.dataset.id;
      const rec = btn.dataset.rec;
      if (isOwner()) {
        const med = state.medications.find((m) => m.id === medId);
        state.adminSearch = med?.name || '';
        switchTab('admin', { moveFocus: true });
      } else {
        state.suggestionDraft = { type: 'price_change', medicationId: medId, suggestedPrice: rec };
        switchTab('suggestions', { moveFocus: true });
      }
    });
  });
}

function renderSellTab() {
  const categories = ['All', ...new Set(state.medications.map((m) => m.category)).values()];
  const companies = getAllCompaniesList();
  const panel = document.getElementById('tab-panel');

  panel.innerHTML = `
    <div class="grid lg:grid-cols-3 gap-6 items-start">
      <section class="lg:col-span-2 space-y-4" aria-labelledby="sell-heading">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 id="sell-heading" class="font-display text-xl font-bold text-tealDark">Counter Price Lookup</h2>
            <p class="text-xs text-ink/75">Search by medicine, symptom (e.g. malaria, bp, ulcer), or company name.</p>
          </div>
          <label class="touch-target inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl border border-black/15 bg-white cursor-pointer shadow-sm">
            <input id="sell-cost-toggle" type="checkbox" ${state.a11y.showCost ? 'checked' : ''} class="w-4 h-4 accent-teal" />
            Show Buy Cost (Alt+C)
          </label>
        </div>

        <div class="card-surface bg-white border border-black/10 rounded-2xl p-4 space-y-3">
          <div class="grid sm:grid-cols-12 gap-3">
            <div class="sm:col-span-6">
              <label for="search" class="block text-xs font-bold uppercase tracking-wide text-ink/75 mb-1">Search medicine, symptom, or company</label>
              <div class="flex gap-1.5 items-center">
                <div class="relative flex-1">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-ink/45 pointer-events-none">${ICONS.search}</span>
                  <input id="search" type="search" value="${esc(state.sellSearch)}"
                    placeholder="e.g. Amoxil, malaria, bp, Berlin…"
                    class="touch-target w-full border border-black/20 rounded-xl pl-9 pr-3 py-2 bg-porcelain/40 focus:bg-white" />
                </div>
                ${
                  supportsVoiceRecognition()
                    ? `<button type="button" id="sell-voice-btn" class="touch-target px-3 py-2 rounded-xl border border-black/20 bg-white text-xs font-semibold hover:bg-black/5" aria-label="Voice search">🎤</button>`
                    : ''
                }
              </div>
            </div>
            <div class="sm:col-span-3">
              <label for="category" class="block text-xs font-bold uppercase tracking-wide text-ink/75 mb-1">Category</label>
              <select id="category" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white">
                ${categories.map((c) => `<option value="${esc(c)}" ${c === state.sellCategory ? 'selected' : ''}>${esc(c)}</option>`).join('')}
              </select>
            </div>
            <div class="sm:col-span-3">
              <label for="company-filter" class="block text-xs font-bold uppercase tracking-wide text-ink/75 mb-1">Company / Brand</label>
              <select id="company-filter" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white">
                ${companies.map((c) => `<option value="${esc(c)}" ${c === state.sellCompany ? 'selected' : ''}>${esc(c)}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <p id="med-count" class="text-xs font-semibold text-tealDark" aria-live="polite"></p>
          </div>
        </div>

        <div id="med-results" class="space-y-3 max-h-[68vh] overflow-y-auto pr-1"></div>
      </section>

      <aside id="cart-panel" class="card-surface bg-white border border-black/10 rounded-2xl sticky top-4 overflow-hidden" aria-label="Current Sale Cart"></aside>
    </div>
  `;

  const searchInput = document.getElementById('search');
  searchInput.addEventListener('input', (e) => {
    state.sellSearch = e.target.value;
    updateSellResults();
  });

  document.getElementById('sell-voice-btn')?.addEventListener('click', (e) => {
    startVoiceInput((text) => {
      state.sellSearch = text;
      searchInput.value = text;
      updateSellResults();
      announce(`Searched for ${text}`);
    }, e.currentTarget);
  });

  document.getElementById('category').addEventListener('change', (e) => {
    state.sellCategory = e.target.value;
    updateSellResults();
  });

  document.getElementById('company-filter').addEventListener('change', (e) => {
    state.sellCompany = e.target.value;
    updateSellResults();
  });

  document.getElementById('sell-cost-toggle').addEventListener('change', (e) => {
    state.a11y.showCost = e.target.checked;
    updateA11yButtons();
    updateSellResults();
  });

  updateSellResults();
  updateCartPanel();
}

// ---------------------------------------------------------
// TAB 2: PURCHASE BOOK (Digital Ledger Replacing Physical Book)
// ---------------------------------------------------------
function updatePurchaseResults() {
  const resultsEl = document.getElementById('purchase-results');
  const summaryEl = document.getElementById('pb-summary');
  if (!resultsEl) return;

  const q = state.pbSearch.trim();
  const filtered = state.purchaseEntries.filter((p) => {
    if (state.pbCompany !== 'All' && (p.company || 'Unlabeled') !== state.pbCompany) return false;
    if (!q) return true;
    const hay = `${p.medication_name} ${p.company || ''} ${p.generic_name || ''} ${p.supplier || ''} ${p.pack_description || ''}`;
    return fuzzyScore(q, hay) >= 55;
  });

  if (summaryEl) {
    const totalSpend = filtered.reduce((s, p) => s + Number(p.total_cost || 0), 0);
    summaryEl.textContent = `${filtered.length} entry(s) · Total: ${money(totalSpend)}`;
  }

  if (filtered.length === 0) {
    resultsEl.innerHTML = `
      <div class="card-surface bg-white border border-black/10 rounded-2xl p-8 text-center text-sm text-ink/75">
        No Purchase Book entries match yet. Use the form on the left to record Uncle's pack rate &amp; single unit buy cost!
      </div>`;
    return;
  }

  const byMed = new Map();
  state.purchaseEntries.forEach((p) => {
    const k = p.medication_id || p.medication_name.toLowerCase();
    if (!byMed.has(k)) byMed.set(k, []);
    byMed.get(k).push(p);
  });

  const nowMs = Date.now();
  resultsEl.innerHTML = filtered
    .map((p) => {
      const history = byMed.get(p.medication_id || p.medication_name.toLowerCase()) || [];
      const idx = history.findIndex((x) => x.id === p.id);
      const prev = idx >= 0 ? history[idx + 1] : null;
      let trendBadge = '';
      if (prev) {
        const diff = Number(p.unit_buy_price) - Number(prev.unit_buy_price);
        if (diff > 0) {
          trendBadge = `<span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-900">↑ +${esc(money(diff))} vs prev</span>`;
        } else if (diff < 0) {
          trendBadge = `<span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">↓ -${esc(money(Math.abs(diff)))} vs prev</span>`;
        } else {
          trendBadge = `<span class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">Same rate</span>`;
        }
      }

      let expiryBadge = '';
      if (p.expiry_date) {
        const expDays = (new Date(p.expiry_date).getTime() - nowMs) / 86400000;
        if (expDays <= 0) {
          expiryBadge = `<span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-900">Expired ${esc(p.expiry_date)}</span>`;
        } else if (expDays <= 60) {
          expiryBadge = `<span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">Expires soon: ${esc(p.expiry_date)}</span>`;
        } else {
          expiryBadge = `<span class="text-xs px-2.5 py-0.5 rounded-full bg-porcelain border border-black/10">Exp: ${esc(p.expiry_date)}</span>`;
        }
      }

      const calc = calculateSellingPriceOptions(p.unit_buy_price, 25);
      const rec25 = calc.options.find((o) => o.pct === 25) || calc.options[0];

      return `
        <article class="card-surface bg-white border border-black/10 rounded-2xl p-4 space-y-2">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 class="font-semibold text-base">${esc(p.medication_name)}</h3>
              <p class="text-xs text-ink/80">
                ${p.company ? `Company: <strong>${esc(p.company)}</strong> · ` : ''}
                ${p.supplier ? `Supplier: ${esc(p.supplier)} · ` : ''}
                Date: ${esc(p.purchased_at)}
              </p>
            </div>
            <div class="text-right">
              <p class="text-base font-bold text-tealDark">${esc(money(p.unit_buy_price))} <span class="text-xs font-normal">/ ${esc(p.unit_type)}</span></p>
              <p class="text-xs text-ink/80">${esc(p.pack_description)} · Total ${esc(money(p.total_cost))}</p>
            </div>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div class="flex flex-wrap items-center gap-1.5">
              ${trendBadge}
              ${expiryBadge}
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-mint text-tealDark font-semibold">
                Safe +25% sell: ${esc(money(rec25?.price || p.unit_buy_price))}
              </span>
            </div>
            ${
              isOwner()
                ? `<button type="button" class="pb-del-btn touch-target px-3 py-1 rounded-xl border border-red-300 text-xs font-semibold text-red-800 hover:bg-red-50" data-id="${esc(p.id)}" data-name="${esc(p.medication_name)}">Delete</button>`
                : ''
            }
          </div>
          ${p.notes ? `<p class="text-xs italic text-ink/75">"${esc(p.notes)}"</p>` : ''}
        </article>`;
    })
    .join('');

  resultsEl.querySelectorAll('.pb-del-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const ok = await confirmModal({
        title: 'Delete Purchase Entry?',
        message: `Remove this purchase log for ${btn.dataset.name}? Stock totals already applied will remain unless adjusted in Restock.`,
        confirmLabel: 'Delete Entry',
        danger: true,
        triggerEl: btn,
      });
      if (!ok) return;
      const { error } = await supabase.from('purchase_entries').delete().eq('id', btn.dataset.id);
      if (error) showToast('Could not delete entry: ' + error.message, 'error');
      else {
        await loadPurchaseEntries();
        updatePurchaseResults();
        showToast('Purchase entry removed.', 'info');
      }
    });
  });
}

function renderPurchaseBookTab() {
  const panel = document.getElementById('tab-panel');
  const pbCompanies = ['All', ...new Set(state.purchaseEntries.map((p) => p.company || 'Unlabeled'))];
  const pbCategories = getCanonicalCategoryList(state.medications);
  const todayStr = new Date().toISOString().slice(0, 10);

  panel.innerHTML = `
    <div class="grid lg:grid-cols-5 gap-6 items-start">
      <section class="lg:col-span-2 card-surface bg-white border border-black/10 rounded-2xl p-5" aria-labelledby="pb-form-heading">
        <h2 id="pb-form-heading" class="font-display text-xl font-bold text-tealDark mb-1">Log Purchase (Uncle's Book)</h2>
        <p class="text-xs text-ink/80 mb-4">Record pack rate (1 roll, 5 tins, etc.) and total paid — we compute single unit buy cost, update stock count, and suggest safe retail prices.</p>

        <form id="pb-form" class="space-y-3">
          <div>
            <label for="pb-med" class="block text-xs font-semibold mb-1">Medicine</label>
            <select id="pb-med" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white">
              <option value="">— New / unlisted medicine —</option>
              ${state.medications
                .map(
                  (m) =>
                    `<option value="${esc(m.id)}" ${m.id === state.pbSelectedMedId ? 'selected' : ''}>${esc(m.name)}</option>`,
                )
                .join('')}
            </select>
          </div>

          <div id="pb-new-med-fields" class="grid sm:grid-cols-2 gap-2 ${state.pbSelectedMedId ? 'hidden' : ''}">
            <div>
              <label for="pb-new-name" class="block text-xs font-semibold mb-1">New medicine name</label>
              <input id="pb-new-name" type="text" placeholder="e.g. Emzor Paracetamol" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
            </div>
            <div>
              <label for="pb-new-cat" class="block text-xs font-semibold mb-1">Category</label>
              <input id="pb-new-cat" type="text" list="pb-cat-list" value="" placeholder="Auto-detect or choose…" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
              <datalist id="pb-cat-list">${pbCategories.map((c) => `<option value="${esc(c)}">`).join('')}</datalist>
            </div>
            <div class="sm:col-span-2 flex flex-wrap items-center justify-between gap-2">
              <button type="button" id="pb-ai-cat-btn"
                class="touch-target inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal/40 bg-mint/50 text-tealDark text-xs font-semibold hover:bg-mint transition">
                ${ICONS.ai}<span>AI Auto-Category &amp; Info</span>
              </button>
              <span id="pb-ai-cat-note" class="text-xs text-tealDark font-medium hidden" aria-live="polite"></span>
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-2">
            <div>
              <label for="pb-company" class="block text-xs font-semibold mb-1">Company / Brand</label>
              <input id="pb-company" type="text" placeholder="e.g. Berlin, Teva, Tuyil" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
            </div>
            <div>
              <label for="pb-generic" class="block text-xs font-semibold mb-1">Active Ingredient</label>
              <input id="pb-generic" type="text" placeholder="e.g. Amlodipine" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-2">
            <div>
              <label for="pb-pack" class="block text-xs font-semibold mb-1">Pack / Bulk Description</label>
              <input id="pb-pack" type="text" required placeholder="e.g. 1 roll, 5 tins, 2 cartons" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
            </div>
            <div>
              <label for="pb-supplier" class="block text-xs font-semibold mb-1">Supplier / Market (optional)</label>
              <input id="pb-supplier" type="text" placeholder="e.g. Head Bridge / Distributor" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label for="pb-qty" class="block text-xs font-semibold mb-1">Units in Pack / Buy</label>
              <input id="pb-qty" type="number" step="0.01" min="0.01" value="1" required class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
            </div>
            <div>
              <label for="pb-unit" class="block text-xs font-semibold mb-1">Unit Type</label>
              <select id="pb-unit" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white">
                ${UNIT_TYPES.map((u) => `<option value="${u}">${u.charAt(0).toUpperCase() + u.slice(1)}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label for="pb-total-cost" class="block text-xs font-semibold mb-1">Total Paid (₦)</label>
              <input id="pb-total-cost" type="number" step="0.01" min="0" required placeholder="e.g. 8500" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
            </div>
            <div>
              <label for="pb-unit-price" class="block text-xs font-semibold mb-1">Single Unit Cost (₦)</label>
              <input id="pb-unit-price" type="number" step="0.01" min="0" required placeholder="Auto-calculated" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
            </div>
          </div>

          <div id="pb-sell-helper" class="rounded-xl bg-mint/50 border border-teal/25 p-3 text-xs space-y-2">
            <p class="font-semibold text-tealDark">Enter Total Paid or Single Unit Cost to see safe selling prices.</p>
          </div>

          <div class="space-y-2">
            <label class="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input id="pb-apply-sell" type="checkbox" class="w-4 h-4 accent-teal" />
              ${isOwner() ? 'Also update retail selling price for this unit' : 'Also send retail selling price suggestion to Owner'}
            </label>
            <div id="pb-sell-wrap" class="hidden">
              <label for="pb-sell-price" class="block text-xs font-semibold mb-1">Retail Selling Price (₦)</label>
              <input id="pb-sell-price" type="number" step="0.01" min="0" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
              <p id="pb-below-warn" class="text-xs font-bold text-red-700 mt-1 hidden"></p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label for="pb-date" class="block text-xs font-semibold mb-1">Purchase Date</label>
              <input id="pb-date" type="date" value="${todayStr}" required class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
            </div>
            <div>
              <label for="pb-expiry" class="block text-xs font-semibold mb-1">Expiry Date (optional)</label>
              <input id="pb-expiry" type="date" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
            </div>
          </div>

          <div>
            <label for="pb-notes" class="block text-xs font-semibold mb-1">Notes (optional)</label>
            <input id="pb-notes" type="text" placeholder="Batch, promo deal, or price note" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
          </div>

          <button type="submit" id="pb-submit-btn" class="touch-target w-full bg-gradient-to-r from-teal to-tealDark hover:opacity-95 text-white rounded-xl py-3 font-semibold shadow-sm transition">
            Save to Purchase Book
          </button>
        </form>
      </section>

      <section class="lg:col-span-3 space-y-4" aria-labelledby="pb-ledger-heading">
        <div class="card-surface bg-white border border-black/10 rounded-2xl p-4 space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h2 id="pb-ledger-heading" class="font-display text-xl font-bold text-tealDark">Digital Purchase Book</h2>
            <span id="pb-summary" class="text-xs font-bold px-2.5 py-1 rounded-full bg-mint text-tealDark"></span>
          </div>
          <div class="grid sm:grid-cols-3 gap-2">
            <div class="sm:col-span-2">
              <label for="pb-search" class="block text-xs font-semibold mb-1">Instant search (no flipping pages)</label>
              <input id="pb-search" type="search" value="${esc(state.pbSearch)}" placeholder="Search medicine, supplier, company, or roll…"
                class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
            </div>
            <div>
              <label for="pb-company-filter" class="block text-xs font-semibold mb-1">Company</label>
              <select id="pb-company-filter" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white">
                ${pbCompanies.map((c) => `<option value="${esc(c)}" ${c === state.pbCompany ? 'selected' : ''}>${esc(c)}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <div id="purchase-results" class="space-y-3 max-h-[70vh] overflow-y-auto pr-1"></div>
      </section>
    </div>
  `;

  const medSelect = document.getElementById('pb-med');
  const newMedFields = document.getElementById('pb-new-med-fields');
  const pbNewNameInput = document.getElementById('pb-new-name');
  const pbNewCatInput = document.getElementById('pb-new-cat');
  const pbAiCatBtn = document.getElementById('pb-ai-cat-btn');
  const pbAiCatNote = document.getElementById('pb-ai-cat-note');
  const compInput = document.getElementById('pb-company');
  const genInput = document.getElementById('pb-generic');
  const qtyInput = document.getElementById('pb-qty');
  const unitSelect = document.getElementById('pb-unit');
  const totalInput = document.getElementById('pb-total-cost');
  const unitPriceInput = document.getElementById('pb-unit-price');
  const helperEl = document.getElementById('pb-sell-helper');
  const applySellCb = document.getElementById('pb-apply-sell');
  const sellWrap = document.getElementById('pb-sell-wrap');
  const sellPriceInput = document.getElementById('pb-sell-price');
  const belowWarn = document.getElementById('pb-below-warn');
  let pbCatTouched = false;

  pbNewCatInput.addEventListener('input', () => {
    const v = pbNewCatInput.value.trim().toLowerCase();
    pbCatTouched = Boolean(v && v !== 'other');
  });

  async function runPbAutoCategory(manual = false) {
    const name = pbNewNameInput.value.trim();
    if (!name) {
      if (manual) showToast('Type the new medicine name first.', 'warn');
      return;
    }
    const origHtml = pbAiCatBtn.innerHTML;
    pbAiCatBtn.disabled = true;
    pbAiCatBtn.innerHTML = `${ICONS.ai}<span>Detecting…</span>`;
    try {
      const res = await autoCategorizeMedication({
        supabase,
        name,
        existingCategories: pbCategories,
      });
      if (!document.body.contains(pbNewCatInput)) return;
      pbNewCatInput.value = res.category || 'Other';
      pbCatTouched = false;
      if (!compInput.value.trim() && res.company) compInput.value = res.company;
      if (!genInput.value.trim() && res.generic_name) genInput.value = res.generic_name;
      const via = res.mode === 'gemini' ? `Gemini Cloud AI${res.model ? ` (${res.model})` : ''}` : 'Smart Classifier';
      pbAiCatNote.textContent = `${via}: ${res.category} — ${res.reason}`;
      pbAiCatNote.classList.remove('hidden');
      if (manual) {
        showToast(
          `Detected category: ${res.category}${res.company ? ` (${res.company})` : ''}`,
          res.category !== 'Other' ? 'success' : 'info',
        );
      }
    } finally {
      if (document.body.contains(pbAiCatBtn)) {
        pbAiCatBtn.disabled = false;
        pbAiCatBtn.innerHTML = origHtml;
      }
    }
  }

  pbAiCatBtn.addEventListener('click', () => runPbAutoCategory(true));
  pbNewNameInput.addEventListener('blur', () => {
    const cur = pbNewCatInput.value.trim().toLowerCase();
    if (!medSelect.value && !pbCatTouched && (!cur || cur === 'other')) {
      runPbAutoCategory(false);
    }
  });

  function syncMedSelection() {
    state.pbSelectedMedId = medSelect.value;
    const isNew = !medSelect.value;
    newMedFields.classList.toggle('hidden', !isNew);
    if (!isNew) {
      const m = state.medications.find((x) => x.id === medSelect.value);
      if (m) {
        const meta = inferGenericAndCompany(m);
        if (meta.company) compInput.value = meta.company;
        if (meta.generic) genInput.value = meta.generic;
        if (UNIT_TYPES.includes(m.stock_unit)) unitSelect.value = m.stock_unit;
      }
    }
  }

  function refreshBelowWarn() {
    const unitCost = Number(unitPriceInput.value);
    const sellVal = sellPriceInput.value;
    if (applySellCb.checked && sellVal !== '' && isBelowCost(sellVal, unitCost)) {
      belowWarn.textContent = `⚠ ${money(sellVal)} is AT OR BELOW buy cost (${money(unitCost)}). Increase selling price to make profit!`;
      belowWarn.classList.remove('hidden');
    } else {
      belowWarn.classList.add('hidden');
    }
  }

  function refreshMarkupPreview() {
    const unitCost = Number(unitPriceInput.value);
    if (!Number.isFinite(unitCost) || unitCost <= 0) {
      helperEl.innerHTML = `<p class="font-semibold text-tealDark">Enter Total Paid or Single Unit Cost to see safe selling prices.</p>`;
      refreshBelowWarn();
      return;
    }
    const calc = calculateSellingPriceOptions(unitCost, 25);
    helperEl.innerHTML = `
      <p class="font-semibold text-tealDark">Recommended Selling Prices (Never sell at or below ${esc(money(unitCost))}):</p>
      <div class="flex flex-wrap gap-1.5">
        ${calc.options
          .map(
            (o) => `
          <button type="button" class="pb-markup-pick touch-target px-2.5 py-1.5 rounded-xl border ${
            o.isDefault ? 'bg-teal text-white border-teal' : 'bg-white border-teal/40 text-tealDark hover:bg-mint'
          } font-semibold" data-price="${o.price}">
            +${o.pct}% → ${esc(money(o.price))}
          </button>`,
          )
          .join('')}
      </div>`;
    helperEl.querySelectorAll('.pb-markup-pick').forEach((btn) => {
      btn.addEventListener('click', () => {
        applySellCb.checked = true;
        sellWrap.classList.remove('hidden');
        sellPriceInput.value = btn.dataset.price;
        refreshBelowWarn();
      });
    });
    if (!sellPriceInput.value) {
      const def = calc.options.find((o) => o.isDefault) || calc.options[0];
      if (def) sellPriceInput.value = def.price;
    }
    refreshBelowWarn();
  }

  medSelect.addEventListener('change', syncMedSelection);
  if (state.pbSelectedMedId) syncMedSelection();

  const recalcFromTotal = () => {
    const q = Number(qtyInput.value);
    const t = Number(totalInput.value);
    if (q > 0 && Number.isFinite(t) && totalInput.value !== '') {
      unitPriceInput.value = (t / q).toFixed(2);
    }
    refreshMarkupPreview();
  };

  totalInput.addEventListener('input', recalcFromTotal);
  qtyInput.addEventListener('input', recalcFromTotal);
  unitPriceInput.addEventListener('input', () => {
    const q = Number(qtyInput.value);
    const u = Number(unitPriceInput.value);
    if (q > 0 && Number.isFinite(u) && unitPriceInput.value !== '') {
      totalInput.value = (u * q).toFixed(2);
    }
    refreshMarkupPreview();
  });

  applySellCb.addEventListener('change', () => {
    sellWrap.classList.toggle('hidden', !applySellCb.checked);
    refreshBelowWarn();
  });
  sellPriceInput.addEventListener('input', refreshBelowWarn);

  document.getElementById('pb-search').addEventListener('input', (e) => {
    state.pbSearch = e.target.value;
    updatePurchaseResults();
  });

  document.getElementById('pb-company-filter').addEventListener('change', (e) => {
    state.pbCompany = e.target.value;
    updatePurchaseResults();
  });

  document.getElementById('pb-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('pb-submit-btn');
    let medId = medSelect.value || null;
    const medName = medId ? medSelect.selectedOptions[0].textContent : document.getElementById('pb-new-name').value.trim();

    if (!medName) {
      showToast('Pick an existing medicine or type a new medicine name.', 'warn');
      return;
    }

    const company = compInput.value.trim() || null;
    const genericName = genInput.value.trim() || null;
    const packDesc = document.getElementById('pb-pack').value.trim();
    const qtyUnits = Number(qtyInput.value);
    const unitType = unitSelect.value;
    const unitBuyPrice = Number(unitPriceInput.value);
    const totalCost = Number(totalInput.value);
    const sellPriceVal = applySellCb.checked && sellPriceInput.value !== '' ? Number(sellPriceInput.value) : null;

    if (sellPriceVal !== null && isBelowCost(sellPriceVal, unitBuyPrice)) {
      const ok = await confirmModal({
        title: 'Selling Price Warning',
        message: `Your entered retail selling price (${money(sellPriceVal)}) is AT OR BELOW the buy cost (${money(unitBuyPrice)}). Uncle says not to sell for what you bought it for — continue anyway?`,
        confirmLabel: 'Save Anyway',
        danger: true,
        triggerEl: submitBtn,
      });
      if (!ok) return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving…';

    try {
      if (!medId) {
        const newCat = document.getElementById('pb-new-cat').value.trim() || 'Other';
        const { data: createdId, error: rpcErr } = await supabase.rpc('create_medication_from_purchase', {
          p_name: medName,
          p_category: newCat,
          p_company: company,
          p_generic_name: genericName,
        });
        if (rpcErr) throw rpcErr;
        medId = createdId;
      }

      const payload = {
        medication_id: medId,
        medication_name: medName,
        company,
        generic_name: genericName,
        supplier: document.getElementById('pb-supplier').value.trim() || null,
        pack_description: packDesc,
        quantity_units: qtyUnits,
        unit_type: unitType,
        unit_buy_price: unitBuyPrice,
        total_cost: totalCost,
        suggested_sell_price: sellPriceVal,
        purchased_at: document.getElementById('pb-date').value,
        expiry_date: document.getElementById('pb-expiry').value || null,
        notes: document.getElementById('pb-notes').value.trim() || null,
        recorded_by: state.session.user.id,
        recorded_by_email: state.session.user.email,
      };

      const { error: insErr } = await supabase.from('purchase_entries').insert(payload);
      if (insErr) throw insErr;

      if (sellPriceVal !== null) {
        const priceField = 'price_' + unitType;
        if (isOwner()) {
          await supabase.from('medications').update({ [priceField]: sellPriceVal }).eq('id', medId);
        } else {
          await supabase.from('suggestions').insert({
            type: 'price_change',
            medication_id: medId,
            name: medName,
            company,
            generic_name: genericName,
            [priceField]: sellPriceVal,
            suggested_buy_price: unitBuyPrice,
            note: `From Purchase Book (${packDesc} @ ${money(unitBuyPrice)}/${unitType})`,
            suggested_by: state.session.user.id,
            suggested_by_email: state.session.user.email,
          });
        }
      }

      await Promise.all([loadMedications(), loadPurchaseEntries(), loadSuggestions()]);
      state.pbSelectedMedId = '';
      refreshTabBar();
      renderPurchaseBookTab();
      showToast(`Saved "${medName}" to Purchase Book & updated stock!`, 'success');
    } catch (err) {
      showToast('Could not save purchase: ' + err.message, 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save to Purchase Book';
    }
  });

  updatePurchaseResults();
}

// ---------------------------------------------------------
// TAB 3: RESTOCK & COMPANIES ON SHELF
// ---------------------------------------------------------
function updateRestockResults() {
  const resultsEl = document.getElementById('restock-results');
  const printEl = document.getElementById('restock-print');
  if (!resultsEl) return;

  const vel = analyzeInventoryVelocity(state.medications, state.saleItems, state.purchaseEntries);
  const q = state.restockSearch.trim();

  if (printEl) {
    printEl.innerHTML = `
      <h2 class="font-display text-xl font-bold mb-1">Pharmacy Restock Sheet</h2>
      <p class="text-xs mb-4">Generated ${esc(new Date().toLocaleString())}</p>
      <pre class="whitespace-pre-wrap text-sm font-sans leading-relaxed">${esc(vel.restockListText)}</pre>
    `;
  }

  if (state.restockFilter === 'companies') {
    const groups = vel.companyGroups.filter((g) => {
      if (!q) return true;
      return fuzzyScore(q, g.company) >= 55 || g.items.some((m) => fuzzyScore(q, m) >= 55);
    });

    resultsEl.innerHTML = groups
      .map(
        (g) => `
      <article class="card-surface bg-white border border-black/10 rounded-2xl p-4 space-y-3">
        <div class="flex items-center justify-between gap-2">
          <h3 class="font-semibold text-base text-tealDark">${esc(g.company)}</h3>
          <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-mint text-tealDark">${g.count} item(s)</span>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          ${g.items
            .slice(0, 30)
            .map(
              (m) => `
            <div class="border border-black/10 bg-porcelain/40 rounded-xl p-2.5 text-xs flex justify-between items-center gap-2">
              <div class="min-w-0">
                <p class="font-semibold truncate">${esc(m.name)}</p>
                <p class="text-ink/75">${esc(m.meta.generic || m.category)}</p>
              </div>
              <span class="font-bold text-tealDark shrink-0">
                ${m.availablePrices[0] ? esc(money(m.availablePrices[0].unitPrice)) : 'No price'}
              </span>
            </div>`,
            )
            .join('')}
        </div>
      </article>`,
      )
      .join('');
    return;
  }

  let list = vel.items;
  if (state.restockFilter === 'restock_now') list = [...vel.restockNow, ...vel.lowStock];
  else if (state.restockFilter === 'fast_mover') list = vel.fastMovers;
  else if (state.restockFilter === 'slow_mover') list = vel.slowMovers;
  else if (state.restockFilter === 'missing_price') list = vel.missingPrice;

  if (q) {
    list = list.filter((x) => fuzzyScore(q, x.med) >= 55);
  }

  if (list.length === 0) {
    resultsEl.innerHTML = `
      <div class="card-surface bg-white border border-black/10 rounded-2xl p-8 text-center text-sm text-ink/80">
        No items in this filter right now. Tip: Enter a shelf stock count below or log purchases in <strong>Purchase Book</strong> to automatically track low-stock &amp; slow-mover alerts!
      </div>`;
    return;
  }

  resultsEl.innerHTML = list
    .slice(0, 100)
    .map((x) => {
      const m = x.med;
      const statusPill =
        x.status === 'restock_now'
          ? '<span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-900">Restock Now</span>'
          : x.status === 'low_stock'
            ? '<span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">Low Stock</span>'
            : x.status === 'slow_mover'
              ? '<span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">Slow Mover — Don\'t Overbuy</span>'
              : x.status === 'fast_mover'
                ? '<span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">Fast Mover</span>'
                : '<span class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">Stock Untracked</span>';

      return `
        <article class="card-surface bg-white border border-black/10 rounded-2xl p-4 space-y-3" data-restock-id="${esc(m.id)}">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 class="font-semibold text-base">${esc(m.name)}</h3>
              <p class="text-xs text-ink/80">
                ${esc(m.category)}
                ${x.meta.company ? ` · Company: <strong>${esc(x.meta.company)}</strong>` : ''}
                · Sold: <strong>${x.sold7d}</strong> (7d) / <strong>${x.sold30d}</strong> (30d)
              </p>
            </div>
            <div class="flex flex-wrap gap-1.5 items-center">
              ${statusPill}
              ${x.missingPrice ? '<span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">Missing Sell Price</span>' : ''}
            </div>
          </div>

          <div class="flex flex-wrap items-end justify-between gap-3 pt-2 border-t border-black/10">
            <div class="flex flex-wrap items-end gap-2">
              <div>
                <label for="stk-${esc(m.id)}" class="block text-xs font-semibold mb-1">Shelf Count</label>
                <input id="stk-${esc(m.id)}" type="number" min="0" step="1" value="${m.stock_qty ?? ''}" placeholder="Count"
                  class="touch-target w-24 border border-black/20 rounded-xl px-2.5 py-1.5 text-sm bg-white" />
              </div>
              <div>
                <label for="reo-${esc(m.id)}" class="block text-xs font-semibold mb-1">Alert Below</label>
                <input id="reo-${esc(m.id)}" type="number" min="0" step="1" value="${m.reorder_level ?? 5}"
                  class="touch-target w-24 border border-black/20 rounded-xl px-2.5 py-1.5 text-sm bg-white" />
              </div>
              <button type="button" class="save-stock-btn touch-target px-4 py-2 rounded-xl bg-teal hover:bg-tealDark text-white text-xs font-semibold" data-id="${esc(m.id)}">
                Save Count
              </button>
            </div>
            <div class="text-xs text-right text-ink/80">
              ${x.suggestedOrderQty > 0 ? `<p class="font-bold text-tealDark">Suggested order: ${x.suggestedOrderQty} ${esc(m.stock_unit || 'unit')}</p>` : ''}
              ${x.lastBuyUnitPrice ? `<p>Last buy: ${esc(money(x.lastBuyUnitPrice))}${x.estimatedOrderCost ? ` · Est: ${esc(money(x.estimatedOrderCost))}` : ''}</p>` : ''}
            </div>
          </div>
        </article>`;
    })
    .join('');

  resultsEl.querySelectorAll('.save-stock-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const stkVal = document.getElementById(`stk-${id}`).value;
      const reoVal = document.getElementById(`reo-${id}`).value;
      if (stkVal === '') {
        showToast('Enter a shelf count (0 or higher) before saving.', 'warn');
        return;
      }
      const { error } = await supabase.rpc('adjust_stock_level', {
        p_medication_id: id,
        p_stock_qty: Number(stkVal),
        p_reorder_level: reoVal === '' ? null : Number(reoVal),
      });
      if (error) showToast('Could not update stock: ' + error.message, 'error');
      else {
        await loadMedications();
        refreshTabBar();
        renderRestockTab();
        showToast('Shelf stock count updated!', 'success');
      }
    });
  });
}

function renderRestockTab() {
  const panel = document.getElementById('tab-panel');
  const vel = analyzeInventoryVelocity(state.medications, state.saleItems, state.purchaseEntries);

  const filterCards = [
    { id: 'restock_now', label: 'Need Restock', count: vel.urgentItems.length, tone: 'border-red-300 border-l-red-600 bg-red-50/70 text-red-950' },
    { id: 'fast_mover', label: 'Fast Movers', count: vel.fastMovers.length, tone: 'border-emerald-300 border-l-emerald-600 bg-emerald-50/70 text-emerald-950' },
    { id: 'slow_mover', label: 'Slow Movers (Avoid Overbuy)', count: vel.slowMovers.length, tone: 'border-purple-300 border-l-purple-600 bg-purple-50/70 text-purple-950' },
    { id: 'missing_price', label: 'Missing Selling Price', count: vel.missingPrice.length, tone: 'border-amber-300 border-l-amber-600 bg-amber-50/70 text-amber-950' },
    { id: 'companies', label: 'Companies on Shelf', count: vel.companyGroups.length, tone: 'border-teal/30 border-l-teal bg-mint/60 text-tealDark' },
    { id: 'all', label: 'All Shelf Items', count: vel.items.length, tone: 'border-black/15 border-l-ink bg-white text-ink' },
  ];

  panel.innerHTML = `
    <section class="space-y-4" aria-labelledby="restock-heading">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="restock-heading" class="font-display text-xl font-bold text-tealDark">Restock &amp; Shelf Planner</h2>
          <p class="text-xs text-ink/80">Spot missing items before market runs, avoid overbuying slow movers, and check companies stocked.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button type="button" id="copy-restock-btn" class="touch-target px-4 py-2 rounded-xl bg-gradient-to-r from-teal to-tealDark text-white text-xs font-semibold shadow-sm">
            Copy Restock List (WhatsApp)
          </button>
          <button type="button" id="print-restock-btn" class="touch-target px-4 py-2 rounded-xl border border-black/20 bg-white text-xs font-semibold hover:bg-black/5">
            Print Restock Sheet
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        ${filterCards
          .map(
            (c) => `
          <button type="button" data-filter="${c.id}"
            aria-pressed="${state.restockFilter === c.id}"
            class="restock-filter-btn kpi-tile touch-target rounded-2xl border p-3.5 text-left transition ${c.tone} ${
              state.restockFilter === c.id ? 'ring-2 ring-teal shadow-md' : 'opacity-90 hover:opacity-100'
            }">
            <p class="text-xl font-bold">${c.count}</p>
            <p class="text-xs font-semibold leading-tight mt-0.5">${esc(c.label)}</p>
          </button>`,
          )
          .join('')}
      </div>

      <div class="card-surface bg-white border border-black/10 rounded-2xl p-4">
        <label for="restock-search" class="block text-xs font-semibold mb-1">Filter restock list or companies</label>
        <input id="restock-search" type="search" value="${esc(state.restockSearch)}" placeholder="Search medicine, category, or company…"
          class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
      </div>

      <div id="restock-results" class="space-y-3"></div>
      <div id="restock-print" class="hidden print:block"></div>
    </section>
  `;

  panel.querySelectorAll('.restock-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.restockFilter = btn.dataset.filter;
      panel.querySelectorAll('.restock-filter-btn').forEach((b) => {
        const active = b.dataset.filter === state.restockFilter;
        b.setAttribute('aria-pressed', String(active));
        b.classList.toggle('ring-2', active);
        b.classList.toggle('ring-teal', active);
      });
      updateRestockResults();
    });
  });

  document.getElementById('restock-search').addEventListener('input', (e) => {
    state.restockSearch = e.target.value;
    updateRestockResults();
  });

  document.getElementById('copy-restock-btn').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(vel.restockListText);
      showToast('Restock list copied — ready to paste into WhatsApp!', 'success');
    } catch {
      showToast('Could not auto-copy. Use Print Restock Sheet instead.', 'warn');
    }
  });

  document.getElementById('print-restock-btn').addEventListener('click', () => {
    document.body.dataset.printTarget = 'restock';
    window.print();
  });

  updateRestockResults();
}

// ---------------------------------------------------------
// TAB 4: AI ASSISTANT (Multi-Turn Chat + Nigerian Market Smarts)
// ---------------------------------------------------------
async function runAiQuestion(question, medication = null) {
  const q = String(question || '').trim();
  if (!q) return;

  const history = state.aiMessages
    .slice(-6)
    .map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      text: m.role === 'model' ? m.answer || '' : m.text || '',
    }));

  state.aiMessages.push({
    role: 'user',
    text: q,
    timestamp: new Date().toLocaleTimeString(),
  });
  state.aiLoading = true;
  renderAiOutput();

  const res = await askPharmacyAI({
    supabase,
    question: q,
    history,
    medication,
    meds: state.medications,
    purchaseEntries: state.purchaseEntries,
    saleItems: state.saleItems,
  });

  state.aiLoading = false;
  if (res.geminiConfigured !== undefined) state.aiGeminiConfigured = res.geminiConfigured;
  if (res.model) state.aiActiveModel = res.model;

  state.aiMessages.push({
    role: 'model',
    question: q,
    ...res,
    timestamp: new Date().toLocaleTimeString(),
  });
  renderAiOutput();
  announce(`AI answer ready: ${res.title}`);
}

function renderAiOutput() {
  const out = document.getElementById('ai-output');
  const badge = document.getElementById('ai-engine-badge');
  if (badge) {
    badge.textContent =
      state.aiGeminiConfigured === true
        ? `Gemini Cloud AI${state.aiActiveModel ? ` (${state.aiActiveModel})` : ''} + Local Smart Engine`
        : 'Built-in Smart AI (Offline Ready)';
  }
  if (!out) return;

  if (state.aiMessages.length === 0 && !state.aiLoading) {
    out.innerHTML = `
      <div class="card-surface bg-white border border-black/10 rounded-2xl p-6 text-center space-y-2">
        <div class="w-10 h-10 rounded-2xl bg-mint text-tealDark mx-auto flex items-center justify-center">${ICONS.ai}</div>
        <p class="font-semibold text-base text-tealDark">Ready at the Counter</p>
        <p class="text-sm text-ink/75 max-w-lg mx-auto">Ask about brands circulating in Nigeria that aren't on your shelf yet, calculate multi-item totals, get Purchase Book markup advice, or check ages &amp; allergies — follow-up questions remember context!</p>
      </div>`;
    return;
  }

  const bubblesHtml = state.aiMessages
    .map((msg, mIdx) => {
      if (msg.role === 'user') {
        return `
          <div class="flex justify-end">
            <div class="chat-user px-4 py-3 max-w-[85%] sm:max-w-[75%] text-sm space-y-1">
              <p class="leading-relaxed">${esc(msg.text)}</p>
              <p class="text-[11px] text-white/75 text-right">${esc(msg.timestamp)}</p>
            </div>
          </div>`;
      }

      const sectionsHtml = (msg.sections || [])
        .map(
          (s) => `
          <div class="rounded-xl bg-porcelain/80 border border-black/10 p-3.5 space-y-1">
            <h4 class="text-xs font-bold uppercase tracking-wide text-tealDark">${esc(s.heading)}</h4>
            <div class="ai-formatted space-y-1.5 text-sm leading-relaxed">${formatAiMarkdownHtml(s.body)}</div>
          </div>`,
        )
        .join('');

      const actionsHtml = (msg.actions || [])
        .map(
          (a, aIdx) => `
          <button type="button" class="ai-action-btn touch-target px-3.5 py-2 rounded-xl bg-teal hover:bg-tealDark text-white text-xs font-semibold shadow-sm"
            data-m="${mIdx}" data-a="${aIdx}">
            ${esc(a.label)}
          </button>`,
        )
        .join('');

      return `
        <div class="flex justify-start">
          <article class="chat-ai p-5 w-full max-w-3xl space-y-3">
            <div class="flex flex-wrap items-start justify-between gap-2 border-b border-black/10 pb-2.5">
              <div class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-lg bg-mint text-tealDark flex items-center justify-center">${ICONS.ai}</span>
                <div>
                  <h3 class="font-display text-base font-bold text-tealDark">${esc(msg.title || 'Shelf Price AI')}</h3>
                  <p class="text-[11px] text-ink/65">${esc(msg.timestamp)}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold px-2.5 py-1 rounded-full ${
                  msg.mode === 'gemini' ? 'bg-indigo-100 text-indigo-900' : 'bg-mint text-tealDark'
                }">
                  ${msg.mode === 'gemini' ? `Gemini Cloud AI${msg.model ? ` · ${esc(msg.model)}` : ''}` : 'Built-in Smart AI'}
                </span>
                <button type="button" class="ai-speak-btn touch-target px-3 py-1.5 rounded-xl border border-black/15 text-xs font-semibold hover:bg-black/5" data-m="${mIdx}">
                  Read Aloud
                </button>
              </div>
            </div>

            <div class="ai-formatted space-y-2 text-sm leading-relaxed">${formatAiMarkdownHtml(msg.answer)}</div>
            ${sectionsHtml ? `<div class="space-y-2">${sectionsHtml}</div>` : ''}
            ${actionsHtml ? `<div class="flex flex-wrap gap-2 pt-1">${actionsHtml}</div>` : ''}
            ${msg.statusNote ? `<p class="text-xs text-ink/70">${esc(msg.statusNote)}</p>` : ''}
          </article>
        </div>`;
    })
    .join('');

  const loadingHtml = state.aiLoading
    ? `
      <div class="flex justify-start">
        <div class="chat-ai px-5 py-4 flex items-center gap-3 text-sm font-semibold text-tealDark" role="status">
          <div class="typing-dots flex gap-1"><span></span><span></span><span></span></div>
          <span>Checking shelf inventory &amp; Nigerian pharma market…</span>
        </div>
      </div>`
    : '';

  out.innerHTML = bubblesHtml + loadingHtml;
  out.scrollTop = out.scrollHeight;

  out.querySelectorAll('.ai-speak-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const msg = state.aiMessages[Number(btn.dataset.m)];
      if (msg) speakText(stripMarkdownForSpeech(`${msg.title || ''}. ${msg.answer}`));
    });
  });

  out.querySelectorAll('.ai-action-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const msg = state.aiMessages[Number(btn.dataset.m)];
      const action = msg?.actions?.[Number(btn.dataset.a)];
      if (!action) return;

      if (action.type === 'add_all_to_cart') {
        (action.items || []).forEach((it) => {
          for (let q = 0; q < (it.quantity || 1); q++) {
            addToCart({
              id: it.medication_id,
              name: it.name,
              qtyType: it.qty_type,
              unitPrice: it.unit_price,
            });
          }
        });
        showToast('Added item(s) to Current Sale!', 'success');
        switchTab('sell', { moveFocus: true });
      } else if (action.type === 'compare_brands') {
        openBrandComparisonModal(action.medicationId, btn);
      } else if (action.type === 'open_purchase_book') {
        state.pbSelectedMedId = action.medicationId || '';
        switchTab('purchase', { moveFocus: true });
      } else if (action.type === 'prefill_suggestion') {
        state.suggestionDraft = {
          type: 'price_change',
          medicationId: action.medicationId,
          suggestedPrice: action.suggestedPrice,
        };
        switchTab('suggestions', { moveFocus: true });
      } else if (action.type === 'open_tab') {
        switchTab(action.tab || 'sell', { moveFocus: true });
      }
    });
  });
}

function renderAssistantTab() {
  const panel = document.getElementById('tab-panel');
  const quickChips = [
    "What companies of Amlodipine circulate in Nigeria that we don't have on our shelf?",
    'Price check: 2 cards Amoxil 500 and 1 bottle Abidec',
    'Who should NOT take Amoxil or Ciprofloxacin?',
    'What should we restock and avoid overbuying?',
    'Bought 1 roll of 10 for 8500, what should I sell 1 for?',
  ];

  panel.innerHTML = `
    <section class="space-y-4" aria-labelledby="ai-heading">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="ai-heading" class="font-display text-xl font-bold text-tealDark">AI Counter Pharmacist</h2>
          <div class="flex flex-wrap items-center gap-2 mt-1">
            <span id="ai-engine-badge" class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-mint text-tealDark"></span>
            <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-900">Remembers follow-ups</span>
          </div>
        </div>
        <button type="button" id="ai-clear-btn" class="touch-target px-3.5 py-2 rounded-xl border border-black/15 bg-white text-xs font-semibold hover:bg-black/5">
          New Chat
        </button>
      </div>

      <div class="rounded-2xl bg-amber-50/90 border border-amber-300 px-4 py-3 text-xs font-medium text-amber-950">
        <strong>Clinical Safety Notice:</strong> ${esc(DISCLAIMER)}
      </div>

      <div id="ai-output" class="space-y-4 max-h-[55vh] overflow-y-auto pr-1 py-1"></div>

      <div class="card-surface bg-white border border-black/10 rounded-2xl p-4 space-y-3">
        <div class="flex flex-wrap gap-1.5">
          ${quickChips
            .map(
              (c) => `
            <button type="button" class="ai-chip touch-target text-xs font-semibold px-3 py-1.5 rounded-full border border-teal/35 bg-mint/40 text-tealDark hover:bg-mint" data-q="${esc(c)}">
              ${esc(c)}
            </button>`,
            )
            .join('')}
        </div>

        <form id="ai-form" class="space-y-2">
          <label for="ai-input" class="block text-xs font-bold uppercase tracking-wide text-ink/75">Ask anything (shelf prices, Nigerian brands not on shelf, buy-cost markup, or drug safety)</label>
          <div class="flex flex-col sm:flex-row gap-2">
            <input id="ai-input" type="text" value="${esc(state.aiPrompt)}" placeholder="Ask a question or follow-up…"
              class="touch-target flex-1 border border-black/20 rounded-xl px-3.5 py-2.5 bg-porcelain/40 focus:bg-white" />
            <div class="flex gap-2">
              ${
                supportsVoiceRecognition()
                  ? `<button type="button" id="ai-voice-btn" class="touch-target px-3.5 py-2 rounded-xl border border-black/20 bg-white text-xs font-semibold hover:bg-black/5">🎤 Voice</button>`
                  : ''
              }
              <button type="submit" class="touch-target px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal to-tealDark hover:opacity-95 text-white text-sm font-semibold shadow-sm">
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  `;

  const inputEl = document.getElementById('ai-input');
  inputEl.addEventListener('input', (e) => {
    state.aiPrompt = e.target.value;
  });

  document.getElementById('ai-clear-btn').addEventListener('click', () => {
    state.aiMessages = [];
    state.aiPrompt = '';
    inputEl.value = '';
    renderAiOutput();
    announce('Started a fresh AI conversation');
  });

  panel.querySelectorAll('.ai-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.aiPrompt = '';
      inputEl.value = '';
      runAiQuestion(btn.dataset.q);
    });
  });

  document.getElementById('ai-voice-btn')?.addEventListener('click', (e) => {
    startVoiceInput((text) => {
      state.aiPrompt = '';
      inputEl.value = '';
      runAiQuestion(text);
    }, e.currentTarget);
  });

  document.getElementById('ai-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = inputEl.value.trim();
    if (!q) return;
    state.aiPrompt = '';
    inputEl.value = '';
    runAiQuestion(q);
  });

  renderAiOutput();
}

// ---------------------------------------------------------
// TAB 5: SUGGESTIONS (Accessible + Below-Cost Guardrail)
// ---------------------------------------------------------
function renderSuggestionsTab() {
  const panel = document.getElementById('tab-panel');
  const categories = getCanonicalCategoryList(state.medications);
  const draft = state.suggestionDraft;

  panel.innerHTML = `
    <div class="grid md:grid-cols-2 gap-6 items-start">
      <section class="card-surface bg-white border border-black/10 rounded-2xl p-5" aria-labelledby="sug-form-heading">
        <h2 id="sug-form-heading" class="font-display text-xl font-bold text-tealDark mb-3">Suggest a Price or New Medicine</h2>
        <form id="suggestion-form" class="space-y-3">
          <fieldset class="flex flex-wrap gap-4 text-sm">
            <legend class="text-xs font-semibold mb-1">Suggestion Type</legend>
            <label class="touch-target inline-flex items-center gap-2 cursor-pointer">
              <input type="radio" name="s-type" value="price_change" ${draft?.type !== 'new_med' ? 'checked' : ''} class="w-4 h-4 accent-teal" />
              Price change
            </label>
            <label class="touch-target inline-flex items-center gap-2 cursor-pointer">
              <input type="radio" name="s-type" value="new_med" ${draft?.type === 'new_med' ? 'checked' : ''} class="w-4 h-4 accent-teal" />
              New medicine
            </label>
          </fieldset>

          <div id="s-existing-wrap">
            <label for="s-medication" class="block text-xs font-semibold mb-1">Existing medicine</label>
            <select id="s-medication" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white">
              <option value="">— Pick existing medicine —</option>
              ${state.medications
                .map(
                  (m) =>
                    `<option value="${esc(m.id)}" data-name="${esc(m.name)}" ${draft?.medicationId === m.id ? 'selected' : ''}>${esc(m.name)}</option>`,
                )
                .join('')}
            </select>
          </div>

          <div id="s-new-name-wrap" class="hidden">
            <label for="s-name" class="block text-xs font-semibold mb-1">New medicine name</label>
            <input id="s-name" type="text" placeholder="Medicine name" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
          </div>

          <div id="s-buy-cost-banner" class="hidden rounded-xl bg-mint/50 border border-teal/25 px-3 py-2 text-xs"></div>

          <div class="flex flex-wrap items-center justify-between gap-2">
            <button type="button" id="s-ai-cat-btn"
              class="touch-target inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal/40 bg-mint/50 text-tealDark text-xs font-semibold hover:bg-mint transition">
              ${ICONS.ai}<span>AI Auto-Category &amp; Info</span>
            </button>
            <span id="s-ai-cat-note" class="text-xs text-tealDark font-medium hidden" aria-live="polite"></span>
          </div>

          <div class="grid sm:grid-cols-3 gap-2">
            <div>
              <label for="s-category" class="block text-xs font-semibold mb-1">Category</label>
              <input id="s-category" list="cat-list" placeholder="Pain Relief" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
              <datalist id="cat-list">${categories.map((c) => `<option value="${esc(c)}">`).join('')}</datalist>
            </div>
            <div>
              <label for="s-company" class="block text-xs font-semibold mb-1">Company / Brand</label>
              <input id="s-company" type="text" placeholder="e.g. Berlin" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
            </div>
            <div>
              <label for="s-generic" class="block text-xs font-semibold mb-1">Active Ingredient</label>
              <input id="s-generic" type="text" placeholder="e.g. Amlodipine" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            ${UNIT_TYPES.map(
              (u) => `
              <div>
                <label for="s-${u}" class="block text-xs font-semibold mb-1">${u.charAt(0).toUpperCase() + u.slice(1)} (₦)</label>
                <input id="s-${u}" type="number" step="0.01" min="0" placeholder="₦" class="s-price-inp touch-target w-full border border-black/20 rounded-xl px-2.5 py-2 bg-white" />
              </div>`,
            ).join('')}
          </div>

          <p id="s-below-cost-alert" role="alert" class="hidden text-xs font-bold text-red-800 bg-red-50 border border-red-300 rounded-xl px-3 py-2"></p>

          <div>
            <label for="s-note" class="block text-xs font-semibold mb-1">Note for Owner (optional)</label>
            <textarea id="s-note" rows="2" placeholder="Why this change?" class="w-full border border-black/20 rounded-xl px-3 py-2 bg-white"></textarea>
          </div>

          <button type="submit" id="s-submit-btn" class="touch-target w-full bg-gradient-to-r from-teal to-tealDark hover:opacity-95 text-white rounded-xl py-3 font-semibold shadow-sm transition">
            Submit Suggestion
          </button>
        </form>
      </section>

      <section class="space-y-3" aria-labelledby="sug-list-heading">
        <h2 id="sug-list-heading" class="font-display text-xl font-bold text-tealDark">${isOwner() ? 'Review Suggestions' : 'Suggestion Status'}</h2>
        <div class="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
          ${state.suggestions.length === 0 ? `<p class="text-sm text-ink/75">No suggestions yet.</p>` : ''}
          ${state.suggestions
            .map(
              (s) => `
            <article class="card-surface bg-white border border-black/10 rounded-2xl p-4">
              <div class="flex justify-between items-start gap-2">
                <div>
                  <p class="font-semibold">${esc(s.name)} <span class="text-xs font-normal text-ink/70">(${s.type === 'new_med' ? 'new medicine' : 'price change'})</span></p>
                  <p class="text-xs text-ink/80">
                    ${esc(s.category || 'Other')}
                    ${s.company ? ` · ${esc(s.company)}` : ''}
                    · by ${esc(s.suggested_by_email)}
                  </p>
                  <p class="text-sm mt-1">
                    ${UNIT_TYPES.filter((u) => s['price_' + u] != null)
                      .map((u) => `${u.charAt(0).toUpperCase() + u.slice(1)}: ${money(s['price_' + u])}`)
                      .join(' · ')}
                  </p>
                  ${s.note ? `<p class="text-xs text-ink/75 italic mt-1">"${esc(s.note)}"</p>` : ''}
                </div>
                <span class="text-xs font-bold px-2.5 py-1 rounded-full ${
                  s.status === 'pending'
                    ? 'bg-amber-100 text-amber-900'
                    : s.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-red-100 text-red-900'
                }">${esc(s.status)}</span>
              </div>
              ${
                isOwner() && s.status === 'pending'
                  ? `
                <div class="flex gap-2 mt-3">
                  <button type="button" data-id="${esc(s.id)}" data-approve="true" class="decide-btn touch-target flex-1 bg-teal hover:bg-tealDark text-white rounded-xl py-2 text-sm font-semibold">Approve</button>
                  <button type="button" data-id="${esc(s.id)}" data-approve="false" class="decide-btn touch-target flex-1 border border-clay text-clay rounded-xl py-2 text-sm font-semibold hover:bg-clay/10">Reject</button>
                </div>`
                  : ''
              }
            </article>`,
            )
            .join('')}
        </div>
      </section>
    </div>
  `;

  const medSel = document.getElementById('s-medication');
  const existingWrap = document.getElementById('s-existing-wrap');
  const newNameWrap = document.getElementById('s-new-name-wrap');
  const sNewNameInput = document.getElementById('s-name');
  const sCatInput = document.getElementById('s-category');
  const sCompInput = document.getElementById('s-company');
  const sGenInput = document.getElementById('s-generic');
  const sAiCatBtn = document.getElementById('s-ai-cat-btn');
  const sAiCatNote = document.getElementById('s-ai-cat-note');
  const buyCostBanner = document.getElementById('s-buy-cost-banner');
  const belowAlert = document.getElementById('s-below-cost-alert');
  let activeBuyCost = null;
  let sCatTouched = false;

  sCatInput.addEventListener('input', () => {
    const v = sCatInput.value.trim().toLowerCase();
    sCatTouched = Boolean(v && v !== 'other');
  });

  async function runSuggestionAutoCategory(manual = false) {
    const type = panel.querySelector('input[name="s-type"]:checked').value;
    const medName = medSel.selectedOptions[0]?.dataset.name || '';
    const name = type === 'new_med' ? sNewNameInput.value.trim() : medName;
    if (!name) {
      if (manual) {
        showToast(
          type === 'new_med' ? 'Type the new medicine name first.' : 'Pick an existing medicine first.',
          'warn',
        );
      }
      return;
    }

    const origHtml = sAiCatBtn.innerHTML;
    sAiCatBtn.disabled = true;
    sAiCatBtn.innerHTML = `${ICONS.ai}<span>Detecting…</span>`;
    try {
      const res = await autoCategorizeMedication({
        supabase,
        name,
        existingCategories: categories,
      });
      if (!document.body.contains(sCatInput)) return;
      sCatInput.value = res.category || 'Other';
      sCatTouched = false;
      if ((type === 'new_med' || !sCompInput.value.trim()) && res.company) {
        sCompInput.value = res.company;
      }
      if ((type === 'new_med' || !sGenInput.value.trim()) && res.generic_name) {
        sGenInput.value = res.generic_name;
      }
      const via = res.mode === 'gemini' ? `Gemini Cloud AI${res.model ? ` (${res.model})` : ''}` : 'Smart Classifier';
      sAiCatNote.textContent = `${via}: ${res.category} — ${res.reason}`;
      sAiCatNote.classList.remove('hidden');
      if (manual) {
        showToast(
          `Detected category: ${res.category}${res.company ? ` (${res.company})` : ''}`,
          res.category !== 'Other' ? 'success' : 'info',
        );
      }
    } finally {
      if (document.body.contains(sAiCatBtn)) {
        sAiCatBtn.disabled = false;
        sAiCatBtn.innerHTML = origHtml;
      }
    }
  }

  function checkSuggestionCost() {
    if (!activeBuyCost) {
      belowAlert.classList.add('hidden');
      return;
    }
    const vals = [...panel.querySelectorAll('.s-price-inp')]
      .map((el) => (el.value !== '' ? Number(el.value) : null))
      .filter((v) => v !== null);
    const bad = vals.some((v) => isBelowCost(v, activeBuyCost));
    if (bad) {
      belowAlert.textContent = `⚠ Warning: One of your entered prices is AT OR BELOW Uncle's buy cost (${money(activeBuyCost)}).`;
      belowAlert.classList.remove('hidden');
    } else {
      belowAlert.classList.add('hidden');
    }
  }

  function syncTypeAndMed() {
    const type = panel.querySelector('input[name="s-type"]:checked').value;
    existingWrap.classList.toggle('hidden', type === 'new_med');
    newNameWrap.classList.toggle('hidden', type !== 'new_med');
    sCatTouched = false;
    sAiCatNote.classList.add('hidden');

    const med = type === 'price_change' ? state.medications.find((m) => m.id === medSel.value) : null;
    if (med) {
      const meta = inferGenericAndCompany(med);
      sCatInput.value = med.category || '';
      sCompInput.value = meta.company || '';
      sGenInput.value = meta.generic || '';
      UNIT_TYPES.forEach((u) => {
        const inp = document.getElementById(`s-${u}`);
        inp.placeholder = med['price_' + u] != null ? `Now ${med['price_' + u]}` : '₦';
      });
      activeBuyCost = med.last_buy_unit_price ? Number(med.last_buy_unit_price) : null;
      if (activeBuyCost) {
        const calc = calculateSellingPriceOptions(activeBuyCost, 25);
        const rec25 = calc.options.find((o) => o.pct === 25) || calc.options[0];
        buyCostBanner.innerHTML = `<strong>Purchase Book Cost:</strong> ${esc(money(activeBuyCost))} · Recommended +25% sell: <strong>${esc(money(rec25?.price || activeBuyCost))}</strong>`;
        buyCostBanner.classList.remove('hidden');
      } else {
        buyCostBanner.classList.add('hidden');
      }
    } else {
      activeBuyCost = null;
      buyCostBanner.classList.add('hidden');
    }
    checkSuggestionCost();
  }

  sAiCatBtn.addEventListener('click', () => runSuggestionAutoCategory(true));
  sNewNameInput.addEventListener('blur', () => {
    const type = panel.querySelector('input[name="s-type"]:checked').value;
    const cur = sCatInput.value.trim().toLowerCase();
    if (type === 'new_med' && !sCatTouched && (!cur || cur === 'other')) {
      runSuggestionAutoCategory(false);
    }
  });

  panel.querySelectorAll('input[name="s-type"]').forEach((r) => r.addEventListener('change', syncTypeAndMed));
  medSel.addEventListener('change', syncTypeAndMed);
  panel.querySelectorAll('.s-price-inp').forEach((inp) => inp.addEventListener('input', checkSuggestionCost));

  if (draft?.suggestedPrice && draft?.medicationId) {
    const med = state.medications.find((m) => m.id === draft.medicationId);
    const field = UNIT_TYPES.includes(med?.stock_unit) ? med.stock_unit : 'packet';
    const inp = document.getElementById(`s-${field}`);
    if (inp) inp.value = draft.suggestedPrice;
  }
  state.suggestionDraft = null;
  syncTypeAndMed();

  panel.querySelectorAll('#suggestion-form input:not([type="submit"])').forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') e.preventDefault();
    });
  });

  document.getElementById('suggestion-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('s-submit-btn');
    const type = panel.querySelector('input[name="s-type"]:checked').value;
    const medicationId = medSel.value || null;
    const medName = medSel.selectedOptions[0]?.dataset.name;
    const name = type === 'new_med' ? document.getElementById('s-name').value.trim() : medName || '';

    if (type === 'price_change' && !medicationId) {
      showToast('Pick which existing medicine this price change is for.', 'warn');
      return;
    }
    if (!name) {
      showToast('Please enter the new medicine name.', 'warn');
      return;
    }

    const noPriceEntered = UNIT_TYPES.every((u) => document.getElementById(`s-${u}`).value === '');
    if (noPriceEntered) {
      const proceed = await confirmModal({
        title: 'No Prices Entered',
        message: 'You have not typed any price values yet. Submit this suggestion anyway?',
        confirmLabel: 'Submit Anyway',
        triggerEl: submitBtn,
      });
      if (!proceed) return;
    }

    const payload = {
      type,
      medication_id: type === 'price_change' ? medicationId : null,
      name,
      category: document.getElementById('s-category').value.trim() || 'Other',
      company: document.getElementById('s-company').value.trim() || null,
      generic_name: document.getElementById('s-generic').value.trim() || null,
      suggested_buy_price: activeBuyCost,
      note: document.getElementById('s-note').value.trim() || null,
      suggested_by: state.session.user.id,
      suggested_by_email: state.session.user.email,
    };
    UNIT_TYPES.forEach((u) => {
      const val = document.getElementById(`s-${u}`).value;
      payload['price_' + u] = val === '' ? null : Number(val);
    });

    const { error } = await supabase.from('suggestions').insert(payload);
    if (error) showToast('Could not submit: ' + error.message, 'error');
    else {
      await loadSuggestions();
      refreshTabBar();
      renderSuggestionsTab();
      showToast('Suggestion submitted!', 'success');
    }
  });

  panel.querySelectorAll('.decide-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const approve = btn.dataset.approve === 'true';
      const { error } = await supabase.rpc('decide_suggestion', {
        p_suggestion_id: btn.dataset.id,
        p_approve: approve,
      });
      if (error) showToast('Could not decide: ' + error.message, 'error');
      else {
        await Promise.all([loadMedications(), loadSuggestions()]);
        refreshTabBar();
        renderSuggestionsTab();
        showToast(approve ? 'Suggestion approved & price list updated!' : 'Suggestion rejected.', 'success');
      }
    });
  });
}

// ---------------------------------------------------------
// TAB 6: SALES HISTORY (Filterable + Reprint Receipt)
// ---------------------------------------------------------
function updateHistoryResults() {
  const resultsEl = document.getElementById('history-results');
  const summaryEl = document.getElementById('history-summary');
  if (!resultsEl) return;

  const itemsBySale = new Map();
  state.saleItems.forEach((it) => {
    if (!itemsBySale.has(it.sale_id)) itemsBySale.set(it.sale_id, []);
    itemsBySale.get(it.sale_id).push(it);
  });

  const nowMs = Date.now();
  const q = state.historySearch.trim().toLowerCase();

  const filtered = state.sales.filter((s) => {
    if (state.historyPeriod !== 'all') {
      const days = state.historyPeriod === 'today' ? 1 : Number(state.historyPeriod);
      const created = new Date(s.created_at).getTime();
      if ((nowMs - created) / 86400000 > days) return false;
    }
    if (!q) return true;
    const sItems = itemsBySale.get(s.id) || [];
    return (
      String(s.sold_by_email || '').toLowerCase().includes(q) ||
      sItems.some((it) => String(it.medication_name || '').toLowerCase().includes(q))
    );
  });

  if (summaryEl) {
    const rev = filtered.reduce((sum, s) => sum + Number(s.total || 0), 0);
    summaryEl.textContent = `${filtered.length} sale(s) · Revenue: ${money(rev)}`;
  }

  if (filtered.length === 0) {
    resultsEl.innerHTML = `<p class="text-sm text-ink/75 py-8 text-center card-surface bg-white rounded-2xl border border-black/10">No sales found in this period.</p>`;
    return;
  }

  resultsEl.innerHTML = filtered
    .map((s) => {
      const sItems = itemsBySale.get(s.id) || [];
      return `
        <article class="card-surface bg-white border border-black/10 rounded-2xl p-4 space-y-2">
          <div class="flex flex-wrap justify-between items-start gap-2">
            <div>
              <p class="text-xs font-semibold text-ink/80">${esc(new Date(s.created_at).toLocaleString())}</p>
              <p class="text-xs text-ink/75">Served by ${esc(s.sold_by_email)}</p>
            </div>
            <div class="flex items-center gap-2">
              <p class="font-bold text-base text-tealDark">${esc(money(s.total))}</p>
              <button type="button" class="reprint-btn touch-target px-3.5 py-1.5 rounded-xl border border-black/20 text-xs font-semibold hover:bg-black/5" data-id="${esc(s.id)}">
                Reprint Receipt
              </button>
            </div>
          </div>
          <div class="text-sm space-y-1 border-t border-black/10 pt-2">
            ${sItems
              .map(
                (i) => `
              <div class="flex justify-between gap-2">
                <span>${esc(i.medication_name)} (${esc(i.qty_type)}) × ${i.quantity}</span>
                <span class="font-semibold">${esc(money(i.subtotal))}</span>
              </div>`,
              )
              .join('')}
          </div>
        </article>`;
    })
    .join('');

  resultsEl.querySelectorAll('.reprint-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sale = state.sales.find((s) => s.id === btn.dataset.id);
      if (!sale) return;
      state.lastReceipt = { sale, items: itemsBySale.get(sale.id) || [] };
      state.viewingReceipt = true;
      refreshTabBar();
      renderReceiptView();
    });
  });
}

function renderHistoryTab() {
  const panel = document.getElementById('tab-panel');
  panel.innerHTML = `
    <section class="space-y-4" aria-labelledby="hist-heading">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 id="hist-heading" class="font-display text-xl font-bold text-tealDark">Sales History</h2>
        <span id="history-summary" class="text-xs font-bold px-3 py-1 rounded-full bg-mint text-tealDark"></span>
      </div>
      <div class="card-surface bg-white border border-black/10 rounded-2xl p-4 grid sm:grid-cols-3 gap-3">
        <div class="sm:col-span-2">
          <label for="history-search" class="block text-xs font-semibold mb-1">Search by medicine or staff email</label>
          <input id="history-search" type="search" value="${esc(state.historySearch)}" placeholder="Search sales…"
            class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
        </div>
        <div>
          <label for="history-period" class="block text-xs font-semibold mb-1">Timeframe</label>
          <select id="history-period" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white">
            <option value="today" ${state.historyPeriod === 'today' ? 'selected' : ''}>Last 24 Hours</option>
            <option value="7" ${state.historyPeriod === '7' ? 'selected' : ''}>Last 7 Days</option>
            <option value="30" ${state.historyPeriod === '30' ? 'selected' : ''}>Last 30 Days</option>
            <option value="all" ${state.historyPeriod === 'all' ? 'selected' : ''}>All Recorded</option>
          </select>
        </div>
      </div>
      <div id="history-results" class="space-y-3"></div>
    </section>
  `;

  document.getElementById('history-search').addEventListener('input', (e) => {
    state.historySearch = e.target.value;
    updateHistoryResults();
  });
  document.getElementById('history-period').addEventListener('change', (e) => {
    state.historyPeriod = e.target.value;
    updateHistoryResults();
  });

  updateHistoryResults();
}

// ---------------------------------------------------------
// TAB 7: PRICE LIST ADMIN (Owner Only — Searchable + Cleanups)
// ---------------------------------------------------------
function updateAdminResults() {
  const resultsEl = document.getElementById('admin-results');
  if (!resultsEl) return;

  const q = state.adminSearch.trim();
  const list = state.medications.filter((m) => {
    const meta = inferGenericAndCompany(m);
    if (state.adminCategory !== 'All' && m.category !== state.adminCategory) return false;
    if (state.adminCompany !== 'All' && meta.company !== state.adminCompany) return false;
    if (state.adminMissingOnly && getAllAvailablePrices(m).length > 0) return false;
    if (q && fuzzyScore(q, m) < 55) return false;
    return true;
  });

  resultsEl.innerHTML =
    list
      .map((m) => {
        const meta = inferGenericAndCompany(m);
        const buyCost = m.last_buy_unit_price;
        const anyBelow = buyCost != null && getAllAvailablePrices(m).some((p) => isBelowCost(p.unitPrice, buyCost));
        return `
          <article class="card-surface bg-white border border-black/10 rounded-2xl p-4 space-y-3" data-row="${esc(m.id)}">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 class="font-semibold text-base">${esc(m.name)}</h3>
                ${
                  buyCost != null
                    ? `<p class="text-xs font-medium ${anyBelow ? 'text-red-800 font-bold' : 'text-tealDark'}">
                        Last Buy Cost: ${esc(money(buyCost))} ${anyBelow ? '— ⚠ A selling price below is at/below cost!' : ''}
                      </p>`
                    : `<p class="text-xs text-ink/70">No Purchase Book cost recorded yet</p>`
                }
              </div>
              <div class="flex flex-wrap gap-2">
                <button type="button" class="ai-cat-row-btn touch-target inline-flex items-center gap-1.5 border border-teal/40 bg-mint/50 hover:bg-mint text-tealDark text-xs font-semibold rounded-xl px-3 py-2" data-id="${esc(m.id)}">
                  ${ICONS.ai}<span>AI Category</span>
                </button>
                <button type="button" class="save-med-btn touch-target bg-teal hover:bg-tealDark text-white text-sm font-semibold rounded-xl px-4 py-2" data-id="${esc(m.id)}">
                  Save Row
                </button>
              </div>
            </div>

            <div class="grid sm:grid-cols-5 gap-2">
              <div>
                <label class="block text-xs font-semibold mb-1">Category</label>
                <input list="admin-cat-list" class="meta-input touch-target w-full border border-black/20 rounded-xl px-2.5 py-1.5 text-sm bg-white" data-field="category" value="${esc(m.category || 'Other')}" />
              </div>
              <div>
                <label class="block text-xs font-semibold mb-1">Company</label>
                <input class="meta-input touch-target w-full border border-black/20 rounded-xl px-2.5 py-1.5 text-sm bg-white" data-field="company" placeholder="e.g. Berlin" value="${esc(m.company || meta.company || '')}" />
              </div>
              <div>
                <label class="block text-xs font-semibold mb-1">Generic</label>
                <input class="meta-input touch-target w-full border border-black/20 rounded-xl px-2.5 py-1.5 text-sm bg-white" data-field="generic_name" placeholder="e.g. Amlodipine" value="${esc(m.generic_name || meta.generic || '')}" />
              </div>
              <div>
                <label class="block text-xs font-semibold mb-1">Stock Qty</label>
                <input type="number" min="0" class="int-input touch-target w-full border border-black/20 rounded-xl px-2.5 py-1.5 text-sm bg-white" data-field="stock_qty" placeholder="Untracked" value="${m.stock_qty ?? ''}" />
              </div>
              <div>
                <label class="block text-xs font-semibold mb-1">Reorder Below</label>
                <input type="number" min="0" class="int-input touch-target w-full border border-black/20 rounded-xl px-2.5 py-1.5 text-sm bg-white" data-field="reorder_level" value="${m.reorder_level ?? 5}" />
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-6 gap-2">
              ${UNIT_TYPES.map(
                (u) => `
                <div>
                  <label class="block text-xs font-semibold mb-1">${u.charAt(0).toUpperCase() + u.slice(1)}</label>
                  <input type="number" step="0.01" min="0" class="price-input touch-target w-full border border-black/20 rounded-xl px-2.5 py-1.5 text-sm bg-white"
                    data-field="price_${u}" placeholder="₦" value="${m['price_' + u] ?? ''}" />
                </div>`,
              ).join('')}
            </div>
          </article>`;
      })
      .join('') || `<p class="text-sm text-ink/75 py-6 text-center">No medications match those filters.</p>`;

  resultsEl.querySelectorAll('.ai-cat-row-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const med = state.medications.find((x) => x.id === id);
      if (!med) return;
      const origHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `${ICONS.ai}<span>Detecting…</span>`;
      try {
        const res = await autoCategorizeMedication({
          supabase,
          name: med.name,
          existingCategories: getCanonicalCategoryList(state.medications),
        });
        const row = resultsEl.querySelector(`[data-row="${id}"]`);
        if (!row) return;
        const catInp = row.querySelector('[data-field="category"]');
        const compInp = row.querySelector('[data-field="company"]');
        const genInp = row.querySelector('[data-field="generic_name"]');
        if (catInp && res.category) catInp.value = res.category;
        if (compInp && !compInp.value.trim() && res.company) compInp.value = res.company;
        if (genInp && !genInp.value.trim() && res.generic_name) genInp.value = res.generic_name;
        const via = res.mode === 'gemini' ? 'Gemini AI' : 'Smart Classifier';
        showToast(
          `${med.name}: ${via} suggested "${res.category}" (${res.reason}). Click Save Row to apply.`,
          res.category !== 'Other' ? 'success' : 'info',
        );
      } finally {
        if (document.body.contains(btn)) {
          btn.disabled = false;
          btn.innerHTML = origHtml;
        }
      }
    });
  });

  resultsEl.querySelectorAll('.save-med-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const row = resultsEl.querySelector(`[data-row="${id}"]`);
      const med = state.medications.find((x) => x.id === id);
      const update = {};

      row.querySelectorAll('.meta-input').forEach((inp) => {
        const val = inp.value.trim();
        update[inp.dataset.field] = inp.dataset.field === 'category' ? val || 'Other' : val || null;
      });
      row.querySelectorAll('.int-input').forEach((inp) => {
        if (inp.dataset.field === 'reorder_level') {
          update.reorder_level = inp.value === '' ? 5 : Math.max(0, Math.round(Number(inp.value)));
        } else {
          update.stock_qty = inp.value === '' ? null : Math.max(0, Math.round(Number(inp.value)));
        }
      });
      row.querySelectorAll('.price-input').forEach((inp) => {
        update[inp.dataset.field] = inp.value === '' ? null : Number(inp.value);
      });

      const buyCost = med?.last_buy_unit_price;
      const badSell =
        buyCost != null &&
        UNIT_TYPES.some((u) => update['price_' + u] !== null && isBelowCost(update['price_' + u], buyCost));

      if (badSell) {
        const proceed = await confirmModal({
          title: 'Price Below Purchase Cost',
          message: `One of the prices you entered is AT OR BELOW the Purchase Book buy cost (${money(buyCost)}). Save anyway?`,
          confirmLabel: 'Save Anyway',
          danger: true,
          triggerEl: btn,
        });
        if (!proceed) return;
      }

      const { error } = await supabase.from('medications').update(update).eq('id', id);
      if (error) showToast('Could not save row: ' + error.message, 'error');
      else {
        await loadMedications();
        updateAdminResults();
        showToast(`Updated ${med?.name || 'medication'}!`, 'success');
      }
    });
  });
}

async function runAdminCleanup(triggerEl) {
  const categoryMap = {
    other: 'Other',
    bp: 'Blood Pressure (BP)',
    typhoid: 'Typhoid / Antibiotic',
    skin: 'Skin / Topical',
    infection: 'Antibiotic',
  };
  const existingTrimmed = new Set(state.medications.map((m) => m.name.trim().toLowerCase()));
  const updates = [];

  for (const m of state.medications) {
    const patch = {};
    const lowCat = String(m.category || '').trim().toLowerCase();
    if (categoryMap[lowCat] && m.category !== categoryMap[lowCat]) {
      patch.category = categoryMap[lowCat];
    }
    const trimmedName = m.name.trim();
    if (trimmedName !== m.name) {
      const collides = state.medications.some((other) => other.id !== m.id && other.name.trim().toLowerCase() === trimmedName.toLowerCase());
      if (!collides && existingTrimmed.has(trimmedName.toLowerCase())) {
        patch.name = trimmedName;
      }
    }
    if (Object.keys(patch).length > 0) updates.push({ id: m.id, patch });
  }

  if (updates.length === 0) {
    showToast('Categories and names already look clean!', 'info');
    return;
  }

  const ok = await confirmModal({
    title: 'Clean Up Categories & Spaces?',
    message: `Normalize ${updates.length} item(s) (e.g. "other" → "Other", "bp" → "Blood Pressure (BP)", trim leading/trailing spaces)? Prices stay 100% untouched.`,
    confirmLabel: `Clean ${updates.length} Items`,
    triggerEl,
  });
  if (!ok) return;

  for (const u of updates) {
    await supabase.from('medications').update(u.patch).eq('id', u.id);
  }
  await loadMedications();
  renderAdminTab();
  showToast(`Cleaned up ${updates.length} medication records!`, 'success');
}

async function openBatchCategorizeModal(triggerEl) {
  const otherMeds = state.medications.filter(
    (m) => String(m.category || '').trim().toLowerCase() === 'other',
  );
  if (otherMeds.length === 0) {
    showToast('No medications currently labeled "Other"!', 'info');
    return;
  }

  const canonicalCategories = getCanonicalCategoryList(state.medications);
  openModal({
    title: `AI Auto-Categorize "Other" (${otherMeds.length})`,
    triggerEl,
    bodyHtml: `
      <div class="flex items-center gap-3 py-4 text-sm font-semibold text-tealDark" role="status">
        <div class="typing-dots flex gap-1"><span></span><span></span><span></span></div>
        <span>Analyzing ${otherMeds.length} medication(s) with Gemini AI &amp; Nigerian pharmacy knowledge…</span>
      </div>
    `,
  });

  const batch = await batchAutoCategorizeMedications({
    supabase,
    items: otherMeds,
    existingCategories: canonicalCategories,
  });

  const body = document.getElementById('modal-body');
  if (!body) return;

  const medById = new Map(otherMeds.map((m) => [String(m.id), m]));

  body.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-xs font-bold px-2.5 py-1 rounded-full ${
          batch.mode === 'gemini' ? 'bg-indigo-100 text-indigo-900' : 'bg-mint text-tealDark'
        }">
          ${batch.mode === 'gemini' ? `Gemini Cloud AI${batch.model ? ` · ${esc(batch.model)}` : ''}` : 'Built-in Smart Classifier'}
        </span>
        <span class="text-xs text-ink/75">Review or adjust before applying. Prices stay 100% untouched.</span>
      </div>
      <div class="flex gap-1.5">
        <button type="button" id="batch-select-all" class="touch-target px-3 py-1 rounded-lg border border-black/15 text-xs font-semibold hover:bg-black/5">Select All</button>
        <button type="button" id="batch-clear-all" class="touch-target px-3 py-1 rounded-lg border border-black/15 text-xs font-semibold hover:bg-black/5">Clear</button>
      </div>
    </div>
    ${batch.statusNote ? `<p class="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">${esc(batch.statusNote)}</p>` : ''}

    <div class="space-y-2.5 max-h-[52vh] overflow-y-auto pr-1">
      ${batch.results
        .map((r) => {
          const orig = medById.get(String(r.id));
          const checked = r.category && r.category !== 'Other';
          const addGen = !orig?.generic_name && r.generic_name;
          const addComp = !orig?.company && r.company;
          return `
            <div class="batch-row rounded-xl border border-black/10 p-3 bg-porcelain/40 space-y-2" data-id="${esc(r.id)}">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <label class="inline-flex items-center gap-2 font-semibold text-sm cursor-pointer">
                  <input type="checkbox" class="batch-cb w-4 h-4 accent-teal" ${checked ? 'checked' : ''} />
                  <span>${esc(r.name)}</span>
                </label>
                <div class="flex items-center gap-1.5 text-xs">
                  <span class="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">Other</span>
                  <span aria-hidden="true">→</span>
                  <input type="text" list="admin-cat-list" value="${esc(r.category)}"
                    data-gen="${esc(addGen ? r.generic_name : '')}"
                    data-comp="${esc(addComp ? r.company : '')}"
                    class="batch-cat-inp touch-target border border-teal/40 rounded-lg px-2.5 py-1 text-xs font-semibold bg-white w-48"
                    aria-label="Suggested category for ${esc(r.name)}" />
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2 text-xs text-ink/75 pl-6">
                ${addGen ? `<span class="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-900 font-semibold">+ Generic: ${esc(r.generic_name)}</span>` : ''}
                ${addComp ? `<span class="px-2 py-0.5 rounded-full bg-mint text-tealDark font-semibold">+ Company: ${esc(r.company)}</span>` : ''}
                <span>${esc(r.reason)}</span>
              </div>
            </div>`;
        })
        .join('')}
    </div>

    <div class="flex flex-wrap justify-end gap-2 pt-2 border-t border-black/10">
      <button type="button" id="batch-cancel-btn" class="touch-target px-4 py-2 rounded-xl border border-black/20 text-sm font-medium hover:bg-black/5">Cancel</button>
      <button type="button" id="batch-apply-btn" class="touch-target px-4 py-2 rounded-xl bg-gradient-to-r from-teal to-tealDark text-white text-sm font-semibold shadow-sm">
        Apply Selected
      </button>
    </div>
  `;

  const applyBtn = body.querySelector('#batch-apply-btn');
  const syncCount = () => {
    const count = body.querySelectorAll('.batch-cb:checked').length;
    applyBtn.textContent = `Apply Selected (${count})`;
    applyBtn.disabled = count === 0;
  };
  syncCount();

  body.querySelectorAll('.batch-cb').forEach((cb) => cb.addEventListener('change', syncCount));
  body.querySelector('#batch-select-all').addEventListener('click', () => {
    body.querySelectorAll('.batch-cb').forEach((cb) => {
      cb.checked = true;
    });
    syncCount();
  });
  body.querySelector('#batch-clear-all').addEventListener('click', () => {
    body.querySelectorAll('.batch-cb').forEach((cb) => {
      cb.checked = false;
    });
    syncCount();
  });
  body.querySelector('#batch-cancel-btn').addEventListener('click', closeModal);

  applyBtn.addEventListener('click', async () => {
    const selectedRows = [...body.querySelectorAll('.batch-row')].filter(
      (row) => row.querySelector('.batch-cb')?.checked,
    );
    if (selectedRows.length === 0) return;

    applyBtn.disabled = true;
    applyBtn.textContent = `Applying ${selectedRows.length}…`;

    let updated = 0;
    let failed = 0;

    for (const row of selectedRows) {
      const id = row.dataset.id;
      const orig = medById.get(id);
      const catInp = row.querySelector('.batch-cat-inp');
      const newCat = catInp?.value.trim() || 'Other';
      const addGen = catInp?.dataset.gen || '';
      const addComp = catInp?.dataset.comp || '';

      const patch = {};
      if (newCat && newCat !== orig?.category) patch.category = newCat;
      if (addGen && !orig?.generic_name) patch.generic_name = addGen;
      if (addComp && !orig?.company) patch.company = addComp;

      if (Object.keys(patch).length === 0) continue;

      const { error } = await supabase.from('medications').update(patch).eq('id', id);
      if (error) failed += 1;
      else updated += 1;
    }

    await loadMedications();
    closeModal();
    refreshTabBar();
    renderAdminTab();

    if (failed > 0) {
      showToast(`Updated ${updated} item(s), ${failed} could not be saved.`, 'warn');
    } else {
      showToast(`Updated ${updated} medication record(s)!`, 'success');
    }
  });
}

function renderAdminTab() {
  if (!isOwner()) return switchTab('sell');
  const panel = document.getElementById('tab-panel');
  const categories = ['All', ...new Set(state.medications.map((m) => m.category)).values()];
  const canonicalCategories = getCanonicalCategoryList(state.medications);
  const companies = getAllCompaniesList();
  const otherCount = state.medications.filter(
    (m) => String(m.category || '').trim().toLowerCase() === 'other',
  ).length;

  panel.innerHTML = `
    <section class="space-y-4" aria-labelledby="admin-heading">
      <datalist id="admin-cat-list">${canonicalCategories.map((c) => `<option value="${esc(c)}">`).join('')}</datalist>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="admin-heading" class="font-display text-xl font-bold text-tealDark">Full Price List (Owner Admin)</h2>
          <p class="text-xs text-ink/80">Edit retail prices, brands/companies, generic names, and stock counts directly.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button type="button" id="admin-ai-other-btn" ${otherCount === 0 ? 'disabled' : ''}
            class="touch-target inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal to-tealDark text-white text-xs font-semibold shadow-sm hover:opacity-95 disabled:opacity-50">
            ${ICONS.ai}<span>AI Categorize &ldquo;Other&rdquo; (${otherCount})</span>
          </button>
          <button type="button" id="admin-cleanup-btn" class="touch-target px-4 py-2 rounded-xl border border-teal text-tealDark bg-white text-xs font-semibold hover:bg-mint/40">
            Clean Up Categories &amp; Spaces
          </button>
        </div>
      </div>

      <div class="card-surface bg-white border border-black/10 rounded-2xl p-4 grid sm:grid-cols-12 gap-3 items-end">
        <div class="sm:col-span-4">
          <label for="admin-search" class="block text-xs font-semibold mb-1">Search admin list</label>
          <input id="admin-search" type="search" value="${esc(state.adminSearch)}" placeholder="Search medicine or company…"
            class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white" />
        </div>
        <div class="sm:col-span-3">
          <label for="admin-cat" class="block text-xs font-semibold mb-1">Category</label>
          <select id="admin-cat" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white">
            ${categories.map((c) => `<option value="${esc(c)}" ${c === state.adminCategory ? 'selected' : ''}>${esc(c)}</option>`).join('')}
          </select>
        </div>
        <div class="sm:col-span-3">
          <label for="admin-comp" class="block text-xs font-semibold mb-1">Company</label>
          <select id="admin-comp" class="touch-target w-full border border-black/20 rounded-xl px-3 py-2 bg-white">
            ${companies.map((c) => `<option value="${esc(c)}" ${c === state.adminCompany ? 'selected' : ''}>${esc(c)}</option>`).join('')}
          </select>
        </div>
        <label class="sm:col-span-2 touch-target inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
          <input id="admin-missing" type="checkbox" ${state.adminMissingOnly ? 'checked' : ''} class="w-4 h-4 accent-teal" />
          Missing price
        </label>
      </div>

      <div id="admin-results" class="space-y-3 max-h-[70vh] overflow-y-auto pr-1"></div>
    </section>
  `;

  document.getElementById('admin-search').addEventListener('input', (e) => {
    state.adminSearch = e.target.value;
    updateAdminResults();
  });
  document.getElementById('admin-cat').addEventListener('change', (e) => {
    state.adminCategory = e.target.value;
    updateAdminResults();
  });
  document.getElementById('admin-comp').addEventListener('change', (e) => {
    state.adminCompany = e.target.value;
    updateAdminResults();
  });
  document.getElementById('admin-missing').addEventListener('change', (e) => {
    state.adminMissingOnly = e.target.checked;
    updateAdminResults();
  });
  document.getElementById('admin-ai-other-btn').addEventListener('click', (e) => openBatchCategorizeModal(e.currentTarget));
  document.getElementById('admin-cleanup-btn').addEventListener('click', (e) => runAdminCleanup(e.currentTarget));

  updateAdminResults();
}

// ---------------------------------------------------------
// Router & Auth State Binding
// ---------------------------------------------------------
function renderActiveTabPanel() {
  if (state.viewingReceipt) return renderReceiptView();
  if (state.tab === 'sell') return renderSellTab();
  if (state.tab === 'purchase') return renderPurchaseBookTab();
  if (state.tab === 'restock') return renderRestockTab();
  if (state.tab === 'ai') return renderAssistantTab();
  if (state.tab === 'suggestions') return renderSuggestionsTab();
  if (state.tab === 'history') return renderHistoryTab();
  if (state.tab === 'admin') return renderAdminTab();
  state.tab = 'sell';
  return renderSellTab();
}

function render() {
  if (!state.session) return renderAuth();
  mountShell();
  renderActiveTabPanel();
}

supabase.auth.onAuthStateChange(async (_event, session) => {
  state.session = session;
  if (session) {
    await loadProfile();
    await loadAllData();
  }
  render();
});

render();
