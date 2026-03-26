// ============================================================================
// 农历转换模块
// 使用 lunar-javascript 库实现
// 支持1900-2100年的农历转公历
// ============================================================================

import { Lunar as LunarJS, Solar, LunarYear } from 'lunar-javascript';

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
}

// 保留LUNAR_INFO以保持向后兼容（不再使用，但保留导出）
export const LUNAR_INFO: number[] = [];

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
  if (lunarYear < 1900 || lunarYear > 2100) {
    throw new Error(`农历年份 ${lunarYear} 超出支持范围（1900-2100）`);
  }
  // 使用 LunarYear 类获取闰月信息
  const lunarYearObj = LunarYear.fromYear(lunarYear);
  return lunarYearObj.getLeapMonth();
}

/**
 * 获取农历月的天数
 * @param lunarYear 农历年份
 * @param lunarMonth 农历月份
 * @returns 天数（29或30）
 */
export function getLunarMonthDays(lunarYear: number, lunarMonth: number): number {
  if (lunarYear < 1900 || lunarYear > 2100) {
    throw new Error(`农历年份 ${lunarYear} 超出支持范围（1900-2100）`);
  }
  // 使用 lunar-javascript 库获取月天数
  const lunar = LunarJS.fromYmd(lunarYear, lunarMonth, 1);
  return lunar.getDaysInMonth();
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
    // 闰月天数：使用 lunar-javascript 获取
    const lunar = LunarJS.fromYmd(lunarYear, leapMonth, 1);
    days += lunar.getDaysInMonth();
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

  if (lunarYear < 1900 || lunarYear > 2100) {
    throw new Error(`农历年份 ${lunarYear} 超出支持范围（1900-2100）`);
  }

  if (isLeap) {
    // 获取闰月的天数
    // lunar-javascript 的 fromYmd 方法可以指定是否为闰月
    const lunar = LunarJS.fromYmd(lunarYear, lunarMonth, 1);
    return lunar.getDaysInMonth();
  }
  return getLunarMonthDays(lunarYear, lunarMonth);
}

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

  // 使用 lunar-javascript 库进行转换
  // 注意：该库的 fromYmd 方法第三个参数是日，第四个参数是是否为闰月
  const lunar = LunarJS.fromYmd(year, month, day);
  const solar = lunar.getSolar();

  return {
    year: solar.getYear(),
    month: solar.getMonth(),
    day: solar.getDay(),
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
