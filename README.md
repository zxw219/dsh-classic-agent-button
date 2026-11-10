# DSH 经典 Agent 模式按钮

在 **Windows 版 DSH 桌面端顶部「编辑」右侧**增加「经典 Agent 模式」按钮。点击后调用 DS Bot 设置页已有的切换操作。已经处于经典 Agent 模式时按钮置灰，返回 DS Bot 后恢复可点击。

独立插件，无额外运行依赖，无需编译，不修改 DSH 安装包或 DS Bot 源码。

## 安装

当前适配 DSH Desktop **0.2.2-rc.1 / Windows** 与 DS Bot **0.3.2**。需要已安装并启用 DS Bot。浏览器版没有桌面菜单锚点，不显示此按钮。

1. 克隆本仓库：

   ```powershell
   git clone https://github.com/zxw219/dsh-classic-agent-button.git
   ```

   也可从 [Releases](https://github.com/zxw219/dsh-classic-agent-button/releases) 下载安装包。
2. 在目标 DSH 桌面版对话中，让 Agent 安装本地插件：

   ```text
   请安装本地插件 C:\path\to\dsh-classic-agent-button 并启用。
   ```

   工具操作为 `plugin_manager`，`action: "install_bundle"`，`target` 填仓库本地绝对路径。

3. 加载更新后的客户端页面，在「编辑」右侧查看按钮。安装器若明确提示需要重启，请按提示完全退出桌面端后重新打开。
4. 进入 DS Bot 模式，点击一次按钮，确认切换到经典 Agent 模式。

## 实现与兼容性

按钮由插件自身创建，挂载在页面 body。位置跟随桌面菜单 `[data-windows-menu]` 的右边缘，避免 DS Bot 自有侧栏覆盖底部插槽。样式仅作用于插件自己的类名，禁用插件时移除按钮、样式、订阅与观察器。

通过 DS Bot 已有 `bot-return` 插槽入口的注入数据调用 `actions.setSurface('agent')`，与「设置 → 通用 → 经典 Agent 模式 → 切换」使用同一动作。不会模拟点击工作区空白处、选择其他会话或自行写入模式存储。

**兼容性限制：** DS Bot 尚未公开专用切换服务，桌面标题栏也尚未公开对应插槽。插件依赖上述内部锚点及注入结构；未来版本变更可能需要适配。缺少菜单锚点或 DS Bot 接口时隐藏按钮。

## 开发与发布

```powershell
npm run check
npm pack --dry-run
npm pack
```

源码仓库：https://github.com/zxw219/dsh-classic-agent-button 。包名为 `dsh-classic-agent-button`，当前版本 **0.1.1**。GitHub Release 提供安装包；尚未发布到 npm。

采用 MIT 许可证。client.js 是直接加载的源码，无构建产物需要同步。

## 更新记录

- **0.1.1**：移到 Windows 桌面标题栏「编辑」右侧；移除旧侧栏插槽注册；经典模式时按钮保留并置灰。
- **0.1.0**：初始侧栏方案在 DS Bot 自有侧栏下不可见，不建议使用。
