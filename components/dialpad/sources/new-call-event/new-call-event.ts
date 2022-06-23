import { defineSource } from "@pipedream/types";
import dialpad from "../../app/dialpad.app";
import constants from "../../common/constants";
import common from "../../common/common";

export default defineSource({
  ...common,
  type: "source",
  name: "New Call Event (Instant)",
  key: "dialpad-new-call-event",
  description: `Emit new call event subscription. 
  See [Event doc](https://developers.dialpad.com/reference/webhook_call_event_subscriptioncreate)
  and [webhook doc](https://developers.dialpad.com/reference/webhookscreate)`,
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    contactType: {
      propDefinition: [
        dialpad,
        "callStates",
      ],
    },
  },
  methods: {
    ...common.methods,
    getPath() {
      return constants.EVENT_TYPE.NEW_CALL.path;
    },
    getPayload() {
      return {
        call_states: this.callStates,
      };
    },
    processEvent(event) {
      const { body } = event;
      this.$emit(body, {
        id: body.call_id,
        summary: `New call event - ${body.call_id}`,
        ts: Date.now(),
      });
    },
  },
});
