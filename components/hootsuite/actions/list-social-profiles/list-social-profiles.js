import { axios } from "@pipedream/platform";

export default {
  props: {
    hootsuite: {
      type: "app",
      app: "hootsuite",
    },
  },

  async run({ props }) {
    const token = props.hootsuite.$auth.oauth_access_token;
    const url = "https://api.hootsuite.com/v1/socialProfiles";
    try {
      const response = await axios(this, {
        method: "GET",
        url: url,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      return response.data.data; 
    } catch (error) {
      console.error("API call to Hootsuite failed:", error.response.data);
      throw new Error(`Failed to retrieve social profiles. Error: ${error.response.data.errors[0].message}`);
    }
  },
};