import nordigen from "../../nordigen.app.mjs";

export default {
  key: "nordigen-delete-requisition-link",
  name: "Delete Requisition Link",
  description: "Delete requisition and its end user agreement. [See the docs](https://ob.nordigen.com/api/docs#/requisitions/delete%20requisition%20by%20id%20v2)",
  version: "1.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nordigen,
    requisitionId: {
      propDefinition: [
        nordigen,
        "requisitionId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.nordigen.deleteRequisitionLink(this.requisitionId, {
      $,
    });

    $.export("$summary", `Successfully deleted requisition with ID ${this.requisitionId}`);

    return response;
  },
};
