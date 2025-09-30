import app from "../../sigma.app.mjs";

export default {
  key: "sigma-create-workbook",
  name: "Create Workbook",
  description: "Creates a new blank workbook. [See the documentation](https://docs.sigmacomputing.com/#post-/v2/workbooks)",
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
      description: "The name for the new workbook.",
      propDefinition: [
        app,
        "name",
      ],
    },
    folderId: {
      description: "Folder where the workbook should be saved within the user's Sigma environment.",
      propDefinition: [
        app,
        "folderId",
      ],
    },
    description: {
      description: "A description for the workbook.",
      propDefinition: [
        app,
        "description",
      ],
    },
    ownerId: {
      description: "ID of the user (member) who will own the workbook.",
      propDefinition: [
        app,
        "memberId",
      ],
    },
  },
  methods: {
    createWorkbook(args = {}) {
      return this.app.post({
        path: "/workbooks",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createWorkbook,
      name,
      folderId,
      description,
      ownerId,
    } = this;

    const response = await createWorkbook({
      $,
      data: {
        name,
        folderId,
        description,
        ownerId,
      },
    });
    $.export("$summary", `Successfully created workbook with ID \`${response.workbookId}\`.`);
    return response;
  },
};
