import common from "../common/common.mjs";

export default {
  ...common,
  key: "calendly_v2-invitee-created",
  name: "New Invitee Created",
  description: "Emit new event when a new event is scheduled.",
  version: "0.0.6",
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
        "invitee.created",
      ];
    },
    getScope() {
      return this.scope;
    },
    generateMeta(body) {
      return {
        id: `${body.event}-${body.payload.created_at}`,
        summary: `${body.payload.name} - ${body.event}`,
        ts: Date.now(),
      };
    },
  },
};
