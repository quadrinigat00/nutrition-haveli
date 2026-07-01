TODO
- Consumer website currently renders products from IndexedDB only.
- Owner sync updates backend products.json and (optionally) owner localStorage mirrors, but consumer does not rehydrate IndexedDB from GET /api/products.
- Implement in nutrition-haveli/js/main.js:
  1) fetch('/api/products')
  2) overwrite NutritionHaveliDB/products store
  3) then call existing renderInventoryProductsToGrid()
- Keep UI/layout/domain logic unchanged; only hydration/network + IDB write logic.

