import drift from "../../drift.app.mjs";

export default {
  key: "drift-new-contact-update",
  name: "New Contact Update",
  description: "Emit new event when a contact is updated in Drift. [See the docs](https://devdocs.drift.com/docs/webhook-events-1).",
  version: "0.0.1",
  type: "source",
  props: {
    drift,
    http: "$.interface.http",
  },
  async run(event) {

    const { body } = event;

    if (body?.type !== "contact_updated") {
      console.log("Ignored non-contact_updated event:", body?.type);
      return;
    }

    const contactId = body.data.endUserId;

    const result = await this.drift.getContactById({
      contactId,
    });

    const email = result.data?.attributes?.email || "unknown";

    body.data.attributes =  result.data.attributes;

    this.$emit(body, {
      summary: `Contact "${email}" ID "${contactId}" updated`,
      id: body.data.endUserId,
      ts: body.timeStamp,
    });
  },
};
