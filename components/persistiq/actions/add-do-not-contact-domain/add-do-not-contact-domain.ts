import { defineAction } from "@pipedream/types";
import app from "../../app/persistiq.app";

export default defineAction({
  key: "persistiq-add-do-not-contact-domain",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Add Do Not Contact Domain",
  description: "Creates a new DNC domain. [See docs here](https://apidocs.persistiq.com/#create-dnc-domain)",
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Do Not Contact domain name",
    },
  },
  async run({ $ }) {
    const response = await this.app.addDoNotContactDomain({
      $,
      data: {
        name: this.name,
      },
    });
    $.export("$summary", `Successfully created a DNC domain (ID: ${response?.dnc_domain?.id})`);
    return response;
  },
});
