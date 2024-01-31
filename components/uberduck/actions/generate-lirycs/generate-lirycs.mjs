import uberduck from "../../uberduck.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "uberduck-generate-lyrics",
  name: "Generate Lyrics",
  description: "Generates lyrics using a specified voice model. [See the documentation](https://docs.uberduck.ai/reference/generate-lyrics)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    uberduck,
    voicemodelUuid: {
      propDefinition: [
        uberduck,
        "voicemodelUuid",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text to generate lyrics from",
    },
  },
  async run({ $ }) {
    const response = await this.uberduck.generateLyrics({
      voicemodelUuid: this.voicemodelUuid,
      text: this.text,
    });
    $.export("$summary", `Successfully generated lyrics for voice model UUID: ${this.voicemodelUuid}`);
    return response;
  },
};
