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

### Germany payroll defaults

For standard German employees, the `Calculate Net Salary` action uses semantic adapter fields:

- `de_payroll_preset: "DE_STANDARD_EMPLOYEE_STATUTORY"`
- `de_statutory_pension_and_unemployment: true`
- `de_statutory_health_and_care: true`
- `de_health_extra_contribution_percent: 2.5`

The extra health contribution is a literal percent value. Use `2.5` for 2.5%, not `25`, `250`, basis points, tenths, or cents.

The German payroll preset is the safest translation layer for automations:

- `DE_STANDARD_EMPLOYEE_STATUTORY`: normal employee, statutory pension/unemployment and statutory GKV/PV.
- `DE_PRIVATE_HEALTH_INSURANCE`: employee with statutory pension/unemployment and private health insurance.
- `DE_PENSION_EXEMPT`: civil servant, self-employed, or otherwise pension-exempt with statutory GKV/PV.
- `DE_PENSION_EXEMPT_PRIVATE_HEALTH`: pension-exempt with private health insurance.

The action UI does not expose raw German Obolus payroll flags. JSON overrides can still carry legacy fields for compatibility, but contradictions are rejected before the API call. If private health insurance is selected, provide `de_private_health_employee_contribution_ct` in minor units for the selected payroll period.

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
