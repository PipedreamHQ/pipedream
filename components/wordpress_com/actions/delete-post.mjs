import wordpress from "../wordpress_com.app.mjs";

export default {

  key: "worpress_com-delete-post",
  name: "Delete Post",
  description: "Delete post",
  version: "0.0.1",
  type: "action",
  props: {
    wordpress,
    site: {
      type: "string",
      description: "Enter a site ID or domain (e.g. testsit38.wordpress.com).",
    },
    postId: {
      type: "integer",
      label: "Post ID",
      description: "The ID of the post you want to delete.",
    },
  },
 
  async run({ $ }) {

    const warnings = [];

    const {
      site,
      wordpress,
      postId
    } =  this;


    warnings.push(...wordpress.checkDomainOrId(site)); 
    
    let response;

    try {
      response = await wordpress.deleteWordpressPost({$, site, postId});
    } catch (error) {
      wordpress.onAxiosCatch("Could not delete post", error, warnings); 
    };
    
    $.export("$summary", `Post ID = ${response?.ID} successfully deleted.` + "\n- "  + warnings.join("\n- "));
  },
};

 

