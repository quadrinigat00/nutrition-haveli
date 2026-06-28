# TODO (IndexedDB Inventory Re-Architecture)

- [ ] Step 1: Replace Dynamic Inventory CRUD in `owner.html` with unified IndexedDB (`NutritionHaveliDB`, store `products`, keyPath `id`).
- [ ] Step 2: Update Add/Edit modals in `owner.html` form fields to: 3-tier prices, benefits 1-3, description, multi-image (up to 6) + single video.
- [ ] Step 3: Implement live thumbnail/video label preview in `owner.html` modals.
- [ ] Step 4: Update Inventory dashboard rendering in `owner.html` to fetch from IndexedDB, group/sort by category, and render section heading banners with wired Edit/Delete.
- [ ] Step 5: Rewrite storefront product rendering in `js/main.js` to fetch from IndexedDB asynchronously and render into existing category grids.
- [ ] Step 6: Update View Details modal in `js/main.js` to add image carousel + optional video slide.
- [ ] Step 7: Update View Details bindings in `js/main.js` to use `mrpPrice`, `marketPrice`, `ourPrice`, `description`, `benefit1-3`.
- [ ] Step 8: Ensure storefront cart/checkout uses `ourPrice` for totals (leave cart/wishlist/order system structure untouched).
- [ ] Step 9: Run quick sanity check: inventory create/edit/delete persist; storefront renders; view modal carousel works; cart totals correct.

