import app from "../../campaignhq.app.mjs";

export default {
  name: "Create Contact",
  description: "Create Contact [See the documentation](https://campaignhq.docs.apiary.io/#reference/0/contacts-collection/create-a-new-contact).",
  key: "campaignhq-create-contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
      description: "Email of the contact",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the contact. Ex: `Mr`, `Mrs`, `Dr`, `Prof`",
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company of the contact",
    },
    designation: {
      type: "string",
      label: "Designation",
      description: "Designation of the contact",
    },
    subscribed: {
      type: "boolean",
      label: "Subscribed",
      description: "Whether the contact is subscribed to the list",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      email: this.email,
      first_name: this.firstName,
      last_name: this.lastName,
      title: this.title,
      company: this.company,
      designation: this.designation,
      subscribed: this.subscribed,
    };
    const res = await this.app.createContact(this.listId, data);
    $.export("summary", `Contact successfully created with id "${res.id}".`);
    return res;
  },
};
