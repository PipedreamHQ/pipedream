import app from "../../oracle_cloud_infrastructure.app.mjs";

export default {
  key: "oracle_cloud_infrastructure-delete-object",
  name: "Delete Object",
  description: "Delete an object from a specified Oracle Cloud Infrastructure Object Storage bucket. [See the documentation](https://docs.oracle.com/en-us/iaas/api/#/en/objectstorage/20160918/Object/DeleteObject).",
  version: "0.0.1",
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
  },
  methods: {
    deleteObject(args = {}) {
      return this.app.makeRequest({
        getClient: this.app.getObjectStorageClient,
        method: "deleteObject",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      deleteObject,
      compartmentId,
      bucketName,
      objectName,
    } = this;

    const { value: namespaceName } = await app.getNamespace({
      compartmentId,
    });

    const response = await deleteObject({
      namespaceName,
      bucketName,
      objectName,
    });

    $.export("$summary", `Successfully deleted object with client request ID \`${response.opcRequestId}\`.`);
    return response;
  },
};
