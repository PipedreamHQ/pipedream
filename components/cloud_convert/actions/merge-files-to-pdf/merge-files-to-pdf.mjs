import cloudConvertApp from "../../cloud_convert.app.mjs";
import { axios } from "@pipedream/platform";
import fs from "fs";

export default {
  key: "cloud_convert-merge-files-to-pdf",
  name: "Merge Files to PDF",
  description: "Combines multiple input files into a single PDF file. The input files are automatically converted to PDF before merging.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    cloudConvertApp,
    inputFiles: {
      propDefinition: [
        cloudConvertApp,
        "inputFiles",
      ],
    },
  },
  async run({ $ }) {
    // Create an array to hold the tasks for converting files to PDF
    const convertTasks = this.inputFiles.map((inputFile, index) => ({
      operation: "convert",
      input_format: inputFile.split(".").pop(),
      output_format: "pdf",
      input: [
        `import-${index}`,
      ],
    }));

    // Create import tasks for each input file
    const importTasks = this.inputFiles.map((inputFile, index) => ({
      operation: "import/url",
      url: inputFile,
      filename: `input-file-${index}`,
    }));

    // Create the merge task
    const mergeTask = {
      operation: "merge",
      input: importTasks.map((_, index) => `file-${index}`),
    };

    // Combine all tasks
    const tasks = [
      ...importTasks.map((task, index) => ({
        [`import-${index}`]: task,
      })),
      ...convertTasks.map((task, index) => ({
        [`convert-${index}`]: task,
      })),
      {
        "merge": mergeTask,
      },
    ];

    // Create the job with all tasks
    const jobResponse = await this.cloudConvertApp.createJob({
      tasks,
    });

    const jobId = jobResponse.data.id;

    // Wait for job completion
    let jobStatusResponse;
    do {
      jobStatusResponse = await this.cloudConvertApp.getJobStatus(jobId);
    } while (jobStatusResponse.data.status !== "finished" && jobStatusResponse.data.status !== "error");

    if (jobStatusResponse.data.status === "error") {
      throw new Error(`Job failed with error: ${jobStatusResponse.data.message}`);
    }

    // Download the merged PDF file
    const downloadUrl = jobStatusResponse.data.tasks.find((task) => task.name === "merge" && task.result).result.files[0].url;
    const pdfFileResponse = await this.cloudConvertApp.downloadExportedFile(downloadUrl);

    // Write the file to the /tmp directory
    const targetPath = `/tmp/merged-${Date.now()}.pdf`;
    const writer = fs.createWriteStream(targetPath);
    pdfFileResponse.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    $.export("$summary", "Successfully merged files into a single PDF");

    return {
      merged_pdf: targetPath,
    };
  },
};
