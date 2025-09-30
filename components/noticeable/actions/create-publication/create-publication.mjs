import app from "../../noticeable.app.mjs";

export default {
  type: "action",
  key: "noticeable-create-publication",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Publication",
  description: "Creates a publication, [See the docs](https://graphdoc.noticeable.io/publication.doc.html)",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    authorFullname: {
      type: "string",
      label: "Author Fullname",
      description: "The full name of the author.",
    },
    authorEmail: {
      type: "string",
      label: "Author Email",
      description: "The email address of the author.",
      optional: true,
    },
    postContent: {
      type: "string",
      label: "Post Content",
      description: "The publication content. Supports markdown, max 1500 characters.",
    },
    excerpt: {
      type: "string",
      label: "Excerpt",
      description: "A short extract of the publication content. Max 240 characters.",
      optional: true,
    },
    image: {
      type: "string",
      label: "Featured Image",
      description: "The URL of an image that represents the contents, mood, or theme of the publication, if any",
      optional: true,
    },
    labels: {
      type: "string",
      label: "Labels",
      description: "Publication labels. Must be a Label object array string, e.g. `[{name: \"New Feature\", slug: \"new-feature\", backgroundColor: \"#cccccc\", textColor: \"#111111\"}]`",
    },
    publishedAt: {
      type: "string",
      label: "Published At",
      description: "Identifies the date and time when the object is published. The value can be in the future. Must be in ISO 8601 standard, e.g. `2022-12-23T20:24:46Z`",
    },
    title: {
      type: "string",
      label: "Title",
      description: "A descriptive or general heading of the publication content. Max 80 characters.",
    },
  },
  /* eslint-disable multiline-ternary */
  async run ({ $ }) {
    const resp = await this.app.sendQuery({
      $,
      query: `mutation {
        createPublication(
          input: {
            projectId: "${this.projectId}",
            author: { fullName: "${this.authorFullname}"${this.authorEmail ? ", email: \"" + this.authorEmail + "\"" : ""} },
            content: """${this.postContent}""",
            ${this.excerpt ? "excerpt: \"" + this.excerpt + "\"," : ""}
            ${this.image ? "featuredImage: \"" + this.image + "\"," : ""}
            isDraft: false,
            labels: ${this.labels},
            publishedAt: "${this.publishedAt}",
            title: "${this.title}",
          }
        ) {
            publication {
              id
              permalink
            }
          }
        }`,
    });
    if (resp.errors) {
      console.log(resp);
      throw new Error(resp.errors[0]?.message);
    }
    $.export("$summary", `Publication has been created. ID:${resp?.data?.createPublication?.publication?.id} LINK:${resp?.data?.createPublication?.publication?.permalink}`);
    return resp;
  },
};
