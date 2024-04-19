import ganAi from "../../gan_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "gan_ai-create-videos",
  name: "Create Videos in Bulk",
  description: "Creates videos in bulk by passing tags and values. Requires a project ID. [See the documentation](https://docs.gan.ai/create-video/create-videos)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ganAi,
    projectId: {
      propDefinition: [
        ganAi,
        "projectId",
        (c) => ({
          prevContext: c.prevContext,
        }),
      ],
    },
    tagsAndValues: {
      propDefinition: [
        ganAi,
        "tagsAndValues",
      ],
    },
    queryset: {
      propDefinition: [
        ganAi,
        "queryset",
      ],
    },
  },
  async run({ $ }) {
    let payload;
    if (this.tagsAndValues && this.tagsAndValues.length > 0) {
      payload = this.tagsAndValues.map(JSON.parse);
    } else {
      payload = this.queryset.map(JSON.parse);
    }

    const response = await this.ganAi.createVideosBulk({
      projectId: this.projectId,
      tagsAndValues: this.tagsAndValues,
      queryset: this.queryset,
    });

    $.export("$summary", `Successfully created videos for project ${this.projectId}`);
    return response;
  },
};
