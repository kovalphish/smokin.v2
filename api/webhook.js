// api/webhook.js
const axios = require('axios');

export default async function handler(req, res) {
    const update = req.body;
    const BOT_TOKEN = "8470694002:AAFht8GbM5QJEItnociSjtOgaYf0jQEstIo"; // <--- ТОТ ЖЕ ТОКЕН
    const DB_URL = "https://alexsmok-1dc1c-default-rtdb.firebaseio.com";

    // Подтверждаем платеж для Telegram
    if (update.pre_checkout_query) {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/answerPreCheckoutQuery`, {
            pre_checkout_query_id: update.pre_checkout_query.id,
            ok: true
        });
        return res.status(200).send('ok');
    }

    // Если оплата успешна, меняем can_spin в Firebase
    if (update.message?.successful_payment) {
        const userId = update.message.successful_payment.invoice_payload;
        await axios.patch(`${DB_URL}/users/${userId}.json`, { can_spin: true });
    }
    res.status(200).send('ok');
}

