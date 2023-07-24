import {
  checkForSuccess,
  convertToJSON,
  convertToXML,
} from "../../common/xml.mjs";
import app from "../../credit_repair_cloud.app.mjs";

export default {
  name: "Get Client",
  description: "Get Client [See the documentation](https://app.creditrepaircloud.com/webapi/examples).",
  key: "credit_repair_cloud-get-client",
  version: "0.0.2",
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
    console.log(data);
    const rawRes = await this.app.getClient(data);
    const res = await convertToJSON(rawRes);
    checkForSuccess(res);

    $.export("summary", `Client successfully retrieved with id "${this.id}".`);
    return res;
  },
};
