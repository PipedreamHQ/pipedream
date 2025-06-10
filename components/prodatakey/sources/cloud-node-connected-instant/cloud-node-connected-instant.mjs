import prodatakey from "../../prodatakey.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "prodatakey-cloud-node-connected-instant",
  name: "Cloud Node Connected",
  description: "Emit a new event when a cloud node is connected to the ProdataKey system. [See the documentation](https://developer.pdk.io/web/2.0/rest/webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    prodatakey: {
      type: "app",
      app: "prodatakey",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    organizationId: {
      propDefinition: [
        prodatakey,
        "organizationId",
      ],
    },
    name: {
      propDefinition: [
        prodatakey,
        "name",
      ],
    },
    url: {
      propDefinition: [
        prodatakey,
        "url",
      ],
    },
    scope: {
      propDefinition: [
        prodatakey,
        "scope",
      ],
    },
    authenticationType: {
      propDefinition: [
        prodatakey,
        "authenticationType",
      ],
    },
    authenticationUser: {
      propDefinition: [
        prodatakey,
        "authenticationUser",
      ],
      optional: true,
    },
    authenticationPassword: {
      propDefinition: [
        prodatakey,
        "authenticationPassword",
      ],
      optional: true,
    },
    secret: {
      propDefinition: [
        prodatakey,
        "secret",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Fetch historical data for deployment-related setup
      // For this specific event type, historical fetching is not applicable
    },
    async activate() {
      // Mechanism to create webhook if needed at app or integration level
      // ProdataKey handles subscriptions for real-time event streaming
    },
    async deactivate() {
      // Mechanism to clear webhook if needed at app or integration level
      // ProdataKey handles cleanup on webhooks
    },
  },
  async run(event) {
    if (event.body && event.body.topic === "cloudnode.connected") {
      const {
        id, name, metadata,
      } = event.body;
      const summary = `Cloud node ${name} connected`;
      const ts = metadata.occurred || Date.now();
      this.$emit(event.body, {
        id,
        summary,
        ts,
      });
    }
  },
};
