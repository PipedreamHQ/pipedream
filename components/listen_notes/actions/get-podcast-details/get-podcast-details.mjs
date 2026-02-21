import app from "../../listen_notes.app.mjs";

export default {
  key: "listen_notes-get-podcast-details",
  name: "Get Podcast Details",
  description: "Get the details of the selected podcast. [See the documentation](https://www.listennotes.com/api/docs/#get-api-v2-podcasts-id)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    q: {
      propDefinition: [
        app,
        "q",
      ],
      optional: true,
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
    id: {
      propDefinition: [
        app,
        "id",
        (c) => ({
          q: c.q,
          type: "podcast",
          language: c.language,
          offset: c.offset,
        }),
      ],
    },
    nextEpisodePubDate: {
      propDefinition: [
        app,
        "nextEpisodePubDate",
      ],
    },
    sort: {
      propDefinition: [
        app,
        "sort",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.getPodcastDetails({
      $,
      id: this.id,
      params: {
        next_episode_pub_date: this.nextEpisodePubDate,
        sort: this.sort,
      },
    });
    $.export("$summary", `Successfully retrieved details for the podcast '${response.title}'`);
    return response;
  },
};
