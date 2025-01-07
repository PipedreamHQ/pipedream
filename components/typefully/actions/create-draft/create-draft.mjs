import typefully from "../../typefully.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "typefully-create-draft",
  name: "Create Draft",
  description: "Creates a new draft in Typefully. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    typefully,
    content: {
      propDefinition: [
        typefully,
        "content",
      ],
    },
    threadify: {
      propDefinition: [
        typefully,
        "threadify",
      ],
      optional: true,
    },
    share: {
      propDefinition: [
        typefully,
        "share",
      ],
      optional: true,
    },
    autoRetweetEnabled: {
      propDefinition: [
        typefully,
        "autoRetweetEnabled",
      ],
      optional: true,
    },
    autoPlugEnabled: {
      propDefinition: [
        typefully,
        "autoPlugEnabled",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const draft = await this.typefully.createDraft();
    $.export("$summary", `Created draft with ID: ${draft.id} and content: "${this.content}"`);
    return draft;
  },
};
