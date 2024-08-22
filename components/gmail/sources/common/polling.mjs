import gmail from "../../gmail.app.mjs";
import constants from "../../common/constants.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    gmail,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    q: {
      propDefinition: [
        gmail,
        "q",
      ],
    },
    labels: {
      propDefinition: [
        gmail,
        "label",
      ],
      type: "string[]",
      label: "Labels",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(constants.HISTORICAL_EVENTS);
    },
  },
  methods: {
    getLastDate() {
      return this.db.get("lastDate");
    },
    setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    constructQuery(lastDate) {
      const { q: query } = this;
      const after = !query.includes("after:") && lastDate
        ? `after:${lastDate / 1000}`
        : "";
      return [
        after,
        query,
      ].join(" ").trim();
    },
    isValidType(data) {
      return typeof(data) === "string"
        || data instanceof Buffer
        || ArrayBuffer.isView(data);
    },
    decodeContent(message) {
      const MULTIPART_MIME_TYPE = "multipart";
      const {
        payload: {
          mimeType, body, parts,
        },
      } = message;

      if (!mimeType.startsWith(MULTIPART_MIME_TYPE)) {
        return !this.isValidType(body?.data)
          ? message
          : {
            ...message,
            decodedContent: Buffer.from(body.data, "base64").toString(),
          };
      }

      const [
        firstPart,
      ] = parts;

      return !this.isValidType(firstPart?.body?.data)
        ? message
        : {
          ...message,
          decodedContent: Buffer.from(firstPart.body.data, "base64").toString(),
        };
    },
    async processEvent(max) {
      const {
        gmail,
        constructQuery,
        labels,
      } = this;

      const lastDate = this.getLastDate() || 0;

      console.log("Polling for new messages...");
      const { messages } = await gmail.listMessages({
        q: constructQuery(lastDate),
        labelIds: labels,
        maxResults: max,
      });

      let messageIds = messages?.map((message) => message.id);

      if (!messageIds?.length) {
        console.log("There are no new messages. Exiting...");
        return;
      }

      await this.processMessageIds(messageIds.reverse(), lastDate);
    },
    async processMessageIds(messageIds, lastDate) {
      let maxDate = lastDate;
      const messages = this.gmail.getAllMessages(messageIds);
      for await (const message of messages) {
        if (message.internalDate >= lastDate) {
          this.emitEvent(message);
          maxDate = Math.max(maxDate, message.internalDate);
        }
      }
      if (maxDate) this.setLastDate(maxDate);
    },
  },
  async run() {
    await this.processEvent(constants.DEFAULT_LIMIT);
  },
};
