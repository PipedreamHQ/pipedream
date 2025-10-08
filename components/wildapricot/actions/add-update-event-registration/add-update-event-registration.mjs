import wildapricot from "../../wildapricot.app.mjs";

export default {
  key: "wildapricot-add-update-event-registration",
  name: "Add or Update Event Registration",
  description: "Searches event registrations using a contact email. If a match is found, the registration details are updated. If not, a new registration is added to the event. [See the documentation](https://app.swaggerhub.com/apis-docs/WildApricot/wild-apricot_public_api/7.24.0#/Events.EventRegistrations/CreateEventRegistration)",
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
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email of the contact to search for event registrations",
    },
    eventId: {
      propDefinition: [
        wildapricot,
        "eventId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
    eventRegistrationTypeId: {
      propDefinition: [
        wildapricot,
        "eventRegistrationTypeId",
        (c) => ({
          accountId: c.accountId,
          eventId: c.eventId,
        }),
      ],
    },
    isCheckedIn: {
      type: "boolean",
      label: "Is Checked In",
      description: "Indicates if registrant is already checked in to the event",
      optional: true,
    },
    memo: {
      type: "string",
      label: "Memo",
      description: "Additional notes about this registration",
      optional: true,
    },
  },
  methods: {
    async getContactId($, email) {
      const contacts = await this.wildapricot.listContacts({
        $,
        accountId: this.accountId,
        params: {
          "SimpleQuery": email,
        },
      });
      if (!contacts?.length || !contacts[0].Id) {
        throw new Error(`Contact with email ${email} not found`);
      }
      return contacts[0].Id;
    },
  },
  async run({ $ }) {
    const contactId = await this.getContactId($, this.contactEmail);
    const eventRegistrations = await this.wildapricot.listEventRegistrations({
      $,
      accountId: this.accountId,
      params: {
        contactId,
        eventId: this.eventId,
      },
    });
    const data = {
      Event: {
        Id: this.eventId,
      },
      Contact: {
        Id: contactId,
      },
      RegistrationTypeId: this.eventRegistrationTypeId,
      IsCheckedIn: this.isCheckedIn,
      Memo: this.memo,
    };
    let response;
    if (!eventRegistrations?.length) {
      response = await this.wildapricot.createEventRegistration({
        $,
        accountId: this.accountId,
        data,
      });
    } else {
      const eventRegistrationId = eventRegistrations[0].Id;
      response = await this.wildapricot.updateEventRegistration({
        $,
        accountId: this.accountId,
        eventRegistrationId: eventRegistrationId,
        data: {
          ...data,
          Id: eventRegistrationId,
        },
      });
    }
    $.export("$summary", `Successfully ${eventRegistrations?.length
      ? "updated"
      : "created"} event registration with ID ${response.Id}`);
    return response;
  },
};
