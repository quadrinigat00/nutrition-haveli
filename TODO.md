# TODO - Order Sync Fix (localStorage origin mismatch)

## Gathered
- `index.html` is served via Live Server (http://127.0.0.1:5500)
- `owner.html` is opened as a local file (file:///C:/...)
- `localStorage` is origin-scoped, so keys written by `index.html` aren’t readable by `owner.html`

## Plan
1. Update `owner.html` script to support cross-origin order syncing by trying multiple storage sources.
2. Primary option: require `owner.html` to be served over HTTP from the same origin as `index.html` (Live Server).
3. Add a robust fallback in `owner.html`:
   - Poll `http://127.0.0.1:5500/js/order-sync-storage.json` (or equivalent endpoint) if available.
   - If not available, show an actionable error message explaining how to run `owner.html` via Live Server.
4. (If you enable backend) Provide an optional backend endpoint in `backend/server.js` to persist orders and push them to owner.

## Follow-up steps
- Run both `index.html` and `owner.html` using Live Server (same port/origin), then refresh.

