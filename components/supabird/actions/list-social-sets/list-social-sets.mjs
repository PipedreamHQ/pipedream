import app from "../../supabird.app.mjs";

export default {
  key: "supabird-list-social-sets",
  name: "List Social Sets",
  description: "List the social sets (brands) on your SupaBird account with their connected networks. Use the `id` of a set as **Social Set** in other SupaBird actions. [See the documentation](https://api.supabird.io/v1/docs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const { data = [] } = await this.app.listSocialSets({
      $,
    });
    $.export("$summary", `Found ${data.length} social set${data.length === 1
      ? ""
      : "s"}`);
    return data;
  },
};
