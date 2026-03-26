# bazi-skill

八字命理排盘与分析工具 - 中国传统命理学八字排盘系统

## 简介

`bazi-skill` 是一个专业的八字命理排盘工具，支持：

- 八字排盘（四柱计算）
- 十神关系分析
- 五行统计
- 旺衰判断

## 安装

```bash
npm install bazi-skill
```

## 快速开始

```typescript
import { paiPan, paiPanString } from 'bazi-skill';

// 输入出生时间（公历）
const birthTime = {
  year: 1984,
  month: 2,
  day: 15,
  hour: 8,
};

// 获取排盘结果
const result = paiPan(birthTime);

// 获取格式化输出
const output = paiPanString(birthTime);
console.log(output);
```

## API文档

### paiPan(birthTime)

计算八字排盘，返回完整的排盘结果对象。

```typescript
const result = paiPan({
  year: 1984,   // 公历年份
  month: 2,     // 公历月份（1-12）
  day: 15,      // 公历日期（1-31）
  hour: 8,      // 小时（0-23）
});
```

### paiPanString(birthTime)

计算八字排盘，返回格式化的字符串输出。

```typescript
const output = paiPanString({
  year: 1984,
  month: 2,
  day: 15,
  hour: 8,
});
```

## 项目结构

```
bazi-skill/
├── src/
│   ├── index.ts           # 主入口
│   ├── types/             # TypeScript类型定义
│   ├── data/              # 基础数据（天干、地支、五行、十神）
│   ├── calendar/          # 日历计算（干支、节气）
│   └── bazi/              # 八字排盘核心
├── tests/                 # 测试用例
├── SKILL.md               # Claude Skill定义
└── README.md              # 项目说明
```

## 开发

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 构建项目
npm run build
```

## 测试

```bash
npm test
```

测试覆盖率要求：
- 分支覆盖率 > 80%
- 函数覆盖率 > 80%
- 行覆盖率 > 80%

## 许可证

MIT

## 贡献

欢迎提交Issue和Pull Request。

## 参考资料

- 《渊海子平》
- 《三命通会》
- 《滴天髓》
- 《子平真诠》
