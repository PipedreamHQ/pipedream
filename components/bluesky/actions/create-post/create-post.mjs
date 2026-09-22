import app from "../../bluesky.app.mjs";
import constants from "../../common/constants.mjs";
import textEncoding from "../../common/textEncoding.mjs";

export default {
  key: "bluesky-create-post",
  name: "Create Post",
  description: "Creates a new post on Bluesky. [See the documentation](https://docs.bsky.app/docs/api/com-atproto-repo-create-record).",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    text: {
      type: "string",
      label: "Text",
      description: "The text content of the post.",
    },
  },
  async run({ $ }) {
    const {
      app,
      text,
    } = this;

    const response = await app.createRecord({
      $,
      data: {
        collection: constants.RESOURCE_TYPE.POST,
        record: {
          ["$type"]: constants.RESOURCE_TYPE.POST,
          text,
          facets: await textEncoding.detectFacets(text, app),
          createdAt: new Date().toISOString(),
        },
      },
    });

    $.export("$summary", `Successfully created a new post with uri \`${response.uri}\`.`);
    return response;
  },
};
