# Obolus (Pipedream Integration)

Obolus is a cross-country tax and net income calculation API.

This initial integration includes two actions:

- `Compare Salary Across Countries`
- `Calculate Net Salary`

Supported countries: `DE`, `AT`, `US`, `CH`, `CA`, `AU`, `UK`, `IE`

## Inputs

- common fields are available directly in the action UI
- advanced fields are grouped behind `Show Advanced Inputs`
- JSON override fields remain available for edge cases and forward compatibility
- `/berechne` supports one-person and two-person scenarios

Direct fields cover common use cases. JSON overrides exist for forward compatibility and niche cases.

For country-specific input and output parameter details, the Obolus `/developers` page can serve as the knowledge base:

https://www.obolusfinanz.de/en/developers

## Outputs

Both actions return the full Obolus API response object, so downstream Pipedream workflow steps can bind directly to nested fields.

Typical `/berechne` output fields:

- `person1`
- `person2`
- `gesamt`
- `faktor`
- `source_url`
- `visual_report`
- `localized_cta`

Typical `/taxcompare` output fields:

- `results`
- `comparison_basis`
- `gross_inputs`

## Links

Website:
https://www.obolusfinanz.de/en

Developer documentation:
https://www.obolusfinanz.de/en/developers

OpenAPI contract:
https://www.obolusfinanz.de/api/openapi

This initial integration targets the currently published public API surface.
