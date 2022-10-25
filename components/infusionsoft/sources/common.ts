import infusionsoft from "../app/infusionsoft.app";
import { SourceHttpRunOptions } from "@pipedream/types";
import { CreateHookParams } from "../common/requestParams";
import {
  Webhook, WebhookObject,
} from "../common/responseSchemas";

export default {
  props: {
    infusionsoft,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    getHookType() {
      // Available hooks: GET https://api.infusionsoft.com/crm/rest/v1/hooks/event_keys
      throw new Error("Hook type not defined for this source");
    },
    getSummary() {
      throw new Error("Summary defined for this source");
    },
    getHookSecretName(): string {
      return "x-hook-secret";
    },
  },
  hooks: {
    async activate() {
      const data: CreateHookParams = {
        eventKey: this.getHookType(),
        hookUrl: this.http.endpoint,
      };

      const { key }: Webhook = await this.infusionsoft.createHook(data);

      this.db.set("hookKey", key);
    },
    async deactivate() {
      const key: string = this.db.get("hookKey");

      await this.infusionsoft.deleteHook({
        key,
      });
    },
  },
  async run(data: SourceHttpRunOptions) {
    const hookSecretName: string = this.getHookSecretName();
    const hookSecret = data.headers[hookSecretName];

    const httpResponse = {
      headers: {},
      status: 200,
    };

    // If this is a hook verification request:
    // Do not trigger an event (respond with the secret received)
    if (hookSecret && data.method === "POST") {
      httpResponse.headers[hookSecretName] = hookSecret;
      this.http.respond(httpResponse);
      return;
    }

    this.http.respond(httpResponse);

    // Actual event trigger
    const { object_keys: objectKeys } = data.body;
    if (!Array.isArray(objectKeys)) {
      throw new Error("Unknown data received from Infusionsoft webhook");
    }

    const promises: Promise<{
      obj: WebhookObject;
      response: any;
    }>[] = objectKeys.map(async (obj: WebhookObject) => ({
      obj,
      response: await this.infusionsoft.hookResponseRequest(obj.apiUrl),
    }));

    const result = await Promise.all(promises);
    result.forEach(({
      obj, response,
    }) => {
      const data = response.noUrl
        ? obj
        : response;
      const summary = this.getSummary(data);
      this.$emit(data, {
        id: obj.id,
        summary,
        ts: new Date(obj.timestamp).valueOf(),
      });
    });
  },
};
