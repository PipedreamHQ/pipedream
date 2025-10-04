import uberduck from "../../uberduck.app.mjs";

export default {
  key: "uberduck-generate-lyrics",
  name: "Generate Lyrics",
  description: "Generates lyrics using a specified voice model. [See the documentation](https://docs.uberduck.ai/reference/generate-lyrics)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    uberduck,
    lines: {
      type: "integer",
      label: "Lines",
      description: "Number of lines of lyrics to generate",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The lyrics subject",
    },
    generateTitle: {
      type: "boolean",
      label: "Generate Title",
      description: "Generate a title to the lyrics",
    },
  },
  async run({ $ }) {
    const response = await this.uberduck.generateLyrics({
      $,
      data: {
        lines: this.lines,
        subject: this.subject,
        generate_title: this.generateTitle,
      },
    });

    $.export("$summary", "Successfully generated lyrics");

    return response;
  },
};
