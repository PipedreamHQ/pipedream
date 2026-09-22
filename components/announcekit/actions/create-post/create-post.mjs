import { ConfigurationError } from "@pipedream/platform";
import app from "../../announcekit.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "announcekit-create-post",
  name: "Create Post",
  description: "Create a new post in AnnounceKit. [See the documentation](https://announcekit.app/docs/graphql-api)",
  version: "0.0.1",
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
    title: {
      type: "string",
      label: "Title",
      description: "The title of the post",
    },
    labels: {
      propDefinition: [
        app,
        "labels",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "The body content of the post. You can use basic HTML tags.",
    },
    locale: {
      propDefinition: [
        app,
        "locale",
      ],
    },
    isDraft: {
      type: "boolean",
      label: "Is Draft",
      description: "Whether to create the post as a draft. Set to false to publish immediately.",
      default: false,
    },
  },
  async run({ $ }) {
    const {
      app,
      projectId,
      title,
      labels,
      body,
      isDraft,
      locale,
    } = this;

    const response = await app.createPost({
      projectId,
      contents: [
        {
          title,
          body,
          locale_id: locale,
        },
      ],
      isDraft: isDraft,
      labels: parseObject(labels),
    });

    if (response.errors) {
      throw new ConfigurationError(response.errors[0].message);
    }

    $.export("$summary", `Successfully created post with ID ${response.data.savePost.id}`);
    return response;
  },
};

