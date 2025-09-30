import app from "../../the_odds_api.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  name: "Fetch Current Odds",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "the_odds_api-fetch-current-odds",
  description: "Retrieve the current odds for a specific sport or match. [See the documentation](https://the-odds-api.com/liveapi/guides/v4/#get-event-odds)",
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
    event: {
      propDefinition: [
        app,
        "event",
        (c) => ({
          sport: c.sport,
          region: c.region,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.fetchCurrentOdds({
      $,
      sport: this.sport,
      event: this.event,
      params: {
        regions: this.region,
      },
    });

    if (response) {
      $.export("$summary", `Successfully retrieved current odds with ID \`${response.id}\``);
    }

    return response;
  },
};
