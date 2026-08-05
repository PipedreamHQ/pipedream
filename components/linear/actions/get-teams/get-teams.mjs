import getTeams from "@pipedream/linear_app/actions/get-teams/get-teams.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...getTeams,
  ...utils.getAppProps(getTeams),
  key: "linear-get-teams",
  description: "Retrieves all teams in your Linear workspace. Returns array of team objects with details like ID, name, and key. Supports pagination with configurable limit. Uses OAuth authentication. **Response size matters here:** by default every field of every team is returned — cycle configuration, auto-archive periods, invite hashes — which runs ~1.5 KB per team, so a workspace with a few dozen teams can overflow an AI agent's context window. Most callers want a team's `id` to pass to a team-scoped action such as **Search Issues** or **List Projects**: `fields: \"compact\"` returns just `id,name,key,description`. See Linear docs for additional info [here](https://linear.app/developers/graphql).",
  version: "0.3.0",
};
