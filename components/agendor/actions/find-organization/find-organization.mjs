import app from "../../agendor.app.mjs";

export default {
  name: "Find Organization",
  description: "Find Organization [See the documentation](https://api.agendor.com.br/docs/#operation/Get%20organization).",
  key: "agendor-find-organization",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
  },
  async run({ $ }) {
    const organization = await this.app.getOrganization(this.organizationId);
    $.export("summary", `Organization successfully retrieved with "${organization.data.id}".`);
    return organization;
  },
};
