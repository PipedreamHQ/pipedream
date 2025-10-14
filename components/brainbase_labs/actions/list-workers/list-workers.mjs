import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-list-workers",
    name: "List Workers",
    description: "Get all workers for the team. [See the documentation](https://docs.brainbase.com)",
    version: "0.0.1",
    type: "action",
    props: {
        app,
    },
    async run({ $ }) {
        const response = await this.app.listWorkers({
            $,
        });

        $.export("$summary", `Successfully retrieved ${response.data?.length || 0} worker(s)`);
        return response;
    },
};

