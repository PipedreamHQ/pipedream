import circleci from "../../circleci.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "circleci-create-item",
  name: "Create Item",
  description: "Creates a new item in the CircleCI app. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    circleci,
    title: {
      propDefinition: [
        circleci,
        "title",
      ],
    },
    content: {
      propDefinition: [
        circleci,
        "content",
      ],
    },
    metadata: {
      propDefinition: [
        circleci,
        "metadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.circleci.createItem({
      title: this.title,
      content: this.content,
      metadata: this.metadata,
    });
    $.export("$summary", `Created item "${this.title}"`);
    return response;
  },
};
