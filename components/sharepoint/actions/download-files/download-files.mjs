import utils from "../../common/utils.mjs";
import {
  filePickerProps,
  filePickerMethods,
} from "../../common/file-picker-base.mjs";

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
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: filePickerProps,
  methods: filePickerMethods,
  async run({ $ }) {
    const selections = utils.parseFileOrFolderList(this.fileOrFolderIds);

    if (selections.length === 0) {
      throw new Error("Please select at least one file or folder");
    }

    const siteId = this.sharepoint.resolveWrappedValue(this.siteId);
    const driveId = this.sharepoint.resolveWrappedValue(this.driveId);

    // Separate files and folders
    const {
      files,
      folders,
    } = this.categorizeSelections(selections);

    // If only folders selected, return folder info
    if (files.length === 0 && folders.length > 0) {
      return this.handleFolderOnlySelection($, folders);
    }

    // Fetch metadata for all selected files with download URLs
    const {
      fileResults,
      errors,
    } = await this.fetchFileMetadata($, files, siteId, driveId, {
      includeDownloadUrl: true,
    });

    // Process and return results
    return this.processResults($, fileResults, errors, folders, {
      successVerb: "Retrieved",
      successNoun: "download URL(s)",
    });
  },
};
