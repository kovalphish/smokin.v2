// api/getInvoice.js
const axios = require('axios');

export default async function handler(req, res) {
    const { userId } = req.query;
    const BOT_TOKEN = "8470694002:AAGYITMQ3yNIuoP3w7MqQmnmWmRF66kzUd0"; // <--- ВСТАВЬ ТОКЕН ОТ @BotFather

    try {
        const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
            title: "LUCKY SMOKIN SPIN",
            description: "1 попытка в рулетке",
            payload: userId, 
            currency: "XTR", // Валюта звезд
            prices: [{ label: "Спин", amount: 10 }] // Цена: 10 звезд
        });
        res.status(200).json({ link: response.data.result });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
