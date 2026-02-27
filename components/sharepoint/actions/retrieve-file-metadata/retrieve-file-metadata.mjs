import utils from "../../common/utils.mjs";
import {
  filePickerProps,
  filePickerMethods,
} from "../../common/file-picker-base.mjs";

export default {
  key: "sharepoint-retrieve-file-metadata",
  name: "Retrieve File Metadata",
  description: "Browse and select files from SharePoint to retrieve their metadata (name, size, dates, etc.) without download URLs. [See the documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-get)",
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

    // Fetch metadata for all selected files WITHOUT download URLs
    const {
      fileResults,
      errors,
    } = await this.fetchFileMetadata($, files, siteId, driveId, {
      includeDownloadUrl: false,
    });

    // Process and return results
    return this.processResults($, fileResults, errors, folders, {
      successVerb: "Retrieved",
      successNoun: "metadata",
    });
  },
};
