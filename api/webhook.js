const axios = require('axios');

export default async function handler(req, res) {
    const update = req.body;
    const BOT_TOKEN = "8470694002:AAGYITMQ3yNIuoP3w7MqQmnmWmRF66kzUd0";
    const FIREBASE_DB_URL = "https://alexsmok-1dc1c-default-rtdb.firebaseio.com";

    // 1. Подтверждаем платеж для Telegram
    if (update.pre_checkout_query) {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/answerPreCheckoutQuery`, {
            pre_checkout_query_id: update.pre_checkout_query.id,
            ok: true
        });
        return res.status(200).send('ok');
    }

    // 2. Если оплата прошла — пишем в базу
    if (update.message?.successful_payment) {
        const userId = update.message.successful_payment.invoice_payload;
        
        // Самый простой способ записать в Firebase через их REST API
        await axios.patch(`${FIREBASE_DB_URL}/users/${userId}.json`, {
            can_spin: true
        });
    }

    res.status(200).send('ok');
}