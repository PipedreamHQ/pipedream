import mailjetApp from "../../mailjet.app.mjs";

export default {
  key: "mailjet-create-contact",
  name: "Create Contact",
  description: "Add a new unique contact to your global contact list and select its exclusion status. [See the docs here](https://dev.mailjet.com/email/reference/contacts/contact/#v3_post_contact)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    mailjetApp,
    email: {
      type: "string",
      label: "Email",
      description: "Contact email address. Must be unique (not present already in the global contact list).",
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
        await this.mailjetApp.createContact({
          data: {
            Email: this.email,
            Name: this.name,
            IsExcludedFromCampaigns: this.isExcludedFromCampaigns,
          },
        });

      $.export("$summary", `Successfully created contact with ID ${contacts[0]?.ID}`);

      return contacts[0];

    } catch (error) {
      throw error.response?.res?.statusMessage ?? error;
    }
  },
};
