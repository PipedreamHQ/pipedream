import app from "../../habitica.app.mjs";

export default {
  key: "habitica-delete-challenge",
  name: "Delete Challenge",
  description: "Delete the challenge with the specified ID. [See the documentation](https://habitica.com/apidoc/#api-Challenge-DeleteChallenge)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.app.deleteChallenge({
      $,
      challengeId: this.challengeId,
    });
    $.export("$summary", "Successfully deleted the challenge with ID: " + this.challengeId);
    return response;
  },
};
