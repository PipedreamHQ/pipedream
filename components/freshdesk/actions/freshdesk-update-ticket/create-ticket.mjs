import fetch from "node-fetch"; // if you're using Node 18+, native fetch is available

// 🔧 Replace these with your real values
const API_KEY = "YfaK2hd0KP3og3KbqV";
const DOMAIN = "falc1.freshdesk.com"; // e.g. support.freshdesk.com

// 🎟️ Ticket payload
const payload = {
  subject: "Test ticket for full update suite",
  description: "<strong>This is a test ticket</strong><br>With rich HTML content.",
  type: "Question",
  priority: 2,  // Medium
  status: 2,    // Open
  tags: ["api-test", "pipedream", "full-update"],
  email: "info@falc1.com", // 
  // Uncomment and customize if you have these
  group_id: 157001089898,
  responder_id: 157005992678, //Agent ID
  custom_fields: {
    // Example: "cf_customer_type": "premium"
  },
};

const createTicket = async () => {
  const response = await fetch(`https://${DOMAIN}/api/v2/tickets`, {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(`${API_KEY}:X`).toString("base64"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error("❌ Failed to create ticket", response.status, await response.text());
    return;
  }

  const data = await response.json();
  console.log("✅ Ticket created:", data);
};

createTicket();