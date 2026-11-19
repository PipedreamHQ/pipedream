import muziekMakenMetAi from "../../muziek_maken_met_ai.app.mjs";

export default {
  key: "muziek_maken_met_ai-get-song",
  name: "Get Song",
  description: "Get one song generation, including its status and its audio files when finished. [See the documentation](https://muziekmakenmetai.nl/developers/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  ai: "optimized",
  props: {
    muziekMakenMetAi,
    songId: {
      propDefinition: [
        muziekMakenMetAi,
        "songId",
      ],
    },
  },
  async run({ $ }) {
    const generation = await this.muziekMakenMetAi.getSong($, this.songId);

    $.export("$summary", `Fetched song generation ${generation.id ?? this.songId} (status: ${generation.status ?? "unknown"})`);

    return generation;
  },
};
