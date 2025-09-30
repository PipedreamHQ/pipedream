import app from "../../oracle_cloud_infrastructure.app.mjs";

export default {
  key: "oracle_cloud_infrastructure-create-update-object",
  name: "Create Or Update Object",
  description: "Create or update an object in a specified Oracle Cloud Infrastructure Object Storage bucket. [See the documentation](https://docs.oracle.com/en-us/iaas/api/#/en/objectstorage/20160918/Object/PutObject).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    compartmentId: {
      propDefinition: [
        app,
        "compartmentId",
      ],
    },
    bucketName: {
      propDefinition: [
        app,
        "bucketName",
        ({ compartmentId }) => ({
          compartmentId,
        }),
      ],
    },
    objectName: {
      propDefinition: [
        app,
        "objectName",
        ({
          compartmentId,
          bucketName,
        }) => ({
          compartmentId,
          bucketName,
        }),
      ],
    },
    putObjectBody: {
      propDefinition: [
        app,
        "putObjectBody",
      ],
    },
  },
  methods: {
    putObject(args = {}) {
      return this.app.makeRequest({
        getClient: this.app.getObjectStorageClient,
        method: "putObject",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      compartmentId,
      putObject,
      bucketName,
      objectName,
      putObjectBody,
    } = this;

    const { value: namespaceName } = await app.getNamespace({
      compartmentId,
    });

    const response = await putObject({
      namespaceName,
      bucketName,
      objectName,
      putObjectBody,
    });

    $.export("$summary", `Successfully created/updated object with client request ID \`${response.opcRequestId}\`.`);
    return response;
  },
};
