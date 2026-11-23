# Shelf Price — Pharmacy Price List & Counter Assistant

A fast, accessible web app for pharmacy counter staff and owners — search shelf prices, log Uncle's bulk purchases without flipping physical ledger pages, calculate safe cost-plus selling prices, track restock & slow-movers, compare companies carrying the same active drug, and query an AI counter assistant.

## Key Features
- **WCAG Accessibility Built-In:** Proper form labels, keyboard tab navigation (`ArrowLeft`/`ArrowRight`), focus-preserving live search, `>=44px` counter buttons, `Text Size (A / A+ / A++)`, `High Contrast`, `Easy-Read` spacing, optional **Voice Search** & **Read Aloud**, and a privacy toggle (`Show/Hide Buy Cost`, `Alt+C`).
- **Counter Price Lookup (`Sell`):** Typo-tolerant & symptom-aware search (e.g. `ciprofloxacin` → `ciproflaxacin`, `bp` → `amlodipine`, `malaria` → `Amatem`), unit price buttons (`Packet`, `Box`, `Card`, `Bottle`, `Tube`, `Counting`), **Compare Brands** side-by-side modal, **Drug Info & Safety** modal (age groups, allergies & contraindications), below-cost price warnings, and printable receipts.
- **Digital Purchase Book (`Purchase Book`):** Log bulk buys (`1 roll`, `5 tins`, etc.) with automatic single-unit buy cost calculation, price trend badges (`↑`/`↓` vs prior buy), expiry warnings, automatic shelf stock increments, and instant `+15% / +20% / +25% / +30%` retail price markup suggestions.
- **Restock & Slow-Mover Planner (`Restock`):** Spot out-of-stock / low-stock items before wholesale runs, identify fast movers vs slow movers (avoid overbuying), view **Companies on Shelf** grouped by manufacturer, adjust shelf counts inline, copy a WhatsApp-ready restock list, or print a Restock Sheet.
- **Hybrid AI Assistant (`AI Assistant`):** Built-in offline-ready smart pharmacy engine works immediately with zero API keys (multi-item basket quotes with 1-tap add to cart, purchase cost markup math, brand comparisons, age/allergy safety cards, and restock summaries), backed by the `pharmacy-ai` Supabase Edge Function for optional Gemini Cloud AI.
- **Suggestions, Sales History & Owner Admin:** Staff can propose prices/new medicines (with below-cost alerts) for Owner approval, reprint past receipts, and Owners can edit prices, companies, generic names, and stock counts directly.

## Optional: Upgrade AI Assistant to Gemini Cloud AI
The built-in Smart AI works out of the box with no keys. To also enable Gemini 2.5 Flash via the `pharmacy-ai` Edge Function:
1. Create a free API key in Google AI Studio.
2. In **Supabase Dashboard → Edge Functions → `pharmacy-ai` → Secrets**, add `GEMINI_API_KEY`.
