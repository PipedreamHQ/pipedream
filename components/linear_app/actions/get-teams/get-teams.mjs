import linearApp from "../../linear_app.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "linear_app-get-teams",
  name: "Get Teams",
  description: "Retrieves teams in your Linear workspace. Returns team objects with `id`, `name`, `key`, and more (including internal settings fields). Use this to discover valid team IDs (UUIDs) for creating or filtering issues and projects. Supports pagination: pass `after` with the previous response's `pageInfo.endCursor` to load the next page. Use the optional `fields` prop to narrow the response to only the keys you need (reduces context for large result sets). Example: call with `limit: 50` → returns `{nodes: [{id: \"9d1c3f7e-...\", name: \"Engineering\", key: \"ENG\"}, ...], pageInfo: {endCursor: \"...\", hasNextPage: true}}`. [See the documentation](https://linear.app/developers/graphql).",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    linearApp,
    limit: {
      propDefinition: [
        linearApp,
        "limit",
      ],
      description: "Maximum number of teams to return per page. Defaults to 20 if not specified.",
    },
    after: {
      propDefinition: [
        linearApp,
        "after",
      ],
      description: "Pagination cursor from a previous response's `pageInfo.endCursor` to fetch the next page of teams.",
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in each returned team object. When omitted, the full team payload is returned (including internal settings fields). Pass a subset to reduce response size, e.g. `[\"id\", \"name\", \"key\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const limit = this.limit || constants.DEFAULT_NO_QUERY_LIMIT;

    const variables = {
      first: limit,
      after: this.after,
    };

    const {
      nodes: teams, pageInfo,
    } = await this.linearApp.listTeams(variables);

    $.export("$summary", `Found ${teams.length} team${teams.length === 1
      ? ""
      : "s"}`);

    return {
      nodes: teams.map((team) => utils.pickFields(team, this.fields)),
      pageInfo,
    };
  },
};
