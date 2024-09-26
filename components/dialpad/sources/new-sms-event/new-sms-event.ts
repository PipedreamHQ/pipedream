import { defineSource } from "@pipedream/types";
import dialpad from "../../app/dialpad.app";
import constants from "../../common/constants";
import common from "../../common/common";

export default defineSource({
  ...common,
  type: "source",
  name: "New SMS Event (Instant)",
  key: "dialpad-new-sms-event",
  description: `Emit new SMS event subscription. 
  See [Event doc](https://developers.dialpad.com/reference/webhook_sms_event_subscriptioncreate)
  and [webhook doc](https://developers.dialpad.com/reference/webhookscreate)`,
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    direction: {
      type: "string",
      label: "Direction",
      description: "The SMS direction this event subscription subscribes to.",
      options: constants.SMS_EVENT_DIRECTIONS,
    },
  },
  methods: {
    ...common.methods,
    getPath() {
      return constants.EVENT_TYPE.NEW_SMS.path;
    },
    getPayload() {
      return {
        direction: this.direction,
      };
    },
    processEvent(event) {
      const { body } = event;
      this.$emit(body, {
        id: body.id,
        summary: `New SMS event - ${body.id}`,
        ts: Date.now(),
      });
    },
  },
});
