import songupAi from "../../songup_ai.app.mjs";

export default {
  key: "songup_ai-create-song",
  name: "Create Song",
  description: "Starts an AI song with vocals from an idea or your own lyrics. The song is ready in about 1-3 minutes: use the **New Song Finished** source or **Get Song** to get the MP3. [See the documentation](https://www.songupai.com/developers)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    songupAi,
    prompt: {
      propDefinition: [
        songupAi,
        "prompt",
      ],
    },
    language: {
      propDefinition: [
        songupAi,
        "language",
      ],
    },
    musicType: {
      propDefinition: [
        songupAi,
        "musicType",
      ],
    },
    style: {
      propDefinition: [
        songupAi,
        "style",
      ],
    },
    lyrics: {
      propDefinition: [
        songupAi,
        "lyrics",
      ],
    },
    title: {
      propDefinition: [
        songupAi,
        "title",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.songupAi.createSong({
      $,
      data: {
        prompt: this.prompt,
        language: this.language,
        music_type: this.musicType,
        style: this.style,
        lyrics: this.lyrics,
        title: this.title,
      },
    });
    $.export("$summary", `Started song with ID \`${response.id}\``);
    return response;
  },
};
