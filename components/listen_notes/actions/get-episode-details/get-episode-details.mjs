import app from "../../listen_notes.app.mjs";

export default {
  key: "listen_notes-get-episode-details",
  name: "Get Episode Details",
  description: "Get the details of the selected episode. [See the documentation](https://www.listennotes.com/api/docs/#get-api-v2-episodes-id)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    q: {
      propDefinition: [
        app,
        "q",
      ],
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
          language: c.language,
          offset: c.offset,
        }),
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.getEpisodeDetails({
      $,
      id: this.id,
    });

    $.export("$summary", `Successfully retrieved details for the episode '${response.title}'`);

    return response;
  },
};
