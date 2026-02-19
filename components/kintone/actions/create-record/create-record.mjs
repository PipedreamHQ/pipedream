import { parseObject } from "../../common/utils.mjs";
import kintone from "../../kintone.app.mjs";

export default {
  key: "kintone-create-record",
  name: "Create Record",
  description: "Adds a new record to a Kintone App. [See the documentation](https://kintone.dev/en/docs/kintone/rest-api/records/add-record/)",
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
    record: {
      propDefinition: [
        kintone,
        "record",
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.kintone.addRecord({
        $,
        data: {
          app: this.appId,
          record: parseObject(this.record),
        },
      });

      $.export("$summary", `Successfully created record (ID: ${response.id})`);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
