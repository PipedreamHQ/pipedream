import common from "../common/common.mjs";

export default {
  ...common,
  key: "calendly_v2-invitee-canceled",
  name: "New Invitee Canceled",
  description: "Emit new event when an event is canceled.",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    scope: {
      propDefinition: [
        common.props.app,
        "scope",
      ],
    },
  },
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "invitee.canceled",
      ];
    },
    getScope() {
      return this.scope;
    },
    generateMeta(body) {
      return {
        id: `${body.event}-${body.payload.uri}`,
        summary: `${body.payload.name} - ${body.event}`,
        ts: Date.now(),
      };
    },
  },
};
