import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import kintone from "../../kintone.app.mjs";

export default {
  key: "kintone-update-record",
  name: "Update Record",
  description: "Updates an existing record in a Kintone App. [See the documentation](https://kintone.dev/en/docs/kintone/rest-api/records/update-record/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    kintone,
    appId: {
      propDefinition: [
        kintone,
        "appId",
      ],
    },
    recordId: {
      propDefinition: [
        kintone,
        "recordId",
        ({ appId }) => ({
          appId,
        }),
      ],
    },
    updateKeyField: {
      type: "string",
      label: "Unique Key Field Code",
      description: "The field code of the unique key (when using `Update Key` instead of Record ID). Must have 'Prohibit duplicate values' enabled",
      optional: true,
    },
    updateKeyValue: {
      type: "string",
      label: "Unique Key Value",
      description: "The value of the unique key to identify the record",
      optional: true,
    },
    revision: {
      type: "integer",
      label: "Revision",
      description: "The expected revision number. If the value does not match, an error will occur and the record will not be updated. If the value is not specified, the revision number will not be checked",
      optional: true,
    },
    record: {
      propDefinition: [
        kintone,
        "record",
      ],
    },
  },
  async run({ $ }) {
    if (!this.recordId && !this.updateKeyField) {
      throw new ConfigurationError("Either `Record ID` or `Update Key Field` must be provided");
    }
    if (this.recordId && this.updateKeyField) {
      throw new ConfigurationError("Cannot specify both `Record ID` and `Update Key`");
    }

    let updateKey;
    if (this.updateKeyField && this.updateKeyValue) {
      updateKey = {
        field: this.updateKeyField,
        value: this.updateKeyValue,
      };
    }

    const response = await this.kintone.updateRecord({
      $,
      data: {
        app: this.appId,
        id: this.recordId,
        updateKey,
        revision: this.revision === undefined
          ? -1
          : this.revision,
        record: parseObject(this.record),
      },
    });

    $.export("$summary", `Successfully updated record (revision: ${response.revision})`);
    return response;
  },
};
