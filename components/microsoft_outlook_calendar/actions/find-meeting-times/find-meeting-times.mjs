import { ConfigurationError } from "@pipedream/platform";
import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";
import utils from "../../common/utils.mjs";

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
    duration: {
      type: "integer",
      label: "Duration (Minutes)",
      description: "Optional. Meeting duration in minutes. Defaults to 30.",
      optional: true,
      default: 30,
      min: 1,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Optional. Maximum number of meeting time suggestions to return (default: 20, max: 50).",
      optional: true,
      min: 1,
      max: 50,
      default: 20,
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
      default: true,
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
    const userId = this.userId?.trim();

    const cleanedAttendees = utils.normalizeStringArray(this.attendees);
    const cleanedResourceAttendees = utils.normalizeStringArray(this.resourceAttendees);
    const cleanedLocations = utils.normalizeStringArray(this.locations);
    const startMs = Date.parse(this.start);
    const endMs = Date.parse(this.end);
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || startMs >= endMs) {
      throw new Error("`start` must be before `end` and both must be valid date-time strings.");
    }

    const attendees = [
      ...cleanedAttendees.map((address) => this._toAttendeeBase(address, "required")),
      ...cleanedResourceAttendees.map((address) => this._toAttendeeBase(address, "resource")),
    ];
    if (!attendees.length) {
      throw new ConfigurationError("Provide at least one attendee or resource attendee email address.");
    }

    const durationMinutes = utils.clampInt(this.duration, {
      min: 1,
      max: 24 * 60,
    }) ?? 30;
    const meetingDuration = `PT${durationMinutes}M`;

    const maxCandidates = utils.clampInt(this.maxResults, {
      min: 1,
      max: 50,
    }) ?? 20;

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
      maxCandidates,
      meetingDuration,
      ...(this.minimumAttendeePercentage !== undefined
        ? {
          minimumAttendeePercentage: this.minimumAttendeePercentage,
        }
        : {}),
      returnSuggestionReasons: this.returnSuggestionReasons ?? true,
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

    const graphResponse = await this.microsoftOutlook.findMeetingTimes({
      $,
      userId,
      timeZone: this.timeZone,
      data: body,
    });

    const suggestionCount = graphResponse?.meetingTimeSuggestions?.length ?? 0;
    $.export("$summary", suggestionCount
      ? `Successfully found ${suggestionCount} meeting time suggestion${suggestionCount === 1
        ? ""
        : "s"}`
      : `No meeting time suggestions found${graphResponse?.emptySuggestionsReason
        ? ` (${graphResponse.emptySuggestionsReason})`
        : ""}`);

    const meetingTimesData = (graphResponse?.meetingTimeSuggestions ?? []).map((time) => ({
      confidence: time.confidence,
      organizerAvailability: time.organizerAvailability,
      attendeeAvailability: time.attendeeAvailability,
      meetingTimeSlot: time.meetingTimeSlot,
      suggestionReason: time.suggestionReason,
      locations: time.locations,
    }));

    return {
      data: meetingTimesData,
    };
  },
};

