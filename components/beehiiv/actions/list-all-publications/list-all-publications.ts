import app from "../../app/beehiiv.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List All Publications",
  description: "Get a list of all your publications. [See docs](https://www.beehiiv.com/developers/docs)",
  key: "beehiiv-list-all-publications",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const { publications } = await this.app.listPublications($);
    $.export("$summary", `Successfully listed ${publications.length} publication(s)`);
    return publications;
  },
});
