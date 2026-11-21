import faxtofax from "../../faxtofax.app.mjs";

export default {
  key: "faxtofax-get-fax-status",
  name: "Get Fax Status",
  description: "Check whether a fax was delivered. [See the documentation](https://faxtofax.com/integrations/mcp)",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: false, openWorldHint: true, readOnlyHint: true },
  props: {
    faxtofax,
    faxId: { propDefinition: [faxtofax, "faxId"] },
  },
  async run({ $ }) {
    const response = await this.faxtofax.getFax({
      $,
      faxId: this.faxId,
    });
    $.export("$summary", `Fax ${this.faxId} is ${response.status}`);
    return response;
  },
};
