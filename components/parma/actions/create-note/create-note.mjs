import parma from "../../parma.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "parma-create-note",
  name: "Create Note",
  description: "Adds a new note in Parma. [See the documentation](https://developers.parma.ai/api-docs/index.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    parma,
    content: {
      propDefinition: [
        parma,
        "content",
      ],
    },
    title: {
      propDefinition: [
        parma,
        "title",
      ],
    },
    relatedTo: {
      propDefinition: [
        parma,
        "relatedTo",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.parma.addNote({
      content: this.content,
      title: this.title,
      relatedTo: this.relatedTo,
    });

    $.export("$summary", `Successfully created note with title: ${this.title}`);
    return response;
  },
};
