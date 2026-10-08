# 📜 bazi-skill

**传统八字命理与时家奇门遁甲智能推演系统 (BaZi & QiMen Engine & Skill)**

支持四柱八字排盘、真太阳时经纬度校准、十神旺衰、顺逆大运流年、格局判定；时家奇门遁甲九宫排盘（拆补法：阴阳遁局、符使定位、八门九星八神、奇仪格局、空亡驿马）；内置六大正统古籍原典文库与 AI Agent 智能推演规范。

---

## ✨ 核心特性

- 🧮 **纯原生 Python 算法引擎 (`scripts/bazi_engine.py`)**：
  - 零外部第三方依赖（免安装任何三方库），基于 Python 3.8+ 标准库。
  - 内置全国 360+ 地级市及重点区县经纬度坐标库，支持自动去除行政区划后缀模糊匹配，真太阳时精确校准。
  - 太阳黄经天文算法（精确至分秒级节气交节时刻），支持严格依时分秒换令的四柱八字排盘与拆补法时家奇门定局。
  - 两地大圆距离与真北方位角（Bearing）计算，映射二十四山与后天八卦方位。
  - 时家奇门遁甲（拆补法）阴阳遁定局、旬首符使定位、九宫飞布、八门九星八神、奇仪格局、空亡驿马，内置 CJK 宽字符等宽对齐算法与 Unicode 九宫格渲染。
  - 完整单元测试套件（`tests/`），严格 TDD 闭环驱动与回归校验。
- 📚 **六大正统宗经古籍全文库 (`references/`)**：
  - 《子平真诠》（沈孝瞻 · 格局派至尊圣经）
  - 《穷通宝鉴》（余春台 · 调候派圣经）
  - 《三命通会》（万民英 · 钦定大百科全书，六十日时断语）
  - 《滴天髓阐微》（任铁樵 · 理气派最高峰）
  - 《神峰通考》（张楠 · 动静病药开山）
  - 《渊海子平》（徐大升 · 开山宗经与经典赋文）
- 🤖 **AI Agent 规范 (`SKILL.md`)**：
  - 符合 Antigravity / Claude Agent 规范的标准化推演四步法（时空经纬校准 ➔ 引擎精确排盘 ➔ 古典原典考据 ➔ 现实赋能输出）与实战断事秘钥。

---

## 🚀 命令行快速使用

```bash
# 1. 运行完整单元测试套件
pytest tests/

# 2. 四柱八字排盘 (指定公历时间、性别、城市真太阳时校准)
python scripts/bazi_engine.py --bazi "1990-05-20 14:30:00" --gender male --city "北京"

# 3. 时家奇门遁甲起局 (当前当下时间起局，或指定历史/未来时间)
python scripts/bazi_engine.py --qimen now
python scripts/bazi_engine.py --qimen "2026-10-05 17:36:00"

# 4. 两地地理方位角与大圆距离测算 (用于异地求职、择校、择吉)
python scripts/bazi_engine.py --bearing "北京" "上海"
```

---

## 📂 项目结构

```text
bazi-skill/
├── SKILL.md               # AI Agent 推演规范与断事秘钥
├── README.md              # 项目文档说明
├── LICENSE                # MIT 开源许可证
├── .gitignore             # Git 忽略配置
├── scripts/
│   └── bazi_engine.py     # Python 算法引擎（八字大运 + 拆补奇门 + 天文节气 + 方位测算）
├── tests/                 # 单元测试与回归套件 (pytest)
│   ├── test_render.py     # 宽字符等宽九宫格渲染测试
│   ├── test_cities.py     # 360+ 城市坐标与真太阳时匹配测试
│   ├── test_solar_terms.py# 天文历算时分秒交节精度测试
│   └── test_regression.py # 经典排盘历史回归校验
└── references/            # 六大正统古籍原典文库
    ├── ziping_zhenquan/   # 《子平真诠》
    ├── qiongtong_baojian/ # 《穷通宝鉴》
    ├── sanming_tonghui/   # 《三命通会》
    ├── ditiansui_chanwei/ # 《滴天髓阐微》
    ├── shenfeng_tongkao/  # 《神峰通考》
    └── yuanhai_ziping/    # 《渊海子平》
```


---

## 📄 许可证

MIT License
