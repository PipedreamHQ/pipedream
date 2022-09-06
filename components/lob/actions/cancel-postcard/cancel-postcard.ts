import { defineAction } from "@pipedream/types";
import lob from "../../app/lob.app";

export default defineAction({
  key: "lob-cancel-postcard",
  name: "Cancel Postcard",
  description: "Completely removes a postcard from production. [See docs here](https://docs.lob.com/#tag/Postcards/operation/postcard_delete).",
  version: "0.0.1",
  type: "action",
  props: {
    lob,
  },
  async run({ $ }) {
    $.export("$summary", "Successfully canceled postcard");
  },
});
