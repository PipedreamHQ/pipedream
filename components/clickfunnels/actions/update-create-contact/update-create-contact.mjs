import clickfunnels from "../../clickfunnels.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "clickfunnels-update-create-contact",
  name: "Update or Create Contact",
  description: "Searches for a contact by email and updates it, or creates a new one if not found. [See the documentation](https://developers.myclickfunnels.com/reference/upsertcontact)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    clickfunnels,
    email: {
      propDefinition: [
        clickfunnels,
        "email",
      ],
    },
    contactDetails: {
      propDefinition: [
        clickfunnels,
        "contactDetails",
      ],
    },
  },
  async run({ $ }) {
    const {
      email, contactDetails = {},
    } = this;
    const response = await this.clickfunnels.searchOrCreateContact({
      email,
      contactDetails,
    });
    $.export("$summary", `Contact with email ${email} has been updated or created successfully.`);
    return response;
  },
};
