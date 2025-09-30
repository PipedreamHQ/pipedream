import app from "../../omnivore.app.mjs";
import url from "../../common/queries/url.mjs";
import { v4 as uuidv4 } from "uuid";

export default {
  key: "omnivore-save-url",
  name: "Save URL",
  description: "Save a URL to Omnivore. [See the documentation](https://github.com/omnivore-app/omnivore/blob/main/packages/api/src/schema.ts#L2590)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    },
    locale: {
      propDefinition: [
        app,
        "locale",
      ],
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
      clientRequestId,
      ...input
    } = this;

    const { saveUrl: response } =
      await saveUrl({
        input: {
          ...input,
          clientRequestId: clientRequestId ?? uuidv4(),
        },
      });

    if (response.errorCodes?.length) {
      throw new Error(JSON.stringify(response, null, 2));
    }

    step.export("$summary", `Successfully saved URL with clientRequestId \`${response.clientRequestId}\``);

    return response;
  },
};
