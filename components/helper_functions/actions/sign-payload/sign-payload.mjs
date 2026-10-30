import crypto from "crypto";
import { ConfigurationError } from "@pipedream/platform";
import helper_functions from "../../helper_functions.app.mjs";

// Rebuilds a PEM whose line breaks were lost or mangled when pasted into a form
// field (spaces, literal "\n", indentation, CRLF) so Node's parser accepts it.
function normalizePem(key) {
  const match = key.match(/-----BEGIN ([A-Z ]+)-----([\s\S]*?)-----END \1-----/);
  // Legacy encrypted PEMs carry "Proc-Type"/"DEK-Info" header lines; leave them alone
  if (!match || /Proc-Type:/.test(match[2])) return key;
  const [
    , label,
    body,
  ] = match;
  const base64 = body.replace(/\\n|\\r|\s/g, "");
  return `-----BEGIN ${label}-----\n${base64.match(/.{1,64}/g).join("\n")}\n-----END ${label}-----\n`;
}

export default {
  key: "helper_functions-sign-payload",
  name: "Sign Payload",
  description: "Signs a payload with an RSA or ECDSA private key, or computes an HMAC with a shared secret, and returns the signature. The payload is signed verbatim (no re-serialization). Uses Node's [crypto.sign()](https://nodejs.org/api/crypto.html#cryptosignalgorithm-data-key-callback) and [crypto.createHmac()](https://nodejs.org/api/crypto.html#cryptocreatehmacalgorithm-key-options).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    helper_functions,
    payload: {
      type: "string",
      label: "Payload",
      description: "The exact string to sign, e.g. a pre-rendered JSON request body. It is signed as-is (UTF-8 bytes), without parsing or re-serialization, so it must match byte-for-byte what you send to the API. Example: `{\"login\":\"user@example.com\",\"nonce\":\"neople\",\"lifetime\":1209600}`",
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "`rsa` signs with an RSA private key (`crypto.sign`), `ecdsa` signs with an EC private key (`crypto.sign`), `hmac` computes a keyed hash with a shared secret (`crypto.createHmac`). e.g. `rsa`.",
      options: [
        "rsa",
        "ecdsa",
        "hmac",
      ],
      default: "rsa",
      optional: true,
    },
    algorithm: {
      type: "string",
      label: "Hash Algorithm",
      description: "The digest algorithm, e.g. `sha512`; with mode `rsa`, this produces an RSA-SHA512 signature.",
      options: [
        "sha256",
        "sha384",
        "sha512",
      ],
    },
    key: {
      type: "string",
      label: "Key",
      description: "For `rsa` / `ecdsa`: the PEM-encoded private key, e.g. `-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----` (PKCS#8; PKCS#1 `-----BEGIN RSA PRIVATE KEY-----` and EC keys are also supported). For `hmac`: the shared secret, e.g. `example-hmac-secret`.",
      secret: true,
    },
    passphrase: {
      type: "string",
      label: "Passphrase",
      description: "Passphrase for an encrypted private key, e.g. `example-passphrase`. Not used in `hmac` mode.",
      secret: true,
      optional: true,
    },
    encoding: {
      type: "string",
      label: "Output Encoding",
      description: "How to encode the resulting signature, e.g. `base64`.",
      options: [
        "base64",
        "base64url",
        "hex",
      ],
      default: "base64",
      optional: true,
    },
  },
  async run({ $ }) {
    const mode = this.mode || "rsa";
    const encoding = this.encoding || "base64";
    const data = Buffer.from(this.payload, "utf8");
    let signature;

    try {
      if (mode === "hmac") {
        signature = crypto.createHmac(this.algorithm, this.key)
          .update(data)
          .digest(encoding);
      } else {
        const keyObject = crypto.createPrivateKey({
          key: normalizePem(this.key),
          passphrase: this.passphrase || undefined,
        });
        const expectedType = mode === "rsa"
          ? "rsa"
          : "ec";
        if (keyObject.asymmetricKeyType !== expectedType) {
          throw new ConfigurationError(`Mode \`${mode}\` requires a ${expectedType.toUpperCase()} private key, but the provided key is of type \`${keyObject.asymmetricKeyType}\``);
        }
        signature = crypto.sign(this.algorithm, data, keyObject).toString(encoding);
      }
    } catch (err) {
      if (err instanceof ConfigurationError) throw err;
      // Never echo the raw error's key material; surface only the message
      throw new ConfigurationError(`Unable to sign payload: ${err.message}`);
    }

    $.export("$summary", `Successfully signed payload (${mode}, ${this.algorithm}, ${encoding})`);
    return {
      signature,
    };
  },
};
