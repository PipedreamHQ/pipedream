import cloudConvertApp from "../../cloud_convert.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "cloud_convert-convert-file",
  name: "Convert File",
  description: "Converts an input file to a specified output format using CloudConvert. [See the documentation](https://cloudconvert.com/api/v2/convert#convert-tasks)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    cloudConvertApp,
    inputFile: {
      propDefinition: [
        cloudConvertApp,
        "inputFile",
      ],
    },
    outputFormat: {
      propDefinition: [
        cloudConvertApp,
        "outputFormat",
      ],
    },
    qualitySettings: {
      type: "object",
      label: "Quality Settings",
      description: "The quality settings for the conversion, if applicable.",
      optional: true,
    },
    conversionParameters: {
      type: "object",
      label: "Conversion Parameters",
      description: "Additional conversion parameters for the task.",
      optional: true,
    },
  },
  async run({ $ }) {
    const inputFormat = this.inputFile.split(".").pop();
    const conversionTask = {
      operation: "convert",
      input_format: inputFormat,
      output_format: this.outputFormat,
      ...this.qualitySettings,
      ...this.conversionParameters,
    };

    const job = await this.cloudConvertApp.createJob({
      tasks: {
        "convert-it": conversionTask,
        "export-it": {
          operation: "export/url",
          input: "convert-it",
        },
      },
    });

    const jobId = job.data.id;
    let jobStatus = await this.cloudConvertApp.getJobStatus(jobId);

    // Polling the job status until it's finished or failed
    while (jobStatus.data.status === "processing") {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 sec delay
      jobStatus = await this.cloudConvertApp.getJobStatus(jobId);
    }

    if (jobStatus.data.status === "finished") {
      const exportTask = jobStatus.data.tasks.find((task) => task.name === "export-it" && task.status === "finished");
      if (!exportTask || !exportTask.result || !exportTask.result.files || !exportTask.result.files.length) {
        throw new Error("No export task found with finished status and result files.");
      }

      const file = exportTask.result.files[0];
      const fileDownloadUrl = file.url;

      const fileStream = await this.cloudConvertApp.downloadExportedFile(fileDownloadUrl);

      // Assuming the file needs to be stored temporarily
      const targetPath = `/tmp/converted.${this.outputFormat}`;
      const writer = fs.createWriteStream(targetPath);

      fileStream.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      const summary = this.qualitySettings
        ? "Converted file with quality settings"
        : "Converted file successfully";
      $.export("$summary", summary);
      return {
        jobId,
        fileDownloadUrl,
        targetPath,
      };
    } else {
      throw new Error(`Failed to convert the file. Job status: ${jobStatus.data.status}`);
    }
  },
};
