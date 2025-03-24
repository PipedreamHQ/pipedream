import app from "../../bluesky.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "bluesky-create-post",
  name: "Create Post",
  description: "Creates a new post on Bluesky. [See the documentation](https://docs.bsky.app/docs/api/com-atproto-repo-create-record).",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    text: {
      type: "string",
      label: "Text",
      description: "The text content of the post.",
    },
  },
  methods: {
    parseUrls(text) {
      const spans = [];
      const urlRegex = /(?:[$|\W])(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*[-a-zA-Z0-9@%_+~#//=])?)/g;

      let match;
      while ((match = urlRegex.exec(text)) !== null) {
        spans.push({
          start: match.index + 1,
          end: urlRegex.lastIndex,
          url: match[1],
        });
      }
      return spans;
    },
    parseFacets(text) {
      const facets = [];
      for (const link of this.parseUrls(text)) {
        facets.push({
          index: {
            byteStart: link["start"],
            byteEnd: link["end"],
          },
          features: [
            {
              ["$type"]: "app.bsky.richtext.facet#link",
              uri: link["url"],
            },
          ],
        });
      }
      return facets;
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
          facets: this.parseFacets(text),
          createdAt: new Date().toISOString(),
        },
      },
    });

    $.export("$summary", `Successfully created a new post with uri \`${response.uri}\`.`);
    return response;
  },
};
