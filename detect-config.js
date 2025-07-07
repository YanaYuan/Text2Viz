// Azure OpenAI 配置检测工具
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const baseEndpoint = process.env.AZURE_OPENAI_ENDPOINT;

    if (!apiKey || !baseEndpoint) {
        return res.status(200).json({
            error: '环境变量未配置',
            missing: {
                apiKey: !apiKey,
                endpoint: !baseEndpoint
            }
        });
    }

    const cleanEndpoint = baseEndpoint.replace(/\/$/, '');

    // 常见的模型部署名称
    const commonDeployments = ['gpt-4o', 'gpt-4', 'gpt-35-turbo', 'gpt-4-32k', 'text-davinci-003'];
    
    // 常见的API版本
    const apiVersions = ['2024-02-15-preview', '2024-02-01', '2023-12-01-preview', '2023-08-01-preview'];

    const results = [];

    try {
        // 测试不同的配置组合
        for (const deployment of commonDeployments) {
            for (const apiVersion of apiVersions) {
                const testEndpoint = `${cleanEndpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
                
                try {
                    const response = await fetch(testEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'api-key': apiKey
                        },
                        body: JSON.stringify({
                            messages: [{ role: "user", content: "测试" }],
                            max_tokens: 10
                        })
                    });

                    const status = response.status;
                    let responseData = null;
                    
                    try {
                        responseData = await response.json();
                    } catch (e) {
                        responseData = { error: '无法解析响应' };
                    }

                    results.push({
                        deployment,
                        apiVersion,
                        endpoint: testEndpoint,
                        status,
                        success: status === 200,
                        error: status !== 200 ? responseData : null,
                        working: status === 200
                    });

                    // 如果找到工作的配置，立即返回
                    if (status === 200) {
                        return res.status(200).json({
                            success: true,
                            workingConfig: {
                                deployment,
                                apiVersion,
                                endpoint: testEndpoint
                            },
                            message: '找到可用配置！',
                            allResults: results
                        });
                    }

                } catch (error) {
                    results.push({
                        deployment,
                        apiVersion,
                        endpoint: testEndpoint,
                        status: 'ERROR',
                        success: false,
                        error: error.message,
                        working: false
                    });
                }
            }
        }

        // 如果没有找到工作的配置
        return res.status(200).json({
            success: false,
            message: '未找到可用的配置组合',
            suggestions: [
                '1. 检查Azure OpenAI资源中的部署名称',
                '2. 确认模型是否已成功部署',
                '3. 检查API密钥是否正确',
                '4. 确认Azure资源区域是否正确'
            ],
            allResults: results,
            nextSteps: [
                '访问Azure Portal -> 你的OpenAI资源 -> 模型部署',
                '查看实际的部署名称',
                '复制正确的部署名称到代码中'
            ]
        });

    } catch (error) {
        return res.status(500).json({
            error: '检测过程中发生错误',
            message: error.message,
            details: error.stack
        });
    }
}
