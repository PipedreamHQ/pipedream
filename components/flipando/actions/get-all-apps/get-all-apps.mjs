import flipando from "../../flipando.app.mjs";

export default {
  key: "flipando-get-all-apps",
  name: "Get All Apps",
  description: "Fetches a list of all apps that the user had created within flipando. [See the documentation](https://flipandoai.notion.site/Flipando-ai-API-Integration-Guide-6b508cfe1a5d4a249d20b926eac3a1d7#36b02715e5f440c9b21952b668e0e70c)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    flipando,
  },
  async run({ $ }) {
    const { results } = await this.flipando.listApps({
      $,
    });
    $.export("$summary", `Fetched ${results.length} app${results.length === 1
      ? ""
      : "s"}.`);
    return results;
  },
};
