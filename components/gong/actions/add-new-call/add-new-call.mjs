// x-pd-ai: optimized
import app from "../../gong.app.mjs";
import LANGS from "../../common/languages.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "gong-add-new-call",
  name: "Add New Call",
  description: `Upload a call recording. Returns the new call's ID. [See the documentation](${constants.DOCS_URL}#post-/v2/calls)`,
  type: "action",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      description: "A list of the call's participants, each a JSON object, e.g. `{ \"name\": \"Name\", \"emailAddress\": \"email@example.com\", \"phoneNumber\": \"123123\", \"mediaChannelId\": 1 }`. Set `userId` on the one party who is the internal Gong user hosting the call, e.g. `{ \"name\": \"Rep Name\", \"userId\": \"123456789\" }`; leave it off everyone else so external attendees are not recorded as employees. If no party sets `userId`, the **Primary User** is attached to the first party, since Gong requires a party for the primary user. Always quote `userId` as a string: Gong IDs run to 20 digits, and an unquoted JSON number above 2^53 loses precision (`4011503062935085673` parses as `4011503062935085600`).",
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

      const parsed = utils.parseArray(parties).map((party) => utils.parse(party));

      // `userId` identifies which party is a Gong user, so it must not be
      // stamped onto every party: that would mark the customer as the rep. Gong
      // require a primary user, so when no party claims the primary user,
      // attach it to the first party that is not already someone else.
      // Compared as strings: parties are caller-supplied JSON, so a numeric
      // `userId` would never match the string `primaryUser` and the fallback
      // would then attribute the call to the wrong party.
      const hasPrimaryUser = parsed.some(({ userId }) =>
        userId && String(userId) === String(primaryUser));

      if (!hasPrimaryUser) {
        const unattributed = parsed.find(({ userId }) => !userId);
        if (unattributed) {
          unattributed.userId = primaryUser;
        }
      }

      return parsed;
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
