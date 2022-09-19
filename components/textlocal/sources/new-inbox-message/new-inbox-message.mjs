import textlocal from "../../textlocal.app.mjs";
import common from "../common/timer-based.mjs";

export default {
  ...common,
  key: "textlocal-new-inbox-message",
  name: "New Inbox Message",
  description: "Emit new inbox message.",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    inboxId: {
      propDefinition: [
        textlocal,
        "inboxId",
      ],
    },
  },
  methods: {
    ...common.methods,
    generateMeta(message) {
      const {
        id,
        datetime,
        number,
        sender,
      } = message;
      const maskedNumber = this.getMaskedNumber(number);
      const summary = `New message from ${sender} to ${maskedNumber}`;
      const ts = Date.parse(datetime);
      return {
        id,
        summary,
        ts,
      };
    },
    async processEvent() {
      const params = {
        inbox_id: this.inboxId,
      };
      const inboxMessages = await this.textlocal.paginate({
        fn: this.textlocal.getInboxMessages,
        params,
      });

      const messages = [];
      for await (const inboxMessage of inboxMessages) {
        messages.push(inboxMessage);
      }

      messages.forEach((message) => {
        const meta = this.generateMeta(message);
        this.$emit(message, meta);
      });
    },
  },
};
