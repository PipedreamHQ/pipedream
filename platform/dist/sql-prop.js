"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
exports.default = {
    methods: {
        /**
         * A helper method to get the schema of the database. Used by other features
         * (like the `sql` prop) to enrich the code editor and provide the user with
         * auto-complete and fields suggestion.
         *
         * @returns {DbSchema} The schema of the database, which is a
         * JSON-serializable object.
         * @throws {ConfigurationError} If the method is not implemented.
         */
        getSchema() {
            throw new errors_1.ConfigurationError("getSchema not implemented");
        },
    },
};
