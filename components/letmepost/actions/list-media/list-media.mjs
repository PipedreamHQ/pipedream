import app from "../../letmepost.app.mjs";

export default {
  key: "letmepost-list-media",
  name: "List Media",
  description: "List previously uploaded media assets. [See the documentation](https://letmepost.dev/docs/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of media assets to return.",
      optional: true,
      default: 50,
    },
  },
  async run({ $ }) {
    const { data } = await this.app.listMedia({
      $,
      params: { limit: this.limit ?? 50 },
    });

    $.export("$summary", `Successfully retrieved ${data.length} media asset(s)`);

    return data;
  },
};
