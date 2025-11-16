import { axios } from "@pipedream/platform";

export default {
  key: "hootsuite-list-social-profiles",
  name: "List Social Profiles",
  description: "Retrieves a list of social profiles for the authenticated Hootsuite account. [See the documentation](https://apidocs.hootsuite.com/docs/api/index.html#operation/getSocialProfiles)",
  version: "0.0.1",
  type: "action",
  props: {
    hootsuite: {
      type: "app",
      app: "hootsuite",
    },
  },

  /**
   * Retrieves all social profiles for the authenticated Hootsuite account
   * @param {object} params - The parameters object
   * @param {object} params.props - The action props containing the hootsuite app
   * @returns {Promise<Array>} An array of social profile objects from Hootsuite
   */
  async run({ props }) {
    const token = props.hootsuite.$auth.oauth_access_token;
    const url = "https://api.hootsuite.com/v1/socialProfiles";
    try {
      const response = await axios(this, {
        url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data; 
    } catch (error) {
      console.error("API call to Hootsuite failed:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.errors?.[0]?.message || error.message || "Unknown error";
      throw new Error(`Failed to retrieve social profiles. Error: ${errorMessage}`);
    }
  },
};