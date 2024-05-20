import hippoVideo from "../../hippo_video.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "hippo_video-create-contact",
  name: "Create Contact",
  description: "Creates a new contact in Hippo Video. Requires 'contact_name' and 'contact_email'. Optional prop: 'contact_phone_number'.",
  version: "0.0.1",
  type: "action",
  props: {
    hippoVideo,
    contactName: hippoVideo.propDefinitions.contactName,
    contactEmail: hippoVideo.propDefinitions.contactEmail,
    contactPhoneNumber: {
      ...hippoVideo.propDefinitions.contactPhoneNumber,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hippoVideo.createContact({
      contactName: this.contactName,
      contactEmail: this.contactEmail,
      contactPhoneNumber: this.contactPhoneNumber || undefined,
    });

    $.export("$summary", `Successfully created contact ${this.contactName}`);
    return response;
  },
};
