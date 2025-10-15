import wildapricot from "../../wildapricot.app.mjs";

export default {
  key: "wildapricot-delete-event-registration",
  name: "Delete Event Registration",
  description: "Removes an event registration from the user's WildApricot database. [See the documentation](https://app.swaggerhub.com/apis-docs/WildApricot/wild-apricot_public_api/7.24.0#/Events.EventRegistrations/DeleteEventRegistration)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wildapricot,
    accountId: {
      propDefinition: [
        wildapricot,
        "accountId",
      ],
    },
    contactId: {
      propDefinition: [
        wildapricot,
        "contactId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
      optional: true,
    },
    eventId: {
      propDefinition: [
        wildapricot,
        "eventId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
      optional: true,
    },
    eventRegistrationId: {
      propDefinition: [
        wildapricot,
        "eventRegistrationId",
        (c) => ({
          accountId: c.accountId,
          contactId: c.contactId,
          eventId: c.eventId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wildapricot.deleteEventRegistration({
      $,
      accountId: this.accountId,
      eventRegistrationId: this.eventRegistrationId,
    });
    $.export("$summary", `Successfully deleted event registration with ID: ${this.eventRegistrationId}`);
    return response;
  },
};
