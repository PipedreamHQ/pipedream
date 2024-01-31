import uberduck from "../../uberduck.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "uberduck-get-voices",
  name: "Get Voices",
  description: "List voices available in Uberduck. [See the documentation](https://docs.uberduck.ai/reference/list-voices)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    uberduck,
    mode: {
      propDefinition: [
        uberduck,
        "mode",
      ],
    },
    language: {
      propDefinition: [
        uberduck,
        "language",
      ],
    },
    isPrivate: {
      propDefinition: [
        uberduck,
        "isPrivate",
      ],
    },
    owner: {
      propDefinition: [
        uberduck,
        "owner",
      ],
    },
    name: {
      propDefinition: [
        uberduck,
        "name",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.uberduck.listVoices({
      mode: this.mode,
      language: this.language,
      isPrivate: this.isPrivate,
      owner: this.owner,
      name: this.name,
    });

    $.export("$summary", "Retrieved a list of voices successfully");
    return response;
  },
};
