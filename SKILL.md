---
name: bazi
description: 八字命理排盘与分析工具 - 输入出生时间，自动计算四柱八字、十神关系、五行旺衰
origin: bazi-skill
---

# 八字命理Skill

中国传统命理学八字排盘系统，支持**公历/农历转换**、**真太阳时计算**、节气计算、十神分析、五行统计。

## When to Activate

- 用户询问八字命理相关内容
- 需要提供八字排盘服务
- 分析命局格局、身强身弱
- 查询干支、五行、十神关系
- 计算四柱（年柱、月柱、日柱、时柱）
- **农历转公历排盘**
- **真太阳时计算排盘**

## 核心功能

### 1. 八字排盘（真太阳时）

**重要说明**：八字排盘使用**真太阳时**（地方时），这是传统八字命理的标准做法。无论输入公历还是农历，系统都会自动转换为真太阳时进行排盘。

- 如果提供出生地点 → 按该地点经度计算真太阳时
- 如果未提供出生地点 → 默认使用北京时间（东经120°）

```typescript
import { paiPan, paiPanString } from 'bazi-skill';

// 方式1：公历输入（默认使用北京时间真太阳时）
const birthTime1 = {
  year: 1984,
  month: 2,
  day: 15,
  hour: 8,
};

// 方式2：农历输入（自动转公历，再转真太阳时）
const birthTime2 = {
  year: 1984,
  month: 1,  // 农历正月
  day: 15,   // 农历十五
  hour: 8,
  isLunar: true,
};

// 方式3：指定出生地点计算真太阳时
const birthTime3 = {
  year: 1990,
  month: 5,
  day: 15,
  hour: 12,
  location: { cityName: '成都' },  // 成都约东经104°，比北京时间晚约64分钟
};

// 获取排盘结果
const result = paiPan(birthTime3);
console.log(result.conversions);  // 查看时间转换过程

// 获取格式化字符串
const output = paiPanString(birthTime3);
console.log(output);
```

**输出示例（带真太阳时转换）：**
```
═══════════════════════════════════════════════════════════
                        时 间 转 换
═══════════════════════════════════════════════════════════
  • 出生地点：成都（经度：104.07°E）
  • 标准时间 12:00 → 真太阳时 10:54（调整-1小时6分钟）
╔════════════════════════════════════════════════════════╗
║                     八 字 排 盘                         ║
╠════════════════════════════════════════════════════════╣
║  四柱    │    年柱    │    月柱    │    日柱    │    时柱    ║
╠══════════╪════════════╪════════════╪════════════╪════════════╣
║  天干    │    庚      │    辛      │    壬（日主）│    辛      ║
╠══════════╪════════════╪════════════╪════════════╪════════════╣
║  地支    │    午      │    巳      │    辰      │    丑      ║
╚════════════════════════════════════════════════════════╝
```

**真太阳时原理：**
- 中国标准时间以**东经120°**为基准
- 每偏离1°经度，时间差4分钟
- 东边（经度>120°）时间比北京时间早，西边（经度<120°）时间比北京时间晚
- 北京（东经116°）：比北京时间晚约16分钟
- 上海（东经121°）：比北京时间早约4分钟
- 成都（东经104°）：比北京时间晚约64分钟
- 乌鲁木齐（东经87°）：比北京时间晚约132分钟

### 2. 农历转换支持（1900-2100年）

```typescript
import { lunarToSolar } from 'bazi-skill';

// 农历1990年正月十五转公历
const solarDate = lunarToSolar({
  year: 1990,
  month: 1,
  day: 15,
  isLeap: false,
});

console.log(solarDate);  // { year: 1990, month: 2, day: 10 }
```

### 4. 十神分析

以日主（日干）为中心，计算各天干与日主的关系：

```typescript
import { calculateShiShen } from 'bazi-skill';

// 日主为甲，计算其他天干与甲的十神关系
const riGan = '甲';
const otherGan = '乙';

const shiShen = calculateShiShen(riGan, otherGan);
console.log(shiShen); // "劫财"
```

**十神对照表（以甲、乙为例）：**

| 目标天干 | 甲日主 | 乙日主 |
|---------|--------|--------|
| 甲 | 比肩 | 劫财 |
| 乙 | 劫财 | 比肩 |
| 丙 | 食神 | 伤官 |
| 丁 | 伤官 | 食神 |
| 戊 | 偏财 | 正财 |
| 己 | 正财 | 偏财 |
| 庚 | 七杀 | 正官 |
| 辛 | 正官 | 七杀 |
| 壬 | 偏印 | 正印 |
| 癸 | 正印 | 偏印 |

### 3. 五行统计

统计八字中五行的分布：

```typescript
const result = paiPan(birthTime);
console.log(result.wuXing.count);
// { "木": 2, "火": 1, "土": 3, "金": 0, "水": 2 }
```

### 4. 旺衰判断

根据日主与月支的关系，判断身强身弱：

```typescript
const result = paiPan(birthTime);
console.log(result.wuXing.wangShuai);
// "身旺" | "身弱" | "身衰" | "平和"
```

**判断逻辑：**
- 月支与日主同五行 → 身旺
- 月支生我（印）→ 身旺
- 月支克我（官杀）→ 身弱
- 我克月支（财）→ 身衰
- 我生月支（食伤）→ 身衰

## 数据结构

### BirthTime（出生时间）

```typescript
interface BirthTime {
  year: number;       // 年份，如1984
  month: number;      // 月份，1-12
  day: number;        // 日期，1-31
  hour: number;       // 小时，0-23
  minute?: number;    // 分钟，可选，默认0
  isLunar?: boolean;  // 是否为农历，默认false
  isFemale?: boolean; // 性别（用于大运计算），可选
  location?: {        // 出生地点（用于真太阳时计算），可选
    longitude?: number;  // 经度，东经为正，西经为负（-180到180）
    latitude?: number;   // 纬度，可选
    cityName?: string;   // 城市名称，可选，支持50+中国城市
  };
}
```

### PaiPanResult（排盘结果）

```typescript
interface PaiPanResult {
  baZi: {
    siZhu: {
      nianZhu: { gan: string, zhi: string },  // 年柱
      yueZhu: { gan: string, zhi: string },   // 月柱
      riZhu: { gan: string, zhi: string },    // 日柱
      shiZhu: { gan: string, zhi: string },   // 时柱
    },
    riZhu: { gan: string, zhi: string },      // 日主
  };
  shiShen: {
    tianGan: {
      nianGan: string,  // 年干十神
      yueGan: string,   // 月干十神
      shiGan: string,   // 时干十神
    },
    diZhiCangGan: {
      // 地支藏干及其十神
      nianZhi: [{ gan: string, shiShen: string }],
      yueZhi: [{ gan: string, shiShen: string }],
      riZhi: [{ gan: string, shiShen: string }],
      shiZhi: [{ gan: string, shiShen: string }],
    },
  };
  wuXing: {
    count: { [key: string]: number },  // 五行计数
    wangShuai: string,                 // 旺衰判断
  };
  conversions?: string[];  // 时间转换信息（农历转公历、真太阳时调整等）
}
```

## 天干地支数据

### 十天干

| 天干 | 阴阳 | 五行 |
|------|------|------|
| 甲 | 阳 | 木 |
| 乙 | 阴 | 木 |
| 丙 | 阳 | 火 |
| 丁 | 阴 | 火 |
| 戊 | 阳 | 土 |
| 己 | 阴 | 土 |
| 庚 | 阳 | 金 |
| 辛 | 阴 | 金 |
| 壬 | 阳 | 水 |
| 癸 | 阴 | 水 |

### 十二地支

| 地支 | 阴阳 | 五行 | 生肖 | 藏干 |
|------|------|------|------|------|
| 子 | 阳 | 水 | 鼠 | 癸 |
| 丑 | 阴 | 土 | 牛 | 己、癸、辛 |
| 寅 | 阳 | 木 | 虎 | 甲、丙、戊 |
| 卯 | 阴 | 木 | 兔 | 乙 |
| 辰 | 阳 | 土 | 龙 | 戊、乙、癸 |
| 巳 | 阴 | 火 | 蛇 | 丙、庚、戊 |
| 午 | 阳 | 火 | 马 | 丁、己 |
| 未 | 阴 | 土 | 羊 | 己、丁、乙 |
| 申 | 阳 | 金 | 猴 | 庚、壬、戊 |
| 酉 | 阴 | 金 | 鸡 | 辛 |
| 戌 | 阳 | 土 | 狗 | 戊、辛、丁 |
| 亥 | 阴 | 水 | 猪 | 壬、甲 |

## 算法说明

### 年柱计算

以1984年（甲子年）为基准，使用60甲子循环计算。

**注意：** 年柱以立春为分界线，立春前属于上一年。

### 月柱计算

月柱以节气为分界：
- 正月：立春（约2月4日）
- 二月：惊蛰（约3月6日）
- 三月：清明（约4月5日）
- ...以此类推

月干使用"五虎遁月"算法：
- 甲己之年丙作首
- 乙庚之岁戊为头
- 丙辛之岁寻庚起
- 丁壬壬位顺行流
- 若言戊癸何方发，甲寅之上好追求

### 日柱计算

以1900年1月31日（甲辰日）为基准，计算日期差。

### 时柱计算

时辰划分（每2小时一个时辰）：
- 子时：23:00-01:00
- 丑时：01:00-03:00
- 寅时：03:00-05:00
- ...以此类推

时干使用"五鼠遁时"算法：
- 甲己还加甲
- 乙庚丙作初
- 丙辛从戊起
- 丁壬庚子居
- 戊癸何方发，壬子是真途

## 十神详解

### 同我

- **比肩**：与我五行相同，阴阳相同。代表自己、兄弟、朋友。
- **劫财**：与我五行相同，阴阳不同。代表竞争、争夺、花费。

### 我生

- **食神**：我生之五行，阴阳相同。代表才华、口福、享受。
- **伤官**：我生之五行，阴阳不同。代表才华、创新、叛逆。

### 我克

- **正财**：我克之五行，阴阳不同。代表正当收入、稳定财富、妻子。
- **偏财**：我克之五行，阴阳相同。代表意外之财、投机、父亲。

### 克我

- **正官**：克我之五行，阴阳不同。代表职位、权力、名誉、丈夫（女命）。
- **七杀**：克我之五行，阴阳相同。代表压力、挑战、权威。

### 生我

- **正印**：生我之五行，阴阳不同。代表学业、母亲、贵人、文书。
- **偏印**：生我之五行，阴阳相同。代表偏门学问、继母、孤独。

## 使用示例

### 示例1：基础排盘

```typescript
import { paiPanString } from 'bazi-skill';

const result = paiPanString({
  year: 1990,
  month: 5,
  day: 15,
  hour: 10,
});

console.log(result);
```

### 示例2：分析五行

```typescript
import { paiPan } from 'bazi-skill';

const result = paiPan({
  year: 1990,
  month: 5,
  day: 15,
  hour: 10,
});

const wuXing = result.wuXing.count;
const maxWuxing = Object.entries(wuXing)
  .sort((a, b) => b[1] - a[1])[0];

console.log(`最旺的五行是：${maxWuxing[0]}，共${maxWuxing[1]}个`);
```

### 示例3：查看十神

```typescript
import { paiPan } from 'bazi-skill';

const result = paiPan({
  year: 1990,
  month: 5,
  day: 15,
  hour: 10,
});

const shiShen = result.shiShen.tianGan;
console.log(`年干十神：${shiShen.nianGan}`);
console.log(`月干十神：${shiShen.yueGan}`);
console.log(`时干十神：${shiShen.shiGan}`);
```

## 检查清单

使用本Skill进行八字排盘时，请检查：

- [x] 出生时间是公历还是农历（**已支持**）
- [x] 是否考虑真太阳时（出生地与北京时间经度差）（**已支持**）
- [ ] 时间是否准确（特别是跨节气的时间）
- [ ] 性别信息（用于后续大运计算）
- [ ] 出生地点（用于精确节气计算）

## 注意事项

1. **节气精确度**：当前使用简化节气日期（约数），精确度在1天内。如需更高精度，需使用天文算法。

2. **真太阳时**：已支持真太阳时计算，八字排盘自动使用出生地的真太阳时，而非标准时区时间。可通过 `cityName` 或 `longitude` 指定出生地点。

3. **早晚子时**：关于23:00-00:00的日柱归属，不同流派有不同处理方式。当前实现23:00属于当天子时。

4. **范围限制**：当前支持1900-2100年的排盘计算。

5. **农历闰月**：目前农历转换默认非闰月，如需指定闰月，请使用 `lunarToSolar` 函数并设置 `isLeap: true`。

## 待实现功能

- [x] 农历转公历（**已实现**）
- [x] 真太阳时换算（**已实现**）
- [ ] 精确节气计算（天文算法）
- [ ] 大运推算
- [ ] 流年推算
- [ ] 神煞计算
- [ ] 刑冲合害分析

## 参考资料

- 《渊海子平》
- 《三命通会》
- 《滴天髓》
- 《子平真诠》
