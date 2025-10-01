import { v4 as uuid } from "uuid";
import app from "../../langfuse.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "langfuse-log-trace",
  name: "Log Trace",
  description: "Log a new trace in LangFuse with details. [See the documentation](https://api.reference.langfuse.com/#tag/ingestion/POST/api/public/ingestion).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the trace",
    },
    input: {
      type: "string",
      label: "Input",
      description: "The input of the trace",
    },
    output: {
      type: "string",
      label: "Output",
      description: "The output of the trace",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      optional: true,
    },
    sessionId: {
      label: "Session ID",
      description: "The ID of the session",
      optional: true,
      propDefinition: [
        app,
        "objectId",
        () => ({
          objectType: constants.OBJECT_TYPE.SESSION,
        }),
      ],
    },
    release: {
      type: "string",
      label: "Release",
      description: "The release of the trace",
      optional: true,
    },
    version: {
      type: "string",
      label: "Version",
      description: "The version of the trace",
      optional: true,
    },
    metadata: {
      type: "string",
      label: "Metadata",
      description: "The metadata of the trace",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The tags of the trace",
      optional: true,
    },
  },
  methods: {
    batchIngestion(args = {}) {
      return this.app.post({
        path: "/ingestion",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      batchIngestion,
      name,
      userId,
      input,
      output,
      sessionId,
      release,
      version,
      metadata,
      tags,
    } = this;

    const timestamp = new Date().toISOString();
    const id = uuid();

    const response = await batchIngestion({
      $,
      data: {
        batch: [
          {
            id,
            timestamp,
            type: constants.INGESTION_TYPE.TRACE_CREATE,
            body: {
              id,
              timestamp,
              name,
              userId,
              input: utils.parseJson(input),
              output: utils.parseJson(output),
              sessionId,
              release,
              version,
              metadata: utils.parseJson(metadata),
              tags,
              public: true,
            },
          },
        ],
      },
    });
    $.export("$summary", "Successfully logged a new trace");
    return response;
  },
};
