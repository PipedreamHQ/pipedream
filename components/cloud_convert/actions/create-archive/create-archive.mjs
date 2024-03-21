import cloudConvertApp from "../../cloud_convert.app.mjs";
import { axios } from "@pipedream/platform";
import fs from "fs";

export default {
  key: "cloud_convert-create-archive",
  name: "Create Archive",
  description: "Creates an archive in a specified format such as zip, rar, 7z, tar, etc. [See the documentation](https://cloudconvert.com/api/v2/archive#archive-tasks)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    cloudConvertApp,
    filesToArchive: {
      propDefinition: [
        cloudConvertApp,
        "filesToArchive",
      ],
    },
    archiveFormat: {
      propDefinition: [
        cloudConvertApp,
        "archiveFormat",
      ],
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password for protected archives (optional)",
      optional: true,
      secret: true,
    },
  },
  async run({ $ }) {
    const archiveTask = {
      operation: "archive",
      input: this.filesToArchive,
      output_format: this.archiveFormat,
    };

    if (this.password) {
      archiveTask.options = {
        password: this.password,
      };
    }

    const jobData = {
      tasks: {
        "task_archive": archiveTask,
      },
    };

    const jobResponse = await this.cloudConvertApp.createJob(jobData);
    const jobId = jobResponse.data.id;

    let jobStatusResponse = await this.cloudConvertApp.getJobStatus(jobId);
    while (jobStatusResponse.data.status !== "finished") {
      // Re-check the job status every 30 seconds until it's finished
      await new Promise((resolve) => setTimeout(resolve, 30000));
      jobStatusResponse = await this.cloudConvertApp.getJobStatus(jobId);
    }

    const archiveTaskId = jobStatusResponse.data.tasks.find((task) => task.name === "task_archive").id;
    const downloadUrl = jobStatusResponse.data.tasks.find((task) => task.result && task.result.archive && task.result.archive.url).result.archive.url;

    const fileStream = await this.cloudConvertApp.downloadExportedFile(downloadUrl);

    // Save to /tmp directory
    const filePath = `/tmp/archive-${jobId}.${this.archiveFormat}`;
    const writer = fileStream.pipe(fs.createWriteStream(filePath));

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    $.export("$summary", `Successfully created archive in ${this.archiveFormat} format with Job ID: ${jobId}`);
    return {
      archive_url: downloadUrl,
      local_path: filePath,
    };
  },
};
