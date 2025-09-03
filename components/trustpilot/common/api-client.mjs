import { axios } from "@pipedream/platform";
import {
  BASE_URL, HTTP_STATUS, RETRY_CONFIG,
} from "./constants.mjs";
import {
  formatQueryParams, sleep,
} from "./utils.mjs";

/**
 * Make an authenticated request to the Trustpilot API
 * @param {object} trustpilotApp - The Trustpilot app instance with auth credentials
 * @param {object} options - Request options
 * @param {string} options.endpoint - API endpoint path
 * @param {string} [options.method="GET"] - HTTP method
 * @param {object} [options.params={}] - Query parameters
 * @param {object} [options.data] - Request body data
 * @param {object} [options.additionalHeaders={}] - Additional headers to include in the request
 * @param {number} [options.timeout=30000] - Request timeout
 * @param {number} [retries=RETRY_CONFIG.MAX_RETRIES] - Number of retries for rate limiting
 * @returns {Promise<object>} API response data
 */
export async function makeRequest(trustpilotApp, {
  endpoint,
  method = "GET",
  params = {},
  data = null,
  timeout = 30000,
  additionalHeaders = {},
  ...args
}, retries = RETRY_CONFIG.MAX_RETRIES) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(trustpilotApp, url),
    ...additionalHeaders,
  };

  const config = {
    method,
    url,
    headers,
    params: formatQueryParams(params),
    timeout,
    ...args,
  };

  if (data) {
    config.data = data;
  }

  try {
    const response = await axios(trustpilotApp, config);
    return response.data || response;
  } catch (error) {
    if (retries > 0 && error.response?.status === HTTP_STATUS.TOO_MANY_REQUESTS) {
      const delay = Math.min(
        RETRY_CONFIG.INITIAL_DELAY * (RETRY_CONFIG.MAX_RETRIES - retries + 1),
        RETRY_CONFIG.MAX_DELAY,
      );
      await sleep(delay);
      return makeRequest(trustpilotApp, {
        endpoint,
        method,
        params,
        data,
        timeout,
        ...args,
      }, retries - 1);
    }
    throw error;
  }
}

/**
 * Determine if a URL requires private authentication
 * @param {string} url - The full URL
 * @returns {boolean} - True if URL requires OAuth token
 */
function isPrivateURL(url) {
  return url.includes("private");
}

/**
 * Get authentication headers for private URLs (OAuth)
 * @param {object} trustpilotApp - The Trustpilot app instance
 * @returns {object} - Headers with OAuth token
 */
function getAuthHeadersForPrivateURL(trustpilotApp) {
  if (!trustpilotApp.$auth?.oauth_access_token) {
    throw new Error("Authentication required: OAuth token is required for private requests");
  }
  return {
    "Authorization": `Bearer ${trustpilotApp.$auth.oauth_access_token}`,
  };
}

/**
 * Get authentication headers for public URLs (API key)
 * @param {object} trustpilotApp - The Trustpilot app instance
 * @returns {object} - Headers with API key
 */
function getAuthHeadersForPublicURL(trustpilotApp) {
  if (!trustpilotApp.$auth?.api_key) {
    throw new Error("Authentication required: API key is required for public requests");
  }
  return {
    "apikey": trustpilotApp.$auth.api_key,
  };
}

/**
 * Get appropriate authentication headers based on URL
 * @param {object} trustpilotApp - The Trustpilot app instance
 * @param {string} url - The full URL
 * @returns {object} - Complete headers for the request
 */
function getAuthHeaders(trustpilotApp, url) {
  const headers = {
    "Content-Type": "application/json",
    "User-Agent": "Pipedream/1.0",
  };

  const isPrivate = isPrivateURL(url);

  if (isPrivate) {
    return {
      ...headers,
      ...getAuthHeadersForPrivateURL(trustpilotApp),
    };
  } else {
    return {
      ...headers,
      ...getAuthHeadersForPublicURL(trustpilotApp),
    };
  }
}
