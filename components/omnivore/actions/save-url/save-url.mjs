import app from "../../omnivore.app.mjs";
import url from "../../common/queries/url.mjs";

export default {
  key: "omnivore-save-url",
  name: "Save URL",
  description: "Save a URL to Omnivore. [See the documentation](https://github.com/omnivore-app/omnivore/blob/main/packages/api/src/schema.ts#L2590)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    url: {
      type: "string",
      label: "URL",
      description: "The URL to save.",
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source of the URL.",
    },
    clientRequestId: {
      type: "string",
      label: "Client Request ID",
      description: "The client request ID.",
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the URL.",
      optional: true,
      options: [
        "PROCESSING",
        "SUCCEEDED",
        "FAILED",
        "DELETED",
        "ARCHIVED",
      ],
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "The locale of the URL.",
      optional: true,
    },
  },
  methods: {
    saveUrl(variables = {}) {
      return this.app.makeRequest({
        query: url.mutations.saveUrl,
        variables,
      });
    },
  },
  async run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      saveUrl,
      ...input
    } = this;

    const { saveUrl: response } =
      await saveUrl({
        input,
      });

    if (response.errorCodes?.length) {
      throw new Error(JSON.stringify(response, null, 2));
    }

    step.export("$summary", `Successfully saved URL with clientRequestId \`${response.clientRequestId}\``);

    return response;
  },
};
