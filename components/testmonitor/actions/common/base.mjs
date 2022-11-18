import testmonitor from "../../testmonitor.app.mjs";

export default {
  props: {
    testmonitor,
    projectId: {
      propDefinition: [
        testmonitor,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.processEvent($);

    if (response.error) {
      throw new Error(response.error);
    }

    $.export("$summary", this.getSummary(response));
    return response;
  },
};
