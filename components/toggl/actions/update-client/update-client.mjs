import toggl from "../../toggl.app.mjs";

export default {
    name: "Update new client",
    version: "0.0.1",
    description: "Upate a Client [See docs here.](https://developers.track.toggl.com/docs/api/clients/index.html#put-change-client)",
    type: "action",
    key: "toggle-update-client",
    props: {
        toggl,
        name: {
            type: "string",
            label: "Name",
        },
        workspace_id: {
            type: "integer",
            label: "Workspace ID",
        },
        client_id: {
            type: "integer",
            label: "Client ID",
        },
    },
    async run({ $ }) {
        const response = await this.toggl.updateClient({
            name: this.name,
            workspace_id: this.workspace_id,
            client_id: this.client_id
        })

        response && $.export("$summary", "Successfully updated client info.");
    }
}