import app from "../../microsoft_onedrive.app.mjs";

export default {
  name: "Create Link",
  version: "0.0.1",
  key: "microsoft_onedrive-create-link",
  type: "action",
  description: "Create a sharing link for a DriveItem. [See the documentation](https://docs.microsoft.com/en-us/graph/api/driveitem-createlink?view=graph-rest-1.0&tabs=http)",
  props: {
    app,
    driveItemId: {
      type: "string",
      label: "Drive Item ID",
      description: "The ID of the DriveItem to create a sharing link for.",
      async options() {
        const { value: driveItems } = await this.listDriveItems();
        return driveItems.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of sharing link to create. Either `view`, `edit`, or `embed`.",
      options: [
        "view",
        "edit",
        "embed",
      ],
    },
    scope: {
      type: "string",
      label: "Scope",
      description: "The scope of link to create. Either `anonymous` or `organization`.",
      options: [
        "anonymous",
        "organization",
      ],
      optional: true,
    },
  },
  methods: {
    listDriveItems(args = {}) {
      const client = this.app.client();
      return client
        .api("/me/drive/root/children")
        .get(args);
    },
    createLink({
      driveItemId, ...args
    } = {}) {
      const client = this.app.client();
      return client
        .api(`/me/drive/items/${driveItemId}/createLink`)
        .post(args);
    },
  },
  async run({ $ }) {
    const {
      createLink,
      driveItemId,
      type,
      scope,
    } = this;

    const response = await createLink({
      driveItemId,
      type,
      scope,
    });

    $.export("$summary", `Successfully created a sharing link with id \`${response.id}\`.`);

    return response;
  },
};
