import dropbox from "../../dropbox.app.mjs";

export default {
  key: "dropbox-list-shared-links",
  name: "List Shared Links",
  description: "Retrieves a list of shared links for a given path. [See the documentation](https://www.dropbox.com/developers/documentation/http/documentation#sharing-list_shared_links)",
  version: "0.0.1",
  type: "action",
  props: {
    dropbox,
    path: {
      propDefinition: [
        dropbox,
        "path",
        () => ({
          initialOptions: [],
          filter: ({ metadata: { metadata: { [".tag"]: type } } }) => [
            "file",
            "folder",
          ].includes(type),
        }),
      ],
      optional: true,
      description: "Type the file or folder name to search for it in the user's Dropbox",
    },
  },
  async run({ $ }) {
    const sharedLinks = [];
    let hasMore;
    const args = {
      path: this.path?.value || this.path,
    };

    do {
      const {
        result: {
          links, cursor, has_more,
        },
      } = await this.dropbox.listSharedLinks(args);
      sharedLinks.push(...links);
      args.cursor = cursor;
      hasMore = has_more;
    } while (hasMore);

    $.export("$summary", `Successfully retrieved ${sharedLinks.length} shared link${sharedLinks.length === 1
      ? ""
      : "s"}.`);
    return sharedLinks;
  },
};
