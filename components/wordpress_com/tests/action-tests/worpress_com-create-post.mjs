/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LOCAL TEST RUNNER – DO NOT DEPLOY
 *
 * This file is used to run and debug a Pipedream action **locally** outside
 * of the Pipedream platform. Safe to delete. It does **not** affect production.
 *
 *  It:
 * - Injects mocked `$` object (logs, summary)
 * - Bypasses OAuth by using hardcoded access token (get-token.mjs)
 * - Validates, builds, and sends the Search Console request
 *
 *   You MUST:
 * - Replace `Authorization` token with a valid one manually
 * - Ensure `siteUrl` is verified in your Search Console
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import mockery$ from "../mockery-dollar.mjs";
import { axios } from "@pipedream/platform";
import {removeCustomPropFields} from "../../common/utils.mjs";
import wpress from "../../wordpress_com.app.mjs";



// TEST (FIX IN PRODUCTION) Remove completely
const mockeryData = {
  site: "testsit38.wordpress.com",
  title : "New Post",
  content : "<div> HELLO WORLD </div>",
  status : "draft",
};


// Define prop metadata separately and spread it into the props object.
// Useful for accessing extended metadata during runtime — available because it stays in closure.

const propsMeta = {
  
    site: {
      type: "string",
      label: "Site ID or domain",
      extendedType : "domainOrId",
      description: "Enter a site ID or domain (e.g. testsit38.wordpress.com). Do not include 'https://' or 'www'."
    },
    title: {
      type: "string",
      label: "Post Title",
      description: "The title of the post.",
      postBody : true,
    },
    content: {
      type: "string",
      label: "Post Content",
      description: "The content of the post (HTML or text).",
      postBody : true,
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
      postBody : true,
    },
};



//TEST (FIX IN PRODUCTION). Replace to export default.
const testAction = {

  ...mockeryData,
  key: "worpress_com-create-post",
  name: "Create New Post",
  description: "Retrieves the authenticated user's account information.",
  version: "0.0.1",
  type: "action",
  props: {
    wpress,
    // Remove custom prop metadata and spread only valid prop fields
    ...removeCustomPropFields(propsMeta),
  },
 
  async run({ $ }) {


   /*Validate props (check if they are of a valid data type). 
    Returns an array with warnings. 
    If there are no warnings, it returns an empty array.*/
    const warnings = wpress.methods.validationLoop(propsMeta, this); // TEST (FIX IN PRODUCTION) replace wpress.methods for this.wpress

    // Returns an object with props that has postBody === true
    const payload = wpress.methods.preparePayload(propsMeta, this); // TEST  (FIX IN PRODUCTION) replace wpress.methods for this.wpress

    let response;
      try {
        response = await axios($, {
        method: "POST",
        url : `https://public-api.wordpress.com/rest/v1.1/sites/${this.site}/posts/new`,
        headers: {
          Authorization: `Bearer v6Dp%5xWzh(rsgW9PR&xY4C#Ibs&Jo3W12nv@6Te3cZOrI5XACdoate$DQ#pIyYP`,
        },
        data : payload,
      });

      $.export("$summary", `Post "${response.title}" created (ID: ${response.ID})`  + "\n- " + warnings.join("\n- "));
      return response;
      } catch (error) {

        const thrower = wpress.methods.checkWhoThrewError(error); //TEST
                                            
        throw new Error(`Failed to fetch data ( ${thrower.whoThrew} error ) : ${error.message}. ` + "\n- " + warnings.join("\n- "));
      
      }
  },
};

 

//TEST (FIX IN PRODUCTION)
// await is just in case if node wants to finish its job before time =)
async function runTest() {
  await testAction.run(mockery$);
}

runTest();


