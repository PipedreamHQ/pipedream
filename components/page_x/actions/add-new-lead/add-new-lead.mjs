import pageX from "../../page_x.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "page_x-add-new-lead",
  name: "Add New Lead",
  description: "Create a new lead on PageX CRM. [See the documentation](https://rapidapi.com/thunderhurt/api/pagexcrm)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    pageX,
    customerId: {
      propDefinition: [
        pageX,
        "customerId",
      ],
    },
    email: {
      propDefinition: [
        pageX,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        pageX,
        "phone",
      ],
    },
    name: {
      propDefinition: [
        pageX,
        "name",
      ],
    },
    more: {
      propDefinition: [
        pageX,
        "more",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pageX.createLead({
      customerId: this.customerId,
      email: this.email,
      phone: this.phone,
      name: this.name,
      more: this.more,
    });

    $.export("$summary", `Successfully created lead with email: ${this.email}`);
    return response;
  },
};
