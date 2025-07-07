# AI PPT组件生成器

一个基于AI技术的智能PPT组件生成工具，支持多种组件类型和剪贴板图片识别功能。

## 🌟 功能特色

- 🎯 **智能组件生成** - 支持图标列表、简约列表、数据表格、柱状图表、优劣对比等5种组件
- 📋 **剪贴板识别** - 支持从剪贴板图片中智能识别文字内容
- 🎲 **示例演示** - 提供随机示例功能，快速了解各组件效果
- 🎨 **专业设计** - 现代化UI设计，支持深色主题
- ⚡ **即时预览** - 实时生成预览，所见即所得

## 🛠 技术栈

- HTML5 + CSS3 + JavaScript (ES6+)
- Azure OpenAI API (GPT-4o)
- Font Awesome 图标库
- Tailwind CSS 样式框架
- Vercel Serverless Functions (API代理)

## � 安全特性

- ✅ API密钥安全存储（环境变量）
- ✅ Serverless Function API代理
- ✅ 前端代码不包含敏感信息
- ✅ 跨域请求安全处理

## �🚀 部署到Vercel

本项目已配置Vercel部署支持：

1. 将项目推送到GitHub仓库
2. 在Vercel中导入该仓库
3. 配置环境变量：
   - `AZURE_OPENAI_API_KEY`: 您的Azure OpenAI API密钥
   - `AZURE_OPENAI_ENDPOINT`: Azure OpenAI服务端点
4. 自动部署完成

详细部署指南请参考 [DEPLOY.md](DEPLOY.md)

## 📖 使用方法

1. 在输入框中描述您想要制作的PPT内容
2. 选择合适的组件类型
3. 点击"生成预览"按钮
4. 查看生成的专业PPT组件

## 📋 版本历史

### v3.0 (2025-07-06) - 当前版本
- ✅ 产品名称更新：更名为"AI PPT组件生成器"
- ✅ Demo案例优化：每个组件精选1个示例，项目数量规范化
- ✅ 用户体验提升：界面精简，交互优化，文案简化
- ✅ 默认组件调整：改为默认选择"图标列表"组件
- ✅ 新增剪贴板识别功能：支持从图片中智能识别文字
- ✅ 简化示例区域：移到标题右侧，仅保留核心元素
- ✅ **API安全升级**：使用Vercel Serverless Function代理，确保API密钥安全

### v2.0
- 增加多组件支持，优化AI生成算法

### v1.0
- 基础版本发布

### 可用回滚版本
- **v1.0**: `rollback_to_v1.0.bat` (基础功能版本)
- **v2.0**: `rollback_to_v2.0.bat` (样式定制移除版)
- **v3.0**: `rollback_to_v3.0.bat` (当前版本)

### 版本备份
- `backup_2025-07-06_version1/` - v1.0完整备份
- `backup_2025-07-06_version2/` - v2.0完整备份
- `backup_2025-07-06_version3/` - v3.0完整备份

详细版本信息请查看各备份目录中的VERSION_INFO文档。
