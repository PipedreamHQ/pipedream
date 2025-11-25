import { checkIdArray } from "../../common/utils.mjs";
import dealcloud from "../../dealcloud.app.mjs";

export default {
  key: "slack_v2-get-records",
  name: "Get Record(s)",
  description: "Retrieves one or more records (entries) from DealCloud. [See the documentation](https://api.docs.dealcloud.com/docs/data/rows/get)",
  version: "0.0.{{ts}}",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dealcloud,
    entryTypeId: {
      propDefinition: [
        dealcloud,
        "entryTypeId",
      ],
    },
    entryIds: {
      propDefinition: [
        dealcloud,
        "entryId",
        ({ entryTypeId }) => ({
          entryTypeId,
        }),
      ],
      type: "integer[]",
      label: "Record ID(s)",
      description: "The ID(s) of one or more records (entries) to retrieve.",
    },
  },
  async run({ $ }) {
    const entryIds = checkIdArray(this.entryIds);
    const response = await this.dealcloud.queryEntries({
      $,
      entryTypeId: this.entryTypeId,
      params: {
        query: `{entryid: {$in:[${entryIds.join()}]}}`,
        resolveReferenceUrls: true,
        wrapIntoArrays: true,
      },
    });

    const count = entryIds.length;
    $.export("$summary", `Successfully retrieved ${count} record${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};

