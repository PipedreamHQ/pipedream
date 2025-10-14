import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-list-integrations",
    name: "List Integrations",
    description: "Get all integrations for the authenticated team. [See the documentation](https://docs.brainbase.com)",
    version: "0.0.1",
    type: "action",
    props: {
        app,
    },
    async run({ $ }) {
        const response = await this.app.listIntegrations({
            $,
        });

        $.export("$summary", `Successfully retrieved ${response.data?.length || 0} integration(s)`);
        return response;
    },
};

