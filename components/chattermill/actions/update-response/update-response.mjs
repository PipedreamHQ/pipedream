import chattermill from "../../chattermill.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "chattermill-update-response",
  name: "Update Response",
  description: "Update a response by ID. [See the documentation](https://apidocs.chattermill.com/#a632c60d-ccda-74b3-b9e7-b5a0c4917e1a)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    chattermill,
    projectId: {
      propDefinition: [
        chattermill,
        "projectId",
      ],
    },
    responseId: {
      propDefinition: [
        chattermill,
        "responseId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    userMeta: {
      propDefinition: [
        chattermill,
        "userMeta",
      ],
      optional: true,
    },
    segments: {
      propDefinition: [
        chattermill,
        "segments",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.chattermill.updateResponse({
      $,
      projectId: this.projectId,
      responseId: this.responseId,
      data: {
        response: {
          user_meta: parseObject(this.userMeta),
          segments: parseObject(this.segments),
        },
      },
    });
    $.export("$summary", `Successfully updated response with ID: ${this.responseId}`);
    return response;
  },
};
