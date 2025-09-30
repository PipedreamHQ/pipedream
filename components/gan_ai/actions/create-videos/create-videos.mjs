import utils from "../../common/utils.mjs";
import app from "../../gan_ai.app.mjs";

export default {
  key: "gan_ai-create-videos",
  name: "Create Videos",
  description: "Creates videos in bulk by passing tags and values. Requires a project ID. [See the documentation](https://docs.gan.ai/create-video/create-videos)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    data: {
      type: "string[]",
      label: "Data",
      description: "The payload is a list of dictionaries, where all the parameters required for video generation have to provide a `unique_id` along with the rest of the values you want to set. Eg. `[{ \"names\": \"Manash\", \"unique_id\": \"abc123\" }, { \"names\": \"Manash2\", \"unique_id\": \"cba321\" } ]`",
    },
  },
  methods: {
    createVideos(args = {}) {
      return this.app.post({
        path: "/create_video/bulk",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createVideos,
      projectId,
      data,
    } = this;

    const response = await createVideos({
      $,
      params: {
        project_id: projectId,
      },
      data: utils.parseArray(data),
    });

    if (!response.length) {
      $.export("$summary", "No videos were created");
      return response;
    }

    $.export("$summary", `Successfully created \`${response.length}\` video(s)`);
    return response;
  },
};
