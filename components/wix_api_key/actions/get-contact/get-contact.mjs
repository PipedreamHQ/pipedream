import wix from "../../wix_api_key.app.mjs";

export default {
  key: "wix_api_key-get-contact",
  name: "Get Contact",
  description: "Retrieves information about a contact. [See the documentation](https://dev.wix.com/api/rest/contacts/contacts/contacts-v4/get-contact)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    wix,
    site: {
      propDefinition: [
        wix,
        "site",
      ],
    },
    contact: {
      propDefinition: [
        wix,
        "contact",
        (c) => ({
          siteId: c.site,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wix.getContact({
      siteId: this.site,
      contactId: this.contact,
      $,
    });

    if (response) {
      $.export("$summary", "Successfully retrieved contact");
    }

    return response;
  },
};
