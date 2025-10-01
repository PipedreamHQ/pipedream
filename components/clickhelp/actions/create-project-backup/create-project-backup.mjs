import clickhelp from "../../clickhelp.app.mjs";
import { pollTaskStatus } from "../../common/utils.mjs";

export default {
  key: "clickhelp-create-project-backup",
  name: "Create Project Backup",
  description: "Generates a backup of the specified project. This action ensures you have a safe copy of your project in case of any unpredicted data loss. [See the documentation](https://clickhelp.com/software-documentation-tool/user-manual/api-create-project-backup.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    clickhelp,
    projectId: {
      propDefinition: [
        clickhelp,
        "projectId",
      ],
    },
    outputFileName: {
      type: "string",
      label: "Output File Name",
      description: "The full file name of the output file, including the file path that starts with `Storage/`. Example: `Storage/Backups/Project-backup_2023-03-13_03-46-07.zip`",
    },
    waitForCompletion: {
      propDefinition: [
        clickhelp,
        "waitForCompletion",
      ],
    },
  },
  async run({ $ }) {
    let response = await this.clickhelp.createProjectBackup({
      $,
      projectId: this.projectId,
      params: {
        action: "download",
      },
      data: {
        outputFileName: this.outputFileName,
      },
    });

    const { taskKey } = response;
    if (this.waitForCompletion) {
      response = await pollTaskStatus($, this, taskKey);
    }

    $.export("$summary", "Successfully created project backup.");
    return response;
  },
};
