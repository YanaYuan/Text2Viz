@echo off
echo =================================
echo    Vercel API 修复部署脚本
echo =================================
echo.

echo 1. 检查Git状态...
git status

echo.
echo 2. 添加所有文件到Git...
git add .

echo.
echo 3. 提交更改...
git commit -m "修复Vercel API 404问题 - 添加hello.js测试端点和完整诊断工具"

echo.
echo 4. 推送到远程仓库...
git push origin main

echo.
echo ✅ 部署完成！
echo.
echo 📋 接下来请：
echo 1. 等待3-5分钟让Vercel完成部署
echo 2. 访问你的vercel-diagnostic.html页面进行测试
echo 3. 检查以下API端点是否正常：
echo    - /api/hello
echo    - /api/check-env  
echo    - /api/test-env
echo.
echo 如果仍有问题，请查看 VERCEL_404_TROUBLESHOOTING.md 文件
echo.
pause
