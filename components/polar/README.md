# Polar

Polar is a monetization platform for developers and creators. This component uses the [Polar API](https://polar.sh/docs/api-reference) (Core API with [Organization Access Token](https://polar.sh/docs/api-reference/introduction)).

## Authentication

Use a Polar **Organization Access Token (OAT)**. The component sends it in the `Authorization: Bearer` header as per the [API Overview](https://polar.sh/docs/api-reference/introduction). Create an OAT in your organization settings in the Polar dashboard. The token must have the scopes required by the sources and actions (e.g. `webhooks:write` for webhooks, `orders:read` for list orders, `subscriptions:read` for list subscriptions). Production base URL is `https://api.polar.sh/v1`.

## Webhook Sources

- **New Benefit Created** – Emit when a new benefit is created (`benefit.created`).
- **Benefit Updated** – Emit when a benefit is updated (`benefit.updated`).
- **New Subscription Created** – Emit when a new subscription is created (`subscription.created`).
- **Subscription Updated** – Emit when a subscription is updated (`subscription.updated`).
- **New Webhook Event** – Emit when any selected webhook event occurs (choose event types).

Webhook sources create an endpoint in Polar and receive events at the Pipedream URL. Optionally set **Organization ID** if your token is not organization-scoped.

## Actions

- **List Orders** – List orders with optional filters. [API reference](https://polar.sh/docs/api-reference/orders/list).
- **List Subscriptions** – List subscriptions with optional filters. [API reference](https://polar.sh/docs/api-reference/subscriptions/list).

---

## Publishing and Using in Pipedream

### Option A: Use in your workspace (private publish)

Use the component in your own Pipedream account without contributing to the public registry:

1. **Install the Pipedream CLI**  
   [Install the CLI](https://pipedream.com/cli/install/) for your OS.

2. **Log in**  
   Run `pd login` and complete the browser flow so the CLI has your API key.

3. **Publish each component file**  
   From the **repo root** (not inside `components/polar`), run `pd publish` for each source and action:

   ```bash
   # Sources (webhooks)
   pd publish components/polar/sources/new-benefit-created/new-benefit-created.mjs
   pd publish components/polar/sources/benefit-updated/benefit-updated.mjs
   pd publish components/polar/sources/new-subscription-created/new-subscription-created.mjs
   pd publish components/polar/sources/subscription-updated/subscription-updated.mjs
   pd publish components/polar/sources/new-webhook-event/new-webhook-event.mjs

   # Actions
   pd publish components/polar/actions/list-orders/list-orders.mjs
   pd publish components/polar/actions/list-subscriptions/list-subscriptions.mjs
   ```

   Each published component is then available in your Pipedream account under the **Polar** app.

4. **Use in workflows**  
   - **Sources:** In Pipedream, create a new workflow → **Trigger** → choose **Polar** and the source (e.g. “New Benefit Created”). Connect your Polar account (Organization Access Token) and configure.  
   - **Actions:** In a workflow, add a step → **Polar** → choose the action (e.g. “List Orders”) and configure.

5. **Deploy a source from the CLI (optional)**  
   To deploy a source from your local file and have it watch for events:

   ```bash
   pd deploy components/polar/sources/new-benefit-created/new-benefit-created.mjs
   ```

   Or use **pd dev** to develop against a live source:

   ```bash
   pd dev components/polar/sources/new-benefit-created/new-benefit-created.mjs
   ```

**Workspace / org:** If you use a [Pipedream workspace](https://pipedream.com/workspaces/), add `org_id = <your-workspace-id>` to your [CLI config](https://pipedream.com/cli/reference/#cli-config-file) (under the right profile) and run the same `pd publish` / `pd deploy` commands. Components will be available in that workspace.

### Option B: Publish to the public Pipedream registry

To make Polar available to everyone on Pipedream:

1. **Fork and branch**  
   Fork [PipedreamHQ/pipedream](https://github.com/PipedreamHQ/pipedream), then create a branch with your Polar component under `components/polar/` (as in this repo).

2. **Run local checks**  
   From the repo root:

   ```bash
   pnpm install
   npx eslint components/polar
   ```

   Fix any lint errors; use `npx eslint --fix components/polar` where applicable.

3. **Open a pull request**  
   Open a PR from your branch to `master`. In the PR, mention that you’re adding the Polar app with the listed sources and actions.

4. **Review and merge**  
   After review, Pipedream will merge the PR. Their [publish workflow](https://github.com/PipedreamHQ/pipedream/blob/master/.github/workflows/publish-components.yaml) runs on push to `master` and publishes changed components to the registry.

5. **Using the public app**  
   Once in the registry, anyone can use **Polar** from the app picker when creating triggers or steps. They connect their Polar account (Organization Access Token) and use the sources and actions like any other app.

### Connecting your Polar account in Pipedream

When you add a Polar trigger or action in a workflow, Pipedream will prompt you to connect an account:

- Create a **Polar Organization Access Token** in your [organization settings](https://polar.sh/dashboard).
- In Pipedream, when connecting the app, use that token. The connection field must be mapped to **Access Token** (or whatever key your app file uses; this component uses `access_token` in `polar.app.mjs`).

If the Pipedream app is configured with a different auth key (e.g. `api_key`), use that when setting up the connection so `this.$auth.<key>` in the app file matches.
