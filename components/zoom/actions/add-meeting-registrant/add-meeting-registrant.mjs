// legacy_hash_id: a_zNiweO
import { axios } from "@pipedream/platform";

export default {
  key: "zoom-add-meeting-registrant",
  name: "Add Meeting Registrant",
  description: "Registers a participant for a meeting.",
  version: "0.2.1",
  type: "action",
  props: {
    zoom: {
      type: "app",
      app: "zoom",
    },
    meeting_id: {
      type: "string",
      description: "The meeting ID.",
    },
    occurrence_ids: {
      type: "string",
      description: "Occurrence IDs. You can find these with the meeting get API. Multiple values separated by comma.",
      optional: true,
    },
    email: {
      type: "string",
      description: "A valid email address of the registrant.",
    },
    first_name: {
      type: "string",
      description: "Registrant's first name.",
    },
    last_name: {
      type: "string",
      description: "Registrant's last name.",
    },
    address: {
      type: "string",
      description: "Registrant's address.",
      optional: true,
    },
    city: {
      type: "string",
      description: "Registrant's city.",
      optional: true,
    },
    country: {
      type: "string",
      description: "Registrant's country.",
      optional: true,
    },
    zip: {
      type: "string",
      description: "Registrant's Zip/Postal code.",
      optional: true,
    },
    state: {
      type: "string",
      description: "Registrant's State/Province.",
      optional: true,
    },
    phone: {
      type: "string",
      description: "Registrant's Phone number.",
      optional: true,
    },
    industry: {
      type: "string",
      description: "Registrant's industry.",
      optional: true,
    },
    org: {
      type: "string",
      description: "Registrant's Organization.",
      optional: true,
    },
    job_title: {
      type: "string",
      description: "Registrant's job title.",
      optional: true,
    },
    purchasing_time_frame: {
      type: "string",
      description: "This field can be included to gauge interest of webinar attendees towards buying your product or service.",
      optional: true,
    },
    role_in_purchase_process: {
      type: "string",
      description: "Role in Purchase Process.",
      optional: true,
    },
    no_of_employees: {
      type: "string",
      description: "Number of Employees.",
      optional: true,
    },
    comments: {
      type: "string",
      description: "A field that allows registrants to provide any questions or comments that they might have.",
      optional: true,
    },
    custom_questions: {
      type: "any",
      description: "Custom questions.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs here: https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingregistrantcreate
    const config = {
      method: "post",
      url: `https://api.zoom.us/v2/meetings/${this.meeting_id}/registrants`,
      params: {
        occurrence_ids: this.occurrence_ids,
      },
      data: {
        email: this.email,
        first_name: this.first_name,
        last_name: this.last_name,
        address: this.address,
        city: this.city,
        country: this.country,
        zip: this.zip,
        state: this.state,
        phone: this.phone,
        industry: this.industry,
        org: this.org,
        job_title: this.job_title,
        purchasing_time_frame: this.purchasing_time_frame,
        role_in_purchase_process: this.role_in_purchase_process,
        no_of_employees: this.no_of_employees,
        comments: this.comments,
        custom_questions: typeof this.custom_questions == "undefined"
          ? this.custom_questions
          : JSON.parse(this.custom_questions),
      },
      headers: {
        "Authorization": `Bearer ${this.zoom.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      },
    };
    return await axios($, config);
  },
};
