#  Local Tests Directory

This folder contains **non-production test scripts** used for developing and validating Pipedream components locally.  
**You can safely delete the entire folder** — it does not affect runtime or deployment.

---

##  Folder Structure

### `action-tests/`
Component-level test runners that simulate a real Pipedream `$` context using `mockery-dollar.mjs`.

- `test-retrieve-site-performance-data.mjs` – Tests the Search Analytics action
- `test-submit-url-for-indexing.mjs` – Tests the Indexing API action

---

### `methods/`
Unit tests for reusable validation and utility methods found in `.app.mjs`.

- `test-checkIfUrlValid.mjs` – Tests URL validation helper
- `test-throwIfNotYMDDashDate.mjs` – Tests strict date validation

#### `bogus-data/`
Mocked data used to simulate edge-case user inputs and trigger validations:
- `bogus-data-url.mjs` – Invalid or suspicious URLs
- `bogus-data-google-date.mjs` – Date values to test against expected format

---

### Root-level Utilities

- `mockery-dollar.mjs` – Mocks the `$` object Pipedream injects into actions
- `get-token.mjs` – Script for manually supplying a Google OAuth token during local testing

---

## ⚠️ Notes

- Some files may contain **hardcoded tokens** — be sure to exclude them from commits.
- All files here are meant for **local testing only**.
- Delete this folder any time before publishing — it's safe and has no impact on your app.

---