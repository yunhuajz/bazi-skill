import {
  getJiaZiIndex, getJiaZiByIndex, getYearGanZhi, getYearGanZhiExact,
  getMonthGan, getDayGanZhi, getHourGan, getHourZhi, getHourGanZhi,
  LIU_SHIA_JIA_ZI
} from '../src/calendar/ganzhi';

describe('干支计算测试', () => {
  describe('六十甲子表', () => {
    it('应包含60个甲子', () => {
      expect(LIU_SHIA_JIA_ZI).toHaveLength(60);
    });

    it('甲子应在索引0', () => {
      expect(LIU_SHIA_JIA_ZI[0]).toEqual({ gan: '甲', zhi: '子' });
    });

    it('癸亥应在索引59', () => {
      expect(LIU_SHIA_JIA_ZI[59]).toEqual({ gan: '癸', zhi: '亥' });
    });
  });

  describe('getJiaZiIndex', () => {
    it('应正确返回甲子索引', () => {
      expect(getJiaZiIndex('甲', '子')).toBe(0);
    });

    it('应正确返回其他干支索引', () => {
      expect(getJiaZiIndex('乙', '丑')).toBe(1);
      expect(getJiaZiIndex('丙', '寅')).toBe(2);
    });

    it('应抛出错误对于奇偶不匹配的组合', () => {
      expect(() => getJiaZiIndex('甲', '丑')).toThrow('奇偶不匹配');
    });

    it('应抛出错误对于无效天干', () => {
      expect(() => getJiaZiIndex('X' as any, '子')).toThrow('Invalid gan-zhi combination');
    });

    it('应抛出错误对于无效地支', () => {
      expect(() => getJiaZiIndex('甲', 'X' as any)).toThrow('Invalid gan-zhi combination');
    });
  });

  describe('getJiaZiByIndex', () => {
    it('应正确返回索引对应的干支', () => {
      expect(getJiaZiByIndex(0)).toEqual({ gan: '甲', zhi: '子' });
      expect(getJiaZiByIndex(59)).toEqual({ gan: '癸', zhi: '亥' });
    });

    it('应抛出错误对于负索引', () => {
      expect(() => getJiaZiByIndex(-1)).toThrow('Index out of range');
    });

    it('应抛出错误对于超过60的索引', () => {
      expect(() => getJiaZiByIndex(60)).toThrow('Index out of range');
    });
  });

  describe('getYearGanZhi', () => {
    it('应正确计算1984年', () => {
      expect(getYearGanZhi(1984)).toEqual({ gan: '甲', zhi: '子' });
    });

    it('应正确计算2024年', () => {
      expect(getYearGanZhi(2024)).toEqual({ gan: '甲', zhi: '辰' });
    });

    it('应正确处理60年周期', () => {
      expect(getYearGanZhi(2044)).toEqual({ gan: '甲', zhi: '子' }); // 1984 + 60
    });

    it('应正确处理负年份', () => {
      expect(getYearGanZhi(1924)).toEqual({ gan: '甲', zhi: '子' }); // 1984 - 60
    });
  });

  describe('getYearGanZhiExact', () => {
    it('立春前应属于上一年', () => {
      // 1984年2月3日还在立春前
      const result = getYearGanZhiExact(1984, 2, 3);
      expect(result).toEqual({ gan: '癸', zhi: '亥' }); // 1983年的干支
    });

    it('立春后应属于当年', () => {
      // 1984年2月15日已过立春
      const result = getYearGanZhiExact(1984, 2, 15);
      expect(result).toEqual({ gan: '甲', zhi: '子' });
    });
  });

  describe('getMonthGan', () => {
    it('甲己之年丙作首', () => {
      expect(getMonthGan('甲', '寅')).toBe('丙');
      expect(getMonthGan('己', '寅')).toBe('丙');
    });

    it('乙庚之岁戊为头', () => {
      expect(getMonthGan('乙', '寅')).toBe('戊');
      expect(getMonthGan('庚', '寅')).toBe('戊');
    });

    it('丙辛之岁寻庚起', () => {
      expect(getMonthGan('丙', '寅')).toBe('庚');
      expect(getMonthGan('辛', '寅')).toBe('庚');
    });

    it('丁壬壬位顺行流', () => {
      expect(getMonthGan('丁', '寅')).toBe('壬');
      expect(getMonthGan('壬', '寅')).toBe('壬');
    });

    it('戊癸何方发，甲寅之上好追求', () => {
      expect(getMonthGan('戊', '寅')).toBe('甲');
      expect(getMonthGan('癸', '寅')).toBe('甲');
    });

    it('应正确计算其他月份', () => {
      expect(getMonthGan('甲', '卯')).toBe('丁'); // 甲年二月
      expect(getMonthGan('甲', '辰')).toBe('戊'); // 甲年三月
    });

    it('应抛出错误对于无效年干', () => {
      expect(() => getMonthGan('X' as any, '寅')).toThrow('Invalid year gan');
    });

    it('应抛出错误对于无效月支', () => {
      expect(() => getMonthGan('甲', 'X' as any)).toThrow('Invalid year gan or month zhi');
    });
  });

  describe('getDayGanZhi', () => {
    it('应正确计算1900年1月31日', () => {
      // 1900年1月31日是甲辰日
      const result = getDayGanZhi(1900, 1, 31);
      expect(result).toEqual({ gan: '甲', zhi: '辰' });
    });

    it('应正确计算2024年3月25日', () => {
      const result = getDayGanZhi(2024, 3, 25);
      expect(result.gan).toBe('戊');
      expect(result.zhi).toBe('子');
    });
  });

  describe('getHourGan', () => {
    it('甲己还加甲', () => {
      expect(getHourGan('甲', '子')).toBe('甲');
      expect(getHourGan('己', '子')).toBe('甲');
    });

    it('乙庚丙作初', () => {
      expect(getHourGan('乙', '子')).toBe('丙');
      expect(getHourGan('庚', '子')).toBe('丙');
    });

    it('丙辛从戊起', () => {
      expect(getHourGan('丙', '子')).toBe('戊');
      expect(getHourGan('辛', '子')).toBe('戊');
    });

    it('丁壬庚子居', () => {
      expect(getHourGan('丁', '子')).toBe('庚');
      expect(getHourGan('壬', '子')).toBe('庚');
    });

    it('戊癸何方发，壬子是真途', () => {
      expect(getHourGan('戊', '子')).toBe('壬');
      expect(getHourGan('癸', '子')).toBe('壬');
    });

    it('应正确计算其他时辰', () => {
      expect(getHourGan('甲', '丑')).toBe('乙'); // 甲子时后
      expect(getHourGan('甲', '寅')).toBe('丙'); // 甲子时后第三个时辰
    });

    it('应抛出错误对于无效日干', () => {
      expect(() => getHourGan('X' as any, '子')).toThrow('Invalid day gan');
    });

    it('应抛出错误对于无效时支', () => {
      expect(() => getHourGan('甲', 'X' as any)).toThrow('Invalid day gan or hour zhi');
    });
  });

  describe('getHourZhi', () => {
    it('23点应为子时', () => {
      expect(getHourZhi(23)).toBe('子');
    });

    it('0点应为子时', () => {
      expect(getHourZhi(0)).toBe('子');
    });

    it('1点应为丑时', () => {
      expect(getHourZhi(1)).toBe('丑');
    });

    it('12点应为午时', () => {
      expect(getHourZhi(12)).toBe('午');
    });

    it('23点前应为亥时', () => {
      expect(getHourZhi(22)).toBe('亥');
    });
  });

  describe('getHourGanZhi', () => {
    it('应正确计算时柱', () => {
      const result = getHourGanZhi('甲', 0);
      expect(result.gan).toBe('甲');
      expect(result.zhi).toBe('子');
    });
  });
});
