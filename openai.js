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
        
        // 常见的部署名称和API版本组合
        const deploymentConfigs = [
            { deployment: 'gpt-4', apiVersion: '2024-02-01' },
            { deployment: 'gpt-35-turbo', apiVersion: '2024-02-01' },
            { deployment: 'gpt-4o', apiVersion: '2024-02-01' },
            { deployment: 'gpt-4', apiVersion: '2023-12-01-preview' },
            { deployment: 'gpt-35-turbo', apiVersion: '2023-12-01-preview' }
        ];

        let lastError = null;
        
        // 尝试不同的配置组合
        for (const config of deploymentConfigs) {
            const fullEndpoint = `${cleanEndpoint}/openai/deployments/${config.deployment}/chat/completions?api-version=${config.apiVersion}`;
            
            console.log(`尝试配置: ${config.deployment} with API版本 ${config.apiVersion}`);
            
            try {
                const response = await fetch(fullEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': apiKey
                    },
                    body: JSON.stringify(req.body)
                });

                const data = await response.json();
                
                if (response.ok) {
                    console.log(`✅ 成功使用配置: ${config.deployment} - ${config.apiVersion}`);
                    return res.status(200).json(data);
                } else {
                    console.log(`❌ 配置失败: ${config.deployment} - ${response.status}`);
                    lastError = {
                        config,
                        status: response.status,
                        statusText: response.statusText,
                        data: data,
                        endpoint: fullEndpoint
                    };
                }
            } catch (error) {
                console.log(`❌ 配置异常: ${config.deployment} - ${error.message}`);
                lastError = {
                    config,
                    error: error.message,
                    endpoint: fullEndpoint
                };
            }
        }
        
        // 如果所有配置都失败，返回最后一个错误
        console.error('所有配置都失败了:', lastError);
        return res.status(lastError.status || 500).json({
            error: '所有部署配置都失败',
            lastError: lastError,
            suggestion: '请检查Azure OpenAI资源中的实际部署名称',
            testedConfigs: deploymentConfigs
        });
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
