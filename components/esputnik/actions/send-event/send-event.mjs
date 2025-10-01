import esputnik from "../../esputnik.app.mjs";

export default {
  key: "esputnik-send-event",
  name: "Send Event",
  description: "Send an event in eSputnik. [See the docs here](https://esputnik.com/api/methods.html#/v1/event-POST)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    esputnik,
    eventTypeKey: {
      type: "string",
      label: "Event Type Key",
      description: "Event type ID. If the event type does not exist, it will be created.",
    },
    keyValue: {
      type: "string",
      label: "Key Value",
      description: "Event key. Determines its uniqueness. Should contain unique value for every contact (for example: email, phone number, external contact id, etc).",
    },
    params: {
      type: "object",
      label: "Params",
      description: "List of event parameters as array of \"key\" - \"value\" pairs. Parameter keys are arbitrary. Used in campaigns and for dynamic content creation in messages.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = [];
    if (this.params) {
      for (const [
        key,
        value,
      ] of Object.entries(this.params)) {
        params.push({
          name: key,
          value,
        });
      }
    }
    const data = {
      eventTypeKey: this.eventTypeKey,
      keyValue: this.keyValue,
      params,
    };
    await this.esputnik.sendEvent({
      data,
      $,
    });
    $.export("$summary", `Successfully sent event ${this.eventTypeKey}`);
    // nothing to return
  },
};
