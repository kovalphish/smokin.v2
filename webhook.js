const axios = require('axios');

module.exports = async (req, res) => {
    // 1. Проверяем, что это POST запрос от Telegram
    if (req.method !== 'POST') {
        return res.status(200).send('Webhook is working');
    }

    const update = req.body;

    // 2. Ищем факт успешной оплаты (successful_payment)
    if (update.message && update.message.successful_payment) {
        const userId = update.message.chat.id; // ID того, кто оплатил
        const firebaseURL = `https://alexsmok-1dc1c-default-rtdb.firebaseio.com/users/${userId}/can_spin.json`;

        try {
            // 3. Стучимся в твой Firebase и ставим true
            await axios.put(firebaseURL, true);
            console.log(`Успех: Доступ для ${userId} открыт`);
        } catch (error) {
            console.error('Ошибка Firebase:', error.message);
        }
    }

    // Обязательно отвечаем Telegram 200 OK, чтобы он не слал уведомление повторно
    res.status(200).send('OK');
};
