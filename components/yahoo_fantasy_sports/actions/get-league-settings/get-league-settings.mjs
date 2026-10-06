import yfs from "../../yahoo_fantasy_sports.app.mjs";

export default {
  key: "yahoo_fantasy_sports-get-league-settings",
  name: "Get League Settings",
  description: "Get league settings including roster positions, scoring type, waiver rules, and playoff weeks. [See the documentation](https://developer.yahoo.com/fantasysports/guide/#settings-resource)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    yfs,
    league: {
      propDefinition: [
        yfs,
        "league",
      ],
    },
  },
  async run({ $ }) {
    const settings = await this.yfs.getLeagueSettings(this.league, $);
    $.export("$summary", "Retrieved league settings");
    return settings;
  },
};
