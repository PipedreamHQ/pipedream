import app from "../../gong.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "gong-get-extensive-data",
  name: "Get Extensive Data",
  description: "Lists detailed call data. [See the documentation](https://us-66463.app.gong.io/settings/api/documentation#post-/v2/calls/extensive)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    fromDateTime: {
      propDefinition: [
        app,
        "fromDateTime",
      ],
      optional: true,
    },
    toDateTime: {
      propDefinition: [
        app,
        "toDateTime",
      ],
      optional: true,
    },
    workspaceId: {
      optional: true,
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
    callIds: {
      propDefinition: [
        app,
        "callIds",
      ],
    },
    primaryUserIds: {
      type: "string[]",
      label: "Primary User IDs",
      description: "An optional list of user identifiers, if supplied the API will return only the calls hosted by the specified users. The identifiers in this field match the primaryUserId field of the calls.",
      propDefinition: [
        app,
        "userId",
      ],
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number or results to return",
      default: constants.DEFAULT_MAX,
      optional: true,
    },
  },
  methods: {
    getExtensiveData(args = {}) {
      return this.app.post({
        path: "/calls/extensive",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      getExtensiveData,
      maxResults,
      ...filter
    } = this;

    const calls = await app.paginate({
      resourceFn: getExtensiveData,
      resourceFnArgs: {
        $,
        data: {
          filter,
        },
      },
      resourceName: "calls",
      max: maxResults,
    });

    if (calls?.length) {
      $.export("$summary", `Successfully retrieved data for ${calls.length} calls`);
    }
    return calls;
  },
};
