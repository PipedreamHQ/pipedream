import mautic from "../../mautic.app.mjs";

export default {
  key: "mautic-delete-company",
  name: "Delete Company",
  description: "Deletes a company. [See docs](https://developer.mautic.org/#delete-company)",
  version: "0.2.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mautic,
    companyId: {
      propDefinition: [
        mautic,
        "companyId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mautic.deleteCompany({
      $,
      companyId: this.companyId.value,
    });
    $.export("$summary", "Successfully deleted company");
    return response;
  },
};
