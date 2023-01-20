import app from "../../app/formatter.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "[Date/Time] Format",
  description: "Format a date string to another date string",
  key: "formatter-date-time-format",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },
  async run({ $ }): Promise<object> {
    $.export("$summary", "Successfully added keyword");
    return null;
  },
});
