import hootsuite from "../../hootsuite.app.mjs";

export default {
  key: "hootsuite-list-social-profiles",
  name: "List Social Profiles",
  description: "Retrieves a list of social profiles for the authenticated Hootsuite account. [See the documentation](https://apidocs.hootsuite.com/docs/api/index.html#operation/getSocialProfiles)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hootsuite,
  },
  /**
   * Retrieves all social profiles for the authenticated Hootsuite account
   * @param {object} params - The parameters object
   * @param {object} params.props - The action props containing the hootsuite app
   * @returns {Promise<Array>} An array of social profile objects from Hootsuite
   */
  async run({ $ }) {
    try {
      const response = await $.apps.hootsuite.listSocialProfiles({
        $,
      });
      $.export("$summary", `Successfully retrieved ${response?.data?.length} social profile${response?.data?.length === 1
        ? ""
        : "s"}`);
      return response;
    } catch (error) {
      console.error("API call to Hootsuite failed:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.errors?.[0]?.message || error.message || "Unknown error";
      throw new Error(`Failed to retrieve social profiles. Error: ${errorMessage}`);
    }
  },
};
