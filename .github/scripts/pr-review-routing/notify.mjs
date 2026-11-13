const PD_API_URL = "https://api.pipedream.com/v1";

const REQUIRED_ENV = [
  "PD_CLIENT_ID",
  "PD_CLIENT_SECRET",
  "PD_PROJECT_ID",
  "PD_EXTERNAL_USER_ID",
];

function parseEmails(json) {
  const entries = Object.entries(JSON.parse(json || "{}"));

  return Object.fromEntries(
    entries.map(([login, email]) => [login.toLowerCase(), email]),
  );
}

async function post(url, body, headers = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`POST ${url} → ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

export function createNotifier(env = process.env) {
  const emails = parseEmails(env.REVIEWER_EMAILS);
  const emailOf = (login) => emails[login.toLowerCase()];

  const isConfigured = REQUIRED_ENV.every((key) => env[key]);
  const dryRun = env.DRY_RUN === "true" || !isConfigured;

  const slack = { authProvisionId: env.PD_SLACK_ACCOUNT_ID };
  const gmail = { authProvisionId: env.PD_GMAIL_ACCOUNT_ID };

  let accessToken;

  if (dryRun) {
    console.log("Notifications are in dry-run mode and will only be logged.");
  }

  async function getAccessToken() {
    if (!accessToken) {
      const res = await post(`${PD_API_URL}/oauth/token`, {
        grant_type: "client_credentials",
        client_id: env.PD_CLIENT_ID,
        client_secret: env.PD_CLIENT_SECRET,
      });

      accessToken = res.access_token;
    }

    return accessToken;
  }

  async function runAction(id, configuredProps) {
    if (dryRun) {
      console.log(`[dry-run] ${id}`, JSON.stringify(configuredProps));
      return null;
    }

    const url = `${PD_API_URL}/connect/${env.PD_PROJECT_ID}/actions/run`;

    const body = {
      id,
      external_user_id: env.PD_EXTERNAL_USER_ID,
      configured_props: configuredProps,
    };

    const headers = {
      "Authorization": `Bearer ${await getAccessToken()}`,
      "x-pd-environment": env.PD_ENVIRONMENT || "production",
    };

    const { ret, error, os = [] } = await post(url, body, headers);

    // A failed action can still come back as HTTP 200, with the error in the body or logs.
    const failure = error ?? os.find((entry) => entry.k === "error")?.err;

    if (failure) {
      throw new Error(`Pipedream ${id} failed: ${JSON.stringify(failure)}`);
    }

    return ret;
  }

  async function mention(login) {
    const email = emailOf(login);

    if (!email) {
      return `@${login}`;
    }

    const result = await runAction("slack_v2-find-user-by-email", {
      slack,
      email,
    });

    return result?.user ? `<@${result.user.id}>` : `@${login}`;
  }

  async function slackChannel(conversation, text) {
    await runAction("slack_v2-send-message", {
      slack,
      conversation,
      text,
    });
  }

  async function email(login, subject, body) {
    const to = emailOf(login);

    if (!to) {
      console.log(`No email configured for ${login}, skipping email.`);
      return;
    }

    await runAction("gmail-send-email", {
      gmail,
      to: [to],
      subject,
      body,
      bodyType: "plaintext",
    });
  }

  return {
    mention,
    slackChannel,
    email,
  };
}
