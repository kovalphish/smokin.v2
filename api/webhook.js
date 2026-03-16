const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;
const TG_API = BOT_TOKEN ? `https://api.telegram.org/bot${BOT_TOKEN}` : null;

const FIREBASE_DB_URL = process.env.FIREBASE_DB_URL || 'https://alexsmok-1dc1c-default-rtdb.firebaseio.com';

function firebaseWriteUrl(path) {
    const base = FIREBASE_DB_URL.replace(/\/+$/, '');
    const p = String(path || '').replace(/^\/+/, '');
    return `${base}/${p}.json`;
}

module.exports = async (req, res) => {
    // 1. Проверяем, что это POST запрос от Telegram
    if (req.method !== 'POST') {
        return res.status(200).send('Webhook is working');
    }

    const update = req.body;

    // Stars: Telegram сначала присылает pre_checkout_query — на него надо ответить, иначе оплата "висит"
    if (update.pre_checkout_query) {
        if (!TG_API) {
            console.error('BOT_TOKEN не задан, не могу ответить на pre_checkout_query');
        } else {
            try {
                await axios.post(`${TG_API}/answerPreCheckoutQuery`, {
                    pre_checkout_query_id: update.pre_checkout_query.id,
                    ok: true,
                });
                console.log('pre_checkout_query подтверждён:', update.pre_checkout_query.id);
            } catch (err) {
                console.error('Ошибка answerPreCheckoutQuery:', err.response?.data || err.message);
            }
        }
    }

    // 2. Ищем факт успешной оплаты (successful_payment)
    if (update.message && update.message.successful_payment) {
        const userId = update.message.chat.id; // ID того, кто оплатил
        if (!FIREBASE_DB_URL) {
            console.error('FIREBASE_DB_URL не задан, не могу записать can_spin');
        }
        const firebaseURL = firebaseWriteUrl(`users/${userId}/can_spin`);

        try {
            // 3. Стучимся в твой Firebase и ставим true
            await axios.put(firebaseURL, true);
            console.log(`Успех: Доступ для ${userId} открыт`);
        } catch (error) {
            console.error('Ошибка Firebase:', error.response?.data || error.message);
        }
    }

    // Обязательно отвечаем Telegram 200 OK, чтобы он не слал уведомление повторно
    res.status(200).send('OK');
};
