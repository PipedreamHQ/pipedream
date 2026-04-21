import liveagent from "../../liveagent.app.mjs";

export default {
  key: "liveagent-list-tags",
  name: "List Tags",
  description: "Lists all tags. [See the documentation](https://support.liveagent.com/911737-API-v3)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    liveagent,
  },
  async run({ $ }) {
    const response = await this.liveagent.listTags({
      $,
    });
    $.export("$summary", `Successfully listed ${response.length} tag(s).`);
    return response;
  },
};
