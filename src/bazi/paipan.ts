import { SiZhu, BaZi, GanZhi, BirthTime, PaiPanResult } from '../types';
import { paiPan, getYearGanZhiExact, getMonthGanZhi, getDayGanZhi, getHourGanZhi } from '../calendar/ganzhi';
import { calculateShiShen } from '../data/shishen';
import { getGanInfo, getZhiInfo } from '../data';

/**
 * 处理后的出生时间（内部使用）
 */
interface ProcessedBirthTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
}

/**
 * 八字排盘核心类
 */
export class BaZiPaiPan {
  private siZhu: SiZhu;
  private birthTime: ProcessedBirthTime;

  constructor(birthTime: ProcessedBirthTime) {
    this.birthTime = birthTime;
    this.siZhu = paiPan(birthTime);
  }

  /**
   * 获取四柱
   */
  getSiZhu(): SiZhu {
    return this.siZhu;
  }

  /**
   * 获取日主（日干）
   */
  getRiZhu(): GanZhi {
    return this.siZhu.riZhu;
  }

  /**
   * 获取八字完整结构
   */
  getBaZi(): BaZi {
    return {
      siZhu: this.siZhu,
      riZhu: this.siZhu.riZhu,
      ganZhiList: [
        this.siZhu.nianZhu,
        this.siZhu.yueZhu,
        this.siZhu.riZhu,
        this.siZhu.shiZhu,
      ],
    };
  }

  /**
   * 获取四柱的十神
   * @returns 各柱天干相对于日主的十神
   */
  getShiShen(): { [key: string]: string } {
    const riGan = this.siZhu.riZhu.gan;

    return {
      nianGan: calculateShiShen(riGan as any, this.siZhu.nianZhu.gan as any),
      yueGan: calculateShiShen(riGan as any, this.siZhu.yueZhu.gan as any),
      shiGan: calculateShiShen(riGan as any, this.siZhu.shiZhu.gan as any),
    };
  }

  /**
   * 获取地支藏干的十神
   * @returns 各支藏干的十神
   */
  getZhiCangGanShiShen(): { [key: string]: { gan: string; shiShen: string }[] } {
    const riGan = this.siZhu.riZhu.gan;
    const result: { [key: string]: { gan: string; shiShen: string }[] } = {};

    const zhuList = [
      { name: 'nianZhi', zhi: this.siZhu.nianZhu.zhi },
      { name: 'yueZhi', zhi: this.siZhu.yueZhu.zhi },
      { name: 'riZhi', zhi: this.siZhu.riZhu.zhi },
      { name: 'shiZhi', zhi: this.siZhu.shiZhu.zhi },
    ];

    for (const { name, zhi } of zhuList) {
      const zhiInfo = getZhiInfo(zhi);
      if (zhiInfo) {
        result[name] = zhiInfo.cangGan.map((gan) => ({
          gan,
          shiShen: calculateShiShen(riGan as any, gan as any),
        }));
      }
    }

    return result;
  }

  /**
   * 获取五行统计
   */
  getWuXingCount(): { '木': number; '火': number; '土': number; '金': number; '水': number } {
    const counts: { '木': number; '火': number; '土': number; '金': number; '水': number } = {
      '木': 0,
      '火': 0,
      '土': 0,
      '金': 0,
      '水': 0,
    };

    // 统计天干的五行
    const ganList = [
      this.siZhu.nianZhu.gan,
      this.siZhu.yueZhu.gan,
      this.siZhu.riZhu.gan,
      this.siZhu.shiZhu.gan,
    ];

    for (const gan of ganList) {
      const ganInfo = getGanInfo(gan);
      if (ganInfo) {
        counts[ganInfo.wuXing]++;
      }
    }

    // 统计地支的五行（主气）
    const zhiList = [
      this.siZhu.nianZhu.zhi,
      this.siZhu.yueZhu.zhi,
      this.siZhu.riZhu.zhi,
      this.siZhu.shiZhu.zhi,
    ];

    for (const zhi of zhiList) {
      const zhiInfo = getZhiInfo(zhi);
      if (zhiInfo) {
        counts[zhiInfo.wuXing]++;
      }
    }

    return counts;
  }

  /**
   * 简单的旺衰判断
   */
  getWangShuai(): string {
    const riGan = this.siZhu.riZhu.gan;
    const riGanInfo = getGanInfo(riGan);

    if (!riGanInfo) {
      return '无法判断';
    }

    const riGanWuXing = riGanInfo.wuXing;
    const yueZhi = this.siZhu.yueZhu.zhi;
    const yueZhiInfo = getZhiInfo(yueZhi);

    if (!yueZhiInfo) {
      return '无法判断';
    }

    const yueZhiWuXing = yueZhiInfo.wuXing;

    // 根据月支五行和日干五行的关系判断旺衰
    // 月支生我、同我者为旺，克我、我克者为衰
    const wuXingShengKe: { [key: string]: { sheng: string; ke: string; beiSheng: string; beiKe: string } } = {
      '木': { sheng: '火', ke: '土', beiSheng: '水', beiKe: '金' },
      '火': { sheng: '土', ke: '金', beiSheng: '木', beiKe: '水' },
      '土': { sheng: '金', ke: '水', beiSheng: '火', beiKe: '木' },
      '金': { sheng: '水', ke: '木', beiSheng: '土', beiKe: '火' },
      '水': { sheng: '木', ke: '火', beiSheng: '金', beiKe: '土' },
    };

    const relation = wuXingShengKe[riGanWuXing];

    if (yueZhiWuXing === riGanWuXing) {
      return '身旺（月支同五行）';
    } else if (yueZhiWuXing === relation.beiSheng) {
      return '身旺（月支生我）';
    } else if (yueZhiWuXing === relation.sheng) {
      return '身衰（我生月支）';
    } else if (yueZhiWuXing === relation.ke) {
      return '身衰（我克月支）';
    } else if (yueZhiWuXing === relation.beiKe) {
      return '身弱（月支克我）';
    }

    return '平和';
  }

  /**
   * 获取完整的排盘结果
   */
  getResult(): PaiPanResult {
    return {
      baZi: this.getBaZi(),
      shiShen: {
        tianGan: this.getShiShen(),
        diZhiCangGan: this.getZhiCangGanShiShen(),
      },
      wuXing: {
        count: this.getWuXingCount(),
        wangShuai: this.getWangShuai(),
      },
    };
  }

  /**
   * 格式化输出八字
   */
  toString(): string {
    const { nianZhu, yueZhu, riZhu, shiZhu } = this.siZhu;
    const shiShen = this.getShiShen();

    return `
╔════════════════════════════════════════════════════════╗
║                     八 字 排 盘                         ║
╠════════════════════════════════════════════════════════╣
║  四柱    │    年柱    │    月柱    │    日柱    │    时柱    ║
╠══════════╪════════════╪════════════╪════════════╪════════════╣
║  天干    │    ${nianZhu.gan}      │    ${yueZhu.gan}      │    ${riZhu.gan}（日主）│    ${shiZhu.gan}      ║
║  十神    │    ${shiShen.nianGan.padEnd(4)}    │    ${shiShen.yueGan.padEnd(4)}    │    日主    │    ${shiShen.shiGan.padEnd(4)}    ║
╠══════════╪════════════╪════════════╪════════════╪════════════╣
║  地支    │    ${nianZhu.zhi}      │    ${yueZhu.zhi}      │    ${riZhu.zhi}      │    ${shiZhu.zhi}      ║
╚════════════════════════════════════════════════════════╝

五行统计：${JSON.stringify(this.getWuXingCount())}
日主旺衰：${this.getWangShuai()}
    `.trim();
  }
}

/**
 * 便捷的八字排盘函数
 * @param birthTime 处理后的出生时间
 * @returns 排盘结果
 */
export function calculateBaZi(birthTime: ProcessedBirthTime): PaiPanResult {
  const paipan = new BaZiPaiPan(birthTime);
  return paipan.getResult();
}

/**
 * 便捷的八字排盘字符串输出
 * @param birthTime 处理后的出生时间
 * @returns 格式化字符串
 */
export function calculateBaZiString(birthTime: ProcessedBirthTime): string {
  const paipan = new BaZiPaiPan(birthTime);
  return paipan.toString();
}
