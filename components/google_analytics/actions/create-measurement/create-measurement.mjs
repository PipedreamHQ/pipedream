import analytics from "../../google_analytics.app.mjs";

const GTAGJS = "gtag.js";
const FIREBASE = "firebase";

export default {
  key: "google_analytics-create-measurement",
  name: "Create Measurement",
  description: "Sends a measurement of an event to Google Analytics",
  version: "0.0.1",
  type: "action",
  props: {
    analytics,
    apiSecret: {
      type: "string",
      label: "API Secret",
      description: "An API Secret that is generated through the Google Analytics UI",
      secret: true,
    },
    params: {
      type: "object",
      label: "Hit Parameters",
      description: `Required parameters for the hit payload
        [Examples](https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide)`,
    },
    clientType: {
      type: "string",
      label: "Client Type",
      description: `A valid request requires two sets of parameters that vary if you're using firebase or gtag.js
        More information at [Measurement Protocol Reference](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference)`,
      options: [
        GTAGJS,
        FIREBASE,
      ],
    },
    appId: {
      type: "string",
      label: "Measurement or Firebase App ID",
      description: `gtag.js: Measurement ID - the identifier for a Data Stream
        firebase: Firebase App ID - the identifier for a Firebase App`,
    },
    clientId: {
      type: "string",
      label: "Client ID or App Instance ID",
      description: ` gtag.js: Uniquely identifies a user instance of a web client
        firebase: Uniquely identifies a specific installation of a Firebase app`,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "A unique identifier for a user",
      optional: true,
    },
    timestamp: {
      type: "integer",
      label: "Timestamp",
      description: `A Unix timestamp (in microseconds) for the time to associate with the event
        This should only be set to record events that happened in the past`,
      optional: true,
    },
    userProperties: {
      type: "object",
      label: "User Properties",
      description: "The user properties for the measurement",
      optional: true,
    },
    nonPersonalizedAds: {
      type: "boolean",
      label: "Non Personalized Ads",
      description: "Set to true to indicate these events should not be used for personalized ads",
      optional: true,
    },
    events: {
      type: "string[]",
      label: "Events",
      description: `An array of event items
        The prop event.name is required. More information at [Events Reference](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events)`,
    },
  },
  methods: {
    _parseJSONString(params) {
      if (typeof params == "string") {
        params = JSON.parse(params);
      }
      return params;
    },
    _gtagjsParams(params, data) {
      params.measurement_id = this.appId;
      data.client_id = this.clientId;
    },
    _firebaseParams(params, data) {
      params.firebase_app_id = this.appId;
      data.app_instance_id = this.clientId;
    },
  },
  async run({ $ }) {
    let params = {
      api_secret: this.apiSecret,
      ...this._parseJSONString(this.params),
    };

    let data = {
      user_id: this.userId,
      timestamp_micros: this.timestamp,
      user_properties: this.userProperties,
      non_personalized_ads: this.nonPersonalizedAds,
      events: this.events.map((event) => JSON.parse(event)),
    };

    if (this.clientType == GTAGJS) {
      this._gtagjsParams(params, data);
    } else if (this.clientType == FIREBASE) {
      this._firebaseParams(params, data);
    } else {
      throw new Error("Client Type must be gtag.js or firebase app");
    }

    await this.analytics.createMeasurement(
      params,
      data,
    );

    $.export("$summary", "Measurement event sent to Google Analytics");
  },
};
