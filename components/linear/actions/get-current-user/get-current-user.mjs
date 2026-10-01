import linearApp from "../../linear.app.mjs";
import utils from "@pipedream/linear_app/common/utils.mjs";

const DEFAULT_CONNECTION_LIMIT = 50;

export default {
  key: "linear-get-current-user",
  name: "Get Current User",
  description: "Retrieve rich context about the authenticated Linear user, including core profile fields, recent timestamps, direct team memberships, and high-level organization settings. Use this when your workflow or agent needs to understand who is currently authenticated, which teams they belong to, or what workspace policies might influence subsequent Linear actions. Use the optional `fields` prop to return only the top-level sections you need (reduces context for large workspaces). Example: call with no parameters → returns `{user: {id: \"usr_01\", name: \"Jane Doe\", email: \"jane@acme.com\"}, organization: {id: \"org_01\", name: \"Acme Inc\"}, teams: {nodes: [{id: \"9d1c3f7e-2b48-4c6a-9f1e-5a7b8c9d0e1f\", name: \"Engineering\", key: \"ENG\"}], pageInfo: {endCursor: \"...\", hasNextPage: false}}, teamMemberships: {nodes: [{id: \"tm_01\"}], pageInfo: {endCursor: \"...\", hasNextPage: false}}}`. [See the documentation](https://linear.app/developers/graphql).",
  version: "0.1.0",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linearApp,
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of top-level sections to include in the response — one or more of `user`, `organization`, `teams`, `teamMemberships`. When omitted, all four are returned. Pass a subset to reduce response size, e.g. `[\"user\", \"teams\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const client = this.linearApp.client();
    const viewer = await client.viewer;

    const [
      organization,
      teamsConnection,
      teamMembershipsConnection,
    ] = await Promise.all([
      viewer.organization,
      viewer.teams({
        first: DEFAULT_CONNECTION_LIMIT,
      }),
      viewer.teamMemberships({
        first: DEFAULT_CONNECTION_LIMIT,
      }),
    ]);

    const summaryIdentifier = viewer.name || viewer.displayName || viewer.email || viewer.id;
    $.export("$summary", `Retrieved Linear user ${summaryIdentifier}`);

    return utils.pickFields({
      user: viewer,
      organization,
      teams: teamsConnection,
      teamMemberships: teamMembershipsConnection,
    }, this.fields);
  },
};
