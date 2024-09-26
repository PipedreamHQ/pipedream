import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
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
    processEmail(msg) {
      // Process and structure the email data
      const headers = msg.payload.headers;
      return {
        "id": msg.id,
        "threadId": msg.threadId,
        "subject": headers.find((h) => h.name.toLowerCase() === "subject")?.value,
        "from": headers.find((h) => h.name.toLowerCase() === "from")?.value,
        "to": headers.find((h) => h.name.toLowerCase() === "to")?.value,
        "reply-to": headers.find((h) => h.name.toLowerCase() === "reply-to")?.value,
        "date": headers.find((h) => h.name.toLowerCase() === "date")?.value,
        "snippet": msg.snippet,
      };
    },
    emitEvent(message) {
      message = {
        ...message,
        parsedHeaders: this.processEmail(message),
      };
      const meta = this.generateMeta(message);
      this.$emit(this.decodeContent(message), meta);
    },
  },
};
