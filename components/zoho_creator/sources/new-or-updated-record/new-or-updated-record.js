const zohoCreator = require("../../zoho_creator.app");

module.exports = {
    key: "zoho_creator-new-or-updated-record",
    description: "Emit new events new or updated records",
    type: "source",
    props: {
        zohoCreator
    },
    methods: {},
    async run(event) {
        this.$emit(
            { event },
            {
                summary: "Hello, world!",
                ts: Date.now(),
            }
        );
    },
};
