import dropbox from "../../dropbox.app.mjs";

export default {
  name: "List All Files/Subfolders in a Folder",
  description: "Retrieves a list of files or subfolders in a specified folder [See the documentation](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesListFolder__anchor)",
  key: "dropbox-list-file-folders-in-a-folder",
  version: "0.0.13",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dropbox,
    path: {
      propDefinition: [
        dropbox,
        "path",
        () => ({
          initialOptions: [],
          filter: ({ metadata: { metadata: { [".tag"]: type } } }) => type === "folder",
        }),
      ],
      description: "Type the folder name to search for it in the user's Dropbox.",
    },
    recursive: {
      type: "boolean",
      label: "Recursive",
      description: "If `true`, the list folder operation will be applied recursively to all subfolders and the response will contain contents of all subfolders.",
      default: true,
    },
    includeDeleted: {
      type: "boolean",
      label: "Include Deleted",
      description: "If `true`, the results will include files and folders that used to exist but were deleted.",
      default: false,
    },
    includeHasExplicitSharedMembers: {
      type: "boolean",
      label: "Include has explicit shared members",
      description: "If `true`, the results will include a flag for each file indicating whether or not that file has any explicit members.",
      default: false,
    },
    includeMountedFolders: {
      type: "boolean",
      label: "Include mounted folders",
      description: "If `true`, the results will include entries under mounted folders which includes app folder, shared folder and team folder.",
      default: false,
    },
    includeNonDownloadableFiles: {
      type: "boolean",
      label: "Include non downloadable files",
      description: "If `true`, include files that are not downloadable, i.e. Google Docs.",
      default: true,
    },
    limit: {
      propDefinition: [
        dropbox,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const {
      limit,
      path,
      recursive,
      includeDeleted,
      includeHasExplicitSharedMembers,
      includeMountedFolders,
      includeNonDownloadableFiles,
    } = this;
    const res = await this.dropbox.listFilesFolders({
      path: this.dropbox.getPath(path),
      recursive,
      include_deleted: includeDeleted,
      include_has_explicit_shared_members: includeHasExplicitSharedMembers,
      include_mounted_folders: includeMountedFolders,
      include_non_downloadable_files: includeNonDownloadableFiles,
    }, limit);
    $.export("$summary", `Files and folders in the path ${path?.label || path} successfully fetched`);
    return res;
  },
};
