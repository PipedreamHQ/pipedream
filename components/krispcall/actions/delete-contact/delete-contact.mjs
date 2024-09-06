import krispcall from "../../krispcall.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "krispcall-delete-contact",
  name: "Delete Contacts",
  description: "Deletes a list of contacts. [See the documentation](https://documenter.getpostman.com/view/32476792/2sa3dxfcal)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    krispcall,
    contactIds: {
      propDefinition: [
        krispcall,
        "contactIds",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.krispcall.deleteContacts({
      contactIds: this.contactIds,
    });
    $.export("$summary", `Deleted ${this.contactIds.length} contact(s) successfully`);
    return response;
  },
};
