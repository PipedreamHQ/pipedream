import postmark from "../../postmark.app.mjs";

export default {
  key: "postmark-create-domain",
  name: "Create Domain",
  description: "Create a new domain. [See the documentation](https://postmarkapp.com/developer/api/domains-api#create-domain)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    postmark,
    name: {
      type: "string",
      label: "Name",
      description: "Domain name",
    },
    returnPathDomain: {
      type: "string",
      label: "Return Path Domain",
      description: "A custom value for the Return-Path domain. It is an optional field, but it must be a subdomain of your From Email domain and must have a CNAME record that points to **pm.mtasv.net**. For more information about this field, please [read our support page](http://support.postmarkapp.com/article/910-adding-a-custom-return-path-domain).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.postmark.createDomain({
      $,
      data: {
        Name: this.name,
        ReturnPathDomain: this.returnPathDomain,
      },
    });

    $.export("$summary", `The new domain with ID: ${response.ID} was successfully created!`);
    return response;
  },
};
