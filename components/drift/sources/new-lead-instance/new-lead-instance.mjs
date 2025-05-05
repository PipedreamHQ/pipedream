import drift from "../../drift.app.mjs";

export default {
  key: "drift-new-lead-instance",
  name: "New Lead",
  description: "Emit new event when a contact adds their email in chat.  [See the docs](https://devdocs.drift.com/docs/webhook-events-1).",
  version: "0.0.1",
  type: "source",
  props: {
    drift,
    http: "$.interface.http",
  },
  async run(event) {

    const { body } = event;

    if (body?.type !== "contact_identified") {
      console.log("Ignored non-contact_identified event:", body?.type);
      return;
    }

    const contactId = body.data.endUserId;

    const result = await this.drift.getContactById({
      contactId,
    });

    const email = result.data.attributes.email;

    body.data.attributes =  result.data.attributes; //inject more data

    this.$emit(body, {
      summary: `Contact "${email}" ID "${contactId}"`,
      id: body.data.endUserId,
      ts: body.timeStamp,
    });
  },
};
