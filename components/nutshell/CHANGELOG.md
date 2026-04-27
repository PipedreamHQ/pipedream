<!-- markdownlint-disable MD024 -->

# Changelog

## [0.2.1] - 2026-04-28

### Fixed

- **Get Contact / MCP (RK-6060):** Formatted contact output was omitting the `email` field because Nutshell’s full `getContact` response uses `email` and `phone` (per RPC `Contact` render), while the allowlist only listed `emails` / `phones` / `primaryEmail` / `primaryPhone`. Added `email` and `phone` to the pass-through set so Get Contact and tools that use the same formatter (e.g. Nutshell MCP `get_contact`) return the API’s email and phone.
- **Get Company / nested contacts:** The same pass-through for `email` and `phone` on company (account) objects, including nested `contacts` formatted with the contact helper.

## [0.1.1] - 2026-02-24

### Added

- update-company action
- update-contact action
- update-lead action
- search-company action
- search-contact action
- search-lead action
- get-company action
- get-contact action
- get-lead action

### Changed

- Improved lead, contact, and company output schemas
- App-level improvements in nutshell.app.mjs
