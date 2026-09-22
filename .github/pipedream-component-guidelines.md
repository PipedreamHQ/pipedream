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
  version: "0.0.1",            // semantic versioning; increment when the component's own behavior, interface, or implementation changes
  type: "action",               // or "source"
  props: { ... },              // configuration inputs
  async run({ $ }) { ... },    // execution entry point (signature differs for sources)
};
```

ESLint enforces the **presence** of all required properties. Reviews should focus on whether
values are **semantically correct**, not whether properties exist.

### `ai: "optimized"`

Every action and source that is created or modified must declare the top-level property
`ai: "optimized"` in its default export, alongside `version` and `type`:

```javascript
export default {
  key: "app-action-name",
  name: "Human Readable Name",
  description: "...",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  props: { ... },
};
```

- This must be a real property. The legacy `// x-pd-ai: optimized` comment marker is no
  longer used: do not add it to new files, and when modifying a file that still has it,
  remove the comment and add the property instead.
- It applies to action and source components only. App files (`*.app.mjs`) and helper
  modules (`common/*.mjs`, `test-event.mjs`) do not carry it.

---

## Versioning

Every component has a `version` field that must be incremented whenever the component's
own behavior, interface, or implementation changes. New components always start at
`0.0.1`. Follow semantic versioning:

| Change type | Version segment | Examples |
|---|---|---|
| Bug fix, copy/description tweak, refactor with no behavior change | patch (`0.0.x`) | `0.0.1` → `0.0.2` |
| New optional prop, new output field, backwards-compatible improvement | minor (`0.x.0`) | `0.0.2` → `0.1.0` |
| Removed or renamed prop, changed output shape, behavior change that breaks existing configs | major (`x.0.0`) | `0.1.0` → `1.0.0` |

The app's `package.json` must also be bumped by the same or greater segment whenever a
component in that app changes — patch for patch, minor for minor (or higher), major for
major (or higher).

### CI version check and false positives

A CI workflow flags components whose files — or whose shared dependency files — were
modified without a corresponding version bump. This check is **advisory**: it is not
required to pass for a PR to merge.

The check can produce false positives. For example, adding a new constant to a shared
constants file does not affect existing consumers, so those components do not strictly
need a version bump. In cases like this, a **patch bump is always acceptable** as a
way to satisfy the workflow — reviewers should not block a PR solely because a component
received a patch bump that was not otherwise necessary. Conversely, do not require
authors to bump versions for components that are only transitively touched by a
non-behavioral shared-file change; the CI warning is informational in those cases.

---

## Naming Conventions

All prop names, method names, and local variables must use **camelCase**. This applies
throughout component files and app files alike.

Module-level constants (values that are fixed at import time and reused across the file)
must use **`UPPER_SNAKE_CASE`**:

```javascript
const DEFAULT_LIMIT = 100;
const MAX_RETRIES = 3;
const EVENT_TYPES = Object.freeze(["created", "updated", "deleted"]);
```

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
    description: "The issue title, e.g. `Login page returns 500 on submit`.",
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

#### Moving commonly used props to the app file

Props that identify a shared resource or carry a shared input shape — IDs (`siteId`,
`listId`, `contactId`, `projectId`), pagination controls (`limit`, `maxResults`), filters,
date ranges, and similar — are almost always needed by several components in the same
app. Treat them as shared by default:

- When a PR adds or modifies a component whose inline prop has the same meaning as an
  inline prop in **any other component of the same app**, move it to the app file's
  `propDefinitions` and switch **every** occurrence to `propDefinition: [app, "propName"]`
  in the same PR. Do not leave some components on the inline copy.
- Name the shared definition after the concept, not the component (`listId`, not
  `listIdForCreateItem`). Component-specific wording belongs in a local override
  (`description`, `optional`, `label`), not in a second definition.
- When a prop needs values from another prop (e.g. `listId` depends on `siteId`), keep the
  dependency in the shared definition and pass it from the component:

  ```javascript
  listId: {
    propDefinition: [
      sharepoint,
      "listId",
      (c) => ({ siteId: c.siteId }),
    ],
  },
  ```

- Props that are genuinely unique to one component (e.g. the body of a single create
  endpoint) may stay inline. The test is reuse, not size.

Flag an inline prop in a component when an equivalent prop exists inline in a sibling
component of the same app — both should be consolidated into `propDefinitions`.

### Dynamic options (`async options`)

Props can offer a dropdown of values fetched from the API at configuration time:

```javascript
status: {
  type: "string",
  label: "Status",
  description: "The ID of the pipeline stage to assign, e.g. `stage_4821`."
    + " Use **List Stages** to find valid stage IDs (the `id` field).",
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

Prop definitions shared across more than one component belong in the app file (see
"Moving commonly used props to the app file" above). New `propDefinitions` entries must
include both `label` and `description`, and the description must meet the
[prop description standards](#prop-description-standards) — a concrete example, plus the
**tool name** that supplies the value when it must be looked up. If the definition
includes `async options()` that calls a paginated API endpoint, it must support `prevContext` or `page`.

Generic helper functions do not belong in the app file's `methods` — see
[Shared Utilities](#shared-utilities-commonutilsmjs).

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

### No HTTP method or endpoint path

Component descriptions must **not** expose the underlying HTTP method or endpoint path
(e.g. never `"(GET /employees/changed)"` or `"Calls POST /contacts"`). Agents call the
tool, not the endpoint, and a raw path encourages them to reason in API parameter names
instead of prop names. Describe what the tool does, what it returns, and when to use it
(including which tool to chain next). The `[See the documentation](<deep link>)` link is
still required and already points readers to the endpoint reference.

```javascript
// Wrong
description: "Lists employees changed since a date (GET /employees/changed)."
  + " [See the documentation](https://...)",

// Right
description: "List employees whose records changed since a given date."
  + " Returns employee IDs with the type of change (inserted, updated, deleted)."
  + " Use **Get Employee** to fetch full details for a returned ID."
  + " [See the documentation](https://...)",
```

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

Every prop (except the app connection, `db`, `http`, `timer`, and `syncDir`) must have a
`description` that meets **all** of the following. These apply equally to inline props and
to entries in the app file's `propDefinitions`.

- **Example is required**: Every prop description must include a concrete example value,
  written as `` e.g. `...` `` or `` Example: `...` ``. This includes simple strings, IDs,
  integers, booleans with non-obvious effects, arrays, and JSON objects:
  - ID: `` The ID of the list, e.g. `b!3cK9xZ...` or `a1b2c3d4-...`. ``
  - Date: `` ISO 8601 date-time, e.g. `2026-01-31T00:00:00Z`. ``
  - Enum: `` One of `active`, `archived`, `draft`. e.g. `active`. ``
  - Array: `` e.g. `["jane@example.com", "joe@example.com"]` ``
  - JSON: `` e.g. `{"firstname": "Jane", "lastname": "Doe", "email": "jane@example.com"}` ``
  - Integer: `` Maximum number of results to return, e.g. `50`. Defaults to `100`. ``
- **Source of the value is required when it must be looked up**: If the value is an ID,
  key, slug, or any value the caller cannot know up front, the description must name the
  tool that returns it, using the **bold tool name** of a real action in the same app, and
  the response field to read when it is not obvious:
  - `` Use **List Sites** to find the site ID (the `id` field). ``
  - `` Use **List Lists** with the same `siteId` to find valid list IDs. ``
  - If no such tool exists yet, add one (a companion **List X** / **Search X** action) in
    the same PR rather than leaving the prop without a source.
  - Exception: if the API has no list or search operation for the value, a companion
    action is not possible. Name the authoritative place the value comes from instead
    (e.g. `` Found in **Settings → API** in the dashboard. `` or a link to the vendor docs
    page that lists valid values).
- **Format**: Always describe the expected format for non-obvious values: dates, IDs, JSON
  structures, enum strings.
- **Avoid UI language**: Replace "select from the dropdown" with a description of what
  value is expected and how to obtain it.
- **Dependencies**: When a prop only makes sense together with another prop, say so
  (`` Must belong to the site given in `siteId`. ``).

**Poor:**
```javascript
listId: {
  type: "string",
  label: "List ID",
  description: "The list ID.",
},
```

**Good:**
```javascript
listId: {
  type: "string",
  label: "List ID",
  description: "The ID of the SharePoint list, e.g. `a1b2c3d4-5678-90ab-cdef-1234567890ab`."
    + " Use **List Lists** with the same `siteId` to find it (the `id` field).",
},
```

Flag any prop whose description has no example, and any ID-like prop whose description
does not name the tool that supplies the value.

---

## Shared Utilities (`common/utils.mjs`)

Generic helper functions — anything that is not an API call, not a prop definition, and not
component-specific business logic — belong in the app's `common/utils.mjs`, not inside a
component file or the app file's `methods`.

Typical candidates:

- Parsing input: `parseObject()`, `parseArray()`, `parseJson()`
- Cleaning payloads: `cleanObject()` / removing empty values
- Formatting: date conversion, string normalization, building query strings or filter
  expressions
- Pagination helpers that do not themselves call the API (e.g. extracting a cursor)
- Encoding / hashing (e.g. building a stable, length-limited source event `id`)

```javascript
// components/my_app/common/utils.mjs
export const parseObject = (obj) => {
  if (!obj) return undefined;
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch {
      return obj;
    }
  }
  return obj;
};

// components/my_app/actions/create-item/create-item.mjs
import { parseObject } from "../../common/utils.mjs";
```

Rules:

- **Do not define helper functions at module level or in `methods` of a component** when the
  same helper exists (or could live) in `common/utils.mjs`. Import it instead.
- **Do not duplicate a helper across components.** If two components in the app contain
  the same or near-identical function, move it to `common/utils.mjs` in the same PR and
  update both call sites.
- **Reuse before adding.** Check the app's existing `common/utils.mjs` first; extend an
  existing helper rather than adding a second one with overlapping behavior.
- **Keep utils pure.** Functions in `common/utils.mjs` must not call the API or depend on
  `this`; API calls stay in the app file's `methods`. Constants go in `common/constants.mjs`.
- Either named exports (`export const parseObject = ...`) or a default-exported object
  (`export default { parseObject }`) is acceptable — follow whichever style the app's
  existing `common/utils.mjs` already uses.

Flag helper logic defined inside a component file or app file that belongs in
`common/utils.mjs`, and any helper duplicated across components of the same app.
