# 重庆产品出海机会探索器

《跨境电商实践》第一周使用的单页互动教学工具。学生通过 5 个步骤完成一次市场观察，并生成适合截图或打印的《重庆产品出海机会卡》。

## 本地预览

项目不需要安装依赖。可以直接打开 `index.html`，也可以在项目目录启动静态服务器：

```bash
python3 -m http.server 8000
```

然后访问 <http://localhost:8000>。

## 部署

这是纯静态网站，可直接部署到 GitHub Pages、Netlify、Vercel 或学校的静态网站服务器。以 GitHub Pages 为例：

1. 将仓库推送到 GitHub；
2. 打开仓库 **Settings → Pages**；
3. 在 **Build and deployment** 中选择 **Deploy from a branch**；
4. 选择主分支和 `/ (root)`，保存后等待生成公开网址。

## 数据说明

填写内容仅保存在学生当前浏览器的 `localStorage` 中，不会上传到服务器。点击“重新开始”并确认后会清空。
