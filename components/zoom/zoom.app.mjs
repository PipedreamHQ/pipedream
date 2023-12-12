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
      description: "The meeting ID to get details for.",
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
      optional: true,
    },
    includeAudioRecordings: {
      type: "boolean",
      label: "Include Audio Recordings",
      description:
        "This source emits video (MP4) recordings only by default. Set this prop to true to include audio recordings",
      optional: true,
      default: false,
    },
    includeChatTranscripts: {
      type: "boolean",
      label: "Include Chat Transcripts",
      description:
        "This source emits video (MP4) recordings only by default. Set this prop to `true` to include chat transcripts",
      optional: true,
      default: false,
    },
    occurrenceIds: {
      type: "string",
      label: "Occurrence IDs",
      description: "Occurrence IDs. You can find these with the meeting get API. Multiple values separated by comma.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "A valid email address of the registrant.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Registrant's first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Registrant's last name.",
    },
    address: {
      type: "string",
      label: "Address",
      description: "Registrant's address.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Registrant's city.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Registrant's country.",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip/Postal Code",
      description: "Registrant's Zip/Postal code.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State/Province",
      description: "Registrant's State/Province.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Registrant's Phone number.",
      optional: true,
    },
    industry: {
      type: "string",
      label: "Industry",
      description: "Registrant's industry.",
      optional: true,
    },
    org: {
      type: "string",
      label: "Organization",
      description: "Registrant's Organization.",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Registrant's job title.",
      optional: true,
    },
    purchasingTimeFrame: {
      type: "string",
      label: "Purchasing Time Frame",
      description: "This field can be included to gauge interest of webinar attendees towards buying your product or service.",
      optional: true,
    },
    roleInPurchaseProcess: {
      type: "string",
      label: "Role in Purchase Process",
      description: "Role in Purchase Process.",
      optional: true,
    },
    noOfEmployees: {
      type: "string",
      label: "Number of Employees",
      description: "Number of Employees.",
      optional: true,
    },
    comments: {
      type: "string",
      label: "Comments",
      description: "A field that allows registrants to provide any questions or comments that they might have.",
      optional: true,
    },
    customQuestions: {
      type: "string",
      label: "Custom Questions",
      description: "Custom questions.",
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
      description: "The maximum number of resources to retrieve.",
      optional: true,
      default: constants.MAX_RESOURCES,
      min: 1,
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
    getPastMeetingDetails({
      meetingId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/past_meetings/${meetingId}`,
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
