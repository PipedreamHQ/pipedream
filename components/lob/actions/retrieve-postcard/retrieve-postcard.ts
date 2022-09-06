import { defineAction } from "@pipedream/types";
import lob from "../../app/lob.app";

export default defineAction({
  key: "lob-retrieve-postcard",
  name: "Retrieve Postcard",
  description: "Retrieves the details of an existing postcard. [See docs here](https://docs.lob.com/#tag/Postcards/operation/postcard_retrieve).",
  version: "0.0.1",
  type: "action",
  props: {
    lob,
  },
  async run({ $ }) {
    $.export("$summary", "Successfully retrieved postcard");
  },
});
