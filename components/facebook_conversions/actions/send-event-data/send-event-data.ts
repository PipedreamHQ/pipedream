import { defineAction } from "@pipedream/types";
import app from "../../app/facebook_conversions.app";
import { ACTION_SOURCE_OPTIONS } from "../../common/constants";
import { checkUserDataObject } from "../../common/methods";

const GET_DOCS_URL = (s: string) =>
  `[See more on the documentation](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/server-event#${s}).`;

export default defineAction({
  name: "Send Event Data",
  description:
    "Send an event to the Conversions API. [See the documentation](https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api)",
  key: "facebook_conversions-send-event-data",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    // this will probably be moved to $auth later
    accessToken: {
      type: "string",
      label: "Access Token",
    },
    pixelId: {
      type: "string",
      label: "Pixel ID",
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: `A standard event or custom event name. ${GET_DOCS_URL(
        "event-name",
      )}`,
    },
    eventTime: {
      type: "integer",
      label: "Event Time",
      description: `A Unix timestamp in seconds indicating when the actual event occurred. ${GET_DOCS_URL(
        "event-time",
      )}`,
    },
    userData: {
      type: "object",
      label: "User Data",
      description: "A map that contains customer information data. [See more on the documentation](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters)",
    },
    actionSource: {
      type: "string",
      label: "Action Source",
      description: `This field allows you to specify where your conversions occurred. ${GET_DOCS_URL(
        "action-source",
      )}`,
      options: ACTION_SOURCE_OPTIONS,
    },
    customData: {
      type: "object",
      label: "Custom Data",
      description: "A map that includes additional business data about the event. [See more on the documentation](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/custom-data)",
      optional: true,
    },
    eventSourceUrl: {
      type: "string",
      label: "Event Source URL",
      description: `The browser URL where the event happened. ${GET_DOCS_URL(
        "event-source-url",
      )}`,
      optional: true,
    },
    optOut: {
      type: "boolean",
      label: "Opt Out",
      description:
        "A flag that indicates the event should not be used for ads delivery optimization. If set to `true`, the event is only used for attribution.",
      optional: true,
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: `This ID can be any *unique* string chosen by the advertiser. ${GET_DOCS_URL(
        "event-id",
      )}`,
      optional: true,
    },
    dataProcessingOptions: {
      type: "string[]",
      label: "Data Processing Options",
      description: `Processing options you would like to enable for a specific event. ${GET_DOCS_URL(
        "data-processing-options",
      )}`,
      optional: true,
    },
    dataProcessingOptionsCountry: {
      type: "integer",
      label: "Data Processing Options: Country",
      description: `A country that you want to associate to this data processing option. ${GET_DOCS_URL(
        "data-processing-options-country",
      )}`,
      optional: true,
    },
    dataProcessingOptionsState: {
      type: "integer",
      label: "Data Processing Options: State",
      description: `A state that you want to associate to this data processing option. ${GET_DOCS_URL(
        "data-processing-options-state",
      )}`,
      optional: true,
    },
    appData: {
      type: "object",
      label: "App Data",
      description:
        "Parameters for sharing app data and device information with the Conversions API. [See more on the documentation](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/app-data)",
      optional: true,
    },
    testEventCode: {
      type: "string",
      label: "Test Event Code",
      description:
        "If testing, you can include the test code provided in the Events Manager here.",
      optional: true,
    },
  },
  methods: {
    checkUserDataObject,
  },
  async run({ $ }): Promise<object> {
    const {
      pixelId,
      accessToken,
      eventName,
      eventTime,
      userData,
      actionSource,
      customData,
      eventSourceUrl,
      optOut,
      eventId,
      dataProcessingOptions,
      dataProcessingOptionsCountry,
      dataProcessingOptionsState,
      appData,
      testEventCode,
    } = this;

    const params = {
      $,
      data: {
        test_event_code: testEventCode,
        data: [
          {
            event_name: eventName,
            event_time: eventTime,
            user_data: this.checkUserDataObject(userData),
            action_source: actionSource,
            custom_data: customData,
            event_source_url: eventSourceUrl,
            opt_out: optOut,
            event_id: eventId,
            data_processing_options: dataProcessingOptions,
            data_processing_options_country: dataProcessingOptionsCountry,
            data_processing_options_state: dataProcessingOptionsState,
            app_data: appData,
          },
        ],
      },
      pixelId,
      params: {
        access_token: accessToken,
      },
    };
    const response = await this.app.sendData(params);

    $.export("$summary", "Successfully sent event data");

    return response;
  },
});
