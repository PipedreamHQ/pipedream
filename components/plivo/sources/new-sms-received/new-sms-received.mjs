import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";
import { v4 as uuid } from "uuid";

export default {
  ...common,
  key: "plivo-new-sms-received",
  name: "New SMS Received (Instant)",
  description: "Emit new event when a new SMS is received. [See the docs](https://www.plivo.com/docs/sms/api/message#send-a-message).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    phoneNumber: {
      propDefinition: [
        common.props.app,
        "phoneNumber",
      ],
    },
  },
  methods: {
    ...common.methods,
    listMessages(args = []) {
      return this.app.makeRequest({
        path: "messages.list",
        args,
      });
    },
    getResourcesFn() {
      return this.listMessages;
    },
    getResourcesFnArgs() {
      const messageTime = this.getLastMessageTime();
      return messageTime
        ? {
          limit: constants.DEFAULT_LIMIT,
          message_time__gt: messageTime,
        }
        : {
          limit: constants.DEFAULT_LIMIT,
        };
    },
    getPhoneNumber() {
      return this.phoneNumber;
    },
    generateMeta(resource) {
      if (resource.messageUuid) {
        return {
          id: resource.messageUuid,
          ts: Date.parse(resource.messageTime),
          summary: `History SMS received from ${resource.fromNumber}`,
        };
      }
      return {
        id: resource.MessageUUID,
        ts: Date.now(),
        summary: `New SMS received from ${resource.From}`,
      };
    },
    isResourceRelevant(resource) {
      return resource.messageDirection === constants.RESOURCE.MSG.DIRECTION.INBOUND
        && resource.messageState === constants.RESOURCE.MSG.STATUS.DELIVERED
        && resource.messageType === constants.RESOURCE.MSG.TYPE.SMS;
    },
    getApplicationName() {
      return `PipedreamInboundSMS${uuid()}`;
    },
  },
};
