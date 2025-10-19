import linearApp from "../../linear.app.mjs";

const DEFAULT_CONNECTION_LIMIT = 50;

export default {
  key: "linear-get-current-user",
  name: "Get Current User",
  description: "Retrieve rich context about the authenticated Linear user, including core profile fields, recent timestamps, direct team memberships, and high-level organization settings. Returns the user object, a paginated team list (with names, keys, cycle configs, etc.), associated team memberships, and organization metadata such as auth defaults and SCIM/SAML flags. Use this when your workflow or agent needs to understand who is currently authenticated, which teams they belong to, or what workspace policies might influence subsequent Linear actions. See Linear's GraphQL viewer docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linearApp,
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

    return {
      user: viewer,
      organization,
      teams: teamsConnection,
      teamMemberships: teamMembershipsConnection,
    };
  },
};
