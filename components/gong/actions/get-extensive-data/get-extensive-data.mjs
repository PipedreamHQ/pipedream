import app from "../../gong.app.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";
import utils from "../../common/utils.mjs";

export default {
  key: "gong-get-extensive-data",
  name: "Get Extensive Data",
  description: "Lists detailed call data. [See the documentation](https://gong.app.gong.io/settings/api/documentation#post-/v2/calls/extensive)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    context: {
      type: "string",
      label: "Context",
      description: "If 'Basic', add links to external systems (context objects) such as CRM, Telephony System, Case Management. If 'Extended' include also data (context fields) for these links.",
      options: [
        "None",
        "Basic",
        "Extended",
      ],
      default: "None",
      optional: true,
    },
    contextTiming: {
      type: "string[]",
      label: "Context Timing",
      description: "Allowed: Now, TimeOfCall. Timing for the context data. The field is optional and can contain either 'Now' or 'TimeOfCall' or both. The default value is ['Now']. Can be provided only when the context field is set to 'Extended'",
      optional: true,
    },
    includeParties: {
      type: "boolean",
      label: "Include Parties",
      description: "Whether to include parties in the response",
      default: false,
      optional: true,
    },
    exposedFieldsContent: {
      type: "object",
      label: "Exposed Fields Content",
      description: "Specify which fields to include in the response for the content. Example object: {'structure': false, 'topics': false, 'trackers': false, 'trackerOccurrences': false, 'pointsOfInterest': false, 'brief': true, 'outline': true, 'highlights': true, 'callOutcome': true, 'keyPoints': true}",
      default: {
        "structure": "false",
        "topics": "false",
        "trackers": "false",
        "trackerOccurrences": "false",
        "pointsOfInterest": "false",
        "brief": "false",
        "outline": "false",
        "highlights": "false",
        "callOutcome": "false",
        "keyPoints": "false",
      },
      optional: true,
    },
    exposedFieldsInteraction: {
      type: "object",
      label: "Exposed Fields Interaction",
      description: "Specify which fields to include in the response for the interaction. Example object: {'speakers': true, 'video': true, 'personInteractionStats': true, 'questions': true}",
      default: {
        "speakers": "false",
        "video": "false",
        "personInteractionStats": "false",
        "questions": "false",
      },
      optional: true,
    },
    includePublicComments: {
      type: "boolean",
      label: "Include Public Comments",
      description: "Whether to include public comments in the response",
      default: false,
      optional: true,
    },
    includeMedia: {
      type: "boolean",
      label: "Include Media",
      description: "Whether to include media in the response",
      default: false,
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
      context,
      contextTiming,
      includeParties,
      exposedFieldsContent,
      exposedFieldsInteraction,
      includePublicComments,
      includeMedia,
      ...filter
    } = this;

    if (filter?.workspaceId && filter?.callIds) {
      throw new ConfigurationError("Must not provide both `callIds` and `workspaceId`");
    }

    const exposedFieldsContentObj = utils.parseObject(exposedFieldsContent);
    const exposedFieldsInteractionObj = utils.parseObject(exposedFieldsInteraction);

    const contentSelector = {
      "context": context || "None",
      ...(contextTiming?.length > 0 && {
        "contextTiming": contextTiming,
      }),
      "exposedFields": {
        "parties": includeParties || false,
        "content": {
          "structure": exposedFieldsContentObj?.structure || false,
          "topics": exposedFieldsContentObj?.topics || false,
          "trackers": exposedFieldsContentObj?.trackers || false,
          "trackerOccurrences": exposedFieldsContentObj?.trackerOccurrences || false,
          "pointsOfInterest": exposedFieldsContentObj?.pointsOfInterest || false,
          "brief": exposedFieldsContentObj?.brief || false,
          "outline": exposedFieldsContentObj?.outline || false,
          "highlights": exposedFieldsContentObj?.highlights || false,
          "callOutcome": exposedFieldsContentObj?.callOutcome || false,
          "keyPoints": exposedFieldsContentObj?.keyPoints || false,
        },
        "interaction": {
          "speakers": exposedFieldsInteractionObj?.speakers || false,
          "video": exposedFieldsInteractionObj?.video || false,
          "personInteractionStats": exposedFieldsInteractionObj?.personInteractionStats || false,
          "questions": exposedFieldsInteractionObj?.questions || false,
        },
        "collaboration": {
          "publicComments": includePublicComments || false,
        },
        "media": includeMedia || false,
      },
    };

    try {
      const calls = await app.paginate({
        resourceFn: getExtensiveData,
        resourceFnArgs: {
          step: $,
          data: {
            filter,
            contentSelector,
          },
        },
        resourceName: "calls",
        max: maxResults,
      });

      if (calls?.length) {
        $.export("$summary", `Successfully retrieved data for ${calls.length} calls`);
      }
      return calls;
    }
    catch (error) {
      const noCallsMessage = "No calls found corresponding to the provided filters";
      if (error?.message.includes(noCallsMessage)) {
        $.export("$summary", noCallsMessage);
      } else {
        throw new ConfigurationError(`${error?.message}`);
      }
    }
  },
};
