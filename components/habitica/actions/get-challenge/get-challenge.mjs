import app from "../../habitica.app.mjs";

export default {
  key: "habitica-get-challenge",
  name: "Get Challenge",
  description: "Get data for the challenge with the specified ID. [See the documentation](https://habitica.com/apidoc/#api-Challenge-GetChallenge)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    challengeId: {
      propDefinition: [
        app,
        "challengeId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getChallenge({
      $,
      challengeId: this.challengeId,
    });
    $.export("$summary", "Successfully retrieved the challenge with ID: " + this.challengeId);
    return response;
  },
};
