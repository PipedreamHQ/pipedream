# HubSpot: add note to contact (Prismatic parity) + MCP/AI guidance

Use this as the GitHub PR description (copy into the PR body on GitHub).

---

## Why

Customers need to **add a note to a HubSpot contact** the same way they could in **Prismatic**.

The existing **Create Note** and **Create Engagement** actions are a poor fit for that workflow in **AI / MCP** contexts:

- **Create Note** loads **many dynamic HubSpot note properties** (`additionalProps`) and requires **`toObjectId` + `associationType`** together when associating — hard to discover and easy to misconfigure for agents.
- **Create Engagement** works in the **visual workflow editor** but often **fails for AI**: **`engagementType` uses `reloadProps`**, so the tool schema effectively becomes a **multi-step** configuration (pick type → reload → fill HubSpot fields). Agents do not reliably complete that sequence the way the UI does.

This PR adds a **purpose-built action** with a **flat prop surface** and updates **documentation** on the existing actions so agents and humans route to the right tool.

## What

### New: `hubspot-add-note-to-contact` — **Add Note to Contact**

- **Props:** `hubspot`, `contactId`, `noteBody` only (no engagement-type step, no dynamic schema explosion).
- **Behavior:** Creates a CRM **note** and associates it to the contact by resolving **note → contact** association labels at runtime (`getAssociationTypes`), then `createObject` on `notes`.
- **MCP:** Tool description and prop copy explain when to use this vs Create Note / Create Engagement.

### Updated: Create Note & Create Engagement

- **Descriptions** and (where relevant) **prop descriptions** explain:
  - When to prefer **Add Note to Contact**.
  - How **`reloadProps`** on **Create Engagement** interacts with **`engagementType`**.
  - Using **`CONFIGURE_COMPONENT`** for remote options (aligned with Pipedream MCP `componentMapper` behavior).

### Package

- `@pipedream/hubspot` version bumped.

## How to test

1. Connect HubSpot in a workflow or MCP client.
2. Run **Add Note to Contact** with a valid **contact ID** and **note body**; confirm the note appears on the contact timeline in HubSpot.
3. In MCP, confirm the new action exposes a **small, static** parameter set compared to **Create Engagement**.

## Merge / base

- Branch merges latest **`master`** to resolve conflicts with upstream HubSpot component edits.
