import {
  ConfigurationError, getFileStreamAndMetadata,
} from "@pipedream/platform";
import app from "../../lamini.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "lamini-upload-dataset",
  name: "Upload Dataset",
  description: "Upload a dataset to Lamini for training.",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    file: {
      type: "string",
      label: "Dataset File Path or URL",
      description: "URL or path to a file containing your training data. Supported formats include `.jsonl` and `.jsonlines`.",
    },
    inputKey: {
      type: "string",
      label: "Input Key",
      description: "Key of the JSON dictionary to use as the input. Eg. `question`.",
    },
    outputKey: {
      type: "string",
      label: "Output Key",
      description: "Key of the JSON dictionary to use as the output. Eg. `answer`.",
      optional: true,
    },
    isPublic: {
      type: "boolean",
      label: "Is Public",
      description: "Whether this dataset should be publicly accessible.",
      optional: true,
    },
  },
  methods: {
    uploadLocalData(args = {}) {
      return this.app.post({
        versionPath: constants.VERSION_PATH.V1,
        path: "/local-data",
        ...args,
      });
    },
    getUploadBasePath() {
      return this.app.makeRequest({
        versionPath: constants.VERSION_PATH.V1,
        path: "/get-upload-base-path",
      });
    },
    streamToUtf8(stream) {
      return new Promise((resolve, reject) => {
        let data = "";
        stream.setEncoding("utf-8");
        stream.on("data", (chunk) => data += chunk);
        stream.on("end", () => resolve(data));
        stream.on("error", reject);
      });
    },
  },
  async run({ $ }) {
    const {
      file,
      inputKey,
      outputKey,
      isPublic,
    } = this;

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(file);

    const fileName = metadata.name;
    if (!fileName.endsWith(".jsonl") && !fileName.endsWith(".jsonlines")) {
      throw new ConfigurationError(`Unsupported file format for \`${fileName}\`. Only **.jsonl** and **.jsonlines** files are supported.`);
    }

    const { upload_base_path: uploadBasePath } = await this.getUploadBasePath();

    let allData = [];

    const fileContent = await this.streamToUtf8(stream);
    const lines = fileContent.trim().split("\n");

    for (const line of lines) {
      try {
        const row = JSON.parse(line);
        if (!row[inputKey]) {
          throw new ConfigurationError(`File ${fileName} is missing required key: ${inputKey}`);
        }
        allData.push({
          input: row[inputKey],
          output: row[outputKey] || "",
        });
      } catch (e) {
        if (e.message.includes("missing required key")) {
          throw e;
        }
        // Skip invalid JSON lines
      }
    }

    if (allData.length === 0) {
      throw new ConfigurationError("No valid data found in the provided files.");
    }

    const response = await this.uploadLocalData({
      $,
      data: {
        upload_base_path: uploadBasePath,
        data: allData,
        is_public: isPublic,
      },
    });

    $.export("$summary", `Successfully uploaded file as dataset with ID \`${response.dataset_id}\`.`);

    return {
      ...response,
      num_data_points: allData.length,
    };
  },
};
