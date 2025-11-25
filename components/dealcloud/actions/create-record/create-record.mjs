import { convertFieldsToProps } from "../../common/utils.mjs";
import dealcloud from "../../dealcloud.app.mjs";

export default {
  key: "slack_v2-create-record",
  name: "Create Record",
  description: "Creates a new record (entry) in DealCloud. [See the documentation](https://api.docs.dealcloud.com/docs/data/rows/create)",
  version: "0.0.{{ts}}",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    dealcloud,
    entryTypeId: {
      propDefinition: [
        dealcloud,
        "entryTypeId",
      ],
      reloadProps: true,
    },
    ignoreNearDups: {
      propDefinition: [
        dealcloud,
        "ignoreNearDups",
      ],
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.entryTypeId) {
      return props;
    }
    const fields = await this.dealcloud.getEntryTypeFields({
      entryTypeId: this.entryTypeId,
    });
    return convertFieldsToProps(fields);
  },
  async run({ $ }) {
    const {
      dealcloud, entryTypeId, ignoreNearDups, ...props
    } = this;
    const response = await dealcloud.createEntry({
      $,
      entryTypeId,
      data: {
        storeRequests: Object.entries(props).map(([
          key,
          value,
        ]) => {
          const fieldId = key.split("_")[1];
          return {
            entryId: -1,
            fieldId,
            ignoreNearDups,
            value,
          };
        }),
      },
    });

    $.export("$summary", "Successfully created record");
    // add id to summary when we know the response schema
    return response;
  },
};

