import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-company-sizes",
  name: "Get Company Sizes",
  description: "Get available company size codes for filtering. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/company-size/company-size)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
  },
  async run({ $ }) {
    const response = await this.pubrio.getCompanySizes({
      $,
    });
    $.export("$summary", "Successfully retrieved company sizes");
    return response;
  },
};
