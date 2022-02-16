// legacy_hash_id: a_Vpi75e
import axios from "axios";
import { axios as pipedreamAxios } from "@pipedream/platform";

export default {
  key: "smugmug-create-album",
  name: "Create Smugmug Album",
  description: "This action creates an album in a folder. Specify the folder and the JSON document (as a Javascript object) in parameters. A minimal object might look like {\n  UrlName: \"weddings-smith-2020-06-02\",\n  Name: \"Mr & Mrs Smith's June Wedding\",\n  Privacy: 2, \n  SecurityType: 1\n}\nMore fields documented at https://api.smugmug.com/api/v2/folder",
  version: "1.0.1",
  type: "action",
  props: {
    smugmug: {
      type: "app",
      app: "smugmug",
    },
    folder: {
      type: "string",
    },
    data: {
      type: "string",
    },
  },
  async run({ $ }) {
    const token = {
      key: this.smugmug.$auth.oauth_access_token,
      secret: this.smugmug.$auth.oauth_refresh_token,
    };

    const config = {
      url: `https://api.smugmug.com/api/v2/folder/user/${this.smugmug.$auth.oauth_uid}/${this.folder}!albums`,
      method: "POST",
    };

    const payload = {
      requestData: config,
      token,
    };

    config.headers = {
      "Authorization": (await axios.post(this.smugmug.$auth.oauth_signer_uri, payload)).data,
      "Accept": "application/json",
    };

    config.data = this.data;

    return pipedreamAxios( $, config );
  },
};
