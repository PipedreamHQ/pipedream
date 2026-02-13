import sharepoint from "../../sharepoint.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "sharepoint-retrieve-file-metadata",
  name: "Retrieve File Metadata",
  description: "Browse and select files from SharePoint to retrieve their metadata (name, size, dates, etc.) without download URLs. Useful for file inspection and organization workflows. [See the documentation](https://learn.microsoft.com/en-us/graph/api/driveitem-get)",
  version: "0.0.1",
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
          params: {
            $select: "id,name,size,webUrl,createdDateTime,lastModifiedDateTime,createdBy,lastModifiedBy,parentReference,file,folder,image,video,audio,photo,shared,fileSystemInfo,cTag,eTag,sharepointIds",
          },
        });

        // Explicitly remove downloadUrl from response
        delete file["@microsoft.graph.downloadUrl"];

        // Construct SharePoint library view URL that shows the file in document library context
        let sharepointViewUrl;
        if (file.webUrl) {
          try {
            // Parse webUrl to extract components
            // Example: https://tenant.sharepoint.com/sites/sitename/LibraryName/folder/file.ext
            const url = new URL(file.webUrl);

            // Extract library path from webUrl (e.g., "Shared%20Documents")
            // Match pattern: /sites/{sitename}/{libraryname}/...
            const libraryMatch = file.webUrl.match(/\/sites\/[^/]+\/([^/]+)/);
            if (libraryMatch) {
              const libraryUrlPart = libraryMatch[1]; // This keeps the original encoding from webUrl

              // Construct site URL
              const siteUrlMatch = file.webUrl.match(/(https:\/\/[^/]+\/sites\/[^/]+)/);
              const siteUrl = siteUrlMatch[1];

              // Construct the full file path (decode the pathname to get raw path)
              const filePath = decodeURIComponent(url.pathname);

              // Construct parent path by removing the filename
              const parentPath = filePath.substring(0, filePath.lastIndexOf("/"));

              // Build the AllItems.aspx URL - don't re-encode the library name in path
              sharepointViewUrl = `${siteUrl}/${libraryUrlPart}/Forms/AllItems.aspx?id=${encodeURIComponent(filePath)}&parent=${encodeURIComponent(parentPath)}`;
            }
          } catch (error) {
            console.error("Error constructing SharePoint view URL:", error);
          }
        }

        return {
          ...file,
          ...(sharepointViewUrl && {
            sharepointViewUrl,
          }),
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
      $.export("$summary", `Retrieved metadata for: ${fileResults[0].name}`);
      return fileResults[0];
    }

    // Multiple files: return as array
    const fileNames = fileResults.map((f) => f.name).join(", ");
    const summaryParts = [
      `Retrieved metadata for ${fileResults.length} file(s): ${fileNames}`,
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
