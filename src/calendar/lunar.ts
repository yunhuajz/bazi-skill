// ============================================================================
// 农历转换模块
// 支持1900-2100年的农历转公历
// ============================================================================

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
}

// 1900-2100年农历数据
// 每个元素为16进制数，格式为：0x年份数据
// 年份数据格式（16位）：
// 第13-16位：闰月月份（0表示无闰月）
// 第1-12位：每月大小（1=大月30天，0=小月29天）
export const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6, // 1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, // 2050-2059
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2060-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, // 2090-2099
  0x0d520, // 2100
];

// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * 获取农历年的闰月（0表示无闰月）
 * @param lunarYear 农历年份
 * @returns 闰月月份，0表示无闰月
 */
export function getLeapMonth(lunarYear: number): number {
  const index = lunarYear - 1900;
  if (index < 0 || index >= LUNAR_INFO.length) {
    throw new Error(`农历年份 ${lunarYear} 超出支持范围（1900-2100）`);
  }
  return LUNAR_INFO[index] & 0xf;
}

/**
 * 获取农历月的天数
 * @param lunarYear 农历年份
 * @param lunarMonth 农历月份
 * @returns 天数（29或30）
 */
export function getLunarMonthDays(lunarYear: number, lunarMonth: number): number {
  const index = lunarYear - 1900;
  if (index < 0 || index >= LUNAR_INFO.length) {
    throw new Error(`农历年份 ${lunarYear} 超出支持范围（1900-2100）`);
  }
  return (LUNAR_INFO[index] & (0x10000 >> lunarMonth)) ? 30 : 29;
}

/**
 * 获取农历年的总天数
 * @param lunarYear 农历年份
 * @returns 总天数
 */
export function getLunarYearDays(lunarYear: number): number {
  let days = 0;
  for (let month = 1; month <= 12; month++) {
    days += getLunarMonthDays(lunarYear, month);
  }
  const leapMonth = getLeapMonth(lunarYear);
  if (leapMonth > 0) {
    days += (LUNAR_INFO[lunarYear - 1900] & 0x10000) ? 30 : 29;
  }
  return days;
}

/**
 * 获取农历年某月的天数（包括闰月）
 * @param lunarYear 农历年份
 * @param lunarMonth 农历月份
 * @param isLeap 是否为闰月
 * @returns 天数
 */
export function getLunarDaysInMonth(lunarYear: number, lunarMonth: number, isLeap: boolean): number {
  const leapMonth = getLeapMonth(lunarYear);
  if (isLeap && lunarMonth !== leapMonth) {
    throw new Error(`${lunarYear}年闰月为${leapMonth}月，不是${lunarMonth}月`);
  }
  if (isLeap) {
    return (LUNAR_INFO[lunarYear - 1900] & 0x10000) ? 30 : 29;
  }
  return getLunarMonthDays(lunarYear, lunarMonth);
}

// 1900年农历正月初一对应的公历日期：1900年1月31日
const LUNAR_START_DATE = new Date(1900, 0, 31);

/**
 * 农历转公历
 * @param lunarDate 农历日期
 * @returns 公历日期
 */
export function lunarToSolar(lunarDate: LunarDate): { year: number; month: number; day: number } {
  const { year, month, day, isLeap } = lunarDate;

  // 验证输入
  if (year < 1900 || year > 2100) {
    throw new Error(`农历年份 ${year} 超出支持范围（1900-2100）`);
  }
  if (month < 1 || month > 12) {
    throw new Error(`农历月份 ${month} 无效`);
  }

  const leapMonth = getLeapMonth(year);
  if (isLeap && month !== leapMonth) {
    throw new Error(`${year}年闰月为${leapMonth}月，不是${month}月`);
  }

  const maxDays = getLunarDaysInMonth(year, month, isLeap);
  if (day < 1 || day > maxDays) {
    throw new Error(`农历日期 ${day} 超出范围（1-${maxDays}）`);
  }

  // 计算从1900年正月初一到现在经过的天数
  let days = 0;

  // 累加之前年份的天数
  for (let y = 1900; y < year; y++) {
    days += getLunarYearDays(y);
  }

  // 累加当年之前月份的天数
  for (let m = 1; m < month; m++) {
    days += getLunarMonthDays(year, m);
  }

  // 如果有闰月且在当前月份之前
  if (leapMonth > 0 && leapMonth < month) {
    days += (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29;
  }

  // 如果是闰月
  if (isLeap) {
    // 加上之前所有月的天数
    for (let m = month; m <= month; m++) {
      days += getLunarMonthDays(year, m);
    }
    // 加上闰月之前的天数
    days += day - 1;
  } else {
    // 加上当月之前的天数
    days += day - 1;
  }

  // 转换为公历日期
  const resultDate = new Date(LUNAR_START_DATE.getTime() + days * 24 * 60 * 60 * 1000);

  return {
    year: resultDate.getFullYear(),
    month: resultDate.getMonth() + 1,
    day: resultDate.getDate(),
  };
}

/**
 * 获取农历年的干支
 * @param lunarYear 农历年份
 * @returns 干支字符串
 */
export function getLunarYearGanZhi(lunarYear: number): string {
  const index = (lunarYear - 4) % 60;
  const gan = TIAN_GAN[index % 10];
  const zhi = DI_ZHI[index % 12];
  return `${gan}${zhi}`;
}

/**
 * 判断某年是否有闰月
 * @param lunarYear 农历年份
 * @returns 是否有闰月
 */
export function hasLeapMonth(lunarYear: number): boolean {
  return getLeapMonth(lunarYear) > 0;
}
