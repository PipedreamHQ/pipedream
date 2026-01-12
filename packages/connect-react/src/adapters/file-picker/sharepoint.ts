import type { FileItem, FilePickerAdapter, FilePickerLevel, FilePickerContext } from "./types";

const GRAPH_BASE_URL = "https://graph.microsoft.com/v1.0";

interface SharePointSite {
  id: string;
  displayName: string;
  webUrl: string;
}

interface SharePointDrive {
  id: string;
  name: string;
  driveType: string;
}

interface SharePointDriveItem {
  id: string;
  name: string;
  folder?: { childCount: number };
  file?: { mimeType: string };
  size?: number;
  lastModifiedDateTime?: string;
  parentReference?: {
    driveId: string;
    id: string;
    path: string;
  };
}

interface GraphResponse<T> {
  value: T[];
  "@odata.nextLink"?: string;
}

function mapSiteToFileItem(site: SharePointSite): FileItem {
  return {
    id: site.id,
    name: site.displayName,
    type: "site",
    canNavigateInto: true,
    _raw: site,
  };
}

function mapDriveToFileItem(drive: SharePointDrive): FileItem {
  return {
    id: drive.id,
    name: drive.name,
    type: "drive",
    canNavigateInto: true,
    _raw: drive,
  };
}

function mapDriveItemToFileItem(item: SharePointDriveItem): FileItem {
  const isFolder = !!item.folder;
  return {
    id: item.id,
    name: item.name,
    type: isFolder ? "folder" : "file",
    mimeType: item.file?.mimeType,
    size: item.size,
    modifiedAt: item.lastModifiedDateTime,
    canNavigateInto: isFolder,
    _raw: item,
  };
}

function extractNextPageToken(nextLink?: string): string | undefined {
  if (!nextLink) return undefined;
  // The nextLink is a full URL, we store it as the token
  return nextLink;
}

export const sharepointAdapter: FilePickerAdapter = {
  app: "sharepoint",

  async getRootItems(
    ctx: FilePickerContext,
    pageToken?: string
  ): Promise<FilePickerLevel> {
    // If we have a page token, use it directly
    if (pageToken) {
      const response = (await ctx.proxyRequest({
        url: pageToken,
        method: "GET",
      })) as GraphResponse<SharePointSite>;

      return {
        items: response.value.map(mapSiteToFileItem),
        nextPageToken: extractNextPageToken(response["@odata.nextLink"]),
      };
    }

    // Get SharePoint sites the user has access to
    const items: FileItem[] = [];
    const seenSiteIds = new Set<string>();

    // Helper to add sites without duplicates
    const addSites = (sites: SharePointSite[]) => {
      for (const site of sites) {
        if (site.id && !seenSiteIds.has(site.id)) {
          seenSiteIds.add(site.id);
          items.push(mapSiteToFileItem(site));
        }
      }
    };

    // Fetch sites from multiple sources in parallel for speed
    const fetchPromises: Promise<void>[] = [];

    // 1. Try search endpoint - most common method
    fetchPromises.push(
      ctx.proxyRequest({
        url: `${GRAPH_BASE_URL}/sites?search=*`,
        method: "GET",
      }).then((response) => {
        const sitesResponse = response as GraphResponse<SharePointSite>;
        if (sitesResponse.value?.length > 0) {
          addSites(sitesResponse.value);
        }
      }).catch(() => {})
    );

    // 2. Get sites from user's Groups (Team sites are connected to M365 Groups)
    fetchPromises.push(
      ctx.proxyRequest({
        url: `${GRAPH_BASE_URL}/me/memberOf/microsoft.graph.group?$select=id,displayName`,
        method: "GET",
      }).then(async (response) => {
        const groupsResponse = response as GraphResponse<{ id: string; displayName: string }>;
        if (groupsResponse.value?.length > 0) {
          // For each group, try to get its associated site
          const sitePromises = groupsResponse.value.map(async (group) => {
            try {
              const siteResponse = await ctx.proxyRequest({
                url: `${GRAPH_BASE_URL}/groups/${group.id}/sites/root`,
                method: "GET",
              }) as SharePointSite;
              if (siteResponse?.id) {
                return siteResponse;
              }
            } catch {
              // Group might not have a site
            }
            return null;
          });
          const sites = (await Promise.all(sitePromises)).filter((s): s is SharePointSite => s !== null);
          addSites(sites);
        }
      }).catch(() => {})
    );

    // Wait for all fetches to complete
    await Promise.all(fetchPromises);

    // 3. If still nothing, try root site
    if (items.length === 0) {
      try {
        const rootSite = (await ctx.proxyRequest({
          url: `${GRAPH_BASE_URL}/sites/root`,
          method: "GET",
        })) as SharePointSite;

        if (rootSite?.id) {
          addSites([rootSite]);
        }
      } catch {
        // Silently ignore
      }
    }

    // 4. If still nothing, try user's OneDrive as last resort
    if (items.length === 0) {
      try {
        const driveResponse = await ctx.proxyRequest({
          url: `${GRAPH_BASE_URL}/me/drive`,
          method: "GET",
        }) as { id: string; name: string; driveType: string };

        items.push({
          id: driveResponse.id,
          name: driveResponse.name || "My OneDrive",
          type: "drive",
          canNavigateInto: true,
          _raw: driveResponse,
        });
      } catch {
        // Silently ignore
      }
    }

    return { items };
  },

  async getChildren(
    ctx: FilePickerContext,
    item: FileItem,
    pageToken?: string
  ): Promise<FilePickerLevel> {
    let url: string;

    if (pageToken) {
      url = pageToken;
    } else if (item.type === "site") {
      // List drives for this site
      url = `${GRAPH_BASE_URL}/sites/${item.id}/drives`;
    } else if (item.type === "drive") {
      // List root items in this drive
      url = `${GRAPH_BASE_URL}/drives/${item.id}/root/children`;
    } else if (item.type === "folder") {
      // List items in this folder
      const raw = item._raw as SharePointDriveItem;
      const driveId = raw.parentReference?.driveId;
      if (!driveId) {
        throw new Error("Cannot navigate into folder: missing drive ID");
      }
      url = `${GRAPH_BASE_URL}/drives/${driveId}/items/${item.id}/children`;
    } else {
      // Files cannot be navigated into
      return { items: [] };
    }

    const response = await ctx.proxyRequest({
      url,
      method: "GET",
    });

    // Map response based on what we're listing
    if (item.type === "site" && !pageToken) {
      const driveResponse = response as GraphResponse<SharePointDrive>;
      return {
        items: driveResponse.value.map(mapDriveToFileItem),
        nextPageToken: extractNextPageToken(driveResponse["@odata.nextLink"]),
      };
    }

    // For drives and folders, we're listing drive items
    const itemResponse = response as GraphResponse<SharePointDriveItem>;
    return {
      items: itemResponse.value.map(mapDriveItemToFileItem),
      nextPageToken: extractNextPageToken(itemResponse["@odata.nextLink"]),
    };
  },

  async search(
    ctx: FilePickerContext,
    query: string,
    context?: FileItem
  ): Promise<FilePickerLevel> {
    // Search requires a site context
    if (!context || context.type !== "site") {
      // If no site context, search is not available
      return { items: [] };
    }

    const url = `${GRAPH_BASE_URL}/sites/${context.id}/drive/root/search(q='${encodeURIComponent(query)}')`;

    const response = (await ctx.proxyRequest({
      url,
      method: "GET",
    })) as GraphResponse<SharePointDriveItem>;

    return {
      items: response.value.map(mapDriveItemToFileItem),
      nextPageToken: extractNextPageToken(response["@odata.nextLink"]),
    };
  },
};
