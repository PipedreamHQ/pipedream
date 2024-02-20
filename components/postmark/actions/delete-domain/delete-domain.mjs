import postmark from "../../postmark.app.mjs";

export default {
  key: "postmark-delete-domain",
  name: "Delete Domain",
  description: "Delete a specific domain. [See the documentation](https://postmarkapp.com/developer/api/domains-api#delete-domain)",
  version: "0.0.1",
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
    const response = await this.postmark.deleteDomain({
      $,
      domainId: this.domainId.value,
    });

    $.export("$summary", `Domain ${this.domainId.label} was successfully deleted!`);
    return response;
  },
};
