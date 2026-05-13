'use strict';

/**
 * LINE Messaging API へプッシュ通知を送る。
 * 失敗時は呼び出し元に Error をスローする。
 */
async function sendLineNotification(formData) {
  const token  = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const userId = process.env.LINE_USER_ID;

  if (!token || !userId) {
    throw new Error('LINE_CHANNEL_ACCESS_TOKEN または LINE_USER_ID が未設定です');
  }

  const text = buildMessage(formData);

  const res = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: 'text', text }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LINE API ${res.status}: ${body}`);
  }
}

function buildMessage(d) {
  const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  const hr  = '─'.repeat(22);

  return [
    '【和牛亭】新規お問い合わせ',
    hr,
    `お名前　　：${d['お名前']       || '（未記入）'}`,
    `電話番号　：${d['電話番号']     || '（未記入）'}`,
    `メール　　：${d['メールアドレス'] || '（未記入）'}`,
    hr,
    `ご利用日　：${d['ご利用日']     || '（未定）'}`,
    `ご利用時間：${d['ご利用時間']   || '（未定）'}`,
    `ご利用人数：${d['ご利用人数'] ? d['ご利用人数'] + '名' : '（未定）'}`,
    `ご利用目的：${d['ご利用目的']   || '（未選択）'}`,
    `個室希望　：${d['個室希望']     || '（未選択）'}`,
    hr,
    `アレルギー：${d['アレルギー・苦手な食材'] || 'なし'}`,
    '',
    `送信日時　：${now}`,
    hr,
  ].join('\n');
}

module.exports = { sendLineNotification };
