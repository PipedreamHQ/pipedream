import uberduck from "../../uberduck.app.mjs";

export default {
  key: "uberduck-get-voices",
  name: "Get Voices",
  description: "List voices available in Uberduck. [See the documentation](https://docs.uberduck.ai/reference/list-voices)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    uberduck,
    mode: {
      propDefinition: [
        uberduck,
        "mode",
      ],
      optional: true,
    },
    language: {
      propDefinition: [
        uberduck,
        "language",
      ],
      optional: true,
    },
    isPrivate: {
      propDefinition: [
        uberduck,
        "isPrivate",
      ],
      optional: true,
    },
    owner: {
      propDefinition: [
        uberduck,
        "owner",
      ],
      optional: true,
    },
    name: {
      propDefinition: [
        uberduck,
        "name",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.uberduck.listVoices({
      $,
      mode: this.mode,
      language: this.language,
      isPrivate: this.isPrivate,
      owner: this.owner,
      name: this.name,
    });

    $.export("$summary", `Retrieved a list of ${response.length} voices successfully`);

    return response;
  },
};
