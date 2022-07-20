import infusionsoft from "../../app/infusionsoft.app";
import { defineSource, SourceHttpRunOptions } from "@pipedream/types";
import { createHookParams, getContactParams } from "../../types/requestParams";
import { hook } from "../../types/responseSchemas";
import { hookNewObject } from "../../types/common";

export default defineSource({
  name: "New Order",
  description:
    "Emit new event for every new order [See docs here](https://developer.infusionsoft.com/docs/rest/#tag/REST-Hooks)",
  key: "infusionsoft-new-order",
  version: "0.0.1",
  type: "source",
  props: {
    infusionsoft,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    someTestProp: {
      type: "string",
      label: "Test Prop",
      description: "to refresh",
      options: ["option A", "option C"],
    },
  },
  methods: {
    getHookType(): string {
      return "order.add";
    },
    getHookSecretName(): string {
      return "x-hook-secret";
    },
    async getObjectInfo(contactId: number): Promise<hookNewObject> {
      const params: getContactParams = { contactId };
      const info = await this.infusionsoft.getContact(params);
      const summary = info.given_name;
      return { info, summary };
    },
  },
  hooks: {
    async activate() {
      const data: createHookParams = {
        eventKey: this.getHookType(),
        hookUrl: this.http.endpoint,
      };

      const { key }: hook = await this.infusionsoft.createHook(data);

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

      type webhookObject = {
        id: number;
        timestamp: string;
      };

      const objectKeys = data.body.object_keys;
      if (!(objectKeys instanceof Array)) return;

      const promises: Promise<void>[] = objectKeys.map(
        async ({ id, timestamp }: webhookObject) =>
          new Promise(async (resolve) => {
            const { info, summary } = await this.getObjectInfo(id);

            this.$emit(info, {
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
});
