import postmark from "../../postmark.app.mjs";

export default {
  key: "postmark-get-domain",
  name: "Get Domain",
  description: "Gets all the details for a specific domain. [See the documentation](https://postmarkapp.com/developer/api/domains-api#domain)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    postmark,
    domainId: {
      propDefinition: [
        postmark,
        "domainId",
      ],
      withLabel: true,
    },
  },
  async run({ $ }) {
    const response = await this.postmark.getDomain({
      $,
      domainId: this.domainId.value,
    });

    $.export("$summary", `Successfully fetched ${this.domainId.label}!`);
    return response;
  },
};
