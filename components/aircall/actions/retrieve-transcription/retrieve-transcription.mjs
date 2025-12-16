import aircall from "../../aircall.app.mjs";

export default {
    name: "Retrieve Transcription",
    description: "Retrieves AI-generated transcription for a specific Aircall call. [See the docs here](https://developer.aircall.io/api-references/#retrieve-a-transcription)",
    key: "aircall-retrieve-transcription",
    version: "0.0.1",
    annotations: {
        destructiveHint: false,
        openWorldHint: true,
        readOnlyHint: true,
    },
    type: "action",
    props: {
        aircall,
        call: {
            propDefinition: [
                aircall,
                "call",
            ],
        },
    },
    async run({ $ }) {
        const { transcription } = await this.aircall.retrieveTranscription(this.call, $);

        $.export("$summary", `Successfully retrieved transcription with ID ${transcription.id}`);

        return transcription;
    },
};
