import app from "../../z_api.app.mjs";

export default {
  key: "z_api-get-contacts",
  name: "Get Contacts",
  description: "Get a list of all your WhatsApp contacts. [See the documentation](https://developer.z-api.io/en/contacts/get-contacts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    pageNum: {
      propDefinition: [
        app,
        "pageNum",
      ],
    },
    pageSize: {
      propDefinition: [
        app,
        "pageSize",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getContacts({
      $,
      params: {
        page: this.pageNum,
        pageSize: this.pageSize,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.length} contacts`);
    return response;
  },
};
