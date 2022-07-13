import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { contact } from "../../types/responseSchemas";
import { getContactParams } from "../../types/requestParams";

export default defineAction({
  name: "Get Contact",
  description: "Retrieve details of a Contact [See docs here](https://developer.infusionsoft.com/docs/rest/#operation/getContactUsingGET)",
  key: "infusionsoft-get-contact",
  version: "0.0.1",
  type: "action",
  props: {
    infusionsoft,
    contactId: {
      propDefinition: [
        infusionsoft,
        "contactId"
      ]
    }
  },
  async run({ $ }): Promise<contact> {
    const params: getContactParams = {
      contactId: this.contactId
    }
    const data: contact = await this.infusionsoft.getContact(params);

    $.export("$summary", `Retrieved Contact "${data.given_name ?? data.id.toString()}" successfully`);

    return data;
  },
});
