import mailjetApp from "../../mailjet.app.mjs";

export default {
  key: "mailjet-update-contact",
  name: "Update Contact",
  description: "Update the user-given name and exclusion status of a specific contact. [See the docs here](https://dev.mailjet.com/email/reference/contacts/contact/#v3_put_contact_contact_ID)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    mailjetApp,
    contactId: {
      propDefinition: [
        mailjetApp,
        "contactId",
      ],
    },
    name: {
      propDefinition: [
        mailjetApp,
        "name",
      ],
    },
    isExcludedFromCampaigns: {
      propDefinition: [
        mailjetApp,
        "isExcludedFromCampaigns",
      ],
    },
  },
  async run({ $ }) {
    try {
      const { body: { Data: contacts } } =
        await this.mailjetApp.updateContact({
          contactId: this.contactId,
          data: {
            Name: this.name,
            IsExcludedFromCampaigns: this.isExcludedFromCampaigns,
          },
        });

      $.export("$summary", `Successfully updated contact with ID ${contacts[0]?.ID}`);

      return contacts[0];

    } catch (error) {
      throw error.response?.res?.statusMessage ?? error;
    }
  },
};
