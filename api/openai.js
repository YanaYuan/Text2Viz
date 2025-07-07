// Vercel Serverless Function
// 将此文件放在 api/openai.js 目录下

export default async function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 从环境变量中获取API密钥和端点
        const apiKey = process.env.AZURE_OPENAI_API_KEY;
        const baseEndpoint = process.env.AZURE_OPENAI_ENDPOINT;

        if (!apiKey || !baseEndpoint) {
            return res.status(500).json({ error: 'API configuration missing' });
        }

        // 构建完整的API端点URL
        // 确保baseEndpoint格式正确，移除可能的尾部斜杠
        const cleanEndpoint = baseEndpoint.replace(/\/$/, '');
        const fullEndpoint = `${cleanEndpoint}/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview`;
        
        // 添加详细日志（生产环境可以移除）
        console.log('API调用信息:', {
            endpoint: fullEndpoint,
            hasApiKey: !!apiKey,
            apiKeyLength: apiKey.length
        });

        const response = await fetch(fullEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('API响应错误:', {
                status: response.status,
                statusText: response.statusText,
                data: data,
                endpoint: fullEndpoint
            });
            return res.status(response.status).json({
                error: `API调用失败: ${response.status} - ${response.statusText}`,
                details: data,
                endpoint: fullEndpoint
            });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('API调用异常:', {
            error: error.message,
            stack: error.stack,
            endpoint: `${baseEndpoint}/openai/deployments/gpt-4o/chat/completions`
        });
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message,
            details: '请检查API端点和密钥配置'
        });
    }
}
