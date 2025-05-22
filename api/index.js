const axios = require('axios');

export default async function handler(req, res) {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: 'Key is required' });
  }

  try {
    const response = await axios.post(
      'https://2fa-auth.com/wp-admin/admin-ajax.php',
      new URLSearchParams({
        action: 'isures_2fa',
        key: key
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0',
          'X-Requested-With': 'XMLHttpRequest',
          'Origin': 'https://2fa-auth.com',
          'Referer': 'https://2fa-auth.com/'
        }
      }
    );

    const match = response.data.match(/<input[^>]+class="isures-2fa--code"[^>]+value="(\d+)"[^>]*>/);

    if (match) {
      return res.status(200).json({ code: match[1] });
    } else {
      return res.status(404).json({ error: 'Code not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Request failed' });
  }
}
