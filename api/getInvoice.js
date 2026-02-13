const axios = require('axios');

export default async function handler(req, res) {
    const { userId } = req.query;
    const BOT_TOKEN = "8470694002:AAGYITMQ3yNIuoP3w7MqQmnmWmRF66kzUd0"; // Вставь токен от BotFather

    try {
        const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
            title: "Спин в рулетке",
            description: "1 попытка для Smokin174",
            payload: userId, // Передаем ID, чтобы знать, кому дать спин
            currency: "XTR",
            prices: [{ label: "1 попытка", amount: 10 }] // 10 звезд
        });
        res.status(200).json({ link: response.data.result });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}