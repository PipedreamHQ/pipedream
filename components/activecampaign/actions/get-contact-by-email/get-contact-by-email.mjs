import activecampaign from "../../activecampaign.app.mjs";

export default {
  key: "activecampaign-get-contact-by-email",
  name: "Get contact by email",
  description: "Retrieves contact data from the ActiveCampaign CRM by email address. See the docs [here](https://developers.activecampaign.com/reference/list-all-contacts).",
  version: "0.3.0",
  type: "action",
  props: {
    activecampaign,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact you want to get.",
    },
  },
  async run({ $ }) {
    const { search } = this;
    const { contacts } = await this.activecampaign.listContacts({
      params: {
        search,
      },
    });

    if (contacts.length) {
      $.export("$summary", `Successfully got a contact with ID ${contacts[0].id}`);
    } else {
      $.export("$summary", "Contact not found with specified email");
    }

    return contacts[0];
  },
};
