# Vercel API 404 错误排错指南

## 🚨 问题现象
- 访问 `/api/check-env`、`/api/test-env` 等API端点返回404错误
- 页面显示 "The page could not be found" 和 "NOT_FOUND"
- API测试页面无法正常连接后端

## 🔍 诊断步骤

### 1. 使用诊断工具
访问 `vercel-diagnostic.html` 页面进行全面诊断：
```
https://你的域名.vercel.app/vercel-diagnostic.html
```

### 2. 手动检查API端点
依次测试以下端点：
```bash
# 最简单的测试端点
curl https://你的域名.vercel.app/api/hello

# 环境变量检查
curl https://你的域名.vercel.app/api/check-env

# 详细环境测试
curl https://你的域名.vercel.app/api/test-env
```

### 3. 检查Vercel部署日志
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 点击最新的部署记录
4. 查看 "Build Logs" 和 "Function Logs"

## 🛠️ 解决方案

### 方案1: 检查文件结构
确保API文件在正确位置：
```
project/
├── api/
│   ├── hello.js          ✅ 新增的简单测试端点
│   ├── check-env.js      ✅ 环境变量检查
│   ├── test-env.js       ✅ 详细环境测试
│   └── openai.js         ✅ OpenAI代理
├── vercel.json           ✅ 更新的路由配置
└── package.json          ✅ 项目配置
```

### 方案2: 重新部署
1. 确保所有文件已提交到Git
2. 推送到GitHub仓库
3. 触发Vercel重新部署

### 方案3: 检查vercel.json配置
当前配置已更新为：
```json
{
  "version": 2,
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/vercel-diagnostic.html",
      "dest": "/vercel-diagnostic.html"
    },
    // ... 其他路由
  ]
}
```

### 方案4: 检查环境变量
在Vercel Dashboard中确认环境变量：
- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_ENDPOINT`

## 🔧 快速修复步骤

### 步骤1: 上传更新的文件
确保以下文件已上传到GitHub/Vercel：
- ✅ `api/hello.js` (新增的简单测试端点)
- ✅ `vercel-diagnostic.html` (诊断工具)
- ✅ 更新的 `vercel.json`

### 步骤2: 强制重新部署
在Vercel Dashboard中：
1. 进入项目设置
2. 点击 "Redeploy"
3. 选择最新的commit
4. 点击 "Redeploy"

### 步骤3: 测试API端点
部署完成后，按顺序测试：
1. `/api/hello` - 最简单的端点
2. `/api/check-env` - 环境变量检查
3. `/api/test-env` - 详细测试
4. `/api/openai` - OpenAI代理

## 📱 测试页面
使用以下页面进行测试：
- `vercel-diagnostic.html` - 完整诊断工具
- `api-test-simple.html` - 简单API测试
- `debug-api.html` - API调试
- `basic-test.html` - 基础连接测试

## 🚨 常见问题解决

### 问题1: "Function not found"
**原因**: API文件路径错误或未正确部署
**解决**: 检查文件是否在 `api/` 文件夹中，文件名是否正确

### 问题2: "Internal Server Error" (500)
**原因**: API代码语法错误或环境变量缺失
**解决**: 检查API文件语法，确认环境变量已配置

### 问题3: CORS错误
**原因**: 跨域请求被阻止
**解决**: 确认API文件中已设置正确的CORS头

### 问题4: 部署成功但API仍404
**原因**: Vercel缓存或CDN延迟
**解决**: 等待5-10分钟，或清空浏览器缓存

## 📞 支持联系
如果问题持续存在：
1. 导出诊断工具的完整结果
2. 提供Vercel部署日志
3. 确认具体的错误信息和复现步骤

---

**更新时间**: ${new Date().toISOString()}
**版本**: v2.0
