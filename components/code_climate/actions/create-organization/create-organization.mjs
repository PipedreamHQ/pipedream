import app from "../../code_climate.app.mjs";

export default {
  key: "code_climate-create-organization",
  name: "Create Organization",
  description: "Creates a new organization on code_climate. [See the documentation](https://developer.codeclimate.com/#create-organization)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    orgName: {
      propDefinition: [
        app,
        "orgName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createOrganization({
      $,
      data: {
        data: {
          type: "orgs",
          attributes: {
            name: this.orgName,
          },
        },
      },
    });

    $.export("$summary", `Successfully created organization '${this.orgName}'`);

    return response;
  },
};
