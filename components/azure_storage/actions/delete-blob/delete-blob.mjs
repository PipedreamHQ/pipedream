import app from "../../azure_storage.app.mjs";

export default {
  key: "azure_storage-delete-blob",
  name: "Delete Blob",
  description: "Deletes a specific blob from a container in Azure Storage. [See the documentation](https://learn.microsoft.com/en-us/rest/api/storageservices/delete-blob?tabs=microsoft-entra-id).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "In order to have the right permissions to use this feature you need to go to the Azure Console in `Storage Account > IAM > Add role assignment`, and add the special permissions for this type of request:\n - Storage Blob Data Contributor\n - Storage Queue Data Contributor\n [See the documentation](https://learn.microsoft.com/en-us/rest/api/storageservices/delete-blob?tabs=microsoft-entra-id#permissions).",
    },
    containerName: {
      propDefinition: [
        app,
        "containerName",
      ],
    },
    blobName: {
      propDefinition: [
        app,
        "blobName",
        ({ containerName }) => ({
          containerName,
        }),
      ],
    },
  },
  methods: {
    deleteBlob({
      containerName, blobName,
    } = {}) {
      return this.app.delete({
        path: `/${containerName}/${blobName}`,
      });
    },
  },
  async run({ $ }) {
    const {
      deleteBlob,
      containerName,
      blobName,
    } = this;

    await deleteBlob({
      $,
      containerName,
      blobName,
    });

    $.export("$summary", "Successfully deleted blob.");
    return {
      success: true,
    };
  },
};
