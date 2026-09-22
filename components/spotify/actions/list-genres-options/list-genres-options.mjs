import spotify from "../../spotify.app.mjs";

export default {
  key: "spotify-list-genres-options",
  name: "List Seed Genres Options",
  description: "Retrieves available options for the Seed Genres field.",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    spotify,
  },
  async run({ $ }) {
    const options = await spotify.propDefinitions.genres.options.call(this.spotify);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
