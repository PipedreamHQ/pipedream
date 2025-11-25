import { checkIdArray } from "../../common/utils.mjs";
import app from "../../dealcloud.app.mjs";

export default {
  key: "slack_v2-delete-records",
  name: "Delete Record(s)",
  description: "Deletes one or more records (entries) from DealCloud. [See the documentation](https://api.docs.dealcloud.com/docs/data/delete)",
  version: "0.0.{{ts}}",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    entryTypeId: {
      propDefinition: [
        app,
        "entryTypeId",
      ],
    },
    entryIds: {
      propDefinition: [
        app,
        "entryId",
        ({ entryTypeId }) => ({
          entryTypeId,
        }),
      ],
      type: "integer[]",
      label: "Record ID(s)",
      description: "The ID(s) of one or more records (entries) to delete.",
    },
  },
  async run({ $ }) {
    const entryIds = checkIdArray(this.entryIds);
    const response = await this.app.deleteEntry({
      $,
      entryTypeId: this.entryTypeId,
      data: entryIds,
    });

    const count = entryIds.length;
    $.export("$summary", `Successfully deleted ${count} record${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};

