import { defineSource } from "@pipedream/types";
import { webhookObject } from "../../types/responseSchemas";
import common from "../common";

export default defineSource({
  ...common,
  name: "New Invoice",
  description:
    "Emit new event for each new **invoice** [See docs here](https://developer.infusionsoft.com/docs/rest/#operation/getOrderUsingGET)",
  key: "infusionsoft-new-invoice",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getHookType(): string {
      return "invoice.add";
    },
    getSummary({ id }: webhookObject): string {
      return `New invoice (ID ${id})`;
    },
  },
});
