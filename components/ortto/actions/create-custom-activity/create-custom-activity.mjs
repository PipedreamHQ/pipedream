import ortto from "../../ortto.app.mjs";

export default {
  key: "ortto-create-custom-activity",
  name: "Create Custom Activity",
  description: "Creates a unique activity for a user. Can optionally initialize a new record beforehand. [See the documentation](https://help.ortto.com/developer/latest/api-reference/activity/index.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ortto,
    activityName: {
      propDefinition: [
        ortto,
        "activityName",
      ],
    },
    recordId: {
      propDefinition: [
        ortto,
        "recordId",
      ],
      optional: true,
    },
    recordType: {
      propDefinition: [
        ortto,
        "recordType",
      ],
      optional: true,
    },
    data: {
      propDefinition: [
        ortto,
        "data",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.recordType && this.data) {
      await this.ortto.initializeOrUpdateRecord({
        recordType: this.recordType,
        data: this.data,
      });
    }

    const response = await this.ortto.createUniqueActivity({
      activityName: this.activityName,
      recordId: this.recordId,
    });

    $.export("$summary", `Successfully created activity ${response.id}`);
    return response;
  },
};
