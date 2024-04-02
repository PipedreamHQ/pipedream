import wildapricot from "../../wildapricot.app.mjs";

export default {
  key: "wildapricot-add-update-event-registration",
  name: "Add or Update Event Registration",
  description: "Searches event registrations using a contact email. If a match is found, the registration details are updated. If not, a new registration is added to the event.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    wildapricot,
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email of the contact to search for event registrations",
    },
    registrationId: {
      type: "string",
      label: "Registration ID",
      description: "The unique identifier for the registration",
      optional: true,
    },
    contactDetails: {
      type: "object",
      label: "Contact Details",
      description: "The details of the contact or member",
    },
  },
  async run({ $ }) {
    const response = await this.wildapricot.searchAndUpdateEventRegistration({
      contactEmail: this.contactEmail,
      registrationId: this.registrationId,
      contactDetails: this.contactDetails,
    });
    $.export("$summary", `Successfully ${response.data
      ? "updated"
      : "added"} event registration`);
    return response;
  },
};
