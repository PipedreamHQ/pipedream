import app from "../../the_odds_api.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  name: "Get Upcoming Events",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "the_odds_api-get-upcoming-events",
  description: "Get a list of upcoming sports events available on The Odds API. [See the documentation](https://the-odds-api.com/liveapi/guides/v4/#endpoint-2)",
  type: "action",
  props: {
    app,
    region: {
      type: "string",
      label: "Region",
      description: "Regions of the bookmakers to be returned",
      options: constants.REGIONS,
    },
    sport: {
      propDefinition: [
        app,
        "sport",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getUpcomingEvents({
      $,
      sport: this.sport,
      params: {
        regions: this.region,
      },
    });

    if (response) {
      $.export("$summary", `Successfully retrieved \`${response.length}\` upcoming events`);
    }

    return response;
  },
};
