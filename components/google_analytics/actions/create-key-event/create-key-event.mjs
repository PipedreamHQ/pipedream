import app from "../../google_analytics.app.mjs";

export default {
  key: "google_analytics-create-key-event",
  name: "Create Key Event",
  description: "Creates a new key event. [See the documentation](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1beta/properties.keyEvents/create)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    parent: {
      type: "string",
      label: "Parent",
      description: "The resource name of the parent property where this Key Event will be created. Format: `properties/123`",
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "Immutable. The event name for this key event. Examples: `click`, `purchase`",
    },
    countingMethod: {
      type: "string",
      label: "Counting Method",
      description: "The method by which Key Events will be counted across multiple events within a session.",
      options: [
        {
          label: "Counting method not specified.",
          value: "COUNTING_METHOD_UNSPECIFIED",
        },
        {
          label: "Each Event instance is considered a Key Event.",
          value: "ONCE_PER_EVENT",
        },
        {
          label: "An Event instance is considered a Key Event at most once per session per user.",
          value: "ONCE_PER_SESSION",
        },
      ],
    },
  },
  methods: {
    createKeyEvent({
      parent, ...args
    } = {}) {
      return this.app.post({
        path: `/${parent}/keyEvents`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createKeyEvent,
      parent,
      eventName,
      countingMethod,
    } = this;

    const response = await createKeyEvent({
      $,
      parent,
      data: {
        eventName,
        countingMethod,
      },
    });

    $.export("$summary", `Successfully created key event with name ${eventName} and counting method ${countingMethod} in parent ${parent}`);
    return response;
  },
};
