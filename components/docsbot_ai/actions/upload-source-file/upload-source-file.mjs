import { getFileStreamAndMetadata } from "@pipedream/platform";
import docsbotAi from "../../docsbot_ai.app.mjs";

export default {
  key: "docsbot_ai-upload-source-file",
  name: "Upload Source File",
  description: "Upload a file to be used as a source. [See the documentation](https://docsbot.ai/documentation/developer/source-api#source-file-uploads)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    docsbotAi,
    teamId: {
      propDefinition: [
        docsbotAi,
        "teamId",
      ],
    },
    botId: {
      propDefinition: [
        docsbotAi,
        "botId",
        ({ teamId }) => ({
          teamId,
        }),
      ],
    },
    filePath: {
      propDefinition: [
        docsbotAi,
        "filePath",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const { filePath } = this;
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(filePath);

    const {
      file, url,
    } = await this.docsbotAi.getFileUploadUrl({
      $,
      teamId: this.teamId,
      botId: this.botId,
      params: {
        fileName: metadata.name || filePath.split("/").pop(),
      },
    });

    await this.docsbotAi.uploadSourceFile({
      $,
      url,
      data: stream,
    });
    $.export("$summary", `Successfully uploaded "${metadata.name}"`);
    return {
      file,
    };
  },
};
