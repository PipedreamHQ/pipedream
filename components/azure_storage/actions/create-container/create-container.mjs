import app from "../../azure_storage.app.mjs";

export default {
  key: "azure_storage-create-container",
  name: "Create Container",
  description: "Creates a new container under the specified account. If a container with the same name already exists, the operation fails. [See the documentation](https://learn.microsoft.com/en-us/rest/api/storageservices/create-container?tabs=microsoft-entra-id).",
  version: "0.0.3",
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
      content: "The name of your container can include only lowercase characters and needs to follow [these naming rules](https://learn.microsoft.com/en-us/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names).",
    },
    containerName: {
      type: "string",
      label: "Container Name",
      description: "The name of the container within the specified storage account.",
    },
  },
  methods: {
    createContainer({
      containerName, params, ...args
    } = {}) {
      return this.app.put({
        ...args,
        path: `/${containerName}`,
        params: {
          ...params,
          restype: "container",
        },
      });
    },
  },
  async run({ $ }) {
    const {
      createContainer,
      containerName,
    } = this;

    await createContainer({
      $,
      containerName,
    });

    $.export("$summary", "Successfully created container.");

    return {
      success: true,
    };
  },
};
