# Obolus (Pipedream Integration)

Obolus is a cross-country tax and net income calculation API.

This integration provides two main actions:

## Actions

### Compare Salary Across Countries
Compare how much income remains after taxes across multiple countries using the same gross salary.
Supported Tax Systems at the moment are: DE, AT, CH, US, CA, AU, UK, IE

### Calculate Net Salary
Calculate net income, taxes, and social contributions for a payroll case.

The current Pipedream implementation supports:

- simple salary calculations for one person
- optional second-person calculations for joint scenarios
- advanced OpenAPI-compatible request customization through JSON override fields
- full passthrough of the Obolus API response for downstream workflow steps

## Example Use Cases

- Evaluate international job offers
- Compare purchasing power across countries
- Simulate payroll scenarios
- Build relocation decision workflows

## API

Base endpoints:

https://www.obolusfinanz.de/api/taxcompare  
https://www.obolusfinanz.de/api/berechne  

Authentication:

This initial integration targets the currently published public API surface.

## Links

Website:
https://www.obolusfinanz.de/en

Developer documentation:
https://www.obolusfinanz.de/en/developers

OpenAPI contract:
https://www.obolusfinanz.de/api/openapi

As the Obolus `/developers` page expands, it can also serve as the knowledge base for country-specific input and output parameter descriptions.

## Pipedream Usage Notes

Pipedream action inputs are defined via component `props`. These props are bindable in workflows by default, so future users can:

- type static values directly in the UI
- map values from previous workflow steps
- mix simple fields with advanced JSON override objects

The action result is returned as structured JSON. In Pipedream, that returned object becomes the step output and can be referenced by later steps. No extra output binding declaration is required for the response to be usable in workflows.

This component follows the common pattern used by many other Pipedream actions:

- define configurable inputs in `props`
- export a short `$summary`
- `return` the full API response object

## Current Input Model

For `/berechne`, the component intentionally offers:

- a simple first-person form for the most common payroll case
- optional second-person fields for joint calculations
- JSON override fields for the broader OpenAPI surface

This keeps the default UX compact while still allowing advanced users to reach country-specific fields such as:

- `Kirche`
- `KVZ`
- `Bundesland`
- `Sonstige_Bezuege`
- `Geldwerter_Vorteil`
- `Lohnzahlungszeitraum`
- and other request fields from the live OpenAPI contract

Advanced inputs are now split behind a `Show Advanced Inputs` toggle so the default action stays slim for common payroll scenarios.

For `/taxcompare`, the component supports:

- `shared_gross`
- `local_median_gross`
- `joint_assessment`
- `children`
- optional JSON overrides for forward compatibility

## JSON Override Examples

### `/berechne` top-level override

Use `Top-Level JSON Overrides` for fields such as `KinderFRB` or `Kindergeld`:

```json
{
  "KinderFRB": 1,
  "KinderPVA": 1
}
```

### `/berechne` person override

Use `Person 1 JSON Overrides` or `Person 2 JSON Overrides` for advanced person-specific fields:

```json
{
  "Kirche": 1,
  "KVZ": 2.9,
  "Bundesland": "BY",
  "Lohnzahlungszeitraum": 1,
  "Sonstige_Bezuege": 250000
}
```

Notes:

- amounts for `/berechne` advanced OpenAPI fields are generally expected in minor units, for example cent
- `Top-Level JSON Overrides` must not include `Personen`
- if a second person is enabled, required second-person fields can be provided either directly or through `Person 2 JSON Overrides`

### `/taxcompare` override

```json
{
  "children": 2,
  "joint_assessment": true
}
```

## Workflow Output Shape

The `/berechne` action returns the Obolus response object, typically including:

- `person1`
- `person2`
- `gesamt`
- `faktor`
- `source_url`
- `visual_report`
- `localized_cta`

The `/taxcompare` action returns the Obolus response object, typically including:

- `results`
- `comparison_basis`
- `gross_inputs`

Because the full response is returned, later Pipedream steps can bind directly to nested fields from the Obolus result.

## Recommended Next Step

If the `/developers` knowledge base grows into a stable country-by-country field catalog, the next natural enhancement would be to expand the curated advanced fields per country and reduce how often users need JSON overrides for niche cases.
