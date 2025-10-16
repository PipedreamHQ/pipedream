import app from "../../engage.app.mjs";

export default {
  key: "engage-add-event",
  name: "Add Event",
  description: "Adds user events to Engage. [See the documentation](https://docs.engage.so/en-us/a/62bbdd015bfea4dca4834042-users#track-user-event)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    uid: {
      propDefinition: [
        app,
        "uid",
      ],
    },
    event: {
      propDefinition: [
        app,
        "event",
      ],
    },
    value: {
      propDefinition: [
        app,
        "value",
      ],
    },
    timestamp: {
      propDefinition: [
        app,
        "timestamp",
      ],
    },
    properties: {
      propDefinition: [
        app,
        "properties",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.addEvent({
      $,
      uid: this.uid,
      data: {
        event: this.event,
        value: this.value,
        timestamp: this.timestamp,
        properties: this.properties,
      },
    });
    $.export("$summary", `Successfully added event. Status: ${response.status}`);
    return response;
  },
};
