import sharepoint from "../../sharepoint.app.mjs";
import utils from "../../common/utils.mjs";
import { filePickerMethods } from "../../common/file-picker-base.mjs";

export default {
  key: "sharepoint-download-files",
  name: "Download Files",
  description: "Browse and select files from SharePoint and get their metadata along with pre-authenticated download URLs (valid ~1 hour). " +
    "Use this when you need to download or access file content.\n\n" +
    "**Example Use Cases:**\n" +
    "- Download files to analyze content in other steps\n" +
    "- Pass download URLs to other services (email, cloud storage, etc.)\n" +
    "- Archive files to external storage\n" +
    "- Process file content through AI/ML services\n\n" +
    "[See the documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-get)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sharepoint,
    siteId: {
      propDefinition: [
        sharepoint,
        "siteId",
      ],
      withLabel: true,
      reloadProps: true,
    },
    driveId: {
      propDefinition: [
        sharepoint,
        "driveId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
      withLabel: true,
      reloadProps: true,
    },
    folderId: {
      propDefinition: [
        sharepoint,
        "folderId",
        (c) => ({
          siteId: c.siteId,
          driveId: c.driveId,
        }),
      ],
      description: "The folder to browse. Leave empty to browse the root of the drive.",
      optional: true,
      withLabel: true,
      reloadProps: true,
    },
    fileIds: {
      propDefinition: [
        sharepoint,
        "fileIds",
        (c) => ({
          siteId: c.siteId,
          driveId: c.driveId,
          folderId: c.folderId,
        }),
      ],
      label: "Files",
      description: "Select one or more files to download. **Note:** Only files can be downloaded; folders are not supported.",
    },
  },
  methods: filePickerMethods,
  async run({ $ }) {
    // Parse the fileIds (which are JSON strings from the file picker)
    const selections = utils.parseFileOrFolderList(this.fileIds);

    if (selections.length === 0) {
      throw new Error("Please select at least one file");
    }

    const siteId = this.sharepoint.resolveWrappedValue(this.siteId);
    const driveId = this.sharepoint.resolveWrappedValue(this.driveId);

    // Fetch metadata for all selected files with download URLs
    const {
      fileResults,
      errors,
    } = await this.fetchFileMetadata($, selections, siteId, driveId, {
      includeDownloadUrl: true,
    });

    // Process and return results (no folders to handle)
    return this.processResults($, fileResults, errors, [], {
      successVerb: "Retrieved",
      successNoun: "download URL(s)",
    });
  },
};
