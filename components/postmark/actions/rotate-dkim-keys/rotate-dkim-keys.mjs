import postmark from "../../postmark.app.mjs";

export default {
  key: "postmark-rotate-dkim-keys",
  name: "Rotate DKIM Keys",
  description: "Creates a new DKIM key to replace your current key. Until the new DNS entries are confirmed, the pending values will be in DKIMPendingHost and DKIMPendingTextValue fields. After the new DKIM value is verified in DNS, the pending values will migrate to DKIMTextValue and DKIMPendingTextValue and Postmark will begin to sign emails with the new DKIM key. [See the documentation](https://postmarkapp.com/developer/api/domains-api#rotate-dkim)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = this.postmark.rotateDKIM({
      $,
      domainId: this.domainId.value,
    });

    $.export("$summary", `DKIM keys for domain ${this.domainId.label} were successfully rotated!`);
    return response;
  },
};
