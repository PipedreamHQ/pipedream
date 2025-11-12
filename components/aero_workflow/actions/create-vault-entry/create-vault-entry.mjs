import app from "../../aero_workflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "aero_workflow-create-vault-entry",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Create Vault Entry",
  description: "Creates a vault entry for selected company [See the docs here](https://api.aeroworkflow.com/swagger/index.html)",
  props: {
    app,
    company: {
      propDefinition: [
        app,
        "company",
        () => ({
          returnId: true,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type",
      options: [
        "general",
        "login",
        "bank",
        "notes",
      ],
    },
    securityLevel: {
      type: "string",
      label: "Security Level",
      description: "Security level",
      options: [
        "sl1",
        "sl2",
        "sl3",
        "sl4",
        "sl5",
        "sl6",
        "sl7",
        "sl8",
      ],
    },
    link: {
      type: "string",
      label: "Link",
      description: "Link",
      optional: true,
    },
    userName: {
      type: "string",
      label: "User Name",
      description: "User name",
      optional: true,
    },
    securedValue: {
      type: "string",
      label: "Secured Value",
      description: "Secured value",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description",
      optional: true,
    },
  },
  async run ({ $ }) {
    const {
      company, ...data
    } = utils.extractProps(this);
    const resp = await this.app.createVaultEntry({
      $,
      companyId: company,
      data,
    });
    $.export("$summary", `The vault entry(ID: ${resp.id}) has been created successfully.`);
    return resp;
  },
};
