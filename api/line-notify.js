'use strict';

const { sendLineNotification } = require('../lib/line-notifier');

/**
 * POST /api/line-notify
 * フォームデータ（JSON）を受け取り、LINE プッシュ通知を送る。
 * LINE 通知が失敗しても 500 を返すだけ — フォーム UX には影響しない。
 */
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await sendLineNotification(req.body ?? {});
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[line-notify]', err.message);
    return res.status(500).json({ error: 'LINE notification failed' });
  }
};
