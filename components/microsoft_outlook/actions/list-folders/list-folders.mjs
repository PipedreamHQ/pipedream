import microsoftOutlook from "../../microsoft_outlook.app.mjs";
import { COUNT_QUERY_PARAM } from "../../common/constants.mjs";

export default {
  key: "microsoft_outlook-list-folders",
  name: "List Folders",
  description: "Retrieves mail folders for the authenticated user. Returns `{ count, folders }` where `folders` contains each folder's `id`, `displayName`, `parentFolderId`, `childFolderCount`, `totalItemCount`, and `unreadItemCount`. The `count` field reflects the true API total when Microsoft Graph returns `@odata.count` (supported for top-level mailFolders queries); when `Include Subfolders` is `true` or Graph does not return `@odata.count` for the requested filter, `count` equals the number of folders actually retrieved. **Use this action to resolve a folder display name to its ID** — set `Display Name` to filter by exact name. Use **Get Folder** instead when you already have the folder ID. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-mailfolders?view=graph-rest-1.0&tabs=http)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoftOutlook,
    displayName: {
      type: "string",
      label: "Display Name",
      description: "Filter to folders whose display name exactly matches this value. Use this to resolve a known folder name to its ID. Applied server-side when `Include Subfolders` is `false`; applied client-side when `true`.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        microsoftOutlook,
        "maxResults",
      ],
      description: "Maximum number of folders to return (default: 100). Min 1, max 1000. For name-based lookups when the total folder count is unknown, raise this value or set `Include Subfolders` to `true`. Graph API maximum is 999 per page.",
    },
    includeSubfolders: {
      type: "boolean",
      label: "Include Subfolders",
      description: "If `true`, recursively includes all subfolders at every nesting level. Set to `true` when searching for a folder by display name if you don't know whether it is a top-level folder. Default is `false`, which returns only top-level folders. Note: `count` falls back to the number of folders retrieved in this mode.",
      optional: true,
      default: false,
    },
    includeHiddenFolders: {
      type: "boolean",
      label: "Include Hidden Folders",
      description: "If `true`, includes hidden system folders (e.g. `AllItems`, `RecoverableItemsDeletions`, `SearchFolders`, `Clutter`). Set to `true` only when specifically looking for a system or hidden folder. Default is `false`.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    let folders = [];
    let count;

    if (this.includeSubfolders) {
      folders = await this.microsoftOutlook.listAllFolders({
        params: {
          $top: 999,
          includeHiddenFolders: this.includeHiddenFolders,
        },
      });
      if (this.displayName) {
        folders = folders.filter(({ displayName }) => displayName === this.displayName);
      }
      count = folders.length;
      if (folders.length > this.maxResults) {
        folders = folders.slice(0, this.maxResults);
      }
    } else {
      const meta = {};
      const items = this.microsoftOutlook.paginate({
        fn: this.microsoftOutlook.listFolders,
        args: {
          $,
          params: {
            ...(this.displayName && {
              $filter: `displayName eq '${this.displayName.replace(/'/g, "''")}'`,
            }),
            includeHiddenFolders: this.includeHiddenFolders,
            $count: COUNT_QUERY_PARAM,
          },
        },
        max: this.maxResults,
        meta,
      });
      for await (const item of items) {
        folders.push(item);
      }
      count = meta["@odata.count"] ?? folders.length;
    }

    $.export("$summary", `Found ${count} total folder${count !== 1
      ? "s"
      : ""} (returned ${folders.length}).`);
    return {
      count,
      folders,
    };
  },
};
