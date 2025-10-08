import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { Contact } from "../../types/responseSchemas";
import { GetObjectParams } from "../../types/requestParams";

export default defineAction({
  name: "Get Contact",
  description:
    "Retrieve details of a Contact [See docs here](https://developer.infusionsoft.com/docs/rest/#operation/getContactUsingGET)",
  key: "infusionsoft-get-contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    infusionsoft,
    contactId: {
      propDefinition: [
        infusionsoft,
        "contactId",
      ],
    },
  },
  async run({ $ }): Promise<Contact> {
    const params: GetObjectParams = {
      $,
      id: this.contactId,
    };
    const data: Contact = await this.infusionsoft.getContact(params);

    $.export(
      "$summary",
      `Retrieved Contact "${
        data.given_name ?? data.id.toString()
      }" successfully`,
    );

    return data;
  },
});
