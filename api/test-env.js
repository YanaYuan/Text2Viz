// 测试环境变量的API端点
export default async function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 检查环境变量是否存在
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const baseEndpoint = process.env.AZURE_OPENAI_ENDPOINT;

    const envStatus = {
        hasApiKey: !!apiKey,
        hasEndpoint: !!baseEndpoint,
        apiKeyLength: apiKey ? apiKey.length : 0,
        endpointValue: baseEndpoint || 'Not set',
        timestamp: new Date().toISOString()
    };

    res.status(200).json({
        status: 'Environment variables check',
        data: envStatus,
        allConfigured: !!(apiKey && baseEndpoint)
    });
}
