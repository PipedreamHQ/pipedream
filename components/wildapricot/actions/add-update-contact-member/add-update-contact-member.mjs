import wildapricot from "../../wildapricot.app.mjs";

export default {
  key: "wildapricot-add-update-contact-member",
  name: "Add or Update Contact or Member",
  description: "Adds or updates a contact or member details in the user's WildApricot database.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    wildapricot,
    contactDetails: {
      propDefinition: [
        wildapricot,
        "contactDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wildapricot.addOrUpdateContactOrMember({
      contactDetails: this.contactDetails,
    });
    $.export("$summary", `Successfully updated contact/member with ID ${response.Id}`);
    return response;
  },
};
