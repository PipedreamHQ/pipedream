import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "zoom",
  propDefinitions: {
    webinarId: {
      type: "string",
      label: "Webinar",
      description: "The webinar to get details for",
      async options({ prevContext }) {
        const { nextPageToken } = prevContext;
        const response = await this.listWebinars({
          params: {
            next_page_token: nextPageToken,
          },
        });
        const options = response.webinars.map(({
          id: value, topic: label,
        }) => ({
          label,
          value,
        }));
        return {
          context: {
            nextPageToken: response.next_page_token,
          },
          options,
        };
      },
    },
    meetingId: {
      type: "integer",
      label: "Meeting ID",
      description: "The meeting ID to get details for",
      async options({ prevContext }) {
        const { nextPageToken } = prevContext;
        const response = await this.listMeetings({
          params: {
            next_page_token: nextPageToken,
          },
        });
        const options = response.meetings.map((meeting) => ({
          label: `${meeting.topic} (${meeting.id})`,
          value: meeting.id,
        }));
        return {
          options,
          context: {
            nextPageToken: response.next_page_token,
          },
        };
      },
    },
    userId: {
      type: "string",
      label: "User Id",
      description: "The user ID or email address of the user",
      async options({ prevContext }) {
        const { nextPageToken } = prevContext;
        const response = await this.listUsers({
          params: {
            next_page_token: nextPageToken,
          },
        });

        return {
          options: response.users.map(({
            display_name: name, email, id: value,
          }) => ({
            label: `${name} - ${email}`,
            value,
          })),
          context: {
            nextPageToken: response.next_page_token,
          },
        };
      },
    },
    phoneUserId: {
      type: "string",
      label: "User Id",
      description: "The user ID or email address of the user",
      async options({ prevContext }) {
        const { nextPageToken } = prevContext;
        const response = await this.listPhoneUsers({
          params: {
            next_page_token: nextPageToken,
          },
        });

        return {
          options: response.users.map(({
            name, email, id: value,
          }) => ({
            label: `${name} - ${email}`,
            value,
          })),
          context: {
            nextPageToken: response.next_page_token,
          },
        };
      },
    },
    includeAudioRecordings: {
      type: "boolean",
      label: "Include Audio Recordings",
      description: "This source emits video (MP4) recordings only by default. Set this prop to true to include audio recordings",
      optional: true,
      default: false,
    },
    includeChatTranscripts: {
      type: "boolean",
      label: "Include Chat Transcripts",
      description: "This source emits video (MP4) recordings only by default. Set this prop to `true` to include chat transcripts",
      optional: true,
      default: false,
    },
    occurrenceIds: {
      type: "string[]",
      label: "Occurrence IDs",
      description: "An array of meeting occurance IDs to register for",
      optional: true,
      async options({
        meetingId, webinarId,
      }) {
        const { occurrences } = meetingId
          ? await this.getMeeting({
            meetingId,
          })
          : await this.getWebinar({
            webinarId,
          });
        return occurrences?.map(({
          occurrence_id: value, start_time: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "A valid email address of the registrant",
      async options({ prevContext }) {
        const { nextPageToken } = prevContext;
        const response = await this.listUsers({
          params: {
            next_page_token: nextPageToken,
          },
        });

        return {
          options: response.users.map(({
            display_name: name, email,
          }) => ({
            label: `${name} - ${email}`,
            value: email,
          })),
          context: {
            nextPageToken: response.next_page_token,
          },
        };
      },
    },
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "The Channel Id of the channel where you would like to send a message",
      optional: true,
      async options({ prevContext }) {
        const { nextPageToken } = prevContext;
        const response = await this.listChannels({
          params: {
            next_page_token: nextPageToken,
          },
        });

        return {
          options: response.channels?.map(({
            name: label, id: value,
          }) => ({
            label,
            value,
          })) || [],
          context: {
            nextPageToken: response.next_page_token,
          },
        };
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Registrant's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Registrant's last name",
    },
    address: {
      type: "string",
      label: "Address",
      description: "Registrant's address",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Registrant's city",
      optional: true,
    },
    state: {
      type: "string",
      label: "State/Province",
      description: "Registrant's State/Province",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip/Postal Code",
      description: "Registrant's Zip/Postal code",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Registrant's country",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Registrant's Phone number",
      optional: true,
    },
    industry: {
      type: "string",
      label: "Industry",
      description: "Registrant's industry",
      optional: true,
    },
    org: {
      type: "string",
      label: "Organization",
      description: "Registrant's Organization",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Registrant's job title",
      optional: true,
    },
    purchasingTimeFrame: {
      type: "string",
      label: "Purchasing Time Frame",
      description: "This field can be included to gauge interest of webinar attendees towards buying your product or service.",
      options: [
        "Within a month",
        "1-3 months",
        "4-6 months",
        "More than 6 months",
        "No timeframe",
      ],
      optional: true,
    },
    roleInPurchaseProcess: {
      type: "string",
      label: "Role in Purchase Process",
      description: "Role in Purchase Process",
      options: [
        "Decision Maker",
        "Evaluator/Recommender",
        "Influencer",
        "Not involved",
      ],
      optional: true,
    },
    noOfEmployees: {
      type: "string",
      label: "Number of Employees",
      description: "The registrant's number of employees",
      optional: true,
    },
    comments: {
      type: "string",
      label: "Comments",
      description: "The registrant's questions and comments",
      optional: true,
    },
    customQuestions: {
      type: "string",
      label: "Custom Questions",
      description: "An array of objects containing the keys **title** (the title of the question) and **value** (the question's response value). Example: `[{ \"title\": \"What do you hope to learn from this?\", \"value\": \"Look forward to learning how you come up with new recipes and what other services you offer.\" }]`",
      optional: true,
    },
    nextPageToken: {
      type: "string",
      label: "Next Page Token",
      description: "Use the next page token to paginate through large result sets. A next page token is returned whenever the set of available results exceeds the current page size. This token's expiration period is 15 minutes. Example: `IAfJX3jsOLW7w3dokmFl84zOa0MAVGyMEB2`",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Max Resources",
      description: "The maximum number of resources to retrieve",
      optional: true,
      default: constants.MAX_RESOURCES,
      min: 1,
    },
    topic: {
      type: "string",
      label: "Topic",
      description: "The meeting's topic",
      optional: true,
    },
    type: {
      type: "integer",
      label: "Type",
      description: "The type of meeting",
      options: [
        {
          label: "An instant meeting",
          value: 1,
        },
        {
          label: "A scheduled meeting",
          value: 2,
        },
        {
          label: "A recurring meeting with no fixed time",
          value: 3,
        },
        {
          label: "A recurring meeting with fixed time",
          value: 8,
        },
        {
          label: "A screen share only meeting",
          value: 10,
        },
      ],
      optional: true,
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Meeting start time. We support two formats for start_time - local time and GMT.\nTo set time as GMT the format should be yyyy-MM-ddTHH:mm:ssZ.\nTo set time using a specific timezone, use yyyy-MM-ddTHH:mm:ss format and specify the timezone ID in the timezone field OR leave it blank and the timezone set on your Zoom account will be used. You can also set the time as UTC as the timezone field.\nThe start_time should only be used for scheduled and / or recurring webinars with fixed time.",
      optional: true,
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "Meeting duration (minutes). Used for scheduled meetings only.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "Time zone to format start_time. For example, America/Los_Angeles. For scheduled meetings only. Please reference our time [zone list](https://marketplace.zoom.us/docs/api-reference/other-references/abbreviation-lists#timezones) for supported time zones and their formats.",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password to join the meeting. Password may only contain the following characters: [a-z A-Z 0-9 @ - _ *]. Max of 10 characters.",
      optional: true,
    },
    agenda: {
      type: "string",
      label: "Agenda",
      description: "The meeting's agenda",
      optional: true,
    },
    trackingFields: {
      type: "string",
      label: "Tracking Fields",
      description: "An array of objects containing the keys **field** and **value**. Example `[{ \"field\": \"field\", \"value\": \"value1\" }]`",
      optional: true,
    },
    recurrence: {
      type: "object",
      label: "Recurrence",
      description: "Recurrence object. Use this object only for a meeting with type 8, a recurring meeting with a fixed time. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/meetings/POST/users/{userId}/meetings) for more information. Example: `{ \"end_date_time\": \"2022-04-02T15:59:00Z\", \"end_times\": 7, \"monthly_day\": 1, \"monthly_week\": 1, \"monthly_week_day\": 1, \"repeat_interval\": 1, \"type\": 1, \"weekly_days\": \"1\" }`",
      optional: true,
    },
    settings: {
      type: "object",
      label: "Settings",
      description: "Information about the meeting's settings. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/meetings/POST/users/{userId}/meetings) for more information. Example: `{ \"additional_data_center_regions\": [ \"TY\" ], \"allow_multiple_devices\": true, \"alternative_hosts\": \"jchill@example.com;thill@example.com\", \"alternative_hosts_email_notification\": true, \"approval_type\": 2, \"approved_or_denied_countries_or_regions\": { \"approved_list\": [ \"CX\" ], \"denied_list\": [ \"CA\" ], \"enable\": true, \"method\": \"approve\" } }`",
      optional: true,
    },
    paidAccountAlert: {
      type: "alert",
      alertType: "info",
      content: "This action requires a paid Zoom account.",
    },
  },
  methods: {
    _getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    _getHeaders(headers) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    _makeRequest({
      step = this, headers, path, ...args
    } = {}) {
      const config = {
        headers: this._getHeaders(headers),
        url: this._getUrl(path),
        ...args,
      };
      return axios(step, config);
    },
    create(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
    update(args = {}) {
      return this._makeRequest({
        method: "patch",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "delete",
        ...args,
      });
    },
    getPastMeetingDetails({
      meetingId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/past_meetings/${meetingId}`,
        ...args,
      });
    },
    getMeeting({
      meetingId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/meetings/${meetingId}`,
        ...args,
      });
    },
    getWebinar({
      webinarId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/webinars/${webinarId}`,
        ...args,
      });
    },
    listMeetings(args = {}) {
      return this._makeRequest({
        path: "/users/me/meetings",
        ...args,
      });
    },
    listWebinars({
      userId = "me", ...args
    } = {}) {
      return this._makeRequest({
        path: `/users/${userId}/webinars`,
        ...args,
      });
    },
    listWebinarMetrics(args = {}) {
      return this._makeRequest({
        path: "/metrics/webinars",
        ...args,
      });
    },
    listRecordings(args = {}) {
      return this._makeRequest({
        path: "/users/me/recordings",
        ...args,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listPhoneUsers(opts = {}) {
      return this._makeRequest({
        path: "/phone/users",
        ...opts,
      });
    },
    listCallLogs({
      userId, ...args
    }) {
      return this._makeRequest({
        path: `/phone/users/${userId}/call_logs`,
        ...args,
      });
    },
    listCallRecordings(args = {}) {
      return this._makeRequest({
        path: "/phone/recordings",
        ...args,
      });
    },
    listChannels(args = {}) {
      return this._makeRequest({
        path: "/chat/users/me/channels",
        ...args,
      });
    },
    listPastWebinarQA({
      webinarId, ...args
    }) {
      return this._makeRequest({
        path: `/past_webinars/${webinarId}/qa`,
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = constants.MAX_RESOURCES,
    }) {
      let nextPageToken = resourceFnArgs.params?.next_page_token;
      let resourcesCount = 0;

      while (true) {
        const response = await resourceFn({
          ...resourceFnArgs,
          params: {
            ...resourceFnArgs.params,
            next_page_token: nextPageToken,
          },
        });

        const nextResources = response[resourceName];

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return;
          }
        }

        nextPageToken = response.next_page_token;
        if (!nextPageToken) {
          return;
        }
      }
    },
  },
};
