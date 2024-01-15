import workamajig from "../../workamajig.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "workamajig-update-contact",
  name: "Update Contact",
  description: "This component updates a specific contact in Workamajig. [See the documentation](https://app6.workamajig.com/platinum?qs=55df78cc97fb074667db8615c0d25643f39bb9793d1b3d8e875cc9829c30be1b&a=47138aae4fd80818df9275116ee90434407e7153d645c1e99cd7f9784169eb9c7697e47f3a9d70f36f85a6257710ffce)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    workamajig,
    contactId: {
      propDefinition: [
        workamajig,
        "contactId",
      ],
    },
    newContactDetails: {
      propDefinition: [
        workamajig,
        "newContactDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.workamajig.updateContact({
      contactId: this.contactId,
      newContactDetails: this.newContactDetails,
    });
    $.export("$summary", `Successfully updated contact with ID: ${this.contactId}`);
    return response;
  },
};
