import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-batch-create-or-update-contact",
  name: "Batch Create or Update Contact",
  description:
    "Create or update a batch of contacts by its ID or email. [See the documentation](https://developers.hubspot.com/docs/api/crm/contacts)",
  version: "0.0.23",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hubspot,
    contacts: {
      label: "Contacts Array",
      description:
        "Provide a **list of contacts** to be created or updated. If the provided contact has the prop ID or if the provided email already exists, this action will attempt to update it.\n\n**Expected format for create:** `{ \"company\": \"Biglytics\", \"email\": \"bcooper@biglytics.net\", \"firstname\": \"Bryan\", \"lastname\": \"Cooper\", \"phone\": \"(877) 929-0687\", \"website\": \"biglytics.net\" }` \n\n**Expected format for update:** `{ \"id\": \"101\", \"company\": \"Biglytics\", \"email\": \"bcooper@biglytics.net\", \"firstname\": \"Bryan\", \"lastname\": \"Cooper\", \"phone\": \"(877) 929-0687\", \"website\": \"biglytics.net\" }`",
      type: "string[]",
    },
  },
  methods: {
    parseContactArray(contacts) {
      if (typeof contacts === "string") {
        contacts = JSON.parse(contacts);
      } else if (
        Array.isArray(contacts) &&
        contacts.length > 0 &&
        typeof contacts[0] === "string"
      ) {
        contacts = contacts.map((contact) => JSON.parse(contact));
      }
      return contacts;
    },
    async searchExistingContactProperties(contacts, $) {
      const emails = contacts.map(({ email }) => email);
      const { results } = await this.hubspot.searchCRM({
        $,
        object: "contact",
        data: {
          filters: [
            {
              propertyName: "email",
              operator: "IN",
              values: emails,
            },
          ],
        },
      });
      const updateEmails = results?.map(({ properties }) => properties.email);
      const insertProperties = contacts
        .filter(({ email }) => !updateEmails.includes(email))
        .map((properties) => ({
          properties,
        }));
      const updateProperties = [];
      for (const contact of results) {
        updateProperties.push({
          id: contact.id,
          properties: contacts.find(
            ({ email }) => contact.properties.email === email,
          ),
        });
      }
      return {
        insertProperties,
        updateProperties,
      };
    },
  },
  async run({ $ }) {
    const contacts = this.parseContactArray(this.contacts);

    const {
      insertProperties, updateProperties,
    } =
      await this.searchExistingContactProperties(contacts, $);

    const updatePropertiesWithId = contacts
      .filter((contact) => Object.prototype.hasOwnProperty.call(contact, "id"))
      .map(({
        id, ...properties
      }) => ({
        id: id,
        properties,
      }));

    if (updatePropertiesWithId?.length) {
      updateProperties.push(...updatePropertiesWithId);
    }

    let response = {};
    response.created = await this.hubspot.batchCreateContacts({
      $,
      data: {
        inputs: insertProperties,
      },
    });
    response.updated = await this.hubspot.batchUpdateContacts({
      $,
      data: {
        inputs: updateProperties,
      },
    });

    $.export(
      "$summary",
      `Successfully created ${insertProperties.length} and updated ${updateProperties.length} contacts`,
    );

    return response;
  },
};
