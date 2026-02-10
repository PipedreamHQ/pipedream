import sharepoint from "../../sharepoint.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "sharepoint-select-files",
  name: "Select Files",
  description: "A file picker action that allows browsing and selecting one or more files from SharePoint. Returns the selected files' metadata including pre-authenticated download URLs. [See the documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-get)",
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
          siteId: c.siteId?.__lv?.value || c.siteId,
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
          siteId: c.siteId?.__lv?.value || c.siteId,
          driveId: c.driveId?.__lv?.value || c.driveId,
        }),
      ],
      label: "Folder",
      description: "The folder to browse. Leave empty to browse the root of the drive.",
      optional: true,
      withLabel: true,
      reloadProps: true,
    },
    fileOrFolderIds: {
      propDefinition: [
        sharepoint,
        "fileOrFolderId",
        (c) => ({
          siteId: c.siteId?.__lv?.value || c.siteId,
          driveId: c.driveId?.__lv?.value || c.driveId,
          folderId: c.folderId?.__lv?.value || c.folderId,
        }),
      ],
      type: "string[]",
      label: "Files or Folders",
      description: "Select one or more files, or select a folder and click 'Refresh Fields' to browse into it",
      withLabel: true,
    },
  },
  methods: {},
  async run({ $ }) {
    const selections = utils.parseFileOrFolderList(this.fileOrFolderIds);

    if (selections.length === 0) {
      throw new Error("Please select at least one file or folder");
    }

    const siteId = utils.resolveValue(this.siteId);
    const driveId = utils.resolveValue(this.driveId);

    // Separate files and folders
    const folders = selections.filter((s) => s.isFolder);
    const files = selections.filter((s) => !s.isFolder);

    // If only folders selected, return folder info
    if (files.length === 0 && folders.length > 0) {
      const folderNames = folders.map((f) => f.name).join(", ");
      $.export("$summary", `Selected ${folders.length} folder(s): ${folderNames}. Set one as the Folder ID and refresh to browse its contents.`);
      return {
        type: "folders",
        folders: folders.map((f) => ({
          id: f.id,
          name: f.name,
        })),
        message: "To browse a folder, set it as the folderId and reload props",
      };
    }

    // Fetch metadata for all selected files in parallel, handling individual failures
    const settledResults = await Promise.allSettled(
      files.map(async (selected) => {
        const file = await this.sharepoint.getDriveItem({
          $,
          siteId,
          driveId,
          fileId: selected.id,
        });

        const downloadUrl = file["@microsoft.graph.downloadUrl"];

        return {
          ...file,
          downloadUrl,
          _meta: {
            siteId,
            driveId,
            fileId: selected.id,
          },
        };
      }),
    );

    // Separate successful and failed results
    const fileResults = [];
    const errors = [];

    settledResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        fileResults.push(result.value);
      } else {
        const selected = files[index];
        const errorMessage = result.reason?.message || String(result.reason);
        console.error(`Failed to fetch file ${selected.id} (${selected.name}): ${errorMessage}`);
        errors.push({
          fileId: selected.id,
          fileName: selected.name,
          error: errorMessage,
        });
      }
    });

    // If all files failed, throw an error
    if (fileResults.length === 0 && errors.length > 0) {
      throw new Error(`Failed to fetch all selected files: ${errors.map((e) => e.fileName).join(", ")}`);
    }

    // If single file, return it directly for backwards compatibility
    if (fileResults.length === 1 && folders.length === 0 && errors.length === 0) {
      $.export("$summary", `Selected file: ${fileResults[0].name}`);
      return fileResults[0];
    }

    // Multiple files: return as array
    const fileNames = fileResults.map((f) => f.name).join(", ");
    const summaryParts = [
      `Selected ${fileResults.length} file(s): ${fileNames}`,
    ];
    if (errors.length > 0) {
      summaryParts.push(`Failed to fetch ${errors.length} file(s): ${errors.map((e) => e.fileName).join(", ")}`);
    }
    $.export("$summary", summaryParts.join(". "));

    return {
      files: fileResults,
      ...(errors.length > 0 && {
        errors,
      }),
      ...(folders.length > 0 && {
        folders: folders.map((f) => ({
          id: f.id,
          name: f.name,
        })),
      }),
    };
  },
};
