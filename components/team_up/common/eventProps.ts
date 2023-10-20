import { ConfigurationError } from "@pipedream/platform";
import app from "../app/team_up.app";
import calendarKeyOptions from "./calendarKeyOptions";

export const EVENT_PROPS = {
  subCalendarIds: {
    propDefinition: [
      app,
      "subCalendarIds",
      calendarKeyOptions,
    ],
  },
  startDate: {
    propDefinition: [
      app,
      "startDate",
    ],
  },
  endDate: {
    propDefinition: [
      app,
      "endDate",
    ],
  },
  title: {
    type: "string",
    label: "Title",
    description: "Title of the event",
    optional: true,
  },
  location: {
    type: "string",
    label: "Location",
    description: "Location of the event",
    optional: true,
  },
  additionalOptions: {
    type: "object",
    label: "Additional Options",
    description:
      "Additional parameters to pass in the request body. [See the docs for more info.](https://apidocs.teamup.com/docs/api/3269d0159ae9f-create-an-event)",
    optional: true,
  },
  additionalOptionsAsJson: {
    type: "boolean",
    label: "Parse Additional Options as JSON",
    description:
      "If true, the values provided in `Additional Options` will be parsed as a JSON string. This allows you to pass object, integer and boolean values with their actual type instead of stringified.",
    optional: true,
    default: false,
  },
};

export function getEventProps() {
  const {
    subCalendarIds,
    startDate,
    endDate,
    title,
    location,
    additionalOptionsAsJson,
  }: Record<string, string> = this;

  let additionalOptions: Record<string, string> = this.additionalOptions;

  if (additionalOptionsAsJson) {
    try {
      additionalOptions = Object.fromEntries(
        Object.entries(additionalOptions).map(([
          key,
          value,
        ]) => [
          key,
          JSON.parse(value),
        ]),
      );
    } catch (err) {
      throw new ConfigurationError(
        "**Error parsing additional options as JSON: **",
        err,
      );
    }
  }

  return {
    subcalendar_ids: subCalendarIds,
    start_dt: startDate,
    end_dt: endDate,
    title,
    location,
    ...additionalOptions,
  };
}
