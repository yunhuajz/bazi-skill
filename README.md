# 📜 bazi-skill

**传统八字命理与时家奇门遁甲智能推演系统 (BaZi & QiMen Engine & Skill)**

支持四柱八字排盘、真太阳时经纬度校准、十神旺衰、顺逆大运流年、格局判定；时家奇门遁甲九宫排盘（拆补法：阴阳遁局、符使定位、八门九星八神、奇仪格局、空亡驿马）；以及内置六大正统古籍原典文库与 AI Agent 智能推演规范。

---

## ✨ 核心特性

- 🧮 **双引擎支持**：
  - **Python 纯原生免依赖引擎 (`scripts/bazi_engine.py`)**：支持真太阳时校准、大圆方位角（Bearing）、四柱大运、时家奇门遁甲（拆补法）九宫字符画排盘。
  - **TypeScript / Node.js 库 (`src/`)**：轻量级 NPM 模块，支持快速在前端/服务端集成排盘 API。
- 📚 **六大正统古籍文库 (`references/`)**：
  - 《子平真诠》（沈孝瞻 · 格局派至尊圣经）
  - 《穷通宝鉴》（余春台 · 调候派圣经）
  - 《三命通会》（万民英 · 钦定大百科全书，六十日时断语）
  - 《滴天髓阐微》（任铁樵 · 理气派最高峰）
  - 《神峰通考》（张楠 · 动静病药开山）
  - 《渊海子平》（徐大升 · 开山宗经与经典赋文）
- 🤖 **AI Agent 规范 (`SKILL.md`)**：
  - 符合 Antigravity / Claude Agent 规范的标准化推演四步法（时空经纬校准 ➔ 引擎精确排盘 ➔ 古典原典考据 ➔ 现实赋能输出）。

---

## 🚀 快速使用 (Python 引擎)

Python 引擎无需安装额外第三方库，标准 Python 3.8+ 即可运行：

```bash
# 1. 四柱八字排盘 (指定出生公历时间、性别、城市真太阳时校准)
python scripts/bazi_engine.py --bazi "2003-11-04 10:40:34" --gender male --city "济南"

# 2. 时家奇门遁甲排盘 (当下时间起局或指定历史/未来时间)
python scripts/bazi_engine.py --qimen now
python scripts/bazi_engine.py --qimen "2026-09-29 13:26:00"

# 3. 两地地理方位角与大圆距离测算 (用于异地求职、择校、择吉)
python scripts/bazi_engine.py --bearing "北京" "上海"
```

---

## 📦 TypeScript / Node.js 库使用

```bash
npm install bazi-skill
```

```typescript
import { paiPan, paiPanString } from 'bazi-skill';

// 输入出生时间（公历）
const birthTime = {
  year: 1998,
  month: 10,
  day: 15,
  hour: 14,
};

// 获取结构化排盘数据
const result = paiPan(birthTime);

// 获取控制台格式化输出
const output = paiPanString(birthTime);
console.log(output);
```

---

## 📂 项目结构

```text
bazi-skill/
├── SKILL.md               # AI Agent 推演规范与断事秘钥
├── README.md              # 项目文档说明
├── scripts/
│   └── bazi_engine.py     # Python 算法引擎（八字大运 + 拆补奇门 + 方位测算）
├── references/            # 六大正统古籍文库
│   ├── ziping_zhenquan/   # 《子平真诠》
│   ├── qiongtong_baojian/ # 《穷通宝鉴》
│   ├── sanming_tonghui/   # 《三命通会》
│   ├── ditiansui_chanwei/ # 《滴天髓阐微》
│   ├── shenfeng_tongkao/  # 《神峰通考》
│   └── yuanhai_ziping/    # 《渊海子平》
├── src/                   # TypeScript 源码
│   ├── index.ts
│   ├── types/
│   ├── data/
│   ├── calendar/
│   └── bazi/
├── tests/                 # 测试用例
├── package.json
└── tsconfig.json
```

---

## 🛠️ TypeScript 开发与测试

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 构建项目
npm run build
```

---

## 📄 许可证

MIT License
