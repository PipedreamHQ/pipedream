import chattermill from "../../chattermill.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "chattermill-create-response",
  name: "Create Response",
  description: "Create response model with given attributes. [See the documentation](https://apidocs.chattermill.com/#70001058-ac53-eec1-7c44-c836fb0b2489)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
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
    score: {
      type: "integer",
      label: "Score",
      description: "A score of 1 - 10 to add to the response",
      min: 1,
      max: 10,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "The comment to add to the response",
    },
    userMeta: {
      propDefinition: [
        chattermill,
        "userMeta",
      ],
    },
    segments: {
      propDefinition: [
        chattermill,
        "segments",
      ],
    },
    dataType: {
      propDefinition: [
        chattermill,
        "dataType",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    dataSource: {
      propDefinition: [
        chattermill,
        "dataSource",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.chattermill.createResponse({
        $,
        projectId: this.projectId,
        data: {
          response: {
            score: this.score,
            comment: this.comment,
            user_meta: parseObject(this.userMeta),
            segments: parseObject(this.segments),
            data_type: this.dataType,
            data_source: this.dataSource,
          },
        },
      });
      $.export("$summary", "Successfully created response.");
      return response;
    } catch {
      throw new Error("Failed to create response");
    }
  },
};
