import { ZhiInfo } from '../types';

/**
 * 地支数据表
 * 子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥
 */
export const DI_ZHI: ZhiInfo[] = [
  {
    name: '子',
    yinYang: '阳',
    wuXing: '水',
    shengXiao: '鼠',
    cangGan: ['癸'],
    position: 1,
  },
  {
    name: '丑',
    yinYang: '阴',
    wuXing: '土',
    shengXiao: '牛',
    cangGan: ['己', '癸', '辛'],
    position: 2,
  },
  {
    name: '寅',
    yinYang: '阳',
    wuXing: '木',
    shengXiao: '虎',
    cangGan: ['甲', '丙', '戊'],
    position: 3,
  },
  {
    name: '卯',
    yinYang: '阴',
    wuXing: '木',
    shengXiao: '兔',
    cangGan: ['乙'],
    position: 4,
  },
  {
    name: '辰',
    yinYang: '阳',
    wuXing: '土',
    shengXiao: '龙',
    cangGan: ['戊', '乙', '癸'],
    position: 5,
  },
  {
    name: '巳',
    yinYang: '阴',
    wuXing: '火',
    shengXiao: '蛇',
    cangGan: ['丙', '庚', '戊'],
    position: 6,
  },
  {
    name: '午',
    yinYang: '阳',
    wuXing: '火',
    shengXiao: '马',
    cangGan: ['丁', '己'],
    position: 7,
  },
  {
    name: '未',
    yinYang: '阴',
    wuXing: '土',
    shengXiao: '羊',
    cangGan: ['己', '丁', '乙'],
    position: 8,
  },
  {
    name: '申',
    yinYang: '阳',
    wuXing: '金',
    shengXiao: '猴',
    cangGan: ['庚', '壬', '戊'],
    position: 9,
  },
  {
    name: '酉',
    yinYang: '阴',
    wuXing: '金',
    shengXiao: '鸡',
    cangGan: ['辛'],
    position: 10,
  },
  {
    name: '戌',
    yinYang: '阳',
    wuXing: '土',
    shengXiao: '狗',
    cangGan: ['戊', '辛', '丁'],
    position: 11,
  },
  {
    name: '亥',
    yinYang: '阴',
    wuXing: '水',
    shengXiao: '猪',
    cangGan: ['壬', '甲'],
    position: 12,
  },
];

/**
 * 地支索引映射
 */
export const ZHI_INDEX: { [key: string]: number } = {
  '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5,
  '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11,
};

/**
 * 获取地支信息
 */
export function getZhiInfo(zhi: string): ZhiInfo | undefined {
  return DI_ZHI.find(z => z.name === zhi);
}

/**
 * 地支阴阳属性
 */
export function getZhiYinYang(zhi: string): string {
  const info = getZhiInfo(zhi);
  return info?.yinYang || '';
}

/**
 * 地支五行属性
 */
export function getZhiWuXing(zhi: string): string {
  const info = getZhiInfo(zhi);
  return info?.wuXing || '';
}

/**
 * 下一个地支
 */
export function nextZhi(zhi: string): string {
  const index = ZHI_INDEX[zhi];
  if (index === undefined) return '';
  return DI_ZHI[(index + 1) % 12].name;
}

/**
 * 上一个地支
 */
export function prevZhi(zhi: string): string {
  const index = ZHI_INDEX[zhi];
  if (index === undefined) return '';
  return DI_ZHI[(index - 1 + 12) % 12].name;
}

/**
 * 地支六冲关系
 */
export const LIU_CHONG: { [key: string]: string } = {
  '子': '午', '午': '子',
  '丑': '未', '未': '丑',
  '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯',
  '辰': '戌', '戌': '辰',
  '巳': '亥', '亥': '巳',
};

/**
 * 地支六合关系
 */
export const LIU_HE: { [key: string]: string } = {
  '子': '丑', '丑': '子',
  '寅': '亥', '亥': '寅',
  '卯': '戌', '戌': '卯',
  '辰': '酉', '酉': '辰',
  '巳': '申', '申': '巳',
  '午': '未', '未': '午',
};

/**
 * 地支三合关系
 */
export const SAN_HE: string[][] = [
  ['申', '子', '辰'],  // 水局
  ['亥', '卯', '未'],  // 木局
  ['寅', '午', '戌'],  // 火局
  ['巳', '酉', '丑'],  // 金局
];

/**
 * 地支三会关系
 */
export const SAN_HUI: string[][] = [
  ['寅', '卯', '辰'],  // 木会东方
  ['巳', '午', '未'],  // 火会南方
  ['申', '酉', '戌'],  // 金会西方
  ['亥', '子', '丑'],  // 水会北方
];
