// Bare-bones OAuth script to fetch a token.
// For testing purposes only — no timeouts, no browser response.
// Manually terminate the script from the console when finished.
// Access token v6Dp%5xWzh(rsgW9PR&xY4C#Ibs&Jo3W12nv@6Te3cZOrI5XACdoate$DQ#pIyYP
import open from "open";
import http from "http";

// --- Google OAuth Config ---
const clientId = "oLfVJbw59in5HkMknoNohgQ2wOpC2zRm";
//const redirectUri = "http://localhost:3000";
const redirectUri = "https://developers.drift.com/callback"; 
const scopes = "global";

const authUrl = new URL("https://oauth.drift.com/authorize");
authUrl.searchParams.set("client_id", clientId);
authUrl.searchParams.set("redirect_uri", redirectUri);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("scope", scopes);
authUrl.searchParams.set("access_type", "offline");
authUrl.searchParams.set("prompt", "consent");


new Promise((resolve, reject) => {
    // Start a local HTTP server to catch Google's OAuth redirect
    http.createServer((incomingRequest, outgoingResponse) => {
      const fullRequestUrl = new URL(incomingRequest.url, `http://${incomingRequest.headers.host}`);
      const authorizationCode = fullRequestUrl.searchParams.get("code");

      if (authorizationCode) {
        console.log("AUTH CODE RECEIVED:", authorizationCode);
        resolve(authorizationCode);
      } else {
        console.log("Unexpected request received — no code param found.");
        reject("Unexpected request received — no code param.");
      }
    }).listen(3000, () => {
      console.log("🌐 Listening on http://localhost:3000");
      console.log("🔗 Opening browser for Google OAuth...");
      open(authUrl.toString());
    });
})
.then((authorizationCode) => {
    console.log("✅ Got the code! Exchanging for tokens...");
  
  
    fetch("https://public-api.wordpress.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: authorizationCode,
        client_id: clientId,
        client_secret: "VaqZQcIF19reqAcnY6ODL94HilRV60OM", 
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          console.log("🎉 Tokens received!");
          console.log("Access Token:", data.access_token);
          console.log("Refresh Token:", data.refresh_token);
          console.log("Expires In:", data.expires_in);
          console.log("Token retrieval complete. Shutting down server...");
          process.exit(0);
        } else {
          console.error(" Failed to get tokens:", data);
          process.exit(1);
        }
      })
      .catch((err) => {
        console.error("Error while exchanging code:", err);
        process.exit(1);
      });
  })
  .catch((error) => {
    console.error("Error during authorization:", error);
    process.exit(1);
  });