import app from "../../snipe_it.app.mjs";

export default {
  key: "snipe_it-get-user-assets",
  name: "Get User Assets",
  description: "Retrieves all assets currently assigned to a specific user. Useful for audits and inventory reviews. [See the documentation](https://snipe-it.readme.io/reference/usersidassets)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      userId,
    } = this;

    const response = await app.getUserAssets({
      $,
      userId,
    });

    $.export("$summary", `Successfully retrieved \`${response.rows.length}\` assets for user ID \`${userId}\``);
    return response;
  },
};
