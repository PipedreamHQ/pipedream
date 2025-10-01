import app from "../../leexi.app.mjs";

export default {
  key: "leexi-create-call",
  name: "Create Call",
  description: "Create a new call in Leexi. [See the documentation](https://developer.leexi.ai/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    recordingS3Key: {
      type: "string",
      label: "Recording S3 Key",
      description: "The S3 key returned by the presign_recording_url endpoint.",
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "The ID of the call in your system.",
    },
    integrationUserExternalId: {
      type: "string",
      label: "Integration User External ID",
      description: "The external ID of the user making the call on your platform.",
    },
    integrationUserName: {
      type: "string",
      label: "Integration User Name",
      description: "The name of the user making the call on your platform.",
    },
    direction: {
      type: "string",
      label: "Call Direction",
      description: "The direction of the call (inbound or outbound).",
      options: [
        "inbound",
        "outbound",
      ],
    },
    performedAt: {
      type: "string",
      label: "Performed At",
      description: "The start time of the call, in ISO8601 format. Eg. `2024-01-09T17:05:09+01:00`",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the call.",
      optional: true,
    },
    rawPhoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the caller.",
      optional: true,
    },
  },
  methods: {
    createCall(args = {}) {
      return this.app.post({
        path: "/calls",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createCall,
      recordingS3Key,
      externalId,
      integrationUserExternalId,
      integrationUserName,
      direction,
      performedAt,
      description,
      rawPhoneNumber,
    } = this;

    const response = await createCall({
      $,
      data: {
        recording_s3_key: recordingS3Key,
        external_id: externalId,
        integration_user: {
          external_id: integrationUserExternalId,
          name: integrationUserName,
        },
        direction,
        performed_at: performedAt,
        description,
        raw_phone_number: rawPhoneNumber,
      },
    });

    $.export("$summary", "Successfully created a new call.");
    return response;
  },
};
