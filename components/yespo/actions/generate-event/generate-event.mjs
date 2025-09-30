import yespo from "../../yespo.app.mjs";

export default {
  key: "yespo-generate-event",
  name: "Generate Event",
  description: "Sends an event to the specified user. [See the documentation](https://docs.yespo.io/reference/registerevent-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    yespo,
    eventTypeKey: {
      type: "string",
      label: "Event Type Key",
      description: "Event type ID key. If no such event type exists with such a key, a new one is created. All characters are allowed except < ;' \\ / | \" ` ' ^ ? ! , >",
    },
    keyValue: {
      type: "string",
      label: "Key Value",
      description: "Event key. Determines event uniqueness. The key must contain a unique value for each contact (for example, email, phone number, external contact id, etc.)",
      optional: true,
    },
    params: {
      type: "object",
      label: "Params",
      description: "event parameters represented as an object of \"key\" - \"value\" pairs. The parameter keys are arbitrary.",
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

    const response = await this.yespo.registerEvent({
      $,
      data: {
        eventTypeKey: this.eventTypeKey,
        keyValue: this.keyValue,
        params,
      },
    });

    $.export("$summary", `Successfully generated event with type key: ${this.eventTypeKey}`);
    return response;
  },
};
