// ============================================================================
// bazi-skill - 八字命理排盘与分析工具
// ============================================================================

// 类型定义导出
export * from './types';

// 数据模块导出
export * from './data';

// 日历模块导出
export * from './calendar/ganzhi';
export * from './calendar/lunar';
export * from './calendar/solar-time';

// 八字排盘模块导出
export * from './bazi/paipan';

// ============================================================================
// 主要API
// ============================================================================

import { BirthTime, PaiPanResult, BirthLocation } from './types';
import { calculateBaZi, calculateBaZiString } from './bazi/paipan';
import { lunarToSolar, LunarDate } from './calendar/lunar';
import { getTrueSolarTime, getLocationByCity, formatAdjustment, Location } from './calendar/solar-time';

/**
 * 处理出生时间转换
 * 1. 农历转公历
 * 2. 标准时间转真太阳时（默认使用北京时间东经120°）
 * @param birthTime 原始出生时间
 * @returns 转换后的公历真太阳时
 */
function processBirthTime(birthTime: BirthTime): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  conversions: string[];
} {
  const conversions: string[] = [];
  let processedTime = { ...birthTime };

  // 1. 农历转公历
  if (birthTime.isLunar) {
    const lunarDate: LunarDate = {
      year: birthTime.year,
      month: birthTime.month,
      day: birthTime.day,
      isLeap: false, // 默认非闰月，如需闰月需额外指定
    };

    const solarDate = lunarToSolar(lunarDate);
    conversions.push(`农历${birthTime.year}年${birthTime.month}月${birthTime.day}日 → 公历${solarDate.year}年${solarDate.month}月${solarDate.day}日`);

    processedTime.year = solarDate.year;
    processedTime.month = solarDate.month;
    processedTime.day = solarDate.day;
  }

  // 2. 真太阳时转换（八字排盘必须使用真太阳时）
  // 获取地点信息，默认为北京时间（东经120°）
  let location: Location | null = null;
  let locationName = '北京时间（东经120°）';

  if (birthTime.location) {
    // 如果有城市名，优先使用城市名获取经纬度
    if (birthTime.location.cityName) {
      const cityLocation = getLocationByCity(birthTime.location.cityName);
      if (cityLocation) {
        location = cityLocation;
        locationName = birthTime.location.cityName;
        conversions.push(`出生地点：${locationName}（经度：${location.longitude}°E）`);
      }
    }

    // 如果没有城市名或城市名未找到，使用提供的经纬度
    if (!location && birthTime.location.longitude !== undefined) {
      location = {
        longitude: birthTime.location.longitude,
        latitude: birthTime.location.latitude || 0,
      };
      locationName = `自定义位置（经度${location.longitude}°）`;
      conversions.push(`出生地点经度：${location.longitude}°`);
    }
  }

  // 如果没有提供地点，使用默认的北京时间（东经120°）
  if (!location) {
    location = { longitude: 120, latitude: 0 };
    conversions.push(`未指定出生地点，默认使用：${locationName}`);
  }

  // 计算真太阳时
  const trueSolarTime = getTrueSolarTime(
    {
      year: processedTime.year,
      month: processedTime.month,
      day: processedTime.day,
      hour: processedTime.hour,
      minute: processedTime.minute || 0,
    },
    location
  );

  const adjustmentStr = formatAdjustment(trueSolarTime.adjustmentMinutes);
  const originalTime = `${processedTime.hour}:${String(processedTime.minute || 0).padStart(2, '0')}`;
  const trueTime = `${trueSolarTime.hour}:${String(trueSolarTime.minute).padStart(2, '0')}`;

  // 只有当调整不为0时才显示转换信息（北京时间调整通常为0或很小）
  if (Math.abs(trueSolarTime.adjustmentMinutes) > 1) {
    conversions.push(`标准时间 ${originalTime} → 真太阳时 ${trueTime}（调整${adjustmentStr}）`);
  } else {
    conversions.push(`真太阳时：${trueTime}（与标准时间基本一致）`);
  }

  // 如果日期跨越了，显示出来
  if (trueSolarTime.day !== processedTime.day) {
    conversions.push(`注意：真太阳时跨越日期，实际为${trueSolarTime.year}年${trueSolarTime.month}月${trueSolarTime.day}日`);
  }

  return {
    year: trueSolarTime.year,
    month: trueSolarTime.month,
    day: trueSolarTime.day,
    hour: trueSolarTime.hour,
    minute: trueSolarTime.minute,
    conversions,
  };
}

/**
 * 八字排盘 - 主要入口函数
 * @param birthTime 出生时间（支持公历/农历，自动转换为真太阳时）
 * @returns 排盘结果
 */
export function paiPan(birthTime: BirthTime): PaiPanResult & { conversions?: string[] } {
  const processedTime = processBirthTime(birthTime);
  const result = calculateBaZi(processedTime);

  return {
    ...result,
    conversions: processedTime.conversions,
  };
}

/**
 * 八字排盘 - 字符串输出
 * @param birthTime 出生时间（支持公历/农历，自动转换为真太阳时）
 * @returns 格式化字符串
 */
export function paiPanString(birthTime: BirthTime): string {
  const processedTime = processBirthTime(birthTime);
  const result = calculateBaZiString(processedTime);

  // 如果有转换信息，添加到输出中
  if (processedTime.conversions.length > 0) {
    return `
═══════════════════════════════════════════════════════════
                        时 间 转 换
═══════════════════════════════════════════════════════════
${processedTime.conversions.map(c => `  • ${c}`).join('\n')}
${result}`;
  }

  return result;
}

// ============================================================================
// 便捷函数
// ============================================================================

/**
 * 使用城市名称进行八字排盘
 * @param year 年份
 * @param month 月份
 * @param day 日期
 * @param hour 小时
 * @param cityName 城市名称
 * @param options 其他选项
 * @returns 排盘结果
 */
export function paiPanByCity(
  year: number,
  month: number,
  day: number,
  hour: number,
  cityName: string,
  options?: { minute?: number; isLunar?: boolean; isFemale?: boolean }
): PaiPanResult & { conversions?: string[] } {
  return paiPan({
    year,
    month,
    day,
    hour,
    minute: options?.minute,
    isLunar: options?.isLunar,
    isFemale: options?.isFemale,
    location: { cityName },
  });
}

/**
 * 使用经纬度进行八字排盘
 * @param year 年份
 * @param month 月份
 * @param day 日期
 * @param hour 小时
 * @param longitude 经度
 * @param options 其他选项（包括纬度、分钟、是否农历等）
 * @returns 排盘结果
 */
export function paiPanByLocation(
  year: number,
  month: number,
  day: number,
  hour: number,
  longitude: number,
  options?: { latitude?: number; minute?: number; isLunar?: boolean; isFemale?: boolean }
): PaiPanResult & { conversions?: string[] } {
  return paiPan({
    year,
    month,
    day,
    hour,
    minute: options?.minute,
    isLunar: options?.isLunar,
    isFemale: options?.isFemale,
    location: { longitude, latitude: options?.latitude },
  });
}

// ============================================================================
// 版本信息
// ============================================================================
export const VERSION = '1.1.0';
