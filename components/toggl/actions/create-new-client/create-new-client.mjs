import toggl from "../../toggl.app.mjs";

export default {
    name: "Create a new client",
    version: "0.0.1",
    description: "Create a new Client [See docs here.](https://developers.track.toggl.com/docs/api/clients/index.html#post-create-client)",
    type: "action",
    key: "toggle-create-new-client",
    props: {
        toggl,
        name: {
            type: "string",
            label: "Name",
        },
        workspace_id: {
            type: "integer",
            label: "Workspace ID",
        }
    },
    async run({ $ }) {
        const response = await this.toggl.createNewClient({
            name: this.name,
            workspace_id: this.workspace_id,
        })

        response && $.export("$summary", "Successfully created new client");
    }
}