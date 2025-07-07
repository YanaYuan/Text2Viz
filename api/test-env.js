// 测试环境变量的API端点
export default async function handler(req, res) {
    try {
        // 设置CORS头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Content-Type', 'application/json');

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
            endpointValue: baseEndpoint || 'Not configured',
            timestamp: new Date().toISOString(),
            nodeVersion: process.version,
            platform: process.platform
        };

        const result = {
            status: 'success',
            message: 'Environment variables check completed',
            data: envStatus,
            allConfigured: !!(apiKey && baseEndpoint),
            recommendations: []
        };

        // 添加建议
        if (!apiKey) {
            result.recommendations.push('请在Vercel环境变量中配置 AZURE_OPENAI_API_KEY');
        }
        if (!baseEndpoint) {
            result.recommendations.push('请在Vercel环境变量中配置 AZURE_OPENAI_ENDPOINT');
        }
        if (apiKey && baseEndpoint) {
            result.recommendations.push('✅ 环境变量配置完整，可以进行API测试');
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error('Environment check error:', error);
        
        return res.status(200).json({
            status: 'error',
            message: 'Environment check failed',
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    }
}
