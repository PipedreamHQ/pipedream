import app from "../../starloop.app.mjs";

export default {
  key: "starloop-list-ids",
  name: "List IDs",
  description: "Returns your business id and a list of all profile id’s and names. [See the documentation](https://help.starloop.com/article/46-api-documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  run({ $: step }) {
    return this.app.listIds({
      step,
      summary: () => "Successfully listed ids",
    });
  },
};
