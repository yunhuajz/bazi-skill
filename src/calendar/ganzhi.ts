import { Gan, Zhi, GanZhi, SolarTerm } from '../types';
import { TIAN_GAN, GAN_INDEX } from '../data/gan';
import { DI_ZHI, ZHI_INDEX } from '../data/zhi';

/**
 * 六十甲子表
 */
export const LIU_SHIA_JIA_ZI: GanZhi[] = [
  { gan: '甲', zhi: '子' }, { gan: '乙', zhi: '丑' },
  { gan: '丙', zhi: '寅' }, { gan: '丁', zhi: '卯' },
  { gan: '戊', zhi: '辰' }, { gan: '己', zhi: '巳' },
  { gan: '庚', zhi: '午' }, { gan: '辛', zhi: '未' },
  { gan: '壬', zhi: '申' }, { gan: '癸', zhi: '酉' },
  { gan: '甲', zhi: '戌' }, { gan: '乙', zhi: '亥' },
  { gan: '丙', zhi: '子' }, { gan: '丁', zhi: '丑' },
  { gan: '戊', zhi: '寅' }, { gan: '己', zhi: '卯' },
  { gan: '庚', zhi: '辰' }, { gan: '辛', zhi: '巳' },
  { gan: '壬', zhi: '午' }, { gan: '癸', zhi: '未' },
  { gan: '甲', zhi: '申' }, { gan: '乙', zhi: '酉' },
  { gan: '丙', zhi: '戌' }, { gan: '丁', zhi: '亥' },
  { gan: '戊', zhi: '子' }, { gan: '己', zhi: '丑' },
  { gan: '庚', zhi: '寅' }, { gan: '辛', zhi: '卯' },
  { gan: '壬', zhi: '辰' }, { gan: '癸', zhi: '巳' },
  { gan: '甲', zhi: '午' }, { gan: '乙', zhi: '未' },
  { gan: '丙', zhi: '申' }, { gan: '丁', zhi: '酉' },
  { gan: '戊', zhi: '戌' }, { gan: '己', zhi: '亥' },
  { gan: '庚', zhi: '子' }, { gan: '辛', zhi: '丑' },
  { gan: '壬', zhi: '寅' }, { gan: '癸', zhi: '卯' },
  { gan: '甲', zhi: '辰' }, { gan: '乙', zhi: '巳' },
  { gan: '丙', zhi: '午' }, { gan: '丁', zhi: '未' },
  { gan: '戊', zhi: '申' }, { gan: '己', zhi: '酉' },
  { gan: '庚', zhi: '戌' }, { gan: '辛', zhi: '亥' },
  { gan: '壬', zhi: '子' }, { gan: '癸', zhi: '丑' },
  { gan: '甲', zhi: '寅' }, { gan: '乙', zhi: '卯' },
  { gan: '丙', zhi: '辰' }, { gan: '丁', zhi: '巳' },
  { gan: '戊', zhi: '午' }, { gan: '己', zhi: '未' },
  { gan: '庚', zhi: '申' }, { gan: '辛', zhi: '酉' },
  { gan: '壬', zhi: '戌' }, { gan: '癸', zhi: '亥' },
];

/**
 * 获取六十甲子索引
 * @param gan 天干
 * @param zhi 地支
 * @returns 索引（0-59）
 */
export function getJiaZiIndex(gan: Gan, zhi: Zhi): number {
  const ganIndex = GAN_INDEX[gan];
  const zhiIndex = ZHI_INDEX[zhi];

  if (ganIndex === undefined || zhiIndex === undefined) {
    throw new Error(`Invalid gan-zhi combination: ${gan}${zhi}`);
  }

  // 60甲子中，天干地支必须同奇偶才能配对
  if (ganIndex % 2 !== zhiIndex % 2) {
    throw new Error(`Invalid gan-zhi combination: ${gan}${zhi} (奇偶不匹配)`);
  }

  // 计算索引
  for (let i = 0; i < 60; i++) {
    if (LIU_SHIA_JIA_ZI[i].gan === gan && LIU_SHIA_JIA_ZI[i].zhi === zhi) {
      return i;
    }
  }

  throw new Error(`Could not find gan-zhi: ${gan}${zhi}`);
}

/**
 * 根据索引获取六十甲子
 * @param index 索引（0-59）
 * @returns 干支组合
 */
export function getJiaZiByIndex(index: number): GanZhi {
  if (index < 0 || index >= 60) {
    throw new Error(`Index out of range: ${index}`);
  }
  return LIU_SHIA_JIA_ZI[index];
}

/**
 * 根据年份获取年柱干支
 * 以1984年（甲子年）为基准
 * @param year 公历年份
 * @returns 年柱干支
 */
export function getYearGanZhi(year: number): GanZhi {
  // 1984年是甲子年（农历）
  const baseYear = 1984;
  const diff = year - baseYear;
  const index = ((diff % 60) + 60) % 60;
  return LIU_SHIA_JIA_ZI[index];
}

/**
 * 根据年份和节气获取年柱（考虑立春）
 * @param year 公历年份
 * @param month 公历月份
 * @param day 公历日期
 * @returns 年柱干支
 */
export function getYearGanZhiExact(year: number, month: number, day: number): GanZhi {
  // 简化处理：立春一般在2月4日左右
  // 如果日期在立春之前（通常2月4日前），年份减1
  const liChunMonth = 2;
  const liChunDay = 4;

  let actualYear = year;
  if (month < liChunMonth || (month === liChunMonth && day < liChunDay)) {
    actualYear = year - 1;
  }

  return getYearGanZhi(actualYear);
}

/**
 * 五虎遁月 - 根据年干推算月干
 * 甲己之年丙作首，乙庚之岁戊为头
 * 丙辛之岁寻庚起，丁壬壬位顺行流
 * 若言戊癸何方发，甲寅之上好追求
 *
 * @param yearGan 年干
 * @param monthZhi 月支
 * @returns 月干
 */
export function getMonthGan(yearGan: Gan, monthZhi: Zhi): Gan {
  const yearGanIndex = GAN_INDEX[yearGan];
  const monthZhiIndex = ZHI_INDEX[monthZhi];

  if (yearGanIndex === undefined || monthZhiIndex === undefined) {
    throw new Error('Invalid year gan or month zhi');
  }

  // 寅月为正月
  const zhengYueIndex = ZHI_INDEX['寅'];
  const monthOffset = (monthZhiIndex - zhengYueIndex + 12) % 12;

  // 根据年干确定起始月干
  let startGanIndex: number;
  switch (yearGan) {
    case '甲':
    case '己':
      startGanIndex = GAN_INDEX['丙'];
      break;
    case '乙':
    case '庚':
      startGanIndex = GAN_INDEX['戊'];
      break;
    case '丙':
    case '辛':
      startGanIndex = GAN_INDEX['庚'];
      break;
    case '丁':
    case '壬':
      startGanIndex = GAN_INDEX['壬'];
      break;
    case '戊':
    case '癸':
      startGanIndex = GAN_INDEX['甲'];
      break;
    default:
      throw new Error(`Invalid year gan: ${yearGan}`);
  }

  const monthGanIndex = (startGanIndex + monthOffset) % 10;
  return TIAN_GAN[monthGanIndex].name;
}

/**
 * 根据公历日期获取月柱
 * @param year 公历年份
 * @param month 公历月份
 * @param day 公历日期
 * @returns 月柱干支
 */
export function getMonthGanZhi(year: number, month: number, day: number): GanZhi {
  const yearGan = getYearGanZhiExact(year, month, day).gan;

  // 根据节气确定月支
  const monthZhi = getMonthZhiBySolarTerm(year, month, day);
  const monthGan = getMonthGan(yearGan, monthZhi);

  return { gan: monthGan, zhi: monthZhi };
}

/**
 * 根据节气获取月支
 * 简化的节气判断（实际应该用精确算法）
 * @param year 公历年份
 * @param month 公历月份
 * @param day 公历日期
 * @returns 月支
 */
function getMonthZhiBySolarTerm(year: number, month: number, day: number): Zhi {
  // 节气大概日期（简化版）
  // 十二月小寒（1月6日），正月立春（2月4日），二月惊蛰（3月6日）
  // 三月清明（4月5日），四月立夏（5月6日），五月芒种（6月6日）
  // 六月小暑（7月7日），七月立秋（8月8日），八月白露（9月8日）
  // 九月寒露（10月9日），十月立冬（11月7日），十一月大雪（12月7日）

  const solarTerms = [
    { month: 1, day: 6, zhi: '丑' as Zhi },   // 小寒 - 十二月
    { month: 2, day: 4, zhi: '寅' as Zhi },   // 立春 - 正月
    { month: 3, day: 6, zhi: '卯' as Zhi },   // 惊蛰 - 二月
    { month: 4, day: 5, zhi: '辰' as Zhi },   // 清明 - 三月
    { month: 5, day: 6, zhi: '巳' as Zhi },   // 立夏 - 四月
    { month: 6, day: 6, zhi: '午' as Zhi },   // 芒种 - 五月
    { month: 7, day: 7, zhi: '未' as Zhi },   // 小暑 - 六月
    { month: 8, day: 8, zhi: '申' as Zhi },   // 立秋 - 七月
    { month: 9, day: 8, zhi: '酉' as Zhi },   // 白露 - 八月
    { month: 10, day: 9, zhi: '戌' as Zhi },  // 寒露 - 九月
    { month: 11, day: 7, zhi: '亥' as Zhi },  // 立冬 - 十月
    { month: 12, day: 7, zhi: '子' as Zhi },  // 大雪 - 十一月
  ];

  // 找到对应的月支
  // 从后往前找，找到第一个满足条件的节气（即当前日期在该节气之后或当天）
  for (let i = solarTerms.length - 1; i >= 0; i--) {
    const term = solarTerms[i];
    // 当前日期在节气之后或当天
    if (month > term.month || (month === term.month && day >= term.day)) {
      return term.zhi;
    }
  }

  // 如果在1月6日之前，属于上一年的丑月（十二月）
  return '丑' as Zhi;
}

/**
 * 根据公历日期计算日柱（简化算法）
 * 基于1900年1月31日是甲辰日
 * @param year 公历年份
 * @param month 公历月份
 * @param day 公历日期
 * @returns 日柱干支
 */
export function getDayGanZhi(year: number, month: number, day: number): GanZhi {
  // 1900年1月31日是甲辰日（第40个）
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(year, month - 1, day);

  // 计算天数差
  const diffTime = targetDate.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 从甲辰日（第40个）开始计算
  const baseIndex = 40;
  const index = (baseIndex + diffDays) % 60;
  const finalIndex = index < 0 ? index + 60 : index;

  return LIU_SHIA_JIA_ZI[finalIndex];
}

/**
 * 五鼠遁时 - 根据日干推算时干
 * 甲己还加甲，乙庚丙作初
 * 丙辛从戊起，丁壬庚子居
 * 戊癸何方发，壬子是真途
 *
 * @param dayGan 日干
 * @param hourZhi 时支
 * @returns 时干
 */
export function getHourGan(dayGan: Gan, hourZhi: Zhi): Gan {
  const dayGanIndex = GAN_INDEX[dayGan];
  const hourZhiIndex = ZHI_INDEX[hourZhi];

  if (dayGanIndex === undefined || hourZhiIndex === undefined) {
    throw new Error('Invalid day gan or hour zhi');
  }

  // 子时为第一个时辰
  const ziIndex = ZHI_INDEX['子'];
  const hourOffset = (hourZhiIndex - ziIndex + 12) % 12;

  // 根据日干确定起始时干
  let startGanIndex: number;
  switch (dayGan) {
    case '甲':
    case '己':
      startGanIndex = GAN_INDEX['甲'];
      break;
    case '乙':
    case '庚':
      startGanIndex = GAN_INDEX['丙'];
      break;
    case '丙':
    case '辛':
      startGanIndex = GAN_INDEX['戊'];
      break;
    case '丁':
    case '壬':
      startGanIndex = GAN_INDEX['庚'];
      break;
    case '戊':
    case '癸':
      startGanIndex = GAN_INDEX['壬'];
      break;
    default:
      throw new Error(`Invalid day gan: ${dayGan}`);
  }

  const hourGanIndex = (startGanIndex + hourOffset) % 10;
  return TIAN_GAN[hourGanIndex].name;
}

/**
 * 根据小时获取时支
 * @param hour 小时（0-23）
 * @returns 时支
 */
export function getHourZhi(hour: number): Zhi {
  // 时辰划分：
  // 子时 23:00-01:00, 丑时 01:00-03:00, ...
  const zhiList: Zhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // 将小时转换为时辰索引
  // 23点和0点属于子时
  let index: number;
  if (hour === 23) {
    index = 0;  // 子时
  } else {
    index = Math.floor((hour + 1) / 2) % 12;
  }

  return zhiList[index];
}

/**
 * 根据公历时间获取时柱
 * @param dayGan 日干
 * @param hour 小时（0-23）
 * @returns 时柱干支
 */
export function getHourGanZhi(dayGan: Gan, hour: number): GanZhi {
  const hourZhi = getHourZhi(hour);
  const hourGan = getHourGan(dayGan, hourZhi);

  return { gan: hourGan, zhi: hourZhi };
}

/**
 * 完整的八字排盘
 * @param birthTime 出生时间
 * @returns 四柱干支
 */
export function paiPan(birthTime: { year: number; month: number; day: number; hour: number }) {
  const { year, month, day, hour } = birthTime;

  // 年柱
  const nianZhu = getYearGanZhiExact(year, month, day);

  // 月柱
  const yueZhu = getMonthGanZhi(year, month, day);

  // 日柱
  const riZhu = getDayGanZhi(year, month, day);

  // 时柱
  const shiZhu = getHourGanZhi(riZhu.gan, hour);

  return {
    nianZhu,
    yueZhu,
    riZhu,
    shiZhu,
  };
}
