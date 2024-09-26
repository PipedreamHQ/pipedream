import postman from "../../postman.app.mjs";

export default {
  key: "postman-run-monitor",
  name: "Run Monitor",
  description: "Run a specific monitor in Postman. [See the documentation](https://learning.postman.com/docs/developer/postman-api/intro-api/)",
  version: "0.0.1",
  type: "action",
  props: {
    postman,
    monitorId: {
      propDefinition: [
        postman,
        "monitorId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.postman.runMonitor({
      $,
      monitorId: this.monitorId,
    });

    $.export("$summary", `Successfully executed monitor with ID: ${this.monitorId}`);
    return response;
  },
};
