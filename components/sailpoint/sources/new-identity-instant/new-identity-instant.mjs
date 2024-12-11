import sailpoint from "../../sailpoint.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sailpoint-new-identity-instant",
  name: "New Identity Created",
  description: "Emit new event when a new identity is created in IdentityNow. [See the documentation](${{docsLink}})",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    sailpoint,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const params = {
        limit: 50,
        sort: "createdAt desc",
      };
      const identities = await this.sailpoint._makeRequest({
        method: "GET",
        path: "/identities",
        params,
      });

      for (const identity of identities) {
        this.$emit(identity, {
          id: identity.identityId || identity.id,
          summary: `New identity created: ${identity.name}`,
          ts: Date.parse(identity.createdAt) || Date.now(),
        });
      }
    },
    async activate() {
      const webhookUrl = this.http.endpoint;

      const body = {
        name: "New Identity Created Subscription",
        description: "Subscription for new identity creation events",
        triggerId: "idn:identity-created",
        type: "HTTP",
        responseDeadline: "PT1H",
        httpConfig: {
          url: webhookUrl,
          httpDispatchMode: "SYNC",
          httpAuthenticationType: "NO_AUTH",
        },
        enabled: true,
      };

      const headers = {
        "X-SailPoint-Experimental": "true",
      };

      const response = await this.sailpoint._makeRequest({
        method: "POST",
        path: "/trigger-subscriptions",
        headers,
        data: body,
      });

      const subscriptionId = response.id;
      this.db.set("subscriptionId", subscriptionId);
    },
    async deactivate() {
      const subscriptionId = await this.db.get("subscriptionId");
      if (subscriptionId) {
        const headers = {
          "X-SailPoint-Experimental": "true",
        };
        await this.sailpoint._makeRequest({
          method: "DELETE",
          path: `/trigger-subscriptions/${subscriptionId}`,
          headers,
        });
        await this.db.delete("subscriptionId");
      }
    },
  },
  async run(event) {
    const identity = event;
    this.$emit(identity, {
      id: identity.identityId || identity.id,
      summary: `New identity created: ${identity.name}`,
      ts: Date.parse(identity.createdAt) || Date.now(),
    });
  },
};
