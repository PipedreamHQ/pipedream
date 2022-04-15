// legacy_hash_id: a_zNiwKE
import { axios } from "@pipedream/platform";

export default {
  key: "asana-create-project",
  name: "Create Project",
  description: "Create a project",
  version: "0.8.1",
  type: "action",
  props: {
    asana: {
      type: "app",
      app: "asana",
    },
    name: {
      type: "string",
    },
    notes: {
      type: "string",
    },
    workspace: {
      type: "string",
    },
    team: {
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    let dataPayload = new Object();
    if (this.team) {
      dataPayload =  {
        name: this.name,
        notes: this.notes,
        workspace: this.workspace,
        team: this.team,
      };
    } else {
      dataPayload =  {
        name: this.name,
        notes: this.notes,
        workspace: this.workspace,
      };
    }

    return await axios($, {
      method: "post",
      url: "https://app.asana.com/api/1.0/projects",
      headers: {
        "Authorization": `Bearer ${this.asana.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      data: {
        data: dataPayload,
      },
    });
  },
};
