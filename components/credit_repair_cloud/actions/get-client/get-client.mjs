import {
  checkForSuccess,
  convertToJSON,
  convertToXML,
  getResult,
} from "../../common/xml.mjs";
import app from "../../credit_repair_cloud.app.mjs";

export default {
  name: "Get Client",
  description: "Get Client [See the documentation](https://app.creditrepaircloud.com/webapi/examples).",
  key: "credit_repair_cloud-get-client",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "id",
      ],
    },
  },
  async run({ $ }) {
    const data = convertToXML({
      client: {
        id: this.id,
      },
    });
    const rawRes = await this.app.getClient(data);
    const resJson = await convertToJSON(rawRes);
    checkForSuccess(resJson);

    const res = getResult(resJson);
    $.export("summary", `Client successfully retrieved with id "${this.id}".`);
    return res;
  },
};
