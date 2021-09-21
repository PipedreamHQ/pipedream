const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-download-cloud-recording",
    name: "Download Cloud Recording",
    description: "Download a cloud recording by its URL and token",
    type: "action",
    version: "0.0.1",
    props: {
        zoom,
        // @todo: add props
    },
    async run() {
        // @todo: add action logic
    }
}