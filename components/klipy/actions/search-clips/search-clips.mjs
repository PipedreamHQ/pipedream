import klipy from "../../klipy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "klipy-search-clips",
  name: "Search Clips",
  description: "Search and retrieve clips from Klipy's database. [See the documentation](https://docs.klipy.com/clips-api/clips-search-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    klipy,
    q: {
      propDefinition: [
        klipy,
        "searchClipsQ",
      ],
    },
    customer_id: {
      propDefinition: [
        klipy,
        "searchClipsCustomerId",
      ],
    },
    locale: {
      propDefinition: [
        klipy,
        "searchClipsLocale",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const clips = await this.klipy.searchClips();
    $.export("$summary", `Retrieved ${clips.length} clips`);
    return clips;
  },
};
