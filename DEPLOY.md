# Vercel部署指南

## 📋 部署前准备

确保您的项目目录包含以下文件：
- `ai-ppt-generator.html` (主应用文件)
- `api/openai.js` (Serverless Function API代理)
- `vercel.json` (Vercel配置文件)
- `package.json` (项目配置文件)
- `README.md` (项目说明文档)

## 🔐 API安全配置

**重要**: 本项目已升级API安全机制，使用Vercel Serverless Function作为API代理，确保API密钥安全存储。

### 环境变量配置

在Vercel后台（Dashboard）中设置以下环境变量：

1. **AZURE_OPENAI_API_KEY**: 您的Azure OpenAI API密钥
2. **AZURE_OPENAI_ENDPOINT**: Azure OpenAI服务端点（例如：`https://your-resource.openai.azure.com`）

**重要说明**：
- `AZURE_OPENAI_ENDPOINT` 应该只包含基础域名，不包含具体的部署路径
- 系统会自动拼接完整的API路径：`/openai/deployments/gpt-4o/chat/completions?api-version=2025-01-01-preview`
- 环境变量配置后需要重新部署才能生效

### 配置步骤

1. 在Vercel项目控制台，进入 "Settings" → "Environment Variables"
2. 添加上述两个环境变量
3. 重新部署项目使配置生效

## 🚀 部署步骤

### 方法一：通过GitHub部署（推荐）

1. **创建GitHub仓库**
   ```bash
   # 初始化Git仓库
   git init
   
   # 添加所有文件
   git add .
   
   # 提交代码
   git commit -m "Initial commit: AI PPT组件生成器 v3.0"
   
   # 添加远程仓库（替换为您的GitHub仓库地址）
   git remote add origin https://github.com/your-username/ai-ppt-generator.git
   
   # 推送到GitHub
   git push -u origin main
   ```

2. **在Vercel中部署**
   - 访问 [vercel.com](https://vercel.com)
   - 使用GitHub账户登录
   - 点击 "New Project"
   - 选择您的GitHub仓库
   - 点击 "Deploy"

### 方法二：通过Vercel CLI部署

1. **安装Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   # 在项目目录中运行
   vercel
   
   # 首次部署时会询问一些配置问题：
   # - Set up and deploy? [Y/n] -> Y
   # - Which scope? -> 选择您的账户
   # - Link to existing project? [y/N] -> N
   # - What's your project's name? -> ai-ppt-generator
   # - In which directory? -> ./
   # - Override settings? [y/N] -> N
   ```

## ⚙️ 配置说明

### vercel.json 配置文件
```json
{
  "version": 2,
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    },
    {
      "src": "api/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/ai-ppt-generator.html"
    }
  ]
}
```

这个配置的作用：
- `builds`: 告诉Vercel将HTML文件作为静态资源处理，API文件作为Node.js函数处理
- `routes`: 配置API路由和页面重定向

## 🔗 部署后访问

部署成功后，您会获得一个类似这样的URL：
- `https://ai-ppt-generator.vercel.app`
- `https://ai-ppt-generator-username.vercel.app`

## 🔄 更新部署

当您对代码进行修改后：

1. **GitHub方式更新**
   ```bash
   git add .
   git commit -m "更新说明"
   git push
   ```
   推送后Vercel会自动重新部署

2. **CLI方式更新**
   ```bash
   vercel --prod
   ```

## 🛠 自定义域名（可选）

如果您有自己的域名：

1. 在Vercel控制台中选择您的项目
2. 进入 "Settings" -> "Domains"
3. 添加您的自定义域名
4. 按照提示配置DNS记录

## ⚠️ 注意事项

1. **API安全**: ✅ 已升级API安全机制
   - API密钥通过环境变量安全存储
   - 使用Vercel Serverless Function作为API代理
   - 前端代码不包含任何敏感信息

2. **环境变量**: 确保在Vercel后台正确配置API密钥和端点

3. **CORS配置**: API代理已处理跨域问题

4. **性能优化**: 可以考虑启用Vercel的Edge Functions来提升访问速度

## 🔍 故障排除

1. **API调用失败**
   - 检查环境变量是否正确设置
   - 确认Azure OpenAI服务状态
   - 查看Vercel Function日志

2. **部署失败**
   - 检查 `vercel.json` 语法
   - 确认文件路径正确
   - 检查依赖项是否完整

3. **功能测试**
   - 测试PPT组件生成功能
   - 检查剪贴板图片识别功能
   - 确认API调用正常工作

## 📞 技术支持

如果在部署过程中遇到问题：
- 查看Vercel的部署日志
- 检查vercel.json配置是否正确
- 确认所有必要文件都已提交到仓库
