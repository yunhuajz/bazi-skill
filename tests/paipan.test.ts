import { paiPan, calculateBaZi, calculateBaZiString, BaZiPaiPan } from '../src';
import { getYearGanZhi, getDayGanZhi, getHourGanZhi } from '../src/calendar/ganzhi';

describe('八字排盘测试', () => {
  // 测试数据：1984年2月15日 8时（公历）
  // 已知：甲子年 丙寅月 己卯日 戊辰时
  const testBirthTime = {
    year: 1984,
    month: 2,
    day: 15,
    hour: 8,
  };

  describe('年柱计算', () => {
    it('1984年应为甲子年', () => {
      const result = getYearGanZhi(1984);
      expect(result.gan).toBe('甲');
      expect(result.zhi).toBe('子');
    });

    it('2024年应为甲辰年', () => {
      const result = getYearGanZhi(2024);
      expect(result.gan).toBe('甲');
      expect(result.zhi).toBe('辰');
    });

    it('1900年应为庚子年', () => {
      const result = getYearGanZhi(1900);
      expect(result.gan).toBe('庚');
      expect(result.zhi).toBe('子');
    });
  });

  describe('日柱计算', () => {
    it('1984年2月15日应为己卯日', () => {
      const result = getDayGanZhi(1984, 2, 15);
      expect(result.gan).toBe('己');
      expect(result.zhi).toBe('卯');
    });

    it('2024年3月25日应为戊子日', () => {
      const result = getDayGanZhi(2024, 3, 25);
      expect(result.gan).toBe('戊');
      expect(result.zhi).toBe('子');
    });
  });

  describe('时柱计算', () => {
    it('日干为己，8时应为辰时', () => {
      const result = getHourGanZhi('己', 8);
      expect(result.zhi).toBe('辰');
    });

    it('日干为己，子时天干应为甲', () => {
      const result = getHourGanZhi('己', 0);
      expect(result.gan).toBe('甲');
      expect(result.zhi).toBe('子');
    });
  });

  describe('完整八字排盘', () => {
    it('应正确排出四柱', () => {
      const result = paiPan(testBirthTime);

      expect(result.baZi.siZhu.nianZhu).toEqual({ gan: '甲', zhi: '子' });
      expect(result.baZi.siZhu.riZhu).toEqual({ gan: '己', zhi: '卯' });
    });

    it('应正确计算十神', () => {
      const result = paiPan(testBirthTime);

      // 日主为己
      // 年干甲：甲己合，甲为阳己为阴，甲是己的正官
      expect(result.shiShen.tianGan.nianGan).toBe('正官');
    });

    it('应正确统计五行', () => {
      const result = paiPan(testBirthTime);

      expect(result.wuXing.count).toBeDefined();
      expect(Object.values(result.wuXing.count).reduce((a, b) => a + b, 0)).toBe(8); // 4天干 + 4地支
    });
  });

  describe('字符串输出', () => {
    it('应返回格式化字符串', () => {
      const result = calculateBaZiString(testBirthTime);

      expect(result).toContain('八 字 排 盘');
      expect(result).toContain('年柱');
      expect(result).toContain('月柱');
      expect(result).toContain('日柱');
      expect(result).toContain('时柱');
    });
  });

  describe('边界情况', () => {
    it('应处理闰年', () => {
      const leapYear = { year: 2020, month: 2, day: 29, hour: 12 };
      expect(() => paiPan(leapYear)).not.toThrow();
    });

    it('应处理跨年夜', () => {
      const newYear = { year: 2023, month: 12, day: 31, hour: 23 };
      expect(() => paiPan(newYear)).not.toThrow();
    });

    it('应处理凌晨时间', () => {
      const earlyMorning = { year: 2024, month: 1, day: 1, hour: 0 };
      const result = paiPan(earlyMorning);
      expect(result.baZi.siZhu.shiZhu.zhi).toBe('子');
    });
  });
});
