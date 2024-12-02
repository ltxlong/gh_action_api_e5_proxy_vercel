export default async function handler(req, res) {
    // 检查请求方法是否为 POST
    if (req.method === 'POST') {
        try {
            // 获取请求体
            const { targetUrl, ...body } = req.body;

            // 检查 targetUrl 是否存在
            if (!targetUrl) {
                return res.status(400).json({ error: 'Missing targetUrl' });
            }

            // 发送请求到目标 URL
            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            // 获取响应内容
            const results = await response.json();

            // 返回响应结果
            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    } else {
        // 如果不是 POST 请求，返回 Hello World
        return res.status(200).send('Hello World');
    }
}
