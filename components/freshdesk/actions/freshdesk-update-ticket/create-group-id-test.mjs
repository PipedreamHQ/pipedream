const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// 🔧 Replace these with your real values
const API_KEY = "YfaK2hd0KP3og3KbqV";
const DOMAIN = "falc1.freshdesk.com"; // e.g. support.freshdesk.com

const createGroup = async () => {
  const res = await fetch(`https://${DOMAIN}/api/v2/groups`, {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(`${API_KEY}:X`).toString("base64"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "My Team",
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("❌ Group create error:", data);
    return;
  }
  console.log("✅ Group created:", data);
};

createGroup();