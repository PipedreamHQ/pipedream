import linkedin from "../../linkedin.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "linkedin-get-profile-picture-fields",
  name: "Get Profile Picture Fields",
  description: "Gets the authenticated user's profile picture data including display image and metadata. [See the documentation](https://learn.microsoft.com/en-us/linkedin/shared/references/v2/profile/profile-picture)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    linkedin,
    includeOriginalImage: {
      type: "boolean",
      label: "Include Original Image",
      description: "Whether to include the original image data in the response (requires special permissions)",
      optional: true,
      default: false,
    },
  },
  methods: {
    getProfilePictureFields(args) {
      return this.linkedin._makeRequest({
        url: `${constants.BASE_URL}v2/me`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    let projection = "id,profilePicture(displayImage~digitalmediaAsset:playableStreams";

    if (this.includeOriginalImage) {
      projection += ",originalImage~digitalmediaAsset:playableStreams";
    }

    projection += ")";

    const response = await this.getProfilePictureFields({
      $,
      params: {
        projection: `(${projection})`,
      },
    });

    if (response.profilePicture) {
      $.export("$summary", "Successfully retrieved profile picture fields");
    } else {
      $.export("$summary", "Profile retrieved, but no profile picture found for this account");
    }

    return response;
  },
};
