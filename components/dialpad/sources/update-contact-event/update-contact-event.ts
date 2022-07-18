import { defineSource } from "@pipedream/types";
import dialpad from "../../app/dialpad.app";
import constants from "../../common/constants";
import common from "../../common/common";

export default defineSource({
  ...common,
  type: "source",
  name: "Update Contact Event (Instant)",
  key: "dialpad-update-contact-event",
  description: `Emit update contact event subscription. 
  See [Event doc](https://developers.dialpad.com/reference/webhook_contact_event_subscriptionupdate)
  and [webhook doc](https://developers.dialpad.com/reference/webhookscreate)`,
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    contactId: {
      type: "string",
      label: "Contact subscription ID",
      description: "The event subscription's ID, which is generated after creating an event subscription successfully.",
    },
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
      return `${constants.EVENT_TYPE.UPDATE_CONTACT.path}/${this.contactId}`;
    },
    getPayload() {
      return {
        contact_type: this.contactType,
      };
    },
    processEvent(event) {
      const { body } = event;
      this.$emit(body, {
        id: `${body.contact.id}_${new Date().getTime()}`,
        summary: `Update Contact event - ${body.contact.id}`,
        ts: Date.now(),
      });
    },
  },
});
