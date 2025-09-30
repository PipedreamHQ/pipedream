import app from "../../orbit.app.mjs";

export default {
  name: "Create Member",
  description: "Create a new member. [See the docs here](https://api.orbit.love/reference/post_workspace-slug-members)",
  key: "orbit-create-member",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    workspaceSlug: {
      propDefinition: [
        app,
        "workspaceSlug",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the member.",
    },
    bio: {
      type: "string",
      label: "Bio",
      description: "A short bio for the member.",
      optional: true,
    },
    birthday: {
      type: "string",
      label: "Birthday",
      description: "The birthday of the member.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company of the member.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "A title for the member.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location of the member.",
      optional: true,
    },
    pronouns: {
      type: "string",
      label: "Pronouns",
      description: "The pronouns of the member.",
      optional: true,
    },
    shippingAddress: {
      type: "string",
      label: "Shipping Address",
      description: "The shipping address of the member.",
      optional: true,
    },
    slug: {
      type: "string",
      label: "Slug",
      description: "A unique identifier for the member.",
      optional: true,
    },
    tagsToAdd: {
      type: "string[]",
      label: "Tags to Add",
      description: "An array of tag names to add to the member.",
      optional: true,
    },
    tshirt: {
      type: "string",
      label: "T-Shirt",
      description: "The t-shirt size of the member.",
      optional: true,
    },
    teammate: {
      type: "boolean",
      label: "Teammate",
      description: "Whether the member is a teammate.",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "A URL for the member.",
      optional: true,
    },
    github: {
      type: "string",
      label: "GitHub",
      description: "The GitHub username of the member.",
      optional: true,
    },
    twitter: {
      type: "string",
      label: "Twitter",
      description: "The Twitter username of the member.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the member.",
      optional: true,
    },
    linkedin: {
      type: "string",
      label: "LinkedIn",
      description: "The LinkedIn username of the member.",
      optional: true,
    },
    devto: {
      type: "string",
      label: "Devto",
      description: "The member's DEV username.",
      optional: true,
    },
  },
  async run({ $ }) {
    const member = {
      name: this.name,
      bio: this.bio,
      birthday: this.birthday,
      company: this.company,
      title: this.title,
      location: this.location,
      pronouns: this.pronouns,
      shipping_address: this.shippingAddress,
      slug: this.slug,
      tags: this.tagsToAdd,
      tshirt: this.tshirt,
      teammate: this.teammate,
      url: this.url,
      github: this.github,
      twitter: this.twitter,
      email: this.email,
      linkedin: this.linkedin,
      devto: this.devto,
    };
    const res = await this.app.createMember(
      this.workspaceSlug,
      member,
    );
    $.export("$summary", `Member successfully created with id "${res.data.id}"`);
    return res;
  },
};
