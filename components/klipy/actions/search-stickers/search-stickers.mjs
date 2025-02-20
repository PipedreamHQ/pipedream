import klipy from "../../klipy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "klipy-search-stickers",
  name: "Search Stickers",
  description: "Search and retrieve stickers from Klipy's database. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    klipy,
    q: {
      propDefinition: [
        klipy,
        "searchStickersQ",
      ],
    },
    customer_id: {
      propDefinition: [
        klipy,
        "searchStickersCustomerId",
      ],
    },
    locale: {
      propDefinition: [
        klipy,
        "searchStickersLocale",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.klipy.searchStickers();
    $.export("$summary", `Retrieved stickers with query "${this.q}" and customer ID "${this.customer_id}".`);
    return response;
  },
};
