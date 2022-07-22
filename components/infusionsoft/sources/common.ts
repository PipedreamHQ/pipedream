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
    getHookType(): void {
      // Available hooks: GET https://api.infusionsoft.com/crm/rest/v1/hooks/event_keys
      throw new Error("Hook type not defined for this source");
    },
    getSummary(): void {
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
    const hookSecretName = this.getHookSecretName();
    const hookSecret = data.headers[hookSecretName];

    // If this is a hook verification request:
    // Respond with the received secret, but do not trigger an event
    if (hookSecret && data.method === "POST") {
      this.http.respond({
        status: 200,
        headers: {
          [hookSecretName]: hookSecret,
        },
      });
    }

    // Otherwise, this is an actual event
    else {
      this.http.respond({
        status: 200,
      });

      const objectKeys = data.body.object_keys;
      if (!(objectKeys instanceof Array)) return;

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
