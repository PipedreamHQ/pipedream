import app from "../../code_climate.app.mjs";

export default {
  key: "code_climate-get-organizations",
  name: "Get Organizations",
  description: "Returns collection of organizations for the current user. [See the documentation](https://developer.codeclimate.com/#get-organizations)",
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
  async run({ $ }) {
    const response = await this.app.getOrganizations({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.data.length} organization(s)`);

    return response;
  },
};
