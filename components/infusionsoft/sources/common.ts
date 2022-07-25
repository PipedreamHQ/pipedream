import infusionsoft from "../app/infusionsoft.app";
import { SourceHttpRunOptions } from "@pipedream/types";
import { createHookParams } from "../types/requestParams";
import { webhook, webhookObject } from "../types/responseSchemas";

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
      const data: createHookParams = {
        eventKey: this.getHookType(),
        hookUrl: this.http.endpoint,
      };

      const { key }: webhook = await this.infusionsoft.createHook(data);

      this.db.set("hookKey", key);
    },
    async deactivate() {
      const key: string = this.db.get("hookKey");

      await this.infusionsoft.deleteHook({ key });
    },
  },
  async run(data: SourceHttpRunOptions) {
    const hookSecretName: string = this.getHookSecretName();
    const hookSecret = data.headers[hookSecretName];

    const httpResponse = {
      headers: {},
      status: 200
    };

    let shouldTriggerEvent = true;

    // If this is a hook verification request:
    // Do not trigger an event (respond with the secret received)
    if (hookSecret && data.method === "POST") {
      shouldTriggerEvent = false;
      httpResponse.headers[hookSecretName] = hookSecret;
    };

    this.http.respond(httpResponse);

    // Actual event trigger
    if (shouldTriggerEvent) {
      const objectKeys = data.body.object_keys;
      if (!(objectKeys instanceof Array)) {
        throw new Error('Unknown data received from Infusionsoft webhook');
      };

      const promises: Promise<void>[] = objectKeys.map(
        async (obj: webhookObject) =>
          new Promise(async (resolve) => {
            const { apiUrl, id, timestamp } = obj;

            const response = await this.infusionsoft.hookResponseRequest(apiUrl);
            const data = response.noUrl ? obj : response;
            const summary = this.getSummary(data);

            this.$emit(data, {
              id,
              summary,
              ts: new Date(timestamp).valueOf(),
            });

            resolve();
          })
      );

      await Promise.allSettled(promises);
    }
  },
};
