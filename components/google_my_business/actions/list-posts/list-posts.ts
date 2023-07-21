import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";

const DOCS_LINK = "https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts/list";

export default defineAction({
  key: "google_my_business-list-posts",
  name: "List Posts",
  description: `Returns a list of local posts associated with a location. [See the documentation](${DOCS_LINK})`,
  version: "0.0.1",
  type: "action",
  props: {
    app,
    parent: {
      type: "string",
      label: "Parent",
      description:
        "The name of the location whose local posts will be listed.",
    },
  },
  async run({ $ }) {
    const { parent } = this;
    const params = {
      $,
      data: {
        parent,
      },
    };

    const response = await this.app.listPosts(params);

    $.export("$summary", "Success");

    return response;
  },
});
