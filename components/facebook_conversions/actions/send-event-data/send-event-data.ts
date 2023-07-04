import { defineAction } from "@pipedream/types";
import app from "../../app/facebook_conversions.app";
import { ACTION_SOURCE_OPTIONS } from "../../common/constants";

const URL_DOCS_PARAMS = "https://developers.facebook.com/docs/marketing-api/conversions-api/parameters";
const URL_DOCS_SERVER_EVENT = `[See more on the documentation](${URL_DOCS_PARAMS}/server-event).`;

export default defineAction({
  name: "Send Event Data",
  description:
    "Send an event to the Conversions API. [See the documentation](https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api)",
  key: "facebook_conversions-send-event-data",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    eventName: {
      type: "string",
      label: "Event Name",
      description: `A standard event or custom event name. ${URL_DOCS_SERVER_EVENT}`
    },
    eventTime: {
      type: "integer",
      label: "Event Time",
      description: `A Unix timestamp in seconds indicating when the actual event occurred. ${URL_DOCS_SERVER_EVENT}`
    },
    userData: {
      type: "object",
      label: "User Data",
      description: `A map that contains customer information data. ${URL_DOCS_SERVER_EVENT}`
    },
    actionSource: {
      type: "string",
      label: "Action Source",
      description: `This field allows you to specify where your conversions occurred. ${URL_DOCS_SERVER_EVENT}`,
      options: ACTION_SOURCE_OPTIONS
    },
    customData: {
      type: "object",
      label: "Custom Data",
      description: `A map that includes additional business data about the event. [See more on the documentation](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/custom-data).`,
      optional: true,
    },
    eventSourceUrl: {
      type: "string",
      label: "Event Source URL",
      description: `The browser URL where the event happened. ${URL_DOCS_SERVER_EVENT}`,
      optional: true
    },
    optOut: {
      type: "boolean",
      label: "Opt Out",
      description: "A flag that indicates the event should not be used for ads delivery optimization. If set to true, the event is only used for attribution.",
      optional: true,
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: `This ID can be any *unique* string chosen by the advertiser. ${URL_DOCS_SERVER_EVENT}`,
      optional: true,
    },
    dataProcessingOptions: {
      type: "string[]",
      label: "Data Processing Options",
      description: `Processing options you would like to enable for a specific event. ${URL_DOCS_SERVER_EVENT}`,
      optional: true,
    },
    dataProcessingOptionsCountry: {
      type: "integer",
      label: "Data Processing Options: Country",
      description: `A country that you want to associate to this data processing option. ${URL_DOCS_SERVER_EVENT}`,
      optional: true,
    },
    dataProcessingOptionsState: {
      type: "integer",
      label: "Data Processing Options: State",
      description: `A state that you want to associate to this data processing option. ${URL_DOCS_SERVER_EVENT}`,
      optional: true,
    },
    appData: {
      type: "object",
      label: "App Data",
      description: `Parameters for sharing app data and device information with the Conversions API. ${URL_DOCS_SERVER_EVENT}`,
      optional: true,
    },
    extendedInfo: {
      type: "object",
      label: "Extended Info",
      description: `Extended device information, such as screen width and height. ${URL_DOCS_SERVER_EVENT}`,
      optional: true,
    }
  },
  async run({ $ }): Promise<object> {
    const params = { $ };
    const response = await this.app.sendEventData(params);

    $.export("$summary", "Successfully sent event data");

    return response;
  },
});
