import { open } from "fs/promises";
import { defineApp } from "@pipedream/types";
import { Vaas, VAAS_URL, ClientCredentialsGrantAuthenticator, } from "gdata-vaas";
export default defineApp({
    type: "app",
    app: "verdict_as_a_service",
    propDefinitions: {
        file: {
            type: "string",
            label: "File",
            description: "File path of a file previously downloaded in Pipedream E.g. (`/tmp/my-file.txt`). [Download a file to the `/tmp` directory](https://pipedream.com/docs/code/nodejs/http-requests/#download-a-file-to-the-tmp-directory)",
        },
    },
    methods: {
        async getClient() {
            const { client_id: clientId, client_secret: secret, token_url: tokenUrl, vaas_url: url = VAAS_URL, } = this.$auth;
            const authenticator = new ClientCredentialsGrantAuthenticator(clientId, secret, tokenUrl);
            const token = await authenticator.getToken();
            const vaas = new Vaas();
            await vaas.connect(token, url);
            return vaas;
        },
        async requestVerdictForFile(file) {
            const client = await this.getClient();
            const fileHandle = await open(file, "r");
            const buffer = await fileHandle.readFile();
            try {
                return client.forFile(buffer);
            }
            finally {
                fileHandle.close();
                client.close();
            }
        },
    },
});
