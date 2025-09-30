import qualetics from "../../qualetics.app.mjs";

export default {
  key: "qualetics-send-data",
  name: "Send Data",
  description: "Send an event with data to the system. [See the documentation](https://docs.qualetics.com/rest-api-integration-to-send-data)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    qualetics,
    actor: {
      type: "object",
      label: "Actor",
      description: "Actor data to send. Example: `{\"type\":\"User\",\"id\":\"js1234\"}`",
    },
    action: {
      type: "object",
      label: "Action",
      description: "Action data to send. Example: `{\"type\":\"ButtonClick\"}`",
    },
    context: {
      type: "object",
      label: "Context",
      description: "Context data to send. Example: `{\"type\":\"Button\",\"name\":\"Button1\"}`",
    },
  },
  methods: {
    parseObj(obj) {
      if (typeof obj === "string") {
        return JSON.parse(obj);
      }
      return obj;
    },
  },
  async run({ $ }) {
    const response = await this.qualetics.sendData({
      $,
      data: JSON.stringify({
        actor: this.parseObj(this.actor),
        action: this.parseObj(this.action),
        context: this.parseObj(this.context),
      }),
    });
    if (response?.Status === "Success") {
      $.export("$summary", "Successfully sent data.");
    }
    return response;
  },
};
