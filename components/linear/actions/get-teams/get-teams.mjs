import linearApp from "../../linear.app.mjs";
import getTeams from "../../../linear_app/actions/get-teams/get-teams.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...getTeams,
  key: "linear-get-teams",
  description: "Get all the teams (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues)",
  version: "0.0.2",
  props: {
    linearApp,
  },
};
