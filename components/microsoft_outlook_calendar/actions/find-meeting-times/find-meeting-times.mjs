import { axios } from "@pipedream/platform";
import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";

export default {
  key: "microsoft_outlook_calendar-find-meeting-times",
  name: "Find Meeting Times",
  description: "Suggest meeting times and locations based on organizer and attendee availability. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-findmeetingtimes?view=graph-rest-1.0)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftOutlook,
    userId: {
      type: "string",
      label: "User ID or UPN",
      description: "Optional. If set, runs the request for a specific user (`/users/{id|userPrincipalName}/findMeetingTimes`). If unset, uses the signed-in user (`/me/findMeetingTimes`).",
      optional: true,
    },
    attendees: {
      type: "string[]",
      label: "Attendees",
      description: "Optional. A list of attendee email addresses.",
      optional: true,
    },
    resourceAttendees: {
      type: "string[]",
      label: "Resource Attendees",
      description: "Optional. A list of resource email addresses (for example, rooms/equipment).",
      optional: true,
    },
    start: {
      propDefinition: [
        microsoftOutlook,
        "start",
      ],
    },
    end: {
      propDefinition: [
        microsoftOutlook,
        "end",
      ],
    },
    timeZone: {
      propDefinition: [
        microsoftOutlook,
        "timeZone",
      ],
    },
    activityDomain: {
      type: "string",
      label: "Activity Domain",
      description: "Optional. Restrict suggestions to work hours, personal hours, or unrestricted.",
      options: [
        "work",
        "personal",
        "unrestricted",
      ],
      default: "work",
      optional: true,
    },
    meetingDuration: {
      type: "string",
      label: "Meeting Duration",
      description: "Optional. Meeting duration in ISO 8601 format (for example, `PT30M`, `PT1H`, `PT2H30M`). Defaults to 30 minutes if omitted by Microsoft Graph.",
      optional: true,
    },
    maxCandidates: {
      type: "integer",
      label: "Max Candidates",
      description: "Optional. The maximum number of meeting suggestions to return.",
      optional: true,
      min: 1,
    },
    minimumAttendeePercentage: {
      type: "integer",
      label: "Minimum Attendee Percentage",
      description: "Optional. Minimum confidence (0-100) for a suggestion to be returned.",
      optional: true,
      min: 0,
      max: 100,
    },
    isOrganizerOptional: {
      type: "boolean",
      label: "Is Organizer Optional",
      description: "Optional. Set to true if the organizer doesn't necessarily have to attend.",
      optional: true,
    },
    returnSuggestionReasons: {
      type: "boolean",
      label: "Return Suggestion Reasons",
      description: "Optional. Set to true to include a reason for each suggestion in the response.",
      optional: true,
    },
    suggestLocation: {
      type: "boolean",
      label: "Suggest Location",
      description: "Optional. Set to true to ask Microsoft Graph to suggest meeting locations.",
      optional: true,
    },
    locations: {
      type: "string[]",
      label: "Locations",
      description: "Optional. A list of location display names to constrain suggestions (for example, conference room names).",
      optional: true,
    },
    isLocationRequired: {
      type: "boolean",
      label: "Location Required",
      description: "Optional. Set to true if a location is required for the suggestion.",
      optional: true,
    },
  },
  methods: {
    _normalizeStringArray(values) {
      return (values ?? [])
        .map((v) => v?.toString?.().trim())
        .filter(Boolean);
    },
    _toAttendeeBase(address, type) {
      return {
        type,
        emailAddress: {
          address,
        },
      };
    },
  },
  async run({ $ }) {
    const token = this.microsoftOutlook?.$auth?.oauth_access_token;
    if (!token) {
      throw new Error("Missing OAuth access token for Microsoft Outlook Calendar.");
    }

    const userId = this.userId?.trim();
    const basePath = userId
      ? `/users/${encodeURIComponent(userId)}`
      : "/me";

    const cleanedAttendees = this._normalizeStringArray(this.attendees);
    const cleanedResourceAttendees = this._normalizeStringArray(this.resourceAttendees);
    const cleanedLocations = this._normalizeStringArray(this.locations);

    const attendees = [
      ...cleanedAttendees.map((address) => this._toAttendeeBase(address, "required")),
      ...cleanedResourceAttendees.map((address) => this._toAttendeeBase(address, "resource")),
    ];

    const body = {
      ...(attendees.length
        ? {
          attendees,
        }
        : {}),
      ...(this.isOrganizerOptional !== undefined
        ? {
          isOrganizerOptional: this.isOrganizerOptional,
        }
        : {}),
      ...(this.maxCandidates !== undefined
        ? {
          maxCandidates: this.maxCandidates,
        }
        : {}),
      ...(this.meetingDuration
        ? {
          meetingDuration: this.meetingDuration,
        }
        : {}),
      ...(this.minimumAttendeePercentage !== undefined
        ? {
          minimumAttendeePercentage: this.minimumAttendeePercentage,
        }
        : {}),
      ...(this.returnSuggestionReasons !== undefined
        ? {
          returnSuggestionReasons: this.returnSuggestionReasons,
        }
        : {}),
      timeConstraint: {
        activityDomain: this.activityDomain,
        timeSlots: [
          {
            start: {
              dateTime: this.start,
              timeZone: this.timeZone,
            },
            end: {
              dateTime: this.end,
              timeZone: this.timeZone,
            },
          },
        ],
      },
      ...(this.suggestLocation !== undefined
        || cleanedLocations.length
        || this.isLocationRequired !== undefined
        ? {
          locationConstraint: {
            ...(this.isLocationRequired !== undefined
              ? {
                isRequired: this.isLocationRequired,
              }
              : {}),
            ...(this.suggestLocation !== undefined
              ? {
                suggestLocation: this.suggestLocation,
              }
              : {}),
            ...(cleanedLocations.length
              ? {
                locations: cleanedLocations.map((displayName) => ({
                  resolveAvailability: false,
                  displayName,
                })),
              }
              : {}),
          },
        }
        : {}),
    };

    const { data } = await axios($, {
      method: "POST",
      url: `https://graph.microsoft.com/v1.0${basePath}/findMeetingTimes`,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(this.timeZone
          ? {
            Prefer: `outlook.timezone="${this.timeZone}"`,
          }
          : {}),
      },
      data: body,
    });

    const suggestionCount = data?.meetingTimeSuggestions?.length ?? 0;
    $.export("$summary", suggestionCount
      ? `Successfully found ${suggestionCount} meeting time suggestion${suggestionCount === 1
        ? ""
        : "s"}`
      : `No meeting time suggestions found${data?.emptySuggestionsReason
        ? ` (${data.emptySuggestionsReason})`
        : ""}`);

    return data;
  },
};

