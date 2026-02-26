import getTeams from "@pipedream/linear_app/actions/get-teams/get-teams.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...getTeams,
  ...utils.getAppProps(getTeams),
  key: "linear-get-teams",
  description: "Retrieves all teams in your Linear workspace. Returns array of team objects with details like ID, name, and key. Supports pagination with configurable limit. Uses OAuth authentication. See Linear docs for additional info [here](https://linear.app/developers/graphql).",
  version: "0.2.15",
};
