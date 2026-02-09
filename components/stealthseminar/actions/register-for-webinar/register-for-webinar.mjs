import stealthSeminar from "../../stealthseminar.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "stealthseminar-register-for-webinar",
  name: "Register for Webinar",
  description: "Register for a webinar. [See the documentation](https://docs.stealthseminarapp.com/#register-for-a-webinar)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    stealthSeminar,
    shortId: {
      propDefinition: [
        stealthSeminar,
        "shortId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The registrant's email address",
    },
    startTime: {
      propDefinition: [
        stealthSeminar,
        "startTime",
        ({ shortId }) => ({
          shortId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The registrant's name. If no name is provided, the attendee will appear as 'Guest-######' in webinar interactions.",
      optional: true,
    },
    yesterdaysNow: {
      type: "boolean",
      label: "Yesterdays Now",
      description: "If true, the registration is for a \"Watch Yesterday's Webinar Now\" event",
      optional: true,
    },
    registrationPageId: {
      type: "string",
      label: "Registration Page ID",
      description: "Identifier of the registration page from which the user registered",
      optional: true,
    },
    smsNumber: {
      type: "string",
      label: "SMS Number",
      description: "Phone number for sending SMS reminders",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The registrant's timezone - one of the [TZ database names](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)",
      optional: true,
    },
    gdprConsentReceived: {
      type: "boolean",
      label: "GDPR Consent Received",
      description: "Whether the registrant has given GDPR consent",
      optional: true,
    },
    linkParams: {
      type: "object",
      label: "Link Params",
      description: "	Object containing any marketing parameters (v1, v2, v3, v4, v5) or UTM parameters (utm_source, utm_medium, utm_campaign, utm_term, utm_content) and their values",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Object containing any additional registration information about the attendee. These values will be validated against the webinar's registration field configuration",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.stealthSeminar.registerForWebinar({
      $,
      shortId: this.shortId,
      data: {
        email: this.email,
        start_time: this.startTime,
        name: this.name,
        yesterdays_now: this.yesterdaysNow,
        registration_page_id: this.registrationPageId,
        sms_number: this.smsNumber,
        timezone: this.timezone,
        gdprConsentReceived: this.gdprConsentReceived,
        linkParams: parseObject(this.linkParams),
        customFields: parseObject(this.customFields),
      },
    });

    $.export("$summary", `Successfully registered for webinar ${this.shortId}.`);
    return response;
  },
};
