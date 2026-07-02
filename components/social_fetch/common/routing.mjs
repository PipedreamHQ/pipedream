import {
  HANDLE_PLATFORMS,
  URL_PROFILE_PLATFORMS,
} from "./constants.mjs";

/**
 * @param {Record<string, string | undefined>} query
 * @param {string | undefined} cursor
 */
export function withCursor(query, cursor) {
  const trimmed = cursor?.trim();
  if (trimmed) {
    query.cursor = trimmed;
  }
}

/**
 * @param {string} platform
 * @param {{ handle?: string; profileUrl?: string }} input
 * @returns {{ path: string; params?: Record<string, string> }}
 */
export function resolveGetProfileRoute(platform, input) {
  const handle = input.handle?.trim();
  const profileUrl = input.profileUrl?.trim();

  switch (platform) {
  case "tiktok":
    if (!handle) throw new Error("Handle is required for this platform.");
    return {
      path: `/v1/tiktok/profiles/${encodeURIComponent(handle)}`,
    };
  case "instagram":
    if (!handle) throw new Error("Handle is required for this platform.");
    return {
      path: `/v1/instagram/profiles/${encodeURIComponent(handle)}`,
    };
  case "twitter":
    if (!handle) throw new Error("Handle is required for this platform.");
    return {
      path: `/v1/twitter/profiles/${encodeURIComponent(handle)}`,
    };
  case "threads":
    if (!handle) throw new Error("Handle is required for this platform.");
    return {
      path: `/v1/threads/profiles/${encodeURIComponent(handle)}`,
    };
  case "facebook":
    if (!profileUrl) {
      throw new Error("Profile URL is required for this platform.");
    }
    return {
      path: "/v1/facebook/profiles",
      params: {
        url: profileUrl,
      },
    };
  case "linkedin":
    if (!profileUrl) {
      throw new Error("Profile URL is required for this platform.");
    }
    return {
      path: "/v1/linkedin/profiles",
      params: {
        url: profileUrl,
      },
    };
  default:
    throw new Error(`Unsupported platform: ${platform}`);
  }
}

const POST_PATH_BY_PLATFORM = {
  tiktok: "/v1/tiktok/videos",
  instagram: "/v1/instagram/posts",
  twitter: "/v1/twitter/tweets",
  threads: "/v1/threads/posts",
  facebook: "/v1/facebook/posts",
  youtube: "/v1/youtube/videos",
  linkedin: "/v1/linkedin/posts",
};

/**
 * @param {string} platform
 * @param {{ postUrl?: string }} input
 */
export function resolveGetPostRoute(platform, input) {
  const postUrl = input.postUrl?.trim();
  if (!postUrl) {
    throw new Error("Post URL is required.");
  }

  const path = POST_PATH_BY_PLATFORM[platform];
  if (!path) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  return {
    path,
    params: {
      url: postUrl,
    },
  };
}

/**
 * @param {string} platform
 * @param {string} contentType
 * @param {{ handle?: string; profileUrl?: string; cursor?: string }} input
 */
export function resolveListProfilePostsRoute(platform, contentType, input) {
  const handle = input.handle?.trim();
  const profileUrl = input.profileUrl?.trim();

  /** @type {{ path: string; params?: Record<string, string> }} */
  let route;

  if (platform === "tiktok") {
    if (contentType !== "videos") {
      throw new Error("TikTok only supports content type Videos.");
    }
    if (!handle) throw new Error("Handle is required for this platform.");
    route = {
      path: `/v1/tiktok/profiles/${encodeURIComponent(handle)}/videos`,
    };
  } else if (platform === "instagram") {
    if (!handle) throw new Error("Handle is required for this platform.");
    if (contentType === "posts") {
      route = {
        path: `/v1/instagram/profiles/${encodeURIComponent(handle)}/posts`,
      };
    } else if (contentType === "reels") {
      route = {
        path: `/v1/instagram/profiles/${encodeURIComponent(handle)}/reels`,
      };
    } else {
      throw new Error("Instagram supports content types Posts or Reels.");
    }
  } else if (platform === "threads") {
    if (contentType !== "posts") {
      throw new Error("Threads only supports content type Posts.");
    }
    if (!handle) throw new Error("Handle is required for this platform.");
    route = {
      path: `/v1/threads/profiles/${encodeURIComponent(handle)}/posts`,
    };
  } else if (platform === "twitter") {
    if (contentType !== "tweets") {
      throw new Error("Twitter / X only supports content type Tweets.");
    }
    if (!handle) throw new Error("Handle is required for this platform.");
    route = {
      path: `/v1/twitter/profiles/${encodeURIComponent(handle)}/tweets`,
    };
  } else if (platform === "facebook") {
    if (contentType !== "posts") {
      throw new Error("Facebook only supports content type Posts.");
    }
    if (!profileUrl) {
      throw new Error("Profile URL is required for this platform.");
    }
    route = {
      path: "/v1/facebook/profiles/posts",
      params: {
        url: profileUrl,
      },
    };
  } else {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  const params = route.params ?? {};
  withCursor(params, input.cursor);
  if (Object.keys(params).length > 0) {
    route.params = params;
  }

  return route;
}

const TRANSCRIPT_PATH_BY_PLATFORM = {
  tiktok: "/v1/tiktok/videos/transcript",
  instagram: "/v1/instagram/posts/transcript",
  facebook: "/v1/facebook/posts/transcript",
  youtube: "/v1/youtube/videos/transcript",
};

/**
 * @param {string} platform
 * @param {{ mediaUrl?: string }} input
 */
export function resolveGetTranscriptRoute(platform, input) {
  const mediaUrl = input.mediaUrl?.trim();
  if (!mediaUrl) {
    throw new Error("Media URL is required.");
  }

  const path = TRANSCRIPT_PATH_BY_PLATFORM[platform];
  if (!path) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  return {
    path,
    params: {
      url: mediaUrl,
    },
  };
}

/**
 * @param {string} platform
 * @param {{ handle?: string; profileUrl?: string }} input
 */
export function profileLabel(platform, input) {
  if (URL_PROFILE_PLATFORMS.includes(platform)) {
    return input.profileUrl?.trim() || platform;
  }
  if (HANDLE_PLATFORMS.includes(platform)) {
    return input.handle?.trim() || platform;
  }
  return platform;
}
