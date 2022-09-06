import { defineAction } from "@pipedream/types";
import lob from "../../app/lob.app";

export default defineAction({
  key: "lob-create-postcard",
  name: "Create Postcard",
  description: "Creates a new postcard given information. [See docs here](https://docs.lob.com/#tag/Postcards/operation/postcard_create).",
  version: "0.0.1",
  type: "action",
  props: {
    lob,
  },
  async run({ $ }) {
    $.export("$summary", "Successfully created postcard");
  },
});
