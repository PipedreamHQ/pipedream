import app from "../../avinode.app.mjs";

export default {
  key: "avinode-create-trip",
  name: "Create Trip",
  description:
    "Create a trip in Avinode. [Create a trip](https://developer.avinodegroup.com/reference/createtrip)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    externalTripId: {
      type: "string",
      label: "External Trip ID",
      description:
        "A unique identifier for this trip in an external system",
      optional: true,
    },
    criteria: {
      type: "object",
      label: "Criteria",
      description:
        "Trip criteria. Example: `{ \"requiredLift\": [{ \"aircraftCategory\": \"Heavy jet\" }], \"includeLiftUpgrades\": true, \"minimumYearOfMake\": 2010 }`",
    },
    segments: {
      type: "object[]",
      label: "Segments",
      description:
        "Trip itinerary. Example: `[{ \"startAirport\": { \"icao\": \"KMIA\" }, \"endAirport\": { \"icao\": \"EGLL\" }, \"dateTime\": { \"date\": \"2023-01-01\", \"time\": \"10:00\", \"departure\": true, \"local\": true }, \"paxCount\": \"4\", \"paxSegment\": true }]`",
    },
    sourcing: {
      type: "boolean",
      label: "Sourcing",
      description:
        "Should this trip be available in the marketplace for sourcing?",
    },
    postToTripBoard: {
      type: "boolean",
      label: "Post to Trip Board",
      description: "Should this trip be posted to the Trip Board?",
      optional: true,
    },
    tripBoardPostMessage: {
      type: "string",
      label: "Trip Board Post Message",
      description:
        "Message to include when posting to the Trip Board",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      externalTripId,
      criteria,
      segments,
      sourcing,
      postToTripBoard,
      tripBoardPostMessage,
    } = this;

    const data = {
      criteria,
      segments,
      sourcing,
    };

    const externalId = externalTripId?.toString?.()?.trim();
    if (externalId) {
      data.externalTripId = externalId;
    }
    if (postToTripBoard !== undefined) {
      data.postToTripBoard = postToTripBoard;
    }
    const boardMessage = tripBoardPostMessage?.toString?.()?.trim();
    if (boardMessage) {
      data.tripBoardPostMessage = boardMessage;
    }

    const body = await this.app.createTrip({
      $,
      data,
    });
    const trip = body?.data !== undefined
      ? body.data
      : body;

    const tripId = trip?.id || externalId;
    $.export(
      "$summary",
      tripId
        ? `Created trip \`${tripId}\``
        : "Created trip",
    );
    return trip;
  },
};
