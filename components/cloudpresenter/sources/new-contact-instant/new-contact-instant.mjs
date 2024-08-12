import cloudpresenter from "../../cloudpresenter.app.mjs";

export default {
  key: "cloudpresenter-new-contact-instant",
  name: "New Contact Instant",
  description: "Emit new event when a user adds a new contact in cloudpresenter. No necessary props to configure for this trigger.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    cloudpresenter,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      // Code to create a webhook subscription could go here
    },
    async deactivate() {
      // Code to remove a webhook subscription could go here
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (headers["Content-Type"] !== "application/json") {
      return this.http.respond({
        status: 400,
        body: "Expected application/json",
      });
    }

    if (!body || !body.newContactDetails) {
      return this.http.respond({
        status: 400,
        body: "Missing contact details in payload",
      });
    }

    const contact = body.newContactDetails;

    this.$emit(contact, {
      id: contact.contactId,
      summary: `New contact: ${contact.name}`,
      ts: +new Date(contact.created_at),
    });

    this.http.respond({
      status: 200,
    });
  },
};
