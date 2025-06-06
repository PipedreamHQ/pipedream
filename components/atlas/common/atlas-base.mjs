import { axios } from "@pipedream/platform";

// Base class for all ATLAS interactions
export class AtlasBase {
  constructor(apiKey, username, password, baseUrl, authUrl) {
    this.apiKey = apiKey;
    this.username = username;
    this.password = password;
    this.baseUrl = baseUrl;
    this.authUrl = authUrl;
    this.authToken = null; // Will store login token if using username/password
  }

  /**
   * Login using username/password to get auth token
   * @returns {Promise<string>} Authentication token
   */
  async login() {
    if (!this.username || !this.password) {
      throw new Error("Username and password are required for login authentication");
    }

    try {
      const response = await axios(this, {
        method: "POST",
        url: `${this.authUrl}/auth/login`,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        data: {
          email: this.username,
          password: this.password,
        },
      });

      // Extract token from response (adjust based on actual API response structure)
      this.authToken = response.data?.token || response.data?.access_token || response.token;
      
      if (!this.authToken) {
        throw new Error("Login successful but no token received in response");
      }

      return this.authToken;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Login failed: Invalid username or password");
      }
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Get authentication headers for API requests
   * @returns {Promise<Object>} Headers object
   */
  async getHeaders() {
    let token;
    let headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    if (this.apiKey) {
      // Use API Key if provided
      token = this.apiKey;
      headers["Authorization"] = `${token}`;
    } else {
      // Use username/password login if no API key
      if (!this.authToken) {
        await this.login();
      }
      token = this.authToken;
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Make authenticated API request
   * @param {Object} options - Request options
   * @param {string} options.url - API endpoint URL
   * @param {string} [options.method=GET] - HTTP method
   * @param {Object} [options.data] - Request body data
   * @param {Object} [options.params] - Query parameters
   * @param {Object} [options.headers] - Additional headers
   * @returns {Promise} API response
   */
  async makeRequest({ url, method = "GET", data, params, headers = {}, ...opts }) {
    const authHeaders = await this.getHeaders();
    
    const config = {
      method,
      url: url.startsWith("http") ? url : `${this.baseUrl}${url}`,
      headers: {
        ...authHeaders,
        ...headers,
      },
      data,
      params,
      ...opts,
    };

    console.log('confgig', config);

    try {
      return await axios(this, config);
    } catch (error) {
      // If we get 401 and using login auth, try to re-login once
      if (error.response?.status === 401 && !this.apiKey && this.authToken) {
        console.log("Token expired, attempting re-login...");
        this.authToken = null;
        const authHeaders = await this.getHeaders();
        
        const retryConfig = {
          ...config,
          headers: {
            ...authHeaders,
            ...headers,
          },
        };
        
        return await axios(this, retryConfig);
      }
      
      throw error;
    }
  }

  /**
   * Get all job listings from ATLAS
   * @param {Object} params - Query parameters
   * @returns {Promise} Job listings response
   */
  async getJobs(params = {}) {
    return this.makeRequest({
      url: "/v3/jobs",
      params,
    });
  }

  /**
   * Get job details by ID
   * @param {string|number} jobId - Job ID
   * @returns {Promise} Job details response
   */
  async getJob(jobId) {
    return this.makeRequest({
      url: `/v3/jobs/${jobId}`,
    });
  }

  /**
   * Get all candidates from ATLAS
   * @param {Object} params - Query parameters
   * @returns {Promise} Candidates response
   */
  async getCandidates(params = {}) {
    return this.makeRequest({
      url: "/v3/candidates",
      params,
    });
  }

  /**
   * Get candidate details by ID
   * @param {string|number} candidateId - Candidate ID
   * @returns {Promise} Candidate details response
   */
  async getCandidate(candidateId) {
    return this.makeRequest({
      url: `/v3/candidates/${candidateId}`,
    });
  }

  /**
   * Get reports from ATLAS
   * @param {Object} params - Query parameters
   * @returns {Promise} Reports response
   */
  async getReports(params = {}) {
    return this.makeRequest({
      url: "/v3/reports",
      params,
    });
  }

  /**
   * Test API connection
   * @returns {Promise} Connection test response
   */
  async testConnection() {
    return this.makeRequest({
      url: "/v3/jobs",
      params: { limit: 1 },
    });
  }

  /**
   * Handle pagination for large datasets
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @param {number} maxPages - Maximum pages to fetch
   * @returns {Promise<Array>} All results from paginated requests
   */
  async getAllPaginated(endpoint, params = {}, maxPages = 10) {
    const allResults = [];
    let currentPage = 0;
    let hasMore = true;

    while (hasMore && currentPage < maxPages) {
      const response = await this.makeRequest({
        url: endpoint,
        params: {
          ...params,
          offset: currentPage * (params.limit || 100),
          limit: params.limit || 100,
        },
      });

      const results = response.data || response;
      allResults.push(...results);

      // Check if there are more results
      hasMore = results.length === (params.limit || 100);
      currentPage++;
    }

    return allResults;
  }
}

// Helper function to create ATLAS instance
export function createAtlasClient(apiKey, username, password, baseUrl, authUrl) {
  return new AtlasBase(apiKey, username, password, baseUrl, authUrl);
}

// Mixin for Pipedream components
export const atlasMixin = {
  methods: {
    /**
     * Create ATLAS client instance
     * @returns {AtlasBase} ATLAS client
     */
    createAtlasClient() {
      return new AtlasBase(this.apiKey, this.username, this.password, this.baseUrl, this.authUrl);
    },

    /**
     * Validate authentication configuration
     * @throws {Error} If neither API key nor username/password provided
     */
    validateAuth() {
      if (!this.apiKey && (!this.username || !this.password)) {
        throw new Error(
          "Authentication required: Please provide either an API Key OR both Username and Password"
        );
      }
    },

    /**
     * Handle API errors consistently
     * @param {Error} error - The error object
     * @param {string} operation - Description of the operation that failed
     */
    handleAtlasError(error, operation = "API request") {
      console.error(`ATLAS ${operation} failed:`, error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || error.message;
        
        switch (status) {
          case 401:
            throw new Error(`Authentication failed: Please check your credentials. ${message}`);
          case 403:
            throw new Error(`Access forbidden: Insufficient permissions for this operation. ${message}`);
          case 404:
            throw new Error(`Resource not found: ${message}`);
          case 429:
            throw new Error(`Rate limit exceeded: Please wait before making more requests. ${message}`);
          case 500:
            throw new Error(`ATLAS server error: ${message}`);
          default:
            throw new Error(`${operation} failed (${status}): ${message}`);
        }
      }
      
      throw new Error(`${operation} failed: ${error.message}`);
    },

    /**
     * Validate and format API parameters
     * @param {Object} params - Parameters to validate
     * @returns {Object} Cleaned parameters
     */
    cleanParams(params) {
      const cleaned = {};
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          cleaned[key] = value;
        }
      });
      
      return cleaned;
    },
  },
};