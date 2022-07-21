import { defineSource } from "@pipedream/types";
import { webhookNewObjectData } from "../../types/common";
import common from "../common";

export default defineSource({
  ...common,
  name: "New Order",
  description:
    "Emit new event for each new **order** [See docs here](https://developer.infusionsoft.com/docs/rest/#operation/getOrderUsingGET)",
  key: "infusionsoft-new-order",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getHookType(): string {
      return "order.add";
    },
    async getObjectInfo(id: number): Promise<webhookNewObjectData> {
      const info = await this.infusionsoft.getOrder({ id });
      const summary = info.given_name;
      return { info, summary };
    },
  },
});
