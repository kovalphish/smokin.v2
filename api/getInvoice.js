const axios = require('axios');

module.exports = async (req, res) => {
    // 1. ПРАВИЛЬНЫЕ ЗАГОЛОВКИ CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Ответ на предварительный запрос браузера
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { userId, tier } = req.query;
    const BOT_TOKEN = process.env.BOT_TOKEN;

    if (!BOT_TOKEN) {
        return res.status(500).json({ error: "BOT_TOKEN не задан в переменных окружения" });
    }

    // 2. Базовая проверка входных данных
    if (!userId || userId === "test" || userId === "test_user") {
        return res.status(400).json({ error: "Откройте приложение через бота в Telegram" });
    }

    try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`;
        const tierNum = Number(tier) || 10;
        const allowed = new Set([10, 50, 150]);
        const amount = allowed.has(tierNum) ? tierNum : 10;

        const payload = {
            title: "1 Попытка",
            description: `Прокрут рулетки Lucky Smokin (${amount} ⭐)`,
            payload: JSON.stringify({ userId: userId.toString(), tier: amount, ts: Date.now() }),
            provider_token: "",
            currency: "XTR",
            prices: [{ label: "Spin", amount }]
        };

        const response = await axios.post(url, payload);

        if (response.data.ok) {
            return res.status(200).json({ link: response.data.result });
        } else {
            console.error("TG Error:", response.data.description);
            return res.status(500).json({ error: response.data.description });
        }
    } catch (error) {
        console.error("Server Error:", error.message);
        return res.status(500).json({ error: "Ошибка на сервере Vercel" });
    }
};
