import heylibby from "../../heylibby.app.mjs";

export default {
  key: "heylibby-list-qualified-leads",
  name: "List Qualified Leads",
  description: "List qualified leads.",
  version: "0.0.1",
  type: "action",
  props: {
    heylibby,
  },
  async run({ $ }) {
    const response = await this.heylibby.listQualifiedLeads({
      $,
    });
    $.export("$summary", `Successfully listed ${response.length} qualified lead${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
