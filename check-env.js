// 超简单的环境变量检查API
export default function handler(req, res) {
    // 基本的CORS设置
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 直接返回简单的结果
    const result = {
        success: true,
        message: '环境变量检查API正常工作',
        timestamp: new Date().toISOString(),
        environment: {
            hasApiKey: !!process.env.AZURE_OPENAI_API_KEY,
            hasEndpoint: !!process.env.AZURE_OPENAI_ENDPOINT,
            nodeVersion: process.version
        }
    };

    res.status(200).json(result);
}
