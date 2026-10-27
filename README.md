# GlenZ Portfolio

静态作品集网站，线上地址：[https://sheldorzhang.github.io/portfolio/](https://sheldorzhang.github.io/portfolio/)

## 本地开发

需要 Node.js 20 或更新版本，无需安装依赖。

```sh
npm run dev
```

打开终端显示的本地地址。需要调整端口时设置 `PORT`，例如 `PORT=4321 npm run dev`。

提交前检查 HTML 页面引用的本地文件：

```sh
npm run check
```

GitHub Actions 会在 Pull Request 和推送到 `main` 时运行同一项检查。

## 发布

网站由 GitHub Pages 从 `main` 分支根目录提供服务。将完成的改动合并或推送到 `main` 后，GitHub Pages 会自动更新线上网站；不需要单独构建，也不要把 `node_modules` 或本地临时文件提交到仓库。可在仓库 **Settings → Pages** 查看当前发布状态和线上地址。

页面、脚本、图片和演示都以仓库根目录为网站根目录。保留 `.nojekyll`，并使用相对路径引用站内资源，以兼容项目页地址。
