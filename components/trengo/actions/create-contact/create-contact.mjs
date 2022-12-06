import app from "../../trengo.app.mjs";

export default {
  type: "action",
  key: "trengo-create-contact",
  version: "0.0.1",
  name: "Create Contact",
  description: "Creates a contact. If a contact with given identifier already exists, returns it. [See the docs](https://developers.trengo.com/reference/create-update-a-user)",
  props: {
    app,
    channelId: {
      propDefinition: [
        app,
        "channelId",
      ],
    },
    contactIdentifier: {
      propDefinition: [
        app,
        "contactIdentifier",
      ],
    },
    contactName: {
      propDefinition: [
        app,
        "contactName",
      ],
    },
  },
  async run ({ $ }) {
    const resp = await this.app.createContact({
      $,
      channelId: this.channelId,
      data: {
        identifier: this.contactIdentifier,
        channel_id: this.channelId,
        name: this.contactName,
      },
    });
    $.export("$summary", `The contact has been created. (${resp.name} ID:${resp.id})`);
    return resp;
  },
};
