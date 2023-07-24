import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { CreatePostParams } from "../../common/requestParams";

const DOCS_LINK = "https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts/create";

export default defineAction({
  key: "google_my_business-create-post",
  name: "Create Post",
  description: `Creates a new local post associated with the specified location, and returns it. [See the documentation](${DOCS_LINK})`,
  version: "0.0.1",
  type: "action",
  props: {
    app,
    account: {
      propDefinition: [
        app,
        "account",
      ],
    },
    location: {
      propDefinition: [
        app,
        "location",
        ({ account }) => ({
          account,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      account, location,
    } = this;
    const params: CreatePostParams = {
      $,
      account,
      location,
    };

    const response = await this.app.createPost(params);

    $.export("$summary", "Success");

    return response;
  },
});
