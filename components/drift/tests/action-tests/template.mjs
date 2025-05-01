
import mockery$ from "../mockery-dollar.mjs";
import wordpress from "../../wordpress_com.app.mjs";



// TEST (FIX IN PRODUCTION) Remove completely
const mockeryData = {
  site: "testsit38.wordpress.com",
  title : "New Post",
  content : "<div> HELLO WORLD </div>",
  status : "publish",
  type: "post", // <-- ADD THIS
};


//TEST (FIX IN PRODUCTION). Replace to export default.
const testAction = {

  mockery: {wordpress, ...mockeryData}, // TEST
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
    } =  this.mockery; // TEST

    warnings.push(...wordpress.methods.checkDomainOrId(site)); // TEST

    let response;

      try {
        response = await wordpress.methods.createWordpressPost({ //TEST
          
          $,
          site,
          data : {
            ...fields
          }
        });

      } catch (error) {
        wordpress.methods.onAxiosCatch("Could not create post", error, warnings); // TEST
      };
      
      $.export("$summary", `Post successfully created. ID = ${response?.ID}` + "\n- "  + warnings.join("\n- "));
  },
   
};

//TEST (FIX IN PRODUCTION)
// await is just in case if node wants to finish its job before time =)
async function runTest() {
  await testAction.run(mockery$);
}

runTest();

