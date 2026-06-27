# TODO_OWNER_ENGINE

- [x] Update `owner.html`:
  - [x] Revert Home view typography: remove heavy font weights for “Nutrition Haveli” + subtitle; restore original hero scale/padding.
  - [x] Order card UI fixes (Live/Pending/Paid):
    - [x] Ensure trash button (🗑️) is completely OUTSIDE the price strip (sibling element) and positioned bottom-right of card.
    - [x] Change purple strip label from “Order Total” to “Grand Total”.
    - [x] Restore missing “Items:” metadata label before items list.
    - [x] Remove redundant inline “Live” badge chip next to timestamp.
  - [x] Repair regex parsing engine math for totals:
    - [x] Replace brittle comma-splitting logic with robust global capture of all `Qty:` and all `₹` values and pair-wise summation.
  - [x] Keep tab switching click navigation fully workable.
- [ ] Quick manual test checklist:
  - [ ] Switch Home/Orders/Pending/Paid tabs without UI break.
  - [ ] Trash button appears bottom-right and stays outside price strip.
  - [ ] “Grand Total” label shows correctly.
  - [ ] “Items:” label renders.
  - [ ] Totals computed correctly for stored test orders.


