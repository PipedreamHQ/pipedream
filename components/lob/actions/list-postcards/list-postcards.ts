import { defineAction } from "@pipedream/types";
import lob from "../../app/lob.app";

export default defineAction({
  key: "lob-list-postcards",
  name: "List Postcards",
  description: "Returns a list of your postcards. [See docs here](https://docs.lob.com/#tag/Postcards/operation/postcards_list).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    lob,
  },
  async run({ $ }) {
    const response = await this.lob.listAllPostcards();
    const suffix = response.length === 1
      ? ""
      : "s";
    $.export("$summary", `Successfully listed ${response.length} postcard${suffix}`);
    return response;
  },
});
