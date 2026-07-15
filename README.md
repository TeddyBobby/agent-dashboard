# Agent Dashboard 🤖 / Agent 监控面板

多 Agent 实时监控面板 —— 追踪 Token 消耗、工具调用、会话历史和 Agent 状态。

> A real-time monitoring dashboard for AI agents — track token usage, tool calls, session history, and agent status at a glance.

![Agent Dashboard](public/screenshot.png)

## ✨ 功能 Features

- **Agent 状态卡片 Status Cards** — 在线/繁忙/空闲/离线，含模型、会话数、Token 数、运行时长
- **Token 消耗图表 Token Charts** — 7 天输入/输出 Token 可视化条形图
- **工具使用分析 Tool Analytics** — 各工具调用频率分布
- **会话列表 Session Table** — 可搜索、可按 Agent 筛选的会话历史
- **Agent 筛选 Filtering** — 点击 Agent 卡片即可筛选该 Agent 的会话
- **暗色模式 Dark Mode**

## 🚀 快速开始 Quick Start

```bash
git clone https://github.com/TeddyBobby/agent-dashboard.git
cd agent-dashboard
npm install
npm run dev
```

## 🔌 接入真实数据 Integrating Your Data

将 `src/lib/types.ts` 中的 demo 数据生成器替换为 API 调用：

```typescript
// 替换前 Before：
const [agents] = useState(() => generateDemoAgents());

// 替换后 After：
useEffect(() => {
  fetch('/api/agents').then(r => r.json()).then(setAgents);
}, []);
```

兼容任何暴露指标的 Agent 框架 —— Hermes Agent、LangChain、AutoGPT 等。

## 📊 监控指标 Metrics Tracked

| 指标 Metric | 说明 Description |
|------------|-----------------|
| Sessions | 每个 Agent 的会话总数 |
| Tokens | 输入 + 输出 Token 消耗 |
| Tool Calls | 工具调用次数 |
| Uptime | Agent 运行时长 |
| Messages | 每次会话的消息数 |
| Last Active | 最近活跃时间 |

## 🏗️ 技术栈 Tech Stack

| 层 Layer | 技术 Technology |
|----------|---------------|
| 框架 Framework | Next.js 14 (App Router) |
| 语言 Language | TypeScript |
| 样式 Styling | Tailwind CSS |
| 图表 Charts | 纯 CSS（零图表库依赖） |
| 状态 State | React useState |

## 🤝 贡献 Contributing

欢迎 PR！大改动请先开 issue。

## 📄 许可 License

MIT © [TeddyBobby](https://github.com/TeddyBobby)
