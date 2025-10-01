import gist from "../../gist.app.mjs";

export default {
  key: "gist-get-contact",
  name: "Get Contact",
  description: "Find a Contact [See docs](https://developers.getgist.com/api/#add-a-tag-to-contacts)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gist,
    contactId: {
      propDefinition: [
        gist,
        "contactId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gist.getContact({
      $,
      contactId: this.contactId,
    });

    $.export("$summary", "Successfully retrieved contact");

    return response;
  },
};
