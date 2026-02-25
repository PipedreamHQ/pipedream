import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-get-company",
  name: "Get Company",
  description: "Get an account (company) by ID. [See the documentation](https://developers-rpc.nutshell.com/detail/class_core.html#a25045510b0896a45e561fafb9ec266bd)",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nutshell,
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The ID of the company (account) to retrieve.",
    },
  },
  async run({ $ }) {
    const company = await this.nutshell.getAccount({
      $,
      companyId: this.companyId,
    });

    if (!company) {
      throw new Error(`Company not found: ${this.companyId}`);
    }

    $.export("$summary", `Successfully retrieved company "${company?.name ?? this.companyId}"`);
    return this.nutshell.formatCompany(company);
  },
};
