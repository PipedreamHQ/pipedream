import wordpress from "../wordpress_com.app.mjs";

export default {
  key: "worpress_com-create-post",
  name: "Create New Post",
  description: "Retrieves the authenticated user's account information.",
  version: "0.0.1",
  type: "action",
  props: {
    wordpress,
    site: {
      type: "string",
      label: "Site ID or domain",
      description: "Enter a site ID or domain (e.g. testsit38.wordpress.com). Do not include 'https://' or 'www'."
    },
    title: {
      type: "string",
      label: "Post Title",
      description: "The title of the post.",
    },
    content: {
      type: "string",
      label: "Post Content",
      description: "The content of the post (HTML or text).",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the post.",
      options: [
        "publish",
        "draft",
        "private",
        "pending",
      ],
      default: "draft",
    },
    type: {
      type: "string",
      label: "Post Type",
      description: "The type of the post (post or page). For attachments, use the 'Upload Media' action.",
      options: [
        { label: "Post", value: "post" },
        { label: "Page", value: "page" },
      ],
      default: "post",
    }
  },
 
  async run({ $ }) {

    const warnings = [];

    const {
      site,
      wordpress,
      ...fields
    } =  this;

    warnings.push(...wordpress.checkDomainOrId(site)); // TEST

    let response;

      try {
        response = await wordpress.createWordpressPost({ //TEST
          
          $,
          site,
          data : {
            ...fields
          }
        });

      } catch (error) {
        wordpress.onAxiosCatch("Could not create post", error, warnings); 
      };
      
      $.export("$summary", `Post successfully created. ID = ${response?.ID}` + "\n- "  + warnings.join("\n- "));
  },
   
};

