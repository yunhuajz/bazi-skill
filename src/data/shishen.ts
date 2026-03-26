import { ShiShen, Gan, WuXing, YinYang } from '../types';
import { TIAN_GAN, GAN_INDEX } from './gan';

/**
 * 十神定义
 * 以日主（日干）为中心，与其他干支的关系
 */
export const SHI_SHEN_LIST: ShiShen[] = [
  '比肩', '劫财',      // 同我
  '食神', '伤官',      // 我生
  '正财', '偏财',      // 我克
  '正官', '七杀',      // 克我
  '正印', '偏印',      // 生我
];

/**
 * 十神与日主的生克关系分类
 */
export const SHI_SHEN_CATEGORY = {
  /** 同我 - 比肩、劫财 */
  tongWo: ['比肩', '劫财'] as ShiShen[],
  /** 我生 - 食神、伤官 */
  woSheng: ['食神', '伤官'] as ShiShen[],
  /** 我克 - 正财、偏财 */
  woKe: ['正财', '偏财'] as ShiShen[],
  /** 克我 - 正官、七杀 */
  keWo: ['正官', '七杀'] as ShiShen[],
  /** 生我 - 正印、偏印 */
  shengWo: ['正印', '偏印'] as ShiShen[],
};

/**
 * 十神计算表
 * 以日干（日主）为基准，与其他天干的十神关系
 * 阳日干：甲、丙、戊、庚、壬
 * 阴日干：乙、丁、己、辛、癸
 */
const SHI_SHEN_TABLE: { [key: string]: ShiShen[] } = {
  // 阳日干
  '甲': ['比肩', '劫财', '食神', '伤官', '偏财', '正财', '七杀', '正官', '偏印', '正印'],
  '丙': ['偏印', '正印', '比肩', '劫财', '食神', '伤官', '偏财', '正财', '七杀', '正官'],
  '戊': ['七杀', '正官', '偏印', '正印', '比肩', '劫财', '食神', '伤官', '偏财', '正财'],
  '庚': ['偏财', '正财', '七杀', '正官', '偏印', '正印', '比肩', '劫财', '食神', '伤官'],
  '壬': ['食神', '伤官', '偏财', '正财', '七杀', '正官', '偏印', '正印', '比肩', '劫财'],
  // 阴日干
  '乙': ['比肩', '劫财', '伤官', '食神', '正财', '偏财', '正官', '七杀', '正印', '偏印'],
  '丁': ['正印', '偏印', '比肩', '劫财', '伤官', '食神', '正财', '偏财', '正官', '七杀'],
  '己': ['正官', '七杀', '正印', '偏印', '比肩', '劫财', '伤官', '食神', '正财', '偏财'],
  '辛': ['正财', '偏财', '正官', '七杀', '正印', '偏印', '比肩', '劫财', '伤官', '食神'],
  '癸': ['伤官', '食神', '正财', '偏财', '正官', '七杀', '正印', '偏印', '比肩', '劫财'],
};

/**
 * 计算十神
 * @param riGan 日干（日主）
 * @param targetGan 目标天干
 * @returns 十神名称
 */
export function calculateShiShen(riGan: Gan, targetGan: Gan): ShiShen {
  const table = SHI_SHEN_TABLE[riGan];
  if (!table) {
    throw new Error(`Invalid 日干: ${riGan}`);
  }

  const index = GAN_INDEX[targetGan];
  if (index === undefined) {
    throw new Error(`Invalid target 天干: ${targetGan}`);
  }

  return table[index];
}

/**
 * 获取十神的五行属性
 * @param shiShen 十神名称
 * @param riGanWuXing 日干五行
 * @returns 十神的五行
 */
export function getShiShenWuXing(shiShen: ShiShen, riGanWuXing: WuXing): WuXing {
  switch (shiShen) {
    case '比肩':
    case '劫财':
      return riGanWuXing;  // 同我，同五行
    case '食神':
    case '伤官':
      // 我生
      const shengMap: { [key in WuXing]: WuXing } = {
        '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
      };
      return shengMap[riGanWuXing];
    case '正财':
    case '偏财':
      // 我克
      const keMap: { [key in WuXing]: WuXing } = {
        '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
      };
      return keMap[riGanWuXing];
    case '正官':
    case '七杀':
      // 克我
      const beiKeMap: { [key in WuXing]: WuXing } = {
        '木': '金', '火': '水', '土': '木', '金': '火', '水': '土'
      };
      return beiKeMap[riGanWuXing];
    case '正印':
    case '偏印':
      // 生我
      const beiShengMap: { [key in WuXing]: WuXing } = {
        '木': '水', '火': '木', '土': '火', '金': '土', '水': '金'
      };
      return beiShengMap[riGanWuXing];
    default:
      return riGanWuXing;
  }
}

/**
 * 判断十神是偏还是正
 * @param shiShen 十神名称
 * @returns true为正，false为偏
 */
export function isZheng(shiShen: ShiShen): boolean {
  const zhengList = ['比肩', '食神', '正财', '正官', '正印'];
  return zhengList.includes(shiShen);
}

/**
 * 判断十神是吉还是凶（一般分类）
 * @param shiShen 十神名称
 * @returns true为吉，false为凶，null为中性
 */
export function isJi(shiShen: ShiShen): boolean | null {
  switch (shiShen) {
    case '正印':
    case '正官':
    case '食神':
    case '正财':
      return true;  // 四吉神
    case '七杀':
    case '伤官':
    case '劫财':
    case '偏印':
      return false; // 四凶神
    case '比肩':
    case '偏财':
      return null;  // 中性
    default:
      return null;
  }
}

/**
 * 十神简要解释
 */
export const SHI_SHEN_DESCRIPTION: { [key: string]: string } = {
  '比肩': '同类五行，同性相助。代表自己、兄弟、朋友、同事。性格：独立、自主、有主见。',
  '劫财': '同类五行，异性相劫。代表竞争、争夺、花费。性格：好动、积极、善交际。',
  '食神': '我生五行，同性相生。代表才华、口福、享受。性格：温和、宽厚、有艺术气质。',
  '伤官': '我生五行，异性相泄。代表才华、创新、叛逆。性格：聪明、敏感、有创造力。',
  '正财': '我克五行，异性相克。代表正当收入、稳定财富、妻子。性格：务实、节俭、重实际。',
  '偏财': '我克五行，同性相克。代表意外之财、投机、父亲。性格：慷慨、善交际、重义气。',
  '正官': '克我五行，异性相克。代表职位、权力、名誉、丈夫（女命）。性格：正直、守法、有责任感。',
  '七杀': '克我五行，同性相克。代表压力、挑战、权威。性格：果断、有魄力、敢冒险。',
  '正印': '生我五行，异性相生。代表学业、母亲、贵人、文书。性格：仁慈、好学、有智慧。',
  '偏印': '生我五行，同性相生。代表偏门学问、继母、孤独。性格：敏感、多疑、有偏才。',
};
