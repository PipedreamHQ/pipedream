import common from "./base.mjs";
import constants from "../../common/constants.mjs";
import { v4 as uuidv4 } from "uuid";

export default {
  ...common,
  props: {
    ...common.props,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    recipient: {
      propDefinition: [
        common.props.app,
        "recipient",
      ],
    },
    text: {
      propDefinition: [
        common.props.app,
        "text",
      ],
    },
    senderName: {
      optional: true,
      propDefinition: [
        common.props.app,
        "senderName",
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        app,
        http,
        recipient,
        text,
        senderName,
      } = this;

      const authHeader = uuidv4();

      await app.sendMessage({
        data: {
          recipient,
          text,
          sender_name: senderName,
          status_callback: http.endpoint,
          status_callback_header: authHeader,
        },
      });

      this.setAuthHeader(authHeader);
    },
  },
  methods: {
    ...common.methods,
    setAuthHeader(value) {
      this.db.set(constants.AUTH_HEADER, value);
    },
    getAuthHeader() {
      return this.db.get(constants.AUTH_HEADER);
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
  },
  async run({
    headers, body,
  }) {
    if (headers.authorization !== this.getAuthHeader()) {
      console.error("Invalid authorization header");
      return;
    }

    this.http.respond({
      status: 200,
    });

    this.processResource(body);
  },
};
