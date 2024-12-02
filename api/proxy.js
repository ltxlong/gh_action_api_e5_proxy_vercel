import querystring from 'querystring';

export default async function handler(req, res) {
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      let targetUrl;
      let restBody;

      // 处理 application/x-www-form-urlencoded 类型的请求
      if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
        // 解析请求体
        const parsedBody = querystring.parse(req.body);
        targetUrl = parsedBody.targetUrl;
        restBody = { ...parsedBody };
        delete restBody.targetUrl; // 删除 targetUrl 以获取剩余参数
      } else {
        // 处理 JSON 请求体
        const { targetUrl: jsonTargetUrl, ...jsonRestBody } = req.body;
        targetUrl = jsonTargetUrl;
        restBody = jsonRestBody;
      }

      if (!targetUrl) {
        return res.status(400).json({ error: 'targetUrl is required' });
      }

      // 获取原始请求的 headers 和 method
      const { headers, method } = req;

      // 将剩余的请求参数转换为 x-www-form-urlencoded 格式
      const urlEncodedBody = querystring.stringify(restBody);

      // 向目标 API 发起请求，并传递剩余的 body 和 headers
      const response = await fetch(targetUrl, {
        method: method,
        headers: {
          ...headers,
          'X-Forwarded-For': req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          'Content-Type': 'application/x-www-form-urlencoded', // 设置正确的请求头
        },
        body: method === 'POST' ? urlEncodedBody : undefined,  // 只在 POST 请求时包含 body
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
