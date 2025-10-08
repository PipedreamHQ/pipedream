import motion from "../../motion.app.mjs";

export default {
  key: "motion-get-schedules",
  name: "Retrieve Schedules",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Get a list of schedules for your user. [See the documentation](https://docs.usemotion.com/docs/motion-rest-api/f9fec7bb61c6f-get-schedules)",
  type: "action",
  props: {
    motion,
  },
  methods: {
    getSchedules($) {
      return this.motion._makeRequest({
        $,
        path: "schedules",
      });
    },
  },
  async run({ $ }) {
    const response = await this.getSchedules($);
    $.export("$summary", `Successfully fetched ${response?.length} schedules`);
    return response;
  },
};
