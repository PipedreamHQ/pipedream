import app from "../../omnivore.app.mjs";
import url from "../../common/queries/url.mjs";

export default {
  key: "omnivore-save-page",
  name: "Save Page",
  description: "Save a page with supplied HTML content. [See the documentation](https://docs.omnivore.app/integrations/api.html#commonly-used-methods)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    source: {
      propDefinition: [
        app,
        "source",
      ],
      description: "The source of the page.",
    },
    clientRequestId: {
      propDefinition: [
        app,
        "clientRequestId",
      ],
    },
    state: {
      propDefinition: [
        app,
        "state",
      ],
      description: "The state of the page.",
    },
    locale: {
      propDefinition: [
        app,
        "locale",
      ],
      description: "The locale of the page.",
    },
    originalContent: {
      type: "string",
      label: "Original Content",
      description: "The HTML content to save.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the page.",
      optional: true,
    },
  },
  methods: {
    savePage(variables = {}) {
      return this.app.makeRequest({
        query: url.mutations.savePage,
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

    step.export("$summary", `Successfully saved page with clientRequestId \`${response.clientRequestId}\``);

    return response;
  },
};
