import wildapricot from "../../wildapricot.app.mjs";

export default {
  key: "wildapricot-delete-event-registration",
  name: "Delete Event Registration",
  description: "Removes an event registration from the user's WildApricot database. The registration identifier is a required prop for this action.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    wildapricot,
    registrationId: {
      type: "string",
      label: "Registration ID",
      description: "The unique identifier for the registration",
    },
  },
  async run({ $ }) {
    const response = await this.wildapricot.removeEventRegistration({
      registrationId: this.registrationId,
    });
    $.export("$summary", `Successfully deleted registration with ID: ${this.registrationId}`);
    return response;
  },
};
