import { defineSource } from "@pipedream/types";
import dialpad from "../../app/dialpad.app";
import constants from "../../common/constants";
import common from "../../common/common";

export default defineSource({
  ...common,
  type: "source",
  name: "New Contact Event",
  key: "dialpad-new-contact-event",
  description: `Emit new contact event subscription. 
  See [Event doc](https://developers.dialpad.com/reference/webhook_contact_event_subscriptioncreate)
  and [webhook doc](https://developers.dialpad.com/reference/webhookscreate)`,
  version: "0.0.1",
  props: {
    ...common.props,
    contactType: {
      type: "string",
      label: "Contact type",
      description: "The contact type this event subscription subscribes to.",
      options: constants.CONTACT_EVENT_TYPE,
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
        id: body.id,
        summary: `New Contact event - ${body.id}`,
      });
    },
  },
});
