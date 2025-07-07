// 最简单的API测试端点
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    res.status(200).json({
        message: 'Hello from Vercel API!',
        timestamp: new Date().toISOString(),
        success: true
    });
}
