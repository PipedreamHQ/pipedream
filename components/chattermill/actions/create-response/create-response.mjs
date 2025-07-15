import chattermill from "../../chattermill.app.mjs";

export default {
  key: "chattermill-create-response",
  name: "Create Response",
  description: "Create response model with given attributes. [See the documentation](https://apidocs.chattermill.com/#70001058-ac53-eec1-7c44-c836fb0b2489)",
  version: "0.0.{{ts}}",
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
      description: "The score to add to the response",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "The comment to add to the response",
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "A unique customer ID to add to the response",
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
    const response = await this.chattermill.createResponse({
      $,
      projectId: this.projectId,
      data: {
        comment: this.comment,
        response: {
          score: this.score,
          comment: this.comment,
          user_meta: {
            customer_id: {
              type: "text",
              value: this.customerId,
              name: "Customer ID",
            },
          },
          segments: {
            customer_type: {
              type: "text",
              value: "New",
              name: "Customer Type",
            },
          },
          data_type: this.dataType,
          data_source: this.dataSource,
        },
      },
    });
    $.export("$summary", "Successfully created response.");
    return response;
  },
};
