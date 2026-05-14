# Pipedream Action Component Guidelines

This document covers guidelines specific to action components (`type: "action"`). Read
`pipedream-component-guidelines.md` first for the foundational component model.

---

## Action Structure

An action performs a task synchronously and returns a result. Its entry point is `run()`:

```javascript
export default {
  key: "app-action-name",
  name: "Action Name",
  description: "...",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,          // app connection — always first
    // ... input props
  },
  async run({ $ }) {
    // 1. Parse JSON inputs if needed
    // 2. Call API via app methods
    // 3. Export summary
    // 4. Return result
  },
};
```

---

## The `$summary` Requirement

Every **successful** execution path in `run()` must call:

```javascript
$.export("$summary", "Concise description of what happened");
```

This is the primary feedback mechanism — it appears in the workflow UI step result and
signals to agents that an action completed successfully. Paths that throw an error do not
need a summary (the error message serves that purpose).

### Summary format

Summaries should be one line and include the key result: created record's ID and/or name,
count of records returned, or the action taken.

**Good summaries:**
```javascript
$.export("$summary", `Created contact ${response.id}: ${response.properties.email}`);
$.export("$summary", `Found ${results.length} records matching "${this.query}"`);
$.export("$summary", `Updated deal ${this.dealId} — stage set to "${this.stageName}"`);
$.export("$summary", `Deleted ${this.objectType} ${this.recordId}`);
```

**Poor summaries:**
```javascript
$.export("$summary", "Success");
$.export("$summary", "Action completed");
$.export("$summary", JSON.stringify(response));  // too verbose
```

### Multiple execution paths

When an action has branching logic (e.g., create vs. update depending on whether an ID was
provided), each successful branch must call `$.export("$summary", ...)` with context
appropriate to that branch:

```javascript
if (this.accountId) {
  const result = await this.app.updateAccount({ accountId: this.accountId, data });
  $.export("$summary", `Updated account ${result.id}: ${result.name}`);
  return result;
} else {
  const result = await this.app.createAccount({ data });
  $.export("$summary", `Created account ${result.id}: ${result.name}`);
  return result;
}
```

---

## Prop Order

The app connection prop must always be the first prop. Other props follow in logical order:
general to specific, required before optional.

```javascript
props: {
  app,             // ← always first
  objectType,      // general selector
  recordId,        // depends on objectType context
  properties,      // the main input
  optionalField,   // optional extras
},
```

---

## Static vs. Dynamic Schemas

### `async options` (standard pattern)

When a prop's valid values are dynamic but enumerable, use `async options()`. This is the
standard pattern and works in both the workflow UI and agent contexts:

```javascript
pipeline: {
  type: "string",
  label: "Pipeline",
  description: "The pipeline to assign this deal to.",
  async options() {
    const pipelines = await this.app.getPipelines();
    return pipelines.map((p) => ({ label: p.label, value: p.id }));
  },
},
```

### `reloadProps` and `additionalProps`

These patterns cause prop forms to dynamically reload or generate new fields based on
earlier selections. They are legitimate tools — the review question is whether they are
actually needed.

**When reviewing a PR that adds `reloadProps: true` or `additionalProps()`:**
- Ask whether `async options()` alone could satisfy the use case — for example, by
  returning a context-filtered set of options based on another prop's current value.
  If it can, flag the dynamic pattern and suggest the simpler alternative.
- If the structure of required inputs fundamentally depends on an earlier selection in a
  way that a fixed set of optional props cannot represent, the pattern is justified.
- Keep in mind that `reloadProps` and `additionalProps()` may not work in some agent (MCP)
  contexts — if the component is intended for MCP use, this tradeoff should be noted
  so the author can make an informed decision.

### JSON object props for open-ended inputs

When an action accepts a dynamic set of field name-value pairs (e.g., record properties
with user-defined custom fields), either `type: "object"` or `type: "string"` is
acceptable. Both work in agent and workflow contexts:

- **`type: "object"`** — renders a key-value editor in the UI; the platform deserializes
  the value automatically so no `JSON.parse()` is needed in `run()`.
- **`type: "string"` with `JSON.parse()` in `run()`** — accepts a raw JSON string; more
  explicit and portable, but requires manual parsing.

```javascript
// type: "object" style
properties: {
  type: "object",
  label: "Properties",
  description:
    "Field name → value pairs for the new record."
    + " Example: `{\"firstname\": \"Jane\", \"lastname\": \"Doe\", \"email\": \"jane@acme.com\"}`."
    + " Use **Search Properties** to discover valid field names.",
},

// type: "string" style
properties: {
  type: "string",
  label: "Properties",
  description:
    "JSON object of property name-value pairs for the new record."
    + " Example: `{\"firstname\": \"Jane\", \"lastname\": \"Doe\", \"email\": \"jane@acme.com\"}`."
    + " Use **Search Properties** to discover valid field names.",
},

async run({ $ }) {
  const properties = JSON.parse(this.properties);
  // ...
},
```

Follow whichever style is already established in the component or app. Flag only if
the description does not include a concrete JSON example — that is required regardless
of which type is used.

---

## Error Handling

The platform's `axios` (from `@pipedream/platform`) automatically throws HTTP error
responses with the API's original message and status code. Actions should let these
propagate naturally — do **not** wrap `run()` in a generic try/catch:

```javascript
// Wrong — swallows the API's useful error message
async run({ $ }) {
  try {
    const result = await this.app.createRecord(data);
    $.export("$summary", `Created record ${result.id}`);
    return result;
  } catch (e) {
    throw new Error("Failed to create record");
  }
}

// Correct — API errors surface automatically with their original message and status code
async run({ $ }) {
  const result = await this.app.createRecord(data);
  $.export("$summary", `Created record ${result.id}`);
  return result;
}
```

### `ConfigurationError`

`ConfigurationError` from `@pipedream/platform` is appropriate for pre-flight validation
of user inputs — errors that should not trigger retries because they are configuration
mistakes, not transient failures:

```javascript
import { ConfigurationError } from "@pipedream/platform";

async run({ $ }) {
  if (!this.startDate && !this.endDate) {
    throw new ConfigurationError("At least one of Start Date or End Date is required.");
  }
  // proceed with API call
},
```

Do **not** use `ConfigurationError` to wrap API errors — only for explicit pre-call
validation of user-provided inputs.

---

## API Calls via App Methods

Actions should invoke API calls through dedicated methods, either in the app object (`this.app.methodName()`) or in the component itself, never
making raw HTTP calls directly in `run()`. If a needed method does not exist in the app
file, it should be added there or in the component's methods (see "App File Conventions" in the general guidelines).

```javascript
// Correct — delegates to an app method
const response = await this.app.createRecord(this.objectType, {
  $,
  data: this.properties,
});
```

Always pass the `$` context object to app methods that make HTTP requests — it enables
Pipedream's request logging and retry infrastructure.

Optional props can be passed directly into the request payload without truthiness checks,
because the platform's `axios` strips `undefined` values automatically:

```javascript
// No guard needed for optional props
async run({ $ }) {
  return this.app.updateContact({
    $,
    contactId: this.contactId,
    data: {
      name: this.name,          // required
      phone: this.phone,        // optional — omitted automatically if undefined
      company: this.company,    // optional — omitted automatically if undefined
    },
  });
},
```

---

## Annotations for Actions

`openWorldHint` must be `true` for any action that makes external API calls (the vast majority of actions). Pure utility or formatting actions that only process
their inputs locally (no HTTP requests) should use `false`.

The `readOnlyHint` and `destructiveHint` values depend on the API operations performed:

| Action type | `readOnlyHint` | `destructiveHint` |
|---|---|---|
| Fetch / get / list / search / describe | `true` | `false` |
| Create / add / send / publish | `false` | `false` |
| Update / edit / patch / upsert | `false` | `false`* |
| Archive / disable / deactivate (reversible) | `false` | `false` |
| Delete / remove / purge (irreversible) | `false` | `true` |

\* Update operations are **generally non-destructive** (`false`) because the prior state
can be restored by another update. Use `true` only when the specific endpoint irreversibly
overwrites data — for example, a full-replace operation that discards prior field values
with no recovery path. When in doubt, prefer `false`.

An action that performs both reads and writes (e.g., upsert — create or update) is **not**
read-only: `readOnlyHint: false`.

An action that hard-deletes data should have `destructiveHint: true` even if "delete" is
not in the action name. Soft-delete / archive operations are reversible and do not warrant
`destructiveHint: true`.

---

## Cross-Tool References in Descriptions

Action descriptions often reference other tools in **bold** to guide agents through
multi-step workflows. These references must be accurate:

```javascript
description:
  "Create a new deal in HubSpot."
  + " Use **List Pipelines and Stages** to find valid pipeline and stage IDs."
  + " Use **List Owners** to find valid owner IDs.",
```

When reviewing:
- Verify that every **bold tool name** in the description corresponds to a tool that
  actually exists in the same app's `actions/` directory
- The name in bold should match the tool's `name` property (not its `key`)
- A reference to a non-existent tool misleads agents and causes failed calls
