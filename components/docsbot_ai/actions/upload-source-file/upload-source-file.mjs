import fs from "fs";
import docsbotAi from "../../docsbot_ai.app.mjs";

export default {
  key: "docsbot_ai-upload-source-file",
  name: "Upload Source File",
  description: "Upload a file to be used as a source. [See the documentation](https://docsbot.ai/documentation/developer/source-api#source-file-uploads)",
  version: "0.0.1",
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
  },
  async run({ $ }) {
    const { filePath } = this;
    const data = fs.createReadStream(filePath.startsWith("/tmp")
      ? filePath
      : `/tmp/${filePath}`.replace(/\/\//g, "/"));

    const fileName = filePath.split("/").pop();

    const {
      file, url,
    } = await this.docsbotAi.getFileUploadUrl({
      $,
      teamId: this.teamId,
      botId: this.botId,
      params: {
        fileName,
      },
    });

    await this.docsbotAi.uploadSourceFile({
      $,
      url,
      data,
    });
    $.export("$summary", `Successfully uploaded "${fileName}"`);
    return {
      file,
    };
  },
};
