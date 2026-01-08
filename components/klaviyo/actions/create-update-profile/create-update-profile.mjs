import { parseObject } from "../../common/utils.mjs";
import klaviyo from "../../klaviyo.app.mjs";

export default {
  key: "klaviyo-create-update-profile",
  name: "Create Or Update Profile",
  description: "Create or update a profile's custom properties. [See the documentation](https://developers.klaviyo.com/en/reference/create_or_update_profile)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    klaviyo,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "warning",
      content: "At least one identifier (**Email**, **Phone Number**, or **External ID**) must be provided",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the profile",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the profile (E.164 format, e.g., `+12345678901`)",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "A unique identifier from an external system",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the profile",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the profile",
      optional: true,
    },
    organization: {
      type: "string",
      label: "Organization",
      description: "The organization of the profile",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the profile",
      optional: true,
    },
    image: {
      type: "string",
      label: "Image URL",
      description: "URL of the profile's image",
      optional: true,
    },
    location: {
      type: "object",
      label: "Location",
      description: `Location information as a JSON object with properties like \`address1\`, \`address2\`, \`city\`, \`country\`, \`region\`, \`zip\`, \`timezone\`, \`latitude\`, \`longitude\`

**Example:**
\`\`\`json
{
  "address1": "123 Main St",
  "address2": "Apt 4B",
  "city": "New York",
  "country": "USA",
  "region": "NY",
}
\`\`\``,
      optional: true,
    },
    properties: {
      type: "object",
      label: "Custom Properties",
      description: "Custom properties as a JSON object with key-value pairs",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      klaviyo,
      email,
      phoneNumber,
      externalId,
      firstName,
      lastName,
      organization,
      title,
      image,
      location,
      properties,
    } = this;

    if (!email && !phoneNumber && !externalId) {
      throw new Error("At least one identifier (email, phone number, or external ID) must be provided");
    }

    const attributes = {};

    if (email) {
      attributes.email = email;
    }

    if (phoneNumber) {
      attributes.phoneNumber = phoneNumber;
    }

    if (externalId) {
      attributes.externalId = externalId;
    }

    if (firstName) {
      attributes.firstName = firstName;
    }

    if (lastName) {
      attributes.lastName = lastName;
    }

    if (organization) {
      attributes.organization = organization;
    }

    if (title) {
      attributes.title = title;
    }

    if (image) {
      attributes.image = image;
    }

    if (location) {
      attributes.location = parseObject(location);
    }

    if (properties) {
      attributes.properties = parseObject(properties);
    }

    const data = {
      type: "profile",
      attributes,
    };

    try {
      const { response } = await klaviyo.createOrUpdateProfile({
        data,
      });

      $.export("$summary", "Successfully updated profile properties");
      return response.data.data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },
};
