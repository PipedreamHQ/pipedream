import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-get-company",
  name: "Get Company",
  description: "Retrieve a single company (account) from Nutshell. [See the documentation](https://developers.nutshell.com/reference/e011fe1a74d2ca75e6294040b98423f1)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nutshell,
    companyId: {
      propDefinition: [
        nutshell,
        "companyId",
      ],
    },
  },
  async run({ $ }) {
    const company = await this.nutshell.getAccount({
      $,
      companyId: this.companyId,
    });

    $.export("$summary", `Successfully retrieved company "${company?.name ?? this.companyId}"`);
    return this.nutshell.formatCompany(company);
  },
};
