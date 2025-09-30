import bilflo from "../../bilflo.app.mjs";

export default {
  key: "bilflo-create-client",
  name: "Create Client",
  description: "Creates a new client account in Bilflo. [See the documentation](https://developer.bilflo.com/documentation#operations-tag-Clients)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bilflo,
    businessName: {
      type: "string",
      label: "Business Name",
      description: "The name of the business for the new client account.",
    },
  },
  async run({ $ }) {
    const response = await this.bilflo.createClient({
      $,
      data: {
        businessName: this.businessName,
      },
    });
    $.export("$summary", `Successfully created new client account with Id: ${response.data.clientId}`);
    return response;
  },
};
