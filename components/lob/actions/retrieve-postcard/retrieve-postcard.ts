import { defineAction } from "@pipedream/types";
import lob from "../../app/lob.app";

export default defineAction({
  key: "lob-retrieve-postcard",
  name: "Retrieve Postcard",
  description: "Retrieves the details of an existing postcard. [See docs here](https://docs.lob.com/#tag/Postcards/operation/postcard_retrieve).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    lob,
    postcardId: {
      propDefinition: [
        lob,
        "postcardId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lob.retrievePostcard(this.postcardId);
    $.export("$summary", "Successfully retrieved postcard");
    return response;
  },
});
