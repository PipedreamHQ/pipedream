import { writeFile } from "fs/promises";
import path from "path";
import { ConfigurationError } from "@pipedream/platform";
import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-get-employee-file",
  name: "Get Employee File",
  description: "Download a single employee file and save it to `/tmp` (GET /employees/{id}/files/{fileId}). Use **List Employee Files** to discover file IDs. [See the documentation](https://documentation.bamboohr.com/reference/get-employee-file)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bamboohr,
    syncDir: {
      type: "$.sync.dir",
      label: "Output Directory",
      description: "The directory in your Pipedream File Stash to sync the downloaded file to.",
      accessMode: "write",
      sync: true,
    },
    employeeId: {
      propDefinition: [
        bamboohr,
        "employeeId",
      ],
    },
    fileId: {
      propDefinition: [
        bamboohr,
        "fileId",
      ],
      description: "The file ID. Run **List Employee Files** to discover file IDs for this employee.",
    },
    outputFilename: {
      type: "string",
      label: "Output Filename",
      description: "Filename to save in `/tmp`, e.g. `employee-file.pdf`. Defaults to `bamboohr-file-{fileId}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const buffer = await this.bamboohr.getEmployeeFile({
      $,
      employeeId: this.employeeId,
      fileId: this.fileId,
    });
    const filename = this.outputFilename || `bamboohr-file-${this.fileId}`;
    if (filename.includes("/") || filename.includes("\\") || filename === "." || filename === "..") {
      throw new ConfigurationError(`Output Filename must be a plain filename with no path separators or \`.\`/\`..\` segments, got \`${filename}\``);
    }
    const filePath = path.join("/tmp", filename);
    if (path.dirname(filePath) !== "/tmp") {
      throw new ConfigurationError(`Output Filename must resolve to a path inside /tmp, got \`${filename}\``);
    }
    await writeFile(filePath, Buffer.from(buffer));
    $.export("$summary", `Downloaded file ${this.fileId} for employee ${this.employeeId} to ${filePath}`);
    return {
      filePath,
    };
  },
};
