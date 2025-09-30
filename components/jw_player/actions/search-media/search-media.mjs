import jwPlayer from "../../jw_player.app.mjs";

export default {
  key: "jw_player-search-media",
  name: "Search Media",
  description: "Searches for a media or lists all media available in JW Player. [See the documentation](https://docs.jwplayer.com/platform/reference/get_v2-sites-site-id-media)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    jwPlayer,
    siteId: {
      propDefinition: [
        jwPlayer,
        "siteId",
      ],
    },
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "The query for searching the media. For example: `title:Flower`. See [all available attributes here](https://docs.jwplayer.com/platform/reference/get_v2-sites-site-id-media#:~:text=Media%20can%20be%20queried%20by%20the%20following%20attributes%3A) and [the full list of supported search queries here](https://docs.jwplayer.com/platform/reference/building-a-request#query-parameter-q).",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.jwPlayer.paginate({
      resourceFn: this.jwPlayer.listMedia,
      args: {
        siteId: this.siteId,
        params: {
          q: this.searchQuery,
        },
      },
      resourceType: "media",
    });

    const media = [];
    for await (const item of results) {
      media.push(item);
    }

    if (media?.length) {
      $.export("$summary", `Found ${media.length} media item${media.length === 1
        ?
        ""
        :
        "s"}.`);
    }

    return media;
  },
};
