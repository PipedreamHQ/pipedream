import { defineAction } from "@pipedream/types";
import lob from "../../app/lob.app";

export default defineAction({
  key: "lob-list-postcards",
  name: "List Postcards",
  description: "Returns a list of your postcards. [See docs here](https://docs.lob.com/#tag/Postcards/operation/postcards_list).",
  version: "0.0.1",
  type: "action",
  props: {
    lob,
  },
  async run({ $ }) {
    $.export("$summary", "Successfully listed postcard(s)");
  },
});
