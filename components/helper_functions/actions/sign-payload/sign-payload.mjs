import crypto from "crypto";
import { ConfigurationError } from "@pipedream/platform";
import helper_functions from "../../helper_functions.app.mjs";
import constants from "../../common/constants.mjs";

// Rebuilds a PEM whose line breaks were lost or mangled when pasted into a form
// field (spaces, literal "\n", indentation, CRLF) so Node's parser accepts it.
function normalizePem(key) {
  // Only match private key blocks so a leading "EC PARAMETERS" block isn't picked up instead
  const match = key.match(/-----BEGIN ((?:RSA |EC |ENCRYPTED )?PRIVATE KEY)-----([\s\S]*?)-----END \1-----/);
  // Legacy encrypted PEMs carry "Proc-Type"/"DEK-Info" header lines; leave them alone
  if (!match || /Proc-Type:/.test(match[2])) {
    return key;
  }
  const [
    , label,
    body,
  ] = match;
  const base64 = body.replace(/\\n|\\r|\s/g, "");
  if (!base64) {
    throw new ConfigurationError("The private key PEM body is empty");
  }
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
      options: constants.SIGN_MODE_OPTIONS,
      default: constants.DEFAULT_SIGN_MODE,
      optional: true,
    },
    algorithm: {
      type: "string",
      label: "Hash Algorithm",
      description: "The digest algorithm, e.g. `sha512`; with mode `rsa`, this produces an RSA-SHA512 signature.",
      options: constants.SIGN_ALGORITHM_OPTIONS,
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
      description: "Passphrase for an encrypted private key, e.g. `example-passphrase`. Encrypted keys must be PKCS#8 (`-----BEGIN ENCRYPTED PRIVATE KEY-----`); convert legacy keys with `openssl pkcs8 -topk8`. Not used in `hmac` mode.",
      secret: true,
      optional: true,
    },
    hmacKeyEncoding: {
      type: "string",
      label: "HMAC Key Encoding",
      description: "How to decode the shared secret in `hmac` mode, e.g. `hex` if the secret is given as a hex string. Defaults to `utf8` (the secret's text is used as-is). Not used in `rsa` / `ecdsa` modes.",
      options: constants.HMAC_KEY_ENCODING_OPTIONS,
      default: constants.DEFAULT_HMAC_KEY_ENCODING,
      optional: true,
    },
    rsaPadding: {
      type: "string",
      label: "RSA Padding",
      description: "RSA signature scheme in `rsa` mode: `pkcs1` is PKCS#1 v1.5 (RS256/384/512, the default); `pss` is RSA-PSS (PS256/384/512). e.g. `pkcs1`. Not used in other modes.",
      options: constants.RSA_PADDING_OPTIONS,
      default: constants.DEFAULT_RSA_PADDING,
      optional: true,
    },
    rsaPssSaltLength: {
      type: "integer",
      label: "RSA-PSS Salt Length",
      description: "Salt length in bytes when RSA Padding is `pss`, e.g. `32` for `sha256` (JWT PS256 uses the digest length: 32 / 48 / 64). If omitted, the maximum possible salt length is used. Not used with `pkcs1` padding.",
      optional: true,
    },
    ecdsaSignatureFormat: {
      type: "string",
      label: "ECDSA Signature Format",
      description: "Signature format in `ecdsa` mode: `der` (ASN.1 DER, the default) or `ieee-p1363` (raw r||s, required for JWS/JWT ES256/ES384/ES512). e.g. `ieee-p1363`. Not used in other modes.",
      options: constants.ECDSA_SIGNATURE_FORMAT_OPTIONS,
      default: constants.DEFAULT_ECDSA_SIGNATURE_FORMAT,
      optional: true,
    },
    encoding: {
      type: "string",
      label: "Output Encoding",
      description: "How to encode the resulting signature, e.g. `base64`.",
      options: constants.SIGNATURE_ENCODING_OPTIONS,
      default: constants.DEFAULT_SIGNATURE_ENCODING,
      optional: true,
    },
  },
  async run({ $ }) {
    const mode = this.mode || constants.DEFAULT_SIGN_MODE;
    const encoding = this.encoding || constants.DEFAULT_SIGNATURE_ENCODING;
    const data = Buffer.from(this.payload, "utf8");
    let signature;

    if (mode === "hmac") {
      const hmacKey = Buffer.from(
        this.key,
        this.hmacKeyEncoding || constants.DEFAULT_HMAC_KEY_ENCODING,
      );
      signature = crypto.createHmac(this.algorithm, hmacKey)
        .update(data)
        .digest(encoding);
    } else {
      const expectedType = {
        rsa: "rsa",
        ecdsa: "ec",
      }[mode];
      if (!expectedType) {
        throw new ConfigurationError(`Unsupported mode \`${mode}\``);
      }
      const pem = normalizePem(this.key);
      if (!this.passphrase && /ENCRYPTED PRIVATE KEY|Proc-Type:/.test(pem)) {
        throw new ConfigurationError("A passphrase is required for an encrypted private key");
      }
      const keyObject = crypto.createPrivateKey({
        key: pem,
        passphrase: this.passphrase || undefined,
      });
      if (keyObject.asymmetricKeyType !== expectedType) {
        throw new ConfigurationError(`Mode \`${mode}\` requires an ${expectedType.toUpperCase()} private key, but the provided key is of type \`${keyObject.asymmetricKeyType}\``);
      }
      const signOptions = {
        key: keyObject,
      };
      if (mode === "ecdsa") {
        signOptions.dsaEncoding = this.ecdsaSignatureFormat
          || constants.DEFAULT_ECDSA_SIGNATURE_FORMAT;
      } else if ((this.rsaPadding || constants.DEFAULT_RSA_PADDING) === "pss") {
        signOptions.padding = crypto.constants.RSA_PKCS1_PSS_PADDING;
        if (this.rsaPssSaltLength != null) {
          signOptions.saltLength = this.rsaPssSaltLength;
        }
      }
      signature = crypto.sign(this.algorithm, data, signOptions).toString(encoding);
    }

    $.export("$summary", `Successfully signed payload (${mode}, ${this.algorithm}, ${encoding})`);
    return {
      signature,
    };
  },
};
