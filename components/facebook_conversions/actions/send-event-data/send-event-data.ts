import { Pipedream, defineAction } from "@pipedream/types";
import app from "../../app/facebook_conversions.app";

export default defineAction({
  name: "[Date/Time] Compare Dates",
  description:
    "Get the duration between two dates in days, hours, minutes, and seconds along with checking if they are the same.",
  key: "formatting-compare-dates",
  version: "0.0.2",
  type: "action",
  props: {
    app,
  },
  async run({ $ }): Promise<object> {
    const params = { $ };
    const response = await this.app.sendEventData(params);

    $.export("$summary", "Successfully sent event data");

    return response;
  },
});
