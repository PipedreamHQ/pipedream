import app from "../../gong.app.mjs";
import LANGS from "../../common/languages.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "gong-add-new-call",
  name: "Add New Call",
  description: "Add a new call. [See the documentation](https://us-66463.app.gong.io/settings/api/documentation#post-/v2/calls)",
  type: "action",
  version: "0.0.3",
  props: {
    app,
    clientUniqueId: {
      type: "string",
      label: "Client Unique ID",
      description: "A call's unique identifier in the PBX or the recording system. Gong uses this identifier to prevent repeated attempts to upload the same recording.",
    },
    actualStart: {
      type: "string",
      label: "Actual Start",
      description: "The actual date and time when the call started in the ISO-8601 format (e.g., `2018-02-18T02:30:00-07:00` or `2018-02-18T08:00:00Z`, where Z stands for UTC).",
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "Whether the call is inbound (someone called the company), outbound (a rep dialed someone outside the company), or a conference call.",
      options: constants.DIRECTIONS,
    },
    primaryUser: {
      label: "Primary User",
      description: "The Gong internal user ID of the team member who hosted the call.",
      propDefinition: [
        app,
        "userId",
      ],
    },
    parties: {
      type: "string[]",
      label: "Parties",
      description: "A list of the call's participants. A party must be provided for the **Primary User**. Each party can have a JSON stucture like this example: `{ \"phoneNumber\": \"123123\", \"emailAddress\": \"email@example.com\", \"name\": \"Name\", \"mediaChannelId\": \"1\" }`",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the call. This title is available in the Gong system for indexing and search.",
      optional: true,
    },
    purpose: {
      type: "string",
      label: "Purpose",
      description: "The purpose of the call. This optional field is a free text of up to 255 characters.",
      optional: true,
    },
    scheduledStart: {
      type: "string",
      label: "Scheduled Start",
      description: "The date and time the call was scheduled to begin in the ISO-8601 format (e.g., `2018-02-18T02:30:00-07:00` or `2018-02-18T08:00:00Z`, where Z stands for UTC);",
      optional: true,
    },
    scheduledEnd: {
      type: "string",
      label: "Scheduled End",
      description: "The date and time the call was scheduled to end in the ISO-8601 format (e.g., `2018-02-18T02:30:00-07:00` or `2018-02-18T08:00:00Z`, where Z stands for UTC);",
      optional: true,
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "The actual call duration in seconds.",
      optional: true,
    },
    disposition: {
      type: "string",
      label: "Disposition",
      description: "The disposition of the call. The disposition is free text of up to 255 characters.",
      optional: true,
    },
    meetingUrl: {
      type: "string",
      label: "Meeting URL",
      description: "The URL of the conference call by which users join the meeting",
      optional: true,
    },
    callProviderCode: {
      type: "string",
      label: "Call Provider Code",
      description: "The code identifies the provider conferencing or telephony system. For example: `zoom`, `clearslide`, `gotomeeting`, `ringcentral`, `outreach`, `insidesales`, etc. These values are predefined by Gong, please contact help@gong.io to find the proper value for your system.",
      optional: true,
      options: constants.CALL_PROVIDER_CODES,
    },
    downloadMediaUrl: {
      type: "string",
      label: "Download Media URL",
      description: "The URL from which Gong can download the media file. The URL must be unique, the audio or video file must be a maximum of 1.5GB. If you provide this URL, you should not perform the **Add call media** step.",
      optional: true,
    },
    workspaceId: {
      description: "Optional workspace identifier. If specified, the call will be placed into this workspace, otherwise, the default algorithm for workspace placement will be applied.",
      optional: true,
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "The language code the call should be transcribed to. This field is optional as Gong automatically detects the language spoken in the call and transcribes it accordingly. Set this field only if you are sure of the language the call is in.",
      optional: true,
      options: LANGS,
    },
  },
  methods: {
    addNewCall(args = {}) {
      return this.app.post({
        path: "/calls",
        ...args,
      });
    },
    getParties() {
      const {
        primaryUser,
        parties,
      } = this;

      return utils.parseArray(parties)
        .map((party) => {
          const parsed = utils.parse(party);
          return {
            ...parsed,
            userId: primaryUser,
          };
        });
    },
  },
  run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      getParties,
      addNewCall,
      ...data
    } = this;

    return addNewCall({
      step,
      data: {
        ...data,
        parties: getParties(),
      },
      summary: (response) => `Successfully added call with request ID \`${response.requestId}\``,
    });
  },
};
