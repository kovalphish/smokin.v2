const axios = require('axios');

const FIREBASE_DB_URL = process.env.FIREBASE_DB_URL || 'https://alexsmok-1dc1c-default-rtdb.firebaseio.com';

function firebaseWriteUrl(path) {
    const base = (FIREBASE_DB_URL || '').replace(/\/+$/, '');
    const p = String(path || '').replace(/^\/+/, '');
    return `${base}/${p}.json`;
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    if (!FIREBASE_DB_URL) return res.status(500).json({ error: 'FIREBASE_DB_URL не задан' });

    const { wheelConfigs } = req.body || {};

    if (!wheelConfigs || typeof wheelConfigs !== 'object') {
        return res.status(400).json({ error: 'wheelConfigs is required' });
    }

    // минимальная валидация формы
    for (const k of ['t10', 't50', 't150']) {
        const v = wheelConfigs[k];
        if (!Array.isArray(v)) return res.status(400).json({ error: `wheelConfigs.${k} должен быть массивом` });
        for (const item of v) {
            if (!item || typeof item.name !== 'string') return res.status(400).json({ error: `Некорректный item в ${k}` });
        }
    }

    try {
        await axios.put(firebaseWriteUrl('settings/wheel_v2'), wheelConfigs);
        return res.status(200).json({ ok: true });
    } catch (e) {
        return res.status(500).json({ error: e.response?.data || e.message || 'Save failed' });
    }
};

