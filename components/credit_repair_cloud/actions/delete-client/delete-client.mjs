import {
  checkForSuccess,
  convertToJSON,
  convertToXML,
} from "../../common/xml.mjs";
import app from "../../credit_repair_cloud.app.mjs";

export default {
  name: "Delete Client",
  description: "Delete Client [See the documentation](https://app.creditrepaircloud.com/webapi/examples).",
  key: "credit_repair_cloud-delete-client",
  version: "0.0.13",
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
    const rawRes = await this.app.deleteClient(data);
    const res = await convertToJSON(rawRes);
    checkForSuccess(res);

    $.export("summary", `Client successfully deleted with id "${this.id}".`);
    return res;
  },
};
