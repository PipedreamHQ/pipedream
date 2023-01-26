import app from "../../quentn.app.mjs";

export default {
  key: "quentn-campaign-contact-sent",
  name: "New Campaign Contact Sent",
  description: "Emit new event when a campaign contact is sent. You should set up a webhook in the Quentn UI workflow builder to send a POST request to this source by drag and drop the `API Send` element.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
    http: "$.interface.http",
  },
  async run({ body: resource }) {
    this.$emit(resource, {
      id: resource.hash,
      summary: `Campaign contact sent for ${resource.email}`,
      ts: Date.now(),
    });
  },
};
