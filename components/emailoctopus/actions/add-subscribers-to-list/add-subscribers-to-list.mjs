import app from "../../emailoctopus.app.mjs";

export default {
  key: "emailoctopus-add-subscribers-to-list",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Add Subscribers To List",
  description: "Add subscribers to a list, [See the docs here](https://emailoctopus.com/api-documentation/lists/create-contact)",
  props: {
    app,
    listId: {
      propDefinition: [
        app,
        "listId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact.",
    },
    fields: {
      type: "object",
      label: "Fields",
      description: "An object containing key/value pairs of field values, using the field's tag as the key. For example: `{\"FirstName\": \"John\", \"LastName\": \"Doe\"}`",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "An array of tags to add to the contact.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The initial status of the contact. If omitted, the value will default to `PENDING` for lists with double opt-in enabled, or `SUBSCRIBED` for lists without.",
      optional: true,
      options: [
        "SUBSCRIBED",
        "UNSUBSCRIBED",
        "PENDING",
      ],
    },
  },
  async run ({ $ }) {
    const resp = await this.app.addContactToList({
      $,
      listId: this.listId,
      data: {
        email_address: this.email,
        fields: this.fields,
        tags: this.tags,
        status: this.status,
      },
    });
    $.export("$summary", `Contact(ID:${resp.id}) has been added to list successfully.`);
    return resp;
  },
};
