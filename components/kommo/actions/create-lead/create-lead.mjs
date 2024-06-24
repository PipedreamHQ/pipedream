import kommo from "../../kommo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kommo-create-lead",
  name: "Create Lead",
  description: "Creates a new lead in the Kommo app. [See the documentation](https://www.kommo.com/developers/content/api_v4/leads-api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    kommo,
    leadDetails: {
      propDefinition: [
        kommo,
        "leadDetails",
      ],
    },
    contactDetails: {
      propDefinition: [
        kommo,
        "contactDetails",
      ],
    },
    relatedCompanyDetails: {
      propDefinition: [
        kommo,
        "relatedCompanyDetails",
      ],
      optional: true,
    },
    relatedIndividualDetails: {
      propDefinition: [
        kommo,
        "relatedIndividualDetails",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.kommo.createLead({
      leadDetails: this.leadDetails,
      contactDetails: this.contactDetails,
      relatedCompanyDetails: this.relatedCompanyDetails,
      relatedIndividualDetails: this.relatedIndividualDetails,
    });

    $.export("$summary", `Successfully created lead with ID: ${response[0].id}`);
    return response;
  },
};
