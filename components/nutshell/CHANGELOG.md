<!-- markdownlint-disable MD024 -->

# Changelog

## [0.2.1] - 2026-04-29

### Fixed

- **Get Contact / MCP (RK-6060):** Formatted contact output was omitting the `email` field because Nutshell's full `getContact` response uses `email` and `phone` (per RPC `Contact` render), while the allowlist only listed `emails` / `phones` / `primaryEmail` / `primaryPhone`. Added `email` and `phone` to the pass-through set so Get Contact and tools that use the same formatter (e.g. Nutshell MCP `get_contact`) return the API's email and phone.
- **Get Company / nested contacts:** The same pass-through for `email` and `phone` on company (account) objects, including nested `contacts` formatted with the contact helper.
- **Output allowlists (MCP / all get and update actions using formatters):** Expanded pass-through fields to match Nutshell RPC `Lead`, `Contact`, and `Account` renders so we do not drop documented fields the way we previously dropped `email`/`phone`. Leads now include `value` (not only `estimatedValue`), `primaryContact` (formatted like contacts), `accounts`, `sources`, `milestone`, `stageset`, and other common top-level keys; contacts and companies include `rev`, `htmlUrl`, `tags`, `notes`, `territory`, and `url` where applicable. `formatPrimaryAccount` (for `primaryAccount` on leads) now includes `email`/`phone`/`url` so account email is not stripped.
- **Custom fields:** `customFields` was already allowlisted; docs in code now state that pipeline custom fields from `findCustomFields` are returned under `customFields` when the API includes them.

### Changed

- Bumped the component `version` on every Nutshell action and source that imports shared code so the Pipedream PR check (shared `common` changes require a registry version bump) is satisfied for all entry points that import the app.

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
