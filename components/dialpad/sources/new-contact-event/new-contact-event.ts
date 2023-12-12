import { defineSource } from "@pipedream/types";
import dialpad from "../../app/dialpad.app";
import constants from "../../common/constants";
import common from "../../common/common";

export default defineSource({
  ...common,
  type: "source",
  name: "New Contact Event (Instant)",
  key: "dialpad-new-contact-event",
  description: `Emit new contact event subscription. 
  See [Event doc](https://developers.dialpad.com/reference/webhook_contact_event_subscriptioncreate)
  and [webhook doc](https://developers.dialpad.com/reference/webhookscreate)`,
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    contactType: {
      propDefinition: [
        dialpad,
        "contactType",
      ],
    },
  },
  methods: {
    ...common.methods,
    getPath() {
      return constants.EVENT_TYPE.UPDATE_CONTACT.path;
    },
    getPayload() {
      return {
        contact_type: this.contactType,
      };
    },
    processEvent(event) {
      const { body } = event;
      this.$emit(body, {
        id: body.contact.id,
        summary: `New Contact event - ${body.contact.id}`,
        ts: Date.now(),
      });
    },
  },
});
