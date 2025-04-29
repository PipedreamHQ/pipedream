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
    parseEmail(emailStr) {
      if (!emailStr) {
        return undefined;
      }

      const regex = /^(.*)<(.+)>$/;
      const match = emailStr.match(regex);

      if (match) {
        return {
          name: match[1].trim(),
          email: match[2].trim(),
        };
      }
      return {
        name: null,
        email: emailStr.trim(),
      };
    },
    getHeaderValue(headers, key) {
      return headers.find(({ name }) => name.toLowerCase() === key)?.value;
    },
    processEmail(msg) {
      // Process and structure the email data
      const headers = msg.payload.headers;
      return {
        "id": msg.id,
        "threadId": msg.threadId,
        "subject": this.getHeaderValue(headers, "subject"),
        "from": this.parseEmail(this.getHeaderValue(headers, "from")),
        "to": this.parseEmail(this.getHeaderValue(headers, "to")),
        "reply-to": this.parseEmail(this.getHeaderValue(headers, "reply-to")),
        "date": this.getHeaderValue(headers, "date"),
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
