import constants from "../../common/constants.mjs";
import app from "../../langfuse.app.mjs";

export default {
  key: "langfuse-add-feedback",
  name: "Add Feedback",
  description: "Attach user feedback to an existing trace in Langfuse. [See the documentation](https://api.reference.langfuse.com/#tag/comments/POST/api/public/comments).",
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
    objectType: {
      propDefinition: [
        app,
        "objectType",
      ],
    },
    objectId: {
      propDefinition: [
        app,
        "objectId",
        ({ objectType }) => ({
          objectType,
        }),
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the comment. May include markdown. Currently limited to 3000 characters.",
    },
  },
  methods: {
    addFeedback(args = {}) {
      return this.app.post({
        path: "/comments",
        ...args,
      });
    },
    async getObjectId() {
      const {
        app,
        objectType,
        objectId,
      } = this;
      if (objectType == constants.OBJECT_TYPE.PROMPT) {
        const prompt = await app.getPrompt({
          promptName: objectId,
        });
        return prompt?.id;
      }
      return objectId;
    },
  },
  async run({ $ }) {
    const {
      getObjectId,
      addFeedback,
      projectId,
      objectType,
      content,
    } = this;

    const objectId = await getObjectId();

    const response = await addFeedback({
      $,
      data: {
        projectId,
        objectType,
        objectId,
        content,
      },
    });

    $.export("$summary", "Successfully added feedback.");
    return response;
  },
};
