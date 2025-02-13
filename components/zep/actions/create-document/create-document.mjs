import zep from "../../zep.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zep-create-document",
  name: "Create Document",
  description: "Creates a new document in Zep. [See the documentation](/api-reference/document/add-documents)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    zep,
    title: {
      propDefinition: [
        zep,
        "title",
      ],
    },
    content: {
      propDefinition: [
        zep,
        "content",
      ],
    },
    workspace: {
      propDefinition: [
        zep,
        "workspace",
      ],
    },
    folder: {
      propDefinition: [
        zep,
        "folder",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zep.createDocument({
      title: this.title,
      content: this.content,
      workspaceId: this.workspace,
      folderId: this.folder,
    });

    $.export("$summary", `Document Created: ${response.title} (ID: ${response.id})`);
    return response;
  },
};
