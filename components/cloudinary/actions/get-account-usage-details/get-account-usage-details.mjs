// legacy_hash_id: a_WYiEjB
import { v2 } from "cloudinary";

export default {
  key: "cloudinary-get-account-usage-details",
  name: "Get Account Usage Details",
  description: "Enables you to get a report on the status of your Cloudinary account usage details, including storage, credits, bandwidth, requests, number of resources, and add-on usage.",
  version: "0.1.1",
  type: "action",
  props: {
    cloudinary: {
      type: "app",
      app: "cloudinary",
    },
    date: {
      type: "string",
      description: "The date for the usage report. Must be within the last 3 months and given in the format: `dd-mm-yyyy`. Default: the current date",
      optional: true,
    },
  },
  async run() {
  //See the API docs: https://cloudinary.com/documentation/image_upload_api_reference#upload_method

    //Imports and sets up the Cloudinary SDK
    const cloudinary = v2;
    cloudinary.config({
      cloud_name: this.cloudinary.$auth.cloud_name,
      api_key: this.cloudinary.$auth.api_key,
      api_secret: this.cloudinary.$auth.api_secret,
    });

    //A simple callback to throw an error or return the result
    var getusageResponse;
    const callback = function(error, result) {
      if (error) {
        throw error;
      }
      getusageResponse = result;
    };

    //Sends the request against Cloudinary to get the authenticated account usage details.
    await cloudinary.api.usage({
      date: this.date,
    }, callback);
    return getusageResponse;
  },
};
