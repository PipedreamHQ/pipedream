import common from "../common/webhook.mjs";

export default {
  ...common,
  name: "New Event (Instant)",
  key: "procore-new-event-instant",
  description: "Emit new event depending on the resource name selected. [See the documentation](https://developers.procore.com/reference/rest/hooks?version=latest).",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    resourceName: {
      propDefinition: [
        common.props.app,
        "resourceName",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceName() {
      return this.resourceName;
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: `New Event: ${body.event_type}`,
        ts: new Date(body.timestamp).getTime(),
      };
    },
  },
};
