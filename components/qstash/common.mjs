import {
  createHash, createHmac,
} from "crypto";

export const methods = {
  async verify(
    jwt,
    signingKey,
    body,
    url,
  ) {
    const split = jwt.split(".");
    if (split.length != 3) {
      throw new Error("Invalid JWT");
    }
    const [
      header,
      payload,
      signature,
    ] = split;

    if (
      signature !=
          createHmac("sha256", signingKey)
            .update(`${header}.${payload}`)
            .digest("base64url")
    ) {
      throw new Error("Invalid JWT signature");
    }

    // Now the jwt is verified and we can start looking at the claims in the payload
    const p = JSON.parse(Buffer.from(payload, "base64url").toString());

    if (p.iss !== "Upstash") {
      throw new Error(`invalid issuer: ${p.iss}, expected "Upstash"`);
    }
    if (p.sub !== url) {
      throw new Error(`invalid subject: ${p.sub}, expected "${url}"`);
    }

    const now = Math.floor(Date.now() / 1000);
    if (now > p.exp) {
      throw new Error("token has expired");
    }
    if (now < p.nbf) {
      throw new Error("token is not yet valid");
    }

    if (body != null) {
      if (
        p.body.replace(/=+$/, "") !=
            createHash("sha256").update(body)
              .digest("base64url")
      ) {
        throw new Error("body hash does not match");
      }
    }

    return true;
  },
};
