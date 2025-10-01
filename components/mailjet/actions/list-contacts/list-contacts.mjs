import mailjetApp from "../../mailjet.app.mjs";

export default {
  key: "mailjet-list-contacts",
  name: "List Contacts",
  description: "Retrieve details for all contact lists - name, subscriber count, creation timestamp, deletion status. [See the docs here](https://dev.mailjet.com/email/reference/contacts/contact-list/#v3_get_contactslist)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mailjetApp,
    limit: {
      type: "integer",
      label: "Limit",
      description: "Limit the response to a select number of returned objects.",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Retrieve a list of objects starting from a certain offset. Combine this query parameter with Limit to retrieve a specific section of the list of objects.",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Max",
      description: "Maximum number of objects to return.",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const contacts = [];

      const resourcesStream =
        await this.mailjetApp.getResourcesStream({
          resourceFn: this.mailjetApp.listContacts,
          resourceFnArgs: {
            params: {
              Limit: this.limit,
              Offset: this.offset,
            },
          },
          max: this.max,
        });

      for await (const contact of resourcesStream) {
        contacts.push(contact);
      }

      $.export("$summary", `Successfully retrieved ${contacts.length} contacts.`);

      return contacts;

    } catch (error) {
      throw error.response?.res?.statusMessage ?? error;
    }
  },
};
