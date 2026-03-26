import { GanInfo } from '../types';

/**
 * 天干数据表
 * 甲、乙、丙、丁、戊、己、庚、辛、壬、癸
 */
export const TIAN_GAN: GanInfo[] = [
  {
    name: '甲',
    yinYang: '阳',
    wuXing: '木',
    position: 1,
  },
  {
    name: '乙',
    yinYang: '阴',
    wuXing: '木',
    position: 2,
  },
  {
    name: '丙',
    yinYang: '阳',
    wuXing: '火',
    position: 3,
  },
  {
    name: '丁',
    yinYang: '阴',
    wuXing: '火',
    position: 4,
  },
  {
    name: '戊',
    yinYang: '阳',
    wuXing: '土',
    position: 5,
  },
  {
    name: '己',
    yinYang: '阴',
    wuXing: '土',
    position: 6,
  },
  {
    name: '庚',
    yinYang: '阳',
    wuXing: '金',
    position: 7,
  },
  {
    name: '辛',
    yinYang: '阴',
    wuXing: '金',
    position: 8,
  },
  {
    name: '壬',
    yinYang: '阳',
    wuXing: '水',
    position: 9,
  },
  {
    name: '癸',
    yinYang: '阴',
    wuXing: '水',
    position: 10,
  },
];

/**
 * 天干索引映射
 */
export const GAN_INDEX: { [key: string]: number } = {
  '甲': 0, '乙': 1, '丙': 2, '丁': 3, '戊': 4,
  '己': 5, '庚': 6, '辛': 7, '壬': 8, '癸': 9,
};

/**
 * 获取天干信息
 */
export function getGanInfo(gan: string): GanInfo | undefined {
  return TIAN_GAN.find(g => g.name === gan);
}

/**
 * 天干阴阳属性
 */
export function getGanYinYang(gan: string): string {
  const info = getGanInfo(gan);
  return info?.yinYang || '';
}

/**
 * 天干五行属性
 */
export function getGanWuXing(gan: string): string {
  const info = getGanInfo(gan);
  return info?.wuXing || '';
}

/**
 * 下一个天干
 */
export function nextGan(gan: string): string {
  const index = GAN_INDEX[gan];
  if (index === undefined) return '';
  return TIAN_GAN[(index + 1) % 10].name;
}

/**
 * 上一个天干
 */
export function prevGan(gan: string): string {
  const index = GAN_INDEX[gan];
  if (index === undefined) return '';
  return TIAN_GAN[(index - 1 + 10) % 10].name;
}
