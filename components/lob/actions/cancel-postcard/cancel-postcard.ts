import { defineAction } from "@pipedream/types";
import lob from "../../app/lob.app";

export default defineAction({
  key: "lob-cancel-postcard",
  name: "Cancel Postcard",
  description: "Completely removes a postcard from production. This can only be done if the postcard has a `send_date` and the `send_date` has not yet passed. [See docs here](https://docs.lob.com/#tag/Postcards/operation/postcard_delete).",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.lob.cancelPostcard(this.postcardId);
    $.export("$summary", "Successfully canceled postcard");
    return response;
  },
});
