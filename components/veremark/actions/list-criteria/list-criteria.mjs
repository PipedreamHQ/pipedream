import app from "../../veremark.app.mjs";

export default {
  key: "veremark-list-criteria",
  name: "List Criteria",
  description:
    "Returns all background check criteria packages configured for your Veremark account."
    + " Each criteria defines a named bundle of checks (e.g. 'Executive' includes reference check, ID check, employment check)."
    + " Use this tool first to discover available criteria and their GUIDs before calling **Create Background Check Request**."
    + " [See the documentation](https://help.veremark.com/getting-started-with-the-veremark-api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const criteria = await this.app.listCriteria({
      $,
    });
    $.export("$summary", `Found ${criteria.length} criteria package${criteria.length === 1
      ? ""
      : "s"}`);
    return criteria;
  },
};
