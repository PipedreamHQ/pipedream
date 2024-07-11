import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  name: "New Webhook Event (Instant)",
  version: "0.0.3",
  key: "toggl-new-webhook-event",
  description: "Emit new event on receive a webhook event. [See docs here](https://github.com/toggl/toggl_api_docs/blob/master/webhooks.md)",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    entity: {
      label: "Entity",
      description: "The entity you want to listen the events",
      type: "string",
      options: constants.WEBHOOK_ENTITIES,
    },
    action: {
      label: "Action",
      description: "The action you want to listen the events",
      type: "string",
      options: constants.WEBHOOK_ACTIONS,
    },
  },
  methods: {
    ...base.methods,
    _getAction() {
      return this.action;
    },
    _getEntity() {
      return this.entity;
    },
  },
};
