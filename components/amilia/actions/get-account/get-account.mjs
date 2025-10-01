import amilia from "../../amilia.app.mjs";

export default {
  key: "amilia-get-account",
  name: "Get Account",
  description: "Get an (client) account in your organization. [See the docs here](https://www.amilia.com/ApiDocs/v3org#GetAnAccount)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    amilia,
    account: {
      propDefinition: [
        amilia,
        "account",
      ],
    },
    showMedicalInfo: {
      type: "boolean",
      label: "Show Medical Info?",
      description: "Option to also show the persons' medical information.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.amilia.getAccount({
      $,
      account: this.account,
      params: {
        showMedicalInfo: this.showMedicalInfo,
      },
    });
    $.export("$summary", `Succesfully retrieved account for ${this.amilia.getAccountName(response)}`);
    return response;
  },
};
