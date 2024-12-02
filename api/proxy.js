// api/proxy.js
export default async function handler(req, res) {
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      // 解析请求体
      const { targetUrl, ...restBody } = req.body;

      if (!targetUrl) {
        return res.status(400).json({ error: 'targetUrl is required' });
      }

      // 获取原始请求的 method
      const { method } = req;

      if (method === 'POST') {
       const headers = { 'Content-Type':'application/x-www-form-urlencoded' }
       const body = {
        'grant_type': 'refresh_token',
        'refresh_token': restBody.refresh_token,
        'client_id': restBody.id,
        'client_secret': restBody.secret,
        'redirect_uri': 'http://localhost:53682/'
       }
      } else {
        const headers = { 'Content-Type':'application/json' }
        const body = undefined
      }

      // 向目标 API 发起请求，并传递剩余的 body 和 headers
      const response = await fetch(targetUrl, {
        method: method,
        headers,
        body
      });

      // 获取目标 API 的响应
      const responseBody = await response.json();

      // 设置响应头部
      res.setHeader('Content-Type', 'application/json');

      // 返回目标 API 的响应数据
      res.status(response.status).json(responseBody);
    } catch (error) {
      // 错误处理
      res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
  } else {
    // 对于其他请求方式，返回 "Hello World"
    res.status(200).send('Hello World');
  }
}

