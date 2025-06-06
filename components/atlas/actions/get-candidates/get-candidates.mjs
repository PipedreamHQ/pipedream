import { atlasProps, candidateProps } from "../../common/atlas-props.mjs";
import { atlasMixin } from "../../common/atlas-base.mjs";

export default {
  key: "atlas-get-candidates",
  name: "Get All Candidates",
  description: "Retrieve all candidates from ATLAS",
  version: "0.0.1",
  type: "action",
  props: {
    ...atlasProps,
    ...candidateProps,
  },
  ...atlasMixin,
  async run({ $ }) {
    try {
      // Validate authentication configuration
      this.validateAuth();

      const atlas = this.createAtlasClient();

      const params = this.cleanParams({
        limit: this.limit,
        stage: this.stage,
      });

      const response = await atlas.getCandidates(params);
      
      const candidates = response.data || response;
      const candidateCount = Array.isArray(candidates) ? candidates.length : 0;
      
      const authMethod = this.apiKey ? "API Key" : "Username/Password";
      $.export("$summary", `Successfully retrieved ${candidateCount} candidate(s) using ${authMethod}`);
      
      return {
        success: true,
        count: candidateCount,
        candidates: candidates,
        params: params,
        authMethod: authMethod,
      };
      
    } catch (error) {
      this.handleAtlasError(error, "Get candidates");
    }
  },
};