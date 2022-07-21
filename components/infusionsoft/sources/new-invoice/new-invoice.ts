import { defineSource } from "@pipedream/types";
import { webhookNewObjectData } from "../../types/common";
import common from "../common";

export default defineSource({
  ...common,
  name: "New Invoice",
  description:
    "Emit new event for each new invoice [See docs here](https://developer.infusionsoft.com/docs/rest/#operation/getOrderUsingGET)",
  key: "infusionsoft-new-invoice",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getHookType(): string {
      return "invoice.add";
    },
    async getObjectInfo(id: number): Promise<webhookNewObjectData> {
      const info = await this.infusionsoft.getOrder({ id });
      const summary = info.given_name;
      return { info, summary };
    },
  },
});
