import klipy from "../../klipy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "klipy-search-gifs",
  name: "Search GIFs",
  description: "Search and retrieve GIFs from Klipy's database. [See the documentation](https://docs.klipy.com/gifs-api/gifs-search-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    klipy,
    q: {
      propDefinition: [
        klipy,
        "searchGifsQ",
      ],
    },
    customer_id: {
      propDefinition: [
        klipy,
        "searchGifsCustomerId",
      ],
    },
    locale: {
      propDefinition: [
        klipy,
        "searchGifsLocale",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.klipy.searchGifs();
    $.export("$summary", `Successfully retrieved GIFs for query "${this.q}"`);
    return response;
  },
};
