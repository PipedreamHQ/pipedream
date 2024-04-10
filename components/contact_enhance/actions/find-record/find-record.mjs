import contactEnhance from "../../contact_enhance.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "contact_enhance-find-record",
  name: "Find Record",
  description: "Locates a specific record in the Contact Enhance database using the Record ID. [See the documentation](https://u.pcloud.link/publink/show?code=xz8tzp0zjao5gqh55futmeebwt0gojptqqgx)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    contactEnhance,
    recordId: {
      propDefinition: [
        contactEnhance,
        "recordId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.contactEnhance.getRecord({
      recordId: this.recordId,
    });
    $.export("$summary", `Successfully retrieved the record with ID ${this.recordId}`);
    return response;
  },
};
