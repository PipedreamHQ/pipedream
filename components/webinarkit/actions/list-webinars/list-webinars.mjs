import app from "../../webinarkit.app.mjs";

export default {
  key: "webinarkit-list-webinars",
  name: "List Webinars",
  description: "Returns a list of webinars. [See the documentation](https://documenter.getpostman.com/view/22597176/Uzs435mo#31a536ea-5a5a-4b22-8523-4b69b79afce7)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $: step }) {
    const { app } = this;

    const response = await app.listWebinars({
      step,
    });

    step.export("$summary", `Successfully retrieved ${response.results?.length} webinars.`);

    return response;
  },
};
