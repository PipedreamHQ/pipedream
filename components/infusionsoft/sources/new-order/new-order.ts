import infusionsoft from "../../app/infusionsoft.app";
import { defineSource } from "@pipedream/types";
import { createHookParams } from "../../types/requestParams";
import { hook } from "../../types/responseSchemas";

export default defineSource({
  name: "New Order",
  description:
    "Emit new event for every new order [See docs here](https://developer.infusionsoft.com/docs/rest/#tag/REST-Hooks)",
  key: "infusionsoft-new-order",
  version: "0.0.7",
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
  async run(data) {
    this.http.respond({
      status: 200,
      body: data
    });

    console.log("--- start data ---");
    console.log(data);
    console.log("--- end data ---");

    this.$emit(
      data.event || { message: 'NO DATA' },
      {
        id: 1,
        summary: "test-summary",
        ts: Date.now(),
      }
    );
  },
});
