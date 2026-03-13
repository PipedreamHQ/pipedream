import sharepoint from "../sharepoint.app.mjs";

/**
 * Shared prop definitions for file picker actions.
 * These props provide a consistent file/folder browsing experience across actions.
 */
export const filePickerProps = {
  sharepoint,
  siteId: {
    propDefinition: [
      sharepoint,
      "siteId",
    ],
    withLabel: true,
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
    label: "Folder",
    description: "The folder to browse. Leave empty to browse the root of the drive.",
    optional: true,
    withLabel: true,
  },
  fileOrFolderIds: {
    propDefinition: [
      sharepoint,
      "fileOrFolderId",
      (c) => ({
        siteId: c.siteId,
        driveId: c.driveId,
        folderId: c.folderId,
      }),
    ],
    type: "string[]",
    label: "Files or Folders",
    description: "Select one or more files, or select a folder and click 'Refresh Fields' to browse into it",
    withLabel: true,
  },
};

/**
 * Shared methods for file picker actions.
 * Provides common functionality for parsing selections, fetching metadata,
 * and handling folder-only selections.
 */
export const filePickerMethods = {
  /**
   * Categorizes selections into files and folders based on isFolder property.
   *
   * @param {Array<{id: string, name: string, isFolder: boolean}>} selections
   *   Array of parsed file/folder objects
   * @returns {{files: Array, folders: Array}}
   *   Object with separate files and folders arrays
   * @example
   * const { files, folders } = this.categorizeSelections([
   *   { id: "1", name: "report.pdf", isFolder: false },
   *   { id: "2", name: "Documents", isFolder: true }
   * ]);
   * // files: [{ id: "1", name: "report.pdf", isFolder: false }]
   * // folders: [{ id: "2", name: "Documents", isFolder: true }]
   */
  categorizeSelections(selections) {
    return {
      folders: selections.filter((s) => s.isFolder),
      files: selections.filter((s) => !s.isFolder),
    };
  },

  /**
   * Handles the case where only folders are selected
   * @param {Object} $ - Pipedream step context
   * @param {Array} folders - Array of folder objects
   * @returns {Object} Response object with folder information
   */
  handleFolderOnlySelection($, folders) {
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
  },

  /**
   * Constructs a SharePoint library view URL that opens the file in the
   * document library context. This is useful for providing users with a
   * link to view the file in SharePoint's web interface.
   *
   * @param {string} fileWebUrl - The file's webUrl from Microsoft Graph API
   * @returns {string|null} SharePoint AllItems.aspx URL with file location,
   *   or null if construction fails
   * @example
   * // Input: "https://contoso.sharepoint.com/sites/Marketing/..."
   * // Output: "https://contoso.sharepoint.com/sites/Marketing/...aspx?..."
   */
  constructSharePointViewUrl(fileWebUrl) {
    if (!fileWebUrl) return null;

    try {
      // Parse webUrl to extract components
      // Example: https://tenant.sharepoint.com/sites/sitename/LibraryName/folder/file.ext
      const url = new URL(fileWebUrl);

      // Extract library path from webUrl (e.g., "Shared%20Documents")
      // Match pattern: /sites/{sitename}/{libraryname}/...
      const libraryMatch = fileWebUrl.match(/\/sites\/[^/]+\/([^/]+)/);
      if (!libraryMatch) return null;

      const libraryUrlPart = libraryMatch[1]; // This keeps the original encoding from webUrl

      // Construct site URL
      const siteUrlMatch = fileWebUrl.match(/(https:\/\/[^/]+\/sites\/[^/]+)/);
      if (!siteUrlMatch) return null;

      const siteUrl = siteUrlMatch[1];

      // Construct the full file path (decode the pathname to get raw path)
      const filePath = decodeURIComponent(url.pathname);

      // Construct parent path by removing the filename
      const parentPath = filePath.substring(0, filePath.lastIndexOf("/"));

      // Build the AllItems.aspx URL - don't re-encode the library name in path
      return `${siteUrl}/${libraryUrlPart}/Forms/AllItems.aspx?id=${encodeURIComponent(filePath)}&parent=${encodeURIComponent(parentPath)}`;
    } catch (error) {
      console.error("Error constructing SharePoint view URL:", error);
      return null;
    }
  },

  /**
   * Fetches metadata for multiple files in parallel with individual error
   * handling. Uses Promise.allSettled to ensure partial failures don't
   * block successful fetches.
   *
   * @param {Object} $ - Pipedream step context for API calls
   * @param {Array<{id: string, name: string}>} files
   *   Array of file objects with id property
   * @param {string} siteId - SharePoint site ID
   * @param {string} driveId - Drive ID within the site
   * @param {Object} [options={}] - Configuration options
   * @param {boolean} [options.includeDownloadUrl=true]
   *   Whether to include temporary downloadUrl in response
   * @returns {Promise<{fileResults: Array, errors: Array}>}
   *   Object with successful results and errors
   * @example
   * const { fileResults, errors } = await this.fetchFileMetadata(
   *   $, files, siteId, driveId, { includeDownloadUrl: true }
   * );
   */
  async fetchFileMetadata($, files, siteId, driveId, options = {}) {
    const { includeDownloadUrl = true } = options;

    // Fetch metadata for all selected files in parallel, handling individual failures
    const settledResults = await Promise.allSettled(
      files.map(async (selected) => {
        // When includeDownloadUrl is true, omit $select to get @microsoft.graph.downloadUrl
        // (Graph API excludes downloadUrl when using $select)
        const params = includeDownloadUrl
          ? {}
          : {
            $select: "id,name,size,webUrl,createdDateTime,lastModifiedDateTime,createdBy,lastModifiedBy,parentReference,file,folder,image,video,audio,photo,shared,fileSystemInfo,cTag,eTag,sharepointIds",
          };

        const file = await this.sharepoint.getDriveItem({
          $,
          siteId,
          driveId,
          fileId: selected.id,
          params,
        });

        // Construct SharePoint library view URL
        const sharepointViewUrl = this.constructSharePointViewUrl(file.webUrl);

        const result = {
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

        // Remove the Graph API property name from spread
        delete result["@microsoft.graph.downloadUrl"];

        // Conditionally include downloadUrl based on options
        if (includeDownloadUrl) {
          result.downloadUrl = file["@microsoft.graph.downloadUrl"];
        }

        return result;
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

    return {
      fileResults,
      errors,
    };
  },

  /**
   * Processes and formats the final results with user-friendly summary
   * export. Handles single file vs. multiple files formatting for UX.
   *
   * @param {Object} $ - Pipedream step context for exports
   * @param {Array} fileResults - Successfully fetched file metadata
   * @param {Array} errors - Failed file fetches with error details
   * @param {Array} folders
   *   Selected folders (for informational purposes)
   * @param {Object} [options={}] - Configuration options
   * @param {string} [options.successVerb="Retrieved"]
   *   Verb for summary (e.g., "Retrieved", "Downloaded")
   * @param {string} [options.successNoun="file(s)"]
   *   Noun for summary (e.g., "download URL(s)", "metadata")
   * @returns {Object|Array} Single file object if one file, otherwise
   *   object with files/errors/folders arrays
   * @throws {Error} If all file fetches failed
   * @example
   * return this.processResults($, fileResults, errors, folders, {
   *   successVerb: "Retrieved",
   *   successNoun: "download URL(s)"
   * });
   */
  processResults($, fileResults, errors, folders, options = {}) {
    const {
      successVerb = "Retrieved",
      successNoun = "file(s)",
    } = options;

    // If all files failed, throw an error
    if (fileResults.length === 0 && errors.length > 0) {
      throw new Error(`Failed to fetch all selected files: ${errors.map((e) => e.fileName).join(", ")}`);
    }

    // If single file, return it directly for backwards compatibility
    if (fileResults.length === 1 && folders.length === 0 && errors.length === 0) {
      $.export("$summary", `${successVerb} ${successNoun} for: ${fileResults[0].name}`);
      return fileResults[0];
    }

    // Multiple files: return as object with metadata
    const fileNames = fileResults.map((f) => f.name).join(", ");
    const summaryParts = [
      `${successVerb} ${successNoun} for ${fileResults.length} file(s): ${fileNames}`,
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
