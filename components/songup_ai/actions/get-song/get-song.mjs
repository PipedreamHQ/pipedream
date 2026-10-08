import songupAi from "../../songup_ai.app.mjs";

export default {
  key: "songup_ai-get-song",
  name: "Get Song",
  description: "Gets a song by its ID, with its status and the MP3 link once it is finished. [See the documentation](https://www.songupai.com/developers)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    songupAi,
    songId: {
      propDefinition: [
        songupAi,
        "songId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.songupAi.getSong({
      $,
      songId: this.songId,
    });
    $.export("$summary", `Song \`${response.id}\` is ${response.status}`);
    return response;
  },
};
