import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import hippoVideo from "../../hippo_video.app.mjs";

export default {
  key: "hippo_video-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in Hippo Video. [See the documentation](https://documenter.getpostman.com/view/5278433/Tz5naxpW#a4d73ffe-a2b6-4d68-a1ee-9fbc1417a955)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hippoVideo,
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "Email Address of the Contact/Lead/Prospect.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First Name of the Contact/Lead/Prospect.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last Name of the Contact/Lead/Prospect.",
    },
    companyName: {
      type: "string",
      label: "Company name",
      description: "Company Name of the Contact/Lead/Prospect.",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes for the lead/prospect/contact.",
    },
    context: {
      type: "string",
      label: "Context",
      description: "If sales, will be added as a prospect. If empty, will be added as people.",
      optional: true,
    },
    listIds: {
      propDefinition: [
        hippoVideo,
        "listIds",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hippoVideo.createContact({
      $,
      data: {
        contact_email: this.contactEmail,
        first_name: this.firstName,
        last_name: this.lastName,
        company_name: this.companyName,
        notes: this.notes,
        context: this.context,
        list_ids: parseObject(this.listIds)?.join(),
      },
    });

    if (!response.status) throw new ConfigurationError(response.message);

    $.export("$summary", `Successfully created contact with Id: ${response.contact_id}`);
    return response;
  },
};
