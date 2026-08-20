// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import arlo from "../../arlo.app.mjs";

export default {
  key: "arlo-create-event",
  name: "Create Event",
  description: "Create a new scheduled Arlo Event by submitting an event import request. Provide the parent template `Code` (not its numeric ID) and one or more sessions. The Arlo API processes this asynchronously and returns an `AsyncTaskID`; the created event starts in `Draft` status. Run **List Event Templates** to find the template `Code`. Example: call with `templateCode: \"SP1\"`, `sessions: '[{\"Name\":\"Day 1\",\"StartDateTime\":\"2026-09-15T09:00:00+12:00\",\"EndDateTime\":\"2026-09-15T17:00:00+12:00\"}]'` to schedule one session under that template. [See the documentation](https://developer.arlo.co/doc/api/2012-02-01/auth/resources/eventimportrequests#submitting).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    arlo,
    templateCode: {
      type: "string",
      label: "Template Code",
      description: "The Code (short string identifier) of the EventTemplate this event belongs to. Run **List Event Templates** to find the template Code.",
    },
    sessions: {
      type: "string",
      label: "Sessions",
      description: "JSON array of session objects. Each session requires `Name`, `StartDateTime`, and `EndDateTime` in ISO 8601 with UTC offset. Optional per session: `TimeZoneId`, `PresenterIds` (array of integer contact IDs), `VenueDetails` (`{\"VenueId\": 123}` — run **List Venues** to find valid venue IDs). Example: `[{\"Name\":\"Day 1\",\"StartDateTime\":\"2026-09-15T09:00:00+12:00\",\"EndDateTime\":\"2026-09-15T17:00:00+12:00\",\"VenueDetails\":{\"VenueId\":123}}]`.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Optional display name for the event.",
      optional: true,
    },
    locationName: {
      type: "string",
      label: "Location Name",
      description: "Optional location name for the event.",
      optional: true,
    },
    registrationMethod: {
      type: "string",
      label: "Registration Method",
      description: "Optional. The registration method to apply in the event's RegistrationSettings (e.g. `OrderProcess`).",
      optional: true,
      options: [
        "QuickRegistrationProcess",
        "OrderProcess",
        "CustomMessage",
        "Url",
      ],
    },
  },
  async run({ $ }) {
    let parsedSessions;
    try {
      parsedSessions = JSON.parse(this.sessions);
    } catch {
      throw new ConfigurationError("Sessions must be a valid JSON array. Example: [{\"Name\":\"Day 1\",\"StartDateTime\":\"2026-09-15T09:00:00+12:00\",\"EndDateTime\":\"2026-09-15T17:00:00+12:00\"}]");
    }

    if (!Array.isArray(parsedSessions) || !parsedSessions.length) {
      throw new ConfigurationError("Sessions must be a non-empty JSON array of session objects.");
    }

    const data = {
      TemplateCode: this.templateCode,
      Name: this.name,
      Sessions: parsedSessions,
    };

    if (this.locationName) {
      data.LocationName = this.locationName;
    }

    if (this.registrationMethod) {
      data.RegistrationSettings = {
        RegistrationMethod: this.registrationMethod,
      };
    }

    const response = await this.arlo.createEventImportRequest({
      $,
      data,
    });

    const taskId = response?.AsyncTaskID ?? response?.TaskID ?? response?.ID;
    $.export("$summary", `Event import request submitted${taskId
      ? ` (AsyncTaskID: ${taskId})`
      : ""} for template "${this.templateCode}"`);
    return response;
  },
};
