import changesPage from "../../changes_page.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "changes_page-get-pinned-post",
  name: "Get Pinned Post",
  description: "Get the pinned post from Changes Page. [See the documentation](https://docs.changes.page/docs/api/page#get-pinned-post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    changesPage,
  },
  async run({ $ }) {
    try {
      const post = await this.changesPage.getPinnedPost({
        $,
      });
      $.export("$summary", "Successfully retrieved pinned post");
      return post;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new ConfigurationError("No pinned post found");
      }
      throw error;
    }
  },
};
