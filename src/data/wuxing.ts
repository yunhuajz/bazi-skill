import { WuXing } from '../types';

/**
 * 五行相生关系
 * 木生火，火生土，土生金，金生水，水生木
 */
export const WU_XING_SHENG: { [key in WuXing]: WuXing } = {
  '木': '火',
  '火': '土',
  '土': '金',
  '金': '水',
  '水': '木',
};

/**
 * 五行相克关系
 * 木克土，土克水，水克火，火克金，金克木
 */
export const WU_XING_KE: { [key in WuXing]: WuXing } = {
  '木': '土',
  '土': '水',
  '水': '火',
  '火': '金',
  '金': '木',
};

/**
 * 五行颜色
 */
export const WU_XING_COLOR: { [key in WuXing]: string } = {
  '木': '青',
  '火': '赤',
  '土': '黄',
  '金': '白',
  '水': '黑',
};

/**
 * 五行方位
 */
export const WU_XING_DIRECTION: { [key in WuXing]: string } = {
  '木': '东',
  '火': '南',
  '土': '中',
  '金': '西',
  '水': '北',
};

/**
 * 五行季节
 */
export const WU_XING_SEASON: { [key in WuXing]: string } = {
  '木': '春',
  '火': '夏',
  '土': '四季',  // 每个季节的最后一个月
  '金': '秋',
  '水': '冬',
};

/**
 * 判断五行是否相生
 * @param from 来源五行
 * @param to 目标五行
 * @returns 是否相生
 */
export function isXiangSheng(from: WuXing, to: WuXing): boolean {
  return WU_XING_SHENG[from] === to;
}

/**
 * 判断五行是否相克
 * @param from 来源五行
 * @param to 目标五行
 * @returns 是否相克
 */
export function isXiangKe(from: WuXing, to: WuXing): boolean {
  return WU_XING_KE[from] === to;
}

/**
 * 获取生我的五行
 * @param wuXing 当前五行
 * @returns 生我的五行
 */
export function getShengWo(wuXing: WuXing): WuXing {
  const entries = Object.entries(WU_XING_SHENG) as [WuXing, WuXing][];
  for (const [from, to] of entries) {
    if (to === wuXing) return from;
  }
  return wuXing;
}

/**
 * 获取我生的五行
 * @param wuXing 当前五行
 * @returns 我生的五行
 */
export function getWoSheng(wuXing: WuXing): WuXing {
  return WU_XING_SHENG[wuXing];
}

/**
 * 获取克我的五行
 * @param wuXing 当前五行
 * @returns 克我的五行
 */
export function getKeWo(wuXing: WuXing): WuXing {
  const entries = Object.entries(WU_XING_KE) as [WuXing, WuXing][];
  for (const [from, to] of entries) {
    if (to === wuXing) return from;
  }
  return wuXing;
}

/**
 * 获取我克的五行
 * @param wuXing 当前五行
 * @returns 我克的五行
 */
export function getWoKe(wuXing: WuXing): WuXing {
  return WU_XING_KE[wuXing];
}
