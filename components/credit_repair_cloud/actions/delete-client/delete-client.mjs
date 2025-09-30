import {
  checkForSuccess,
  convertToJSON,
  convertToXML,
  getResult,
} from "../../common/xml.mjs";
import app from "../../credit_repair_cloud.app.mjs";

export default {
  name: "Delete Client",
  description: "Delete Client [See the documentation](https://app.creditrepaircloud.com/webapi/examples).",
  key: "credit_repair_cloud-delete-client",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    const rawRes = await this.app.deleteClient(data);
    const resJson = await convertToJSON(rawRes);
    checkForSuccess(resJson);

    const res = getResult(resJson);
    $.export("summary", `Client successfully deleted with id "${this.id}".`);
    return res;
  },
};
