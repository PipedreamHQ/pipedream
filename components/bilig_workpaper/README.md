# Overview

Bilig WorkPaper runs spreadsheet-style formulas in backend services and agent
tools. Use this app to edit a WorkPaper input cell, recalculate dependent
formulas, and verify readback without driving Excel, LibreOffice, Google Sheets,
or a browser UI.

# Example Use Cases

- Gate a quote, forecast, payout, or approval workflow on a formula workbook
- Recalculate formula-backed business logic from webhook or CRM data
- Verify computed output before sending a downstream update

# Getting Started

Use the **Verify Formula Readback** action with a Bilig connected account. The
connected account supplies the Bilig Base URL.

Editable cells in the demo forecast:

- `B2`: qualified opportunities
- `B3`: win rate
- `B4`: average ARR
- `B5`: expansion multiplier

The action returns the edited cell, before/after computed values, and checks for
formula persistence, restored-document equality, and changed computed output.

# Troubleshooting

If `verified` is false, inspect the returned `checks` object. A usable run
should report:

- `formulasPersisted: true`
- `restoredMatchesAfter: true`
- `computedOutputChanged: true`

Make sure the connected account's **Bilig Base URL** points at the app origin and
does not include the `/api/workpaper/n8n/forecast` path.
