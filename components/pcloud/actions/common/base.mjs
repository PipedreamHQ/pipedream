import pcloud from "../../pcloud.app.mjs";

export default {
  props: {
    pcloud,
  },
  async run({ $ }) {
    const VALID_LOCATIONS = [
      "0",
      "1",
    ];
    const locationId = this.pcloud.$auth.locationid;

    if (!VALID_LOCATIONS.includes(locationId)) {
      throw new Error(
        "Unable to retrieve your account's Location ID - try reconnecting your pCloud account to Pipedream.",
      );
    }

    const requestMethod = this.requestMethod;
    const response = await this.pcloud._withRetries(() => requestMethod());

    $.export("$summary", this.getSummary());

    return response;
  },
};
