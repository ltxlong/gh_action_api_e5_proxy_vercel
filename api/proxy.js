import querystring from 'querystring';

export default async function handler(req, res) {
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      // 解析请求体
      const { targetUrl, grant_type, refresh_token, client_id, client_secret, redirect_uri } = req.body;

      if (!targetUrl) {
        return res.status(400).json({ error: 'targetUrl is required' });
      }

      // 获取请求的 HTTP 方法
      const { method } = req;

      let headers;
      let body;

      // 如果是 POST 请求，处理 application/x-www-form-urlencoded 格式
      if (method === 'POST') {
        headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        
        // 将请求体转换为 x-www-form-urlencoded 格式
        body = querystring.stringify({
          grant_type: grant_type,
          refresh_token: refresh_token,
          client_id: client_id,
          client_secret: client_secret,
          redirect_uri: redirect_uri
        });

        console.log(body)
      } else {
        // 对于 GET 请求，使用默认的 application/json 格式
        headers = { 'Content-Type': 'application/json' };
        body = undefined;
      }

      // 向目标 API 发起请求，并传递 headers 和 body
      const response = await fetch(targetUrl, {
        method: method,
        headers: headers,
        body: body
      });

      // 获取目标 API 的响应
      const responseBody = await response.json();

      // 设置响应头部并返回结果
      res.setHeader('Content-Type', 'application/json');
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
