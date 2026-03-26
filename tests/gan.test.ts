import {
  getGanInfo, getGanYinYang, getGanWuXing, nextGan, prevGan,
  TIAN_GAN, GAN_INDEX
} from '../src/data/gan';

describe('天干数据测试', () => {
  describe('TIAN_GAN数据', () => {
    it('应包含10个天干', () => {
      expect(TIAN_GAN).toHaveLength(10);
    });

    it('应按顺序排列', () => {
      expect(TIAN_GAN[0].name).toBe('甲');
      expect(TIAN_GAN[1].name).toBe('乙');
      expect(TIAN_GAN[9].name).toBe('癸');
    });

    it('应正确标记阴阳', () => {
      expect(TIAN_GAN[0].yinYang).toBe('阳'); // 甲
      expect(TIAN_GAN[1].yinYang).toBe('阴'); // 乙
      expect(TIAN_GAN[2].yinYang).toBe('阳'); // 丙
    });

    it('应正确标记五行', () => {
      expect(TIAN_GAN[0].wuXing).toBe('木'); // 甲
      expect(TIAN_GAN[2].wuXing).toBe('火'); // 丙
      expect(TIAN_GAN[4].wuXing).toBe('土'); // 戊
      expect(TIAN_GAN[6].wuXing).toBe('金'); // 庚
      expect(TIAN_GAN[8].wuXing).toBe('水'); // 壬
    });
  });

  describe('GAN_INDEX映射', () => {
    it('应正确映射天干索引', () => {
      expect(GAN_INDEX['甲']).toBe(0);
      expect(GAN_INDEX['乙']).toBe(1);
      expect(GAN_INDEX['癸']).toBe(9);
    });
  });

  describe('getGanInfo', () => {
    it('应返回正确的天干信息', () => {
      const gan = getGanInfo('甲');
      expect(gan).toBeDefined();
      expect(gan?.name).toBe('甲');
      expect(gan?.yinYang).toBe('阳');
      expect(gan?.wuXing).toBe('木');
    });

    it('应返回undefined对于无效天干', () => {
      const gan = getGanInfo('X' as any);
      expect(gan).toBeUndefined();
    });
  });

  describe('getGanYinYang', () => {
    it('应返回正确的阴阳属性', () => {
      expect(getGanYinYang('甲')).toBe('阳');
      expect(getGanYinYang('乙')).toBe('阴');
    });

    it('应返回空字符串对于无效天干', () => {
      expect(getGanYinYang('X')).toBe('');
    });
  });

  describe('getGanWuXing', () => {
    it('应返回正确的五行属性', () => {
      expect(getGanWuXing('甲')).toBe('木');
      expect(getGanWuXing('丙')).toBe('火');
      expect(getGanWuXing('戊')).toBe('土');
      expect(getGanWuXing('庚')).toBe('金');
      expect(getGanWuXing('壬')).toBe('水');
    });

    it('应返回空字符串对于无效天干', () => {
      expect(getGanWuXing('X')).toBe('');
    });
  });

  describe('nextGan', () => {
    it('应返回下一个天干', () => {
      expect(nextGan('甲')).toBe('乙');
      expect(nextGan('乙')).toBe('丙');
    });

    it('应循环回到甲', () => {
      expect(nextGan('癸')).toBe('甲');
    });

    it('应返回空字符串对于无效天干', () => {
      expect(nextGan('X')).toBe('');
    });
  });

  describe('prevGan', () => {
    it('应返回上一个天干', () => {
      expect(prevGan('乙')).toBe('甲');
      expect(prevGan('丙')).toBe('乙');
    });

    it('应循环回到癸', () => {
      expect(prevGan('甲')).toBe('癸');
    });

    it('应返回空字符串对于无效天干', () => {
      expect(prevGan('X')).toBe('');
    });
  });
});
