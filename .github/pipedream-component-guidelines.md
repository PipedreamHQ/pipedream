# Pipedream Component Guidelines

This document describes the Pipedream component model for code review purposes. It covers
concepts that apply to all component types (actions and sources). Type-specific guidelines
are in `pipedream-action-guidelines.md` and `pipedream-source-guidelines.md`.

---

## Component Model Overview

Pipedream components are JavaScript ES modules (`.mjs`) that define reusable integrations
with third-party services. They live in `components/{app-slug}/` and are deployed to
Pipedream's registry.

There are two types:

- **Actions** — Perform a task (create a record, send a message, fetch data) and return a
  result. Used in workflow steps and exposed as MCP tools via Pipedream Connect.
- **Sources** — Emit events that trigger downstream workflows. They listen for new data via
  webhooks or polling timers.

Once deployed, components can be configured by users who connect their authenticated
accounts. When exposed via MCP (Pipedream Connect), they appear as AI agent tools — the
component's `description` and prop `description` fields become the agent's only
documentation for how to call that tool correctly.

---

## Required Component Properties

Every component exports a default object with these required properties:

```javascript
export default {
  key: "app-action-name",       // globally unique; kebab-case; prefixed with app slug
  name: "Human Readable Name",  // shown in UI and as the MCP tool name
  description: "...",           // shown in UI and used as MCP tool documentation
  version: "0.0.1",            // semantic versioning; must be incremented on every change
  type: "action",               // or "source"
  props: { ... },              // configuration inputs
  async run({ $ }) { ... },    // execution entry point (signature differs for sources)
};
```

ESLint enforces the **presence** of all required properties. Reviews should focus on whether
values are **semantically correct**, not whether properties exist.

---

## Versioning

Every component has a `version` field that must be incremented on every change. New
components always start at `0.0.1`. Follow semantic versioning:

| Change type | Version segment | Examples |
|---|---|---|
| Bug fix, copy/description tweak, refactor with no behavior change | patch (`0.0.x`) | `0.0.1` → `0.0.2` |
| New optional prop, new output field, backwards-compatible improvement | minor (`0.x.0`) | `0.0.2` → `0.1.0` |
| Removed or renamed prop, changed output shape, behavior change that breaks existing configs | major (`x.0.0`) | `0.1.0` → `1.0.0` |

The app's `package.json` must also be bumped by the same or greater segment whenever a
component in that app changes — patch for patch, minor for minor (or higher), major for
major (or higher).

---

## Naming Conventions

All prop names, method names, and local variables must use **camelCase**. This applies
throughout component files and app files alike.

The only exception is API request parameters — use whatever casing the API itself
requires (often `snake_case` or `PascalCase`). Map prop values to API parameter names
at the point of the request:

```javascript
// Prop is camelCase
props: {
  firstName: { type: "string", label: "First Name" },
  lastName:  { type: "string", label: "Last Name"  },
},

// API parameter names follow the API's convention (snake_case here)
async run({ $ }) {
  return this.app.createContact({
    $,
    data: {
      first_name: this.firstName,
      last_name:  this.lastName,
    },
  });
},
```

---

## Props System

Props define the configuration inputs collected from users (or passed by AI agents) before
the component runs. They are declared as an object of named prop definitions.

### Inline prop definition

```javascript
props: {
  myApp,                    // app connection — always the first prop
  title: {
    type: "string",
    label: "Title",
    description: "The issue title.",
    optional: true,         // omit if the prop is required
  },
}
```

### Prop types

| Type | Description |
|------|-------------|
| `"string"` | Text input |
| `"string[]"` | Array of text inputs |
| `"integer"` | Integer, supports `min` / `max` |
| `"boolean"` | True or false |
| `"object"` | Key-value object (use sparingly — see JSON input pattern in action guidelines) |
| `"any"` | Untyped |
| `"$.service.db"` | Persistent key-value store (sources) |
| `"$.interface.http"` | Webhook endpoint (sources) |
| `"$.interface.timer"` | Polling timer (sources) |
| `"app"` | App authentication connection |

### propDefinition — shared prop definitions

Reusable prop definitions live in the app file under `propDefinitions`. Components reference
them to avoid duplicating label, description, and options logic:

```javascript
// In the app file:
propDefinitions: {
  repoFullname: {
    label: "Repository",
    description: "The full name of the repository (e.g. `owner/repo`).",
    type: "string",
    async options() { /* ... */ },
  },
},

// In a component:
props: {
  github,
  repoFullname: {
    propDefinition: [github, "repoFullname"],
  },
},
```

Any prop used by more than one component must be defined in the app file's
`propDefinitions` and referenced via `propDefinition` — do not duplicate label,
description, or options logic across components. Individual fields (e.g., `label`,
`optional`, `description`) can be overridden at the component level while still
referencing the shared definition:

```javascript
props: {
  github,
  repoFullname: {
    propDefinition: [github, "repoFullname"],
    label: "Repository (full name)",  // override only what differs
  },
},
```

Flag any inline prop definition that duplicates a propDefinition already present in the
app file.

### Dynamic options (`async options`)

Props can offer a dropdown of values fetched from the API at configuration time:

```javascript
status: {
  type: "string",
  label: "Status",
  description: "The pipeline stage to assign.",
  async options() {
    const stages = await this.app.getStages();
    return stages.map((s) => ({
      label: s.name,   // displayed to user
      value: s.id,     // stored and used at runtime
    }));
  },
},
```

Requirements:
- Each option should be either an object with `label` and `value`, or the primitive value itself (string or number).
- If the API paginates results, `async options()` must support `prevContext` or `page` (starts at 0) for "load more":

```javascript
async options({ prevContext }) {
  const cursor = prevContext?.cursor ?? null;
  const { items, nextCursor } = await this.app.getItems({ cursor });
  return {
    options: items.map((i) => ({ label: i.name, value: i.id })),
    context: { cursor: nextCursor },
  };
},
```
```javascript
async options({ page }) {
  const { items } = await this.app.getItems({ page: page + 1 });
  return items.map((i) => ({ label: i.name, value: i.id }));
},
```

`async options()` is appropriate when the set of valid values is dynamic and bounded (a
list of projects, pipelines, users, etc.). It works in both workflow UI and agent contexts.

### `reloadProps` and `additionalProps`

`reloadProps: true` on a prop causes the entire prop form to reload when that prop's value
changes, potentially revealing or hiding other props. `additionalProps()` generates props
dynamically based on current prop values.

These are legitimate patterns when the use case genuinely requires them. The review
question is whether they are actually necessary: can the same result be achieved with
`async options()` alone — for example, by returning a filtered set of options based on
another prop's value — without dynamically restructuring the prop form? If `async
options()` can satisfy the use case, it is the better choice because it works across
both the workflow UI and agent (MCP) contexts. If the structure of required inputs truly
depends on an earlier selection in a way that fixed optional props cannot represent, then
`reloadProps` or `additionalProps()` are justified.

---

## Annotations

**Actions only.** Source components must NOT include an `annotations` object — flag its
presence in any source file as an error.

Every action must include an `annotations` object that communicates its runtime behavior
to AI agents and the Pipedream platform:

```javascript
annotations: {
  readOnlyHint: true,      // true if the component only reads data, never writes or deletes
  destructiveHint: false,  // true if the component deletes or irreversibly modifies data
  openWorldHint: true,     // true if the component makes external API calls (almost always)
},
```

### Decision guide

| Operation type | `readOnlyHint` | `destructiveHint` | `openWorldHint` |
|---|---|---|---|
| Fetch / list / search / get | `true` | `false` | `true` |
| Create / send / post / publish | `false` | `false` | `true` |
| Update / patch / upsert | `false` | `false`* | `true` |
| Archive / disable (reversible) | `false` | `false` | `true` |
| Delete / purge / permanently remove | `false` | `true` | `true` |

\* Update operations are **generally non-destructive** (`false`) because the change can be
undone by another update. Use `true` only when the specific endpoint irreversibly overwrites
data — for example, a full-replace operation that discards prior field values with no
recovery path. When in doubt, prefer `false`.

`openWorldHint` is `true` for any component that makes external API calls, which covers
the vast majority of components. Pure utility or formatting components that only process
their inputs locally (no HTTP requests) should use `false`.

ESLint enforces that all three properties **exist**. Reviews should catch semantically
incorrect values — a fetch-only action with `readOnlyHint: false`, or a delete action
without `destructiveHint: true`, are the primary issues to flag.

---

## App File Conventions

App files (`{app}.app.mjs`) define the app connection, shared `propDefinitions`, and shared
`methods` (API helpers) reused across multiple components.

### Method naming

- **Private helpers**: prefix with `_` (e.g., `_baseUrl()`, `_makeRequest()`, `_getHeaders()`)
- **Public methods** called by components: verb-noun style (e.g., `getIssues()`,
  `createRecord()`, `deleteItem()`, `updateContact()`)

### Adding methods

When a PR adds new methods to an app file:
- **Renaming or refactoring a shared method requires updating all call sites in the same PR.**
  Already-deployed component instances are unaffected (components are packaged with their
  dependencies at deploy time), but other components in the app that reference the
  old method name will be broken at the source level until updated.
- Each public method should represent one logical API operation and delegate to a shared
  private `_makeRequest()` (or equivalent) that centralizes auth headers, base URL, and
  error handling. Do not inline raw `axios` calls in public methods.
- New methods must follow the same HTTP helper pattern already established in the file.

### HTTP request pattern

All HTTP requests must use `axios` imported from `@pipedream/platform` — never the `axios`
npm package directly. The platform's `axios` provides three behaviors that components rely on:

1. **Automatic `undefined` stripping** — Properties set to `undefined` in the request body
   or `params` object are omitted automatically. Optional props can be passed directly into
   the request payload without truthiness checks:

   ```javascript
   // No need to conditionally include optional fields
   return this._makeRequest({
     method: "POST",
     url: "/contacts",
     data: {
       email: this.email,        // required
       phone: this.phone,        // optional — undefined is stripped automatically
       company: this.company,    // optional — undefined is stripped automatically
     },
   });
   ```

2. **Response data extraction** — The response body is returned directly; there is no need
   to unwrap `.data` from the response object.

3. **Automatic error propagation** — HTTP error responses (4xx, 5xx) are thrown
   automatically with the API's original error message and status code. This is why
   `run()` does not need a try/catch for API errors — the platform surfaces them correctly
   without wrapping.

A typical `_makeRequest()` pattern:

```javascript
methods: {
  async _makeRequest({
    $ = this, headers, ...args
  }) {
    return axios($, {
      baseURL: "https://api.example.com/v1",
      headers: {
        Authorization: `Bearer ${this.$auth.access_token}`,
        ...headers,
      },
      ...args,
    });
  },
  async getContact({ contactId, ...args }) {
    return this._makeRequest({
      url: `/contacts/${contactId}`,
      ...args,
    });
  },
  async createContact(args) {
    return this._makeRequest({
      method: "POST",
      url: "/contacts",
      ...args,
    });
  },
},
```

A few notes on this pattern:

- **`baseURL` vs. URL concatenation**: `baseURL` is the preferred approach because axios
  resolves relative `url` values against it safely. The widely-used `url: \`${this._baseUrl()}${path}\``
  concatenation style is also acceptable when already established in a file.
- **`_baseUrl()` and `_headers()` as separate methods**: Extracting these into their own
  methods is optional. Inlining them directly in `_makeRequest()` (as shown above) is
  equally valid since `_makeRequest()` is already the single centralized place.
- **Custom headers**: The `headers` parameter is destructured separately so callers can
  pass per-request headers that merge with the standard auth headers, without clobbering them.
- **Spreading `args`**: All other request options (`method`, `url`, `params`, `data`, etc.)
  are passed through via `...args`, keeping public methods minimal — they set the
  method and URL, then forward everything else.

### propDefinitions

Prop definitions shared across more than one component belong in the app file. New
`propDefinitions` entries must include both `label` and `description`. If the definition
includes `async options()` that calls a paginated API endpoint, it must support `prevContext` or `page`.

---

## File Handling

Components that accept files as input or write files to `/tmp` must follow a consistent
pattern using helpers from `@pipedream/platform`.

### Reading / uploading files

When a component accepts a file from the user (a URL or a `/tmp` path), the input prop
must include `format: "file-ref"`:

```javascript
filePath: {
  type: "string",
  label: "File Path or URL",
  description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.pdf`).",
  format: "file-ref",
},
```

The file content is accessed at runtime via `getFileStreamAndMetadata` (or `getFileStream`
for stream-only access) imported from `@pipedream/platform`:

```javascript
import { getFileStreamAndMetadata } from "@pipedream/platform";

async run({ $ }) {
  const { stream, metadata } = await getFileStreamAndMetadata(this.filePath);
  // stream             — a readable stream of the file contents
  // metadata.name        — filename
  // metadata.contentType — MIME type
  // metadata.size        — byte size
},
```

The component must also declare a `syncDir` prop with `accessMode: "read"` to allow the
platform to sync the referenced file into the execution environment:

```javascript
syncDir: {
  type: "dir",
  accessMode: "read",
  sync: true,
  optional: true,
},
```

### Writing / downloading files to `/tmp`

When a component writes a file to `/tmp`, declare a `syncDir` prop with
`accessMode: "write"` so the platform can sync the result out:

```javascript
syncDir: {
  type: "dir",
  accessMode: "write",
  sync: true,
},
```

Write the file using standard Node.js `fs` or a stream pipeline:

```javascript
import { pipeline } from "stream/promises";
import fs from "fs";

async run({ $ }) {
  const { Body: data } = await this.app.downloadFile(...);
  await pipeline(data, fs.createWriteStream(this.filePath));
},
```

### File handling checklist

- `format: "file-ref"` must be present on every prop that accepts a file path or URL as
  input — without it the platform cannot resolve the reference at runtime
- A `syncDir` prop with the appropriate `accessMode` must always accompany a file input or
  output: `"read"` when the component consumes a file, `"write"` when it produces one
- Use `getFileStreamAndMetadata` when both the stream and metadata (name, content type,
  size) are needed; use `getFileStream` when only the stream is needed
- File handling applies equally to actions and sources — it is not restricted to actions

---

## Runtime Primitives

These values are injected by the Pipedream platform at runtime. They are not importable —
they exist as prop values or parameters passed to lifecycle methods.

| Primitive | How accessed | Purpose |
|---|---|---|
| `$auth` | `this.$auth` | Authenticated credentials (OAuth tokens, API keys) from the user's connected account |
| `$` (context) | `run({ $ })` parameter | Provides `$.export()` and other step-level utilities |
| `$.export(key, value)` | Called inside `run()` | Exposes a value to downstream workflow steps |
| `$.service.db` | Declared as `db: "$.service.db"` prop | Persistent key-value store scoped to this component instance |
| `$.interface.http` | Declared as `http: "$.interface.http"` prop | Provides a webhook endpoint URL and incoming request handler |
| `$.interface.timer` | Declared as `timer: { type: "$.interface.timer", ... }` | Provides a polling interval or cron trigger |

`$auth` is the only way components should access credentials. Auth tokens must never be
hardcoded or sourced from other props.

---

## Description Quality Standards

Component and prop descriptions serve two audiences simultaneously:
1. **Human workflow builders** in the Pipedream UI
2. **AI agents** using components as MCP tools

Both must be served well. Descriptions that are vague or rely on UI affordances ("select
from the dropdown") leave agents unable to construct correct calls — but the same
descriptions also fail to tell human builders what format or values are expected. Being
explicit about formats, valid values, and relationships between tools improves the
experience for both audiences simultaneously.

### Component description format

The **documentation link is always required** — every component description must end with
`[See the documentation](https://...)` pointing to the relevant API reference page. All
other sections apply when relevant:

1. **Primary purpose** — What does this tool do? One direct sentence.
2. **When to use** — Which user intent maps here vs. a similar tool?
3. **Cross-tool references** — Which tools should be called before or after?
   Use **bold tool names** that exactly match real tool names in the same app.
4. **Parameter guidance** — Inline examples for non-obvious inputs (JSON format, ID prefixes,
   date formats, enum values).
5. **Common gotchas** — Things that frequently go wrong or are misunderstood.
6. **Documentation link** (always required) — `[See the documentation](https://...)`

### Examples

**Poor — too vague, gives an agent no useful context:**
```javascript
description: "Creates a record in Hubspot."
```

**Good — tells the agent when to use it, what to look up first, and how to format inputs:**
```javascript
  description:
    "Create a new CRM record (contact, company, deal, ticket, etc.)."
    + " Pass property values as a JSON object in the `properties` parameter."
    + " Use **Search Properties** to discover available fields for the object type,"
    + " **Get Properties** to find valid enum values (e.g. `lifecyclestage`, `dealstage`),"
    + " and **List Owners** to find valid `hubspot_owner_id` values."
    + " [See the documentation](https://developers.hubspot.com/docs/api/crm/objects)",
```

### Prop description standards

- **Format**: Always describe the expected format for non-obvious values: dates, IDs, JSON
  structures, enum strings.
- **Examples**: Include a concrete example for any prop that accepts a JSON object or a
  value the agent must construct:
  `{"firstname": "Jane", "lastname": "Doe", "email": "jane@example.com"}`
- **ID props**: Explain where to get the ID if the user might only have a name or URL.
  "Use **Search Contacts** to find the contact ID."
- **Avoid UI language**: Replace "select from the dropdown" with a description of what
  value is expected and how to obtain it.
- **Cross-references**: Point to discovery tools when valid values must be looked up.
  "Use **List Pipelines and Stages** to find valid pipeline and stage IDs."
