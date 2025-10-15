import axios from "axios";

export default async function(event) {
  const telegramToken = "8469316973:AAHawOsGOdQ1alVIPy8FpUW3yN-GoJbpcK4";
  const chatId = "8409601106";

  // الرسالة اللي جت من TradingView
  const message = event.body.text || JSON.stringify(event.body);

  const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

  try {
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown"
    });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
}
