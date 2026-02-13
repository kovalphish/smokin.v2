const axios = require('axios');

module.exports = async (req, res) => {
    // Настройка CORS, чтобы браузер не блокировал запрос
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { userId } = req.query;
    const BOT_TOKEN = "8470694002:AAFht8GbM5QJEItnociSjtOgaYf0jQEstIo";

    if (!userId) {
        return res.status(400).json({ error: "Передайте userId" });
    }

    try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`;
        const payload = {
            title: "1 Попытка",
            description: "Прокрут рулетки Lucky Smokin",
            payload: userId.toString(),
            provider_token: "", // Пусто для Telegram Stars
            currency: "XTR",
            prices: [{ label: "Spin", amount: 10 }]
        };

        const response = await axios.post(url, payload);

        if (response.data.ok) {
            // Возвращаем прямую ссылку на оплату
            return res.status(200).json({ link: response.data.result });
        } else {
            console.error("TG Error:", response.data);
            return res.status(500).json({ error: response.data.description });
        }
    } catch (error) {
        console.error("Server Error:", error.response?.data || error.message);
        return res.status(500).json({ error: "Ошибка при создании счета" });
    }
};

