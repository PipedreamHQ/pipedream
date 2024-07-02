import fattureInCloud from "../../fatture_in_cloud.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fatture_in_cloud-create-client",
  name: "Create Client",
  description: "Creates a new client. [See the documentation](https://developers.fattureincloud.it/api-reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fattureInCloud,
    companyid: {
      propDefinition: [
        fattureInCloud,
        "companyid",
      ],
    },
    name: {
      propDefinition: [
        fattureInCloud,
        "name",
      ],
    },
    code: {
      propDefinition: [
        fattureInCloud,
        "code",
      ],
    },
    type: {
      propDefinition: [
        fattureInCloud,
        "type",
      ],
    },
    firstName: {
      propDefinition: [
        fattureInCloud,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        fattureInCloud,
        "lastName",
      ],
    },
    vatNumber: {
      propDefinition: [
        fattureInCloud,
        "vatNumber",
      ],
    },
    email: {
      propDefinition: [
        fattureInCloud,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        fattureInCloud,
        "phone",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fattureInCloud.createClient({
      companyid: this.companyid,
      name: this.name,
      code: this.code,
      type: this.type,
      firstName: this.firstName,
      lastName: this.lastName,
      vatNumber: this.vatNumber,
      email: this.email,
      phone: this.phone,
    });

    $.export("$summary", `Successfully created client with name ${this.name}`);
    return response;
  },
};
