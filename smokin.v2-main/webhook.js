const axios = require('axios');

const BOT_TOKEN = "8470694002:AAFht8GbM5QJEItnociSjtOgaYf0jQEstIo";
const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(200).send('Webhook is working');
    }

    const update = req.body;

    try {
        // Ответ на pre_checkout_query (обязателен для оплаты Stars)
        if (update.pre_checkout_query) {
            const queryId = update.pre_checkout_query.id;
            try {
                await axios.post(`${TG_API}/answerPreCheckoutQuery`, {
                    pre_checkout_query_id: queryId,
                    ok: true
                });
                console.log('pre_checkout_query подтверждён:', queryId);
            } catch (err) {
                console.error('Ошибка answerPreCheckoutQuery:', err.response?.data || err.message);
            }
        }

        // Обработка успешной оплаты
        if (update.message && update.message.successful_payment) {
            const userId = update.message.chat.id;
            const firebaseURL = `https://alexsmok-1dc1c-default-rtdb.firebaseio.com/users/${userId}/can_spin.json`;

            try {
                await axios.put(firebaseURL, true);
                console.log(`Успех: доступ к спину для ${userId} открыт`);
            } catch (error) {
                console.error('Ошибка Firebase:', error.response?.data || error.message);
            }
        }
    } catch (e) {
        console.error('Ошибка обработки апдейта TG:', e.message);
    }

    res.status(200).send('OK');
};
