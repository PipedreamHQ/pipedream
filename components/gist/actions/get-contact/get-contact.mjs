import gist from "../../gist.app.mjs";

export default {
  ...gist,
  key: "gist-get-contact",
  name: "Get Contact",
  description: "Find a Contact",
  type: "action",
  version: "0.0.1",
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
