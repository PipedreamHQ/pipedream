import app from "../../real_id.app.mjs";

export default {
  key: "real_id-get-id-check",
  name: "Get ID Check",
  description: "Retrieve an ID check. [See the documentation](https://getverdict.com/help/docs/api/checks#retrieve-an-id-check).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    checkId: {
      propDefinition: [
        app,
        "checkId",
      ],
    },
    withPhotos: {
      type: "boolean",
      label: "Include Photos",
      description: "All photos will be provided as short lived URLs in the API response under the `photos` key.",
      optional: true,
    },
  },
  methods: {
    retrieveIdCheck({
      checkId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/checks/${checkId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      retrieveIdCheck,
      checkId,
      withPhotos,
    } = this;

    const response = await retrieveIdCheck({
      $,
      checkId,
      params: {
        withPhotos,
      },
    });

    $.export("$summary", "Successfully retrieved ID check.");
    return response;
  },
};
