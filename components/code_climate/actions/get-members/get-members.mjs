import app from "../../code_climate.app.mjs";

export default {
  key: "code_climate-get-members",
  name: "Get Members",
  description: "Returns a list of active members for the specified organization. [See the documentation](https://developer.codeclimate.com/#get-members)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    orgId: {
      propDefinition: [
        app,
        "orgId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getMembers({
      $,
      orgId: this.orgId,
    });

    $.export("$summary", `Successfully retrieved ${response.data.length} user(s) in the specified organization`);

    return response;
  },
};
