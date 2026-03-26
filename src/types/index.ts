// ============================================================================
// 八字命理基础类型定义
// ============================================================================

/** 天干 */
export type Gan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

/** 地支 */
export type Zhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

/** 五行 */
export type WuXing = '木' | '火' | '土' | '金' | '水';

/** 阴阳 */
export type YinYang = '阴' | '阳';

/** 十神 */
export type ShiShen =
  | '比肩' | '劫财'      // 同我
  | '食神' | '伤官'      // 我生
  | '正财' | '偏财'      // 我克
  | '正官' | '七杀'      // 克我
  | '正印' | '偏印';     // 生我

/** 天干属性 */
export interface GanInfo {
  name: Gan;
  yinYang: YinYang;
  wuXing: WuXing;
  position: number;  // 1-10
}

/** 地支属性 */
export interface ZhiInfo {
  name: Zhi;
  yinYang: YinYang;
  wuXing: WuXing;
  shengXiao: string;  // 生肖
  cangGan: Gan[];     // 藏干
  position: number;   // 1-12
}

/** 干支组合 */
export interface GanZhi {
  gan: Gan;
  zhi: Zhi;
}

/** 四柱 */
export interface SiZhu {
  nianZhu: GanZhi;  // 年柱
  yueZhu: GanZhi;   // 月柱
  riZhu: GanZhi;    // 日柱
  shiZhu: GanZhi;   // 时柱
}

/** 八字完整结构 */
export interface BaZi {
  siZhu: SiZhu;
  riZhu: GanZhi;    // 日主（日柱天干）
  ganZhiList: GanZhi[];
}

/** 十神关系映射 */
export interface ShiShenMap {
  [key: string]: ShiShen;
}

/** 出生地点 */
export interface BirthLocation {
  longitude?: number;  // 经度，东经为正，西经为负（-180 到 180），可选
  latitude?: number;  // 纬度，可选（用于未来扩展）
  cityName?: string;  // 城市名称，可选，可通过城市名自动获取经纬度
}

/** 出生时间输入 */
export interface BirthTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  isLunar?: boolean;  // 是否为农历
  isFemale?: boolean; // 性别（用于大运计算）
  location?: BirthLocation; // 出生地点（用于真太阳时计算）
}

/** 节气 */
export interface SolarTerm {
  name: string;
  month: number;      // 1-12
  day: number;
  hour?: number;
  minute?: number;
}

/** 大运 */
export interface DaYun {
  ganZhi: GanZhi;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
}

/** 八字排盘结果 */
export interface PaiPanResult {
  baZi: BaZi;
  shiShen: {
    tianGan: { [key: string]: string };  // 各柱天干的十神
    diZhiCangGan: { [key: string]: { gan: string; shiShen: string }[] };  // 地支藏干的十神
  };
  wuXing: {
    count: { [key in WuXing]: number };
    wangShuai: string;  // 旺衰分析
  };
  dayun?: DaYun[];
}
