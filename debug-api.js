// API测试和诊断工具
export default async function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // 从环境变量中获取API密钥和端点
        const apiKey = process.env.AZURE_OPENAI_API_KEY;
        const baseEndpoint = process.env.AZURE_OPENAI_ENDPOINT;

        // 基础配置检查
        const configCheck = {
            hasApiKey: !!apiKey,
            hasEndpoint: !!baseEndpoint,
            apiKeyLength: apiKey ? apiKey.length : 0,
            endpointValue: baseEndpoint || 'Not configured',
            endpointFormat: baseEndpoint ? 'Provided' : 'Missing'
        };

        if (!apiKey || !baseEndpoint) {
            return res.status(200).json({
                status: 'Configuration Error',
                config: configCheck,
                error: 'API密钥或端点未配置',
                suggestions: [
                    '确保在Vercel环境变量中设置了AZURE_OPENAI_API_KEY',
                    '确保在Vercel环境变量中设置了AZURE_OPENAI_ENDPOINT',
                    'AZURE_OPENAI_ENDPOINT格式应为: https://your-resource.openai.azure.com'
                ]
            });
        }

        // 构建完整的API端点URL
        const cleanEndpoint = baseEndpoint.replace(/\/$/, '');
        const fullEndpoint = `${cleanEndpoint}/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview`;

        // 如果是GET请求，只返回配置信息
        if (req.method === 'GET') {
            return res.status(200).json({
                status: 'Configuration OK',
                config: configCheck,
                fullEndpoint: fullEndpoint,
                timestamp: new Date().toISOString()
            });
        }

        // 如果是POST请求，尝试实际调用API
        if (req.method === 'POST') {
            const testPayload = {
                messages: [
                    {
                        role: "user",
                        content: "测试连接，请回复'连接成功'"
                    }
                ],
                max_tokens: 50,
                temperature: 0.7
            };

            console.log('测试API调用:', {
                endpoint: fullEndpoint,
                hasApiKey: !!apiKey,
                payloadSize: JSON.stringify(testPayload).length
            });

            const response = await fetch(fullEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey
                },
                body: JSON.stringify(testPayload)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('API测试失败:', {
                    status: response.status,
                    statusText: response.statusText,
                    data: data
                });

                return res.status(200).json({
                    status: 'API Test Failed',
                    config: configCheck,
                    error: {
                        httpStatus: response.status,
                        statusText: response.statusText,
                        details: data
                    },
                    endpoint: fullEndpoint,
                    suggestions: [
                        '检查API密钥是否正确',
                        '检查Azure OpenAI资源是否已部署gpt-4o模型',
                        '检查端点URL格式是否正确',
                        '检查Azure资源是否在正确的区域'
                    ]
                });
            }

            return res.status(200).json({
                status: 'API Test Success',
                config: configCheck,
                response: {
                    choices: data.choices?.length || 0,
                    usage: data.usage,
                    model: data.model
                },
                message: '✅ API连接成功！',
                timestamp: new Date().toISOString()
            });
        }

    } catch (error) {
        console.error('API测试异常:', error);
        
        return res.status(200).json({
            status: 'Test Error',
            error: {
                message: error.message,
                name: error.name,
                stack: error.stack
            },
            suggestions: [
                '检查网络连接',
                '检查Vercel函数是否正常运行',
                '检查Azure OpenAI服务状态'
            ],
            timestamp: new Date().toISOString()
        });
    }
}
