const axios = require('axios');

module.exports = async (req, res) => {
    // Разрешаем запросы с твоего сайта
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { userId } = req.query;
    const BOT_TOKEN = "8470694002:AAFht8GbM5QJEItnociSjtOgaYf0jQEstIo"; // Твой новый токен

    if (!userId) {
        return res.status(400).json({ error: "No userId provided" });
    }

    try {
        const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
            title: "Пополнение попытки",
            description: "1 прокрут в Lucky Smokin",
            payload: userId.toString(), // Передаем ID пользователя, чтобы потом узнать, кто оплатил
            provider_token: "", // Для Звёзд оставляем ПУСТЫМ
            currency: "XTR",
            prices: [{ label: "1 Spin", amount: 10 }] // 10 звезд
        });

        if (response.data.ok) {
            res.status(200).json({ link: response.data.result });
        } else {
            res.status(500).json({ error: response.data.description });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка API Telegram" });
    }
};
