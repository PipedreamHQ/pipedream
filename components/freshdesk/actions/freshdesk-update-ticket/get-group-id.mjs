const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// 🔧 Replace with your values
const API_KEY = "your_api_key";
const DOMAIN = "yourdomain.freshdesk.com";

const getGroups = async () => {
  const res = await fetch(`https://${DOMAIN}/api/v2/groups`, {
    headers: {
      "Authorization": "Basic " + Buffer.from(`${API_KEY}:X`).toString("base64"),
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("❌ Failed to fetch groups:", data);
    return;
  }

  console.log("✅ Group List:");
  data.forEach(group => {
    console.log(`- ${group.name}: ${group.id}`);
  });
};

getGroups();