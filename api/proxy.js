// api/proxy.js
export default async function handler(req, res) {
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      // 解析请求体
      const { targetUrl, ...restBody } = req.body;

      if (!targetUrl) {
        return res.status(400).json({ error: 'targetUrl is required' });
      }

      console.log(req.body)
      
      // 获取原始请求的 headers 和 method
      const { headers, method } = req;

      console.log(headers)
      console.log(method)
      
      // 向目标 API 发起请求，并传递剩余的 body 和 headers
      const response = await fetch(targetUrl, {
        method: method,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'X-Forwarded-For': req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        },
        body: method === 'POST' ? JSON.stringify(restBody) : undefined,
      });

      // 获取目标 API 的响应
      const responseBody = await response.json();

      console.log(responseBody)
      
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
