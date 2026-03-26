import {
  SHI_SHEN_LIST, SHI_SHEN_CATEGORY, calculateShiShen, getShiShenWuXing,
  isZheng, isJi, SHI_SHEN_DESCRIPTION
} from '../src/data/shishen';
import { Gan } from '../src/types';

describe('十神数据测试', () => {
  describe('SHI_SHEN_LIST', () => {
    it('应包含10个十神', () => {
      expect(SHI_SHEN_LIST).toHaveLength(10);
    });

    it('应包含所有十神', () => {
      expect(SHI_SHEN_LIST).toContain('比肩');
      expect(SHI_SHEN_LIST).toContain('劫财');
      expect(SHI_SHEN_LIST).toContain('食神');
      expect(SHI_SHEN_LIST).toContain('伤官');
      expect(SHI_SHEN_LIST).toContain('正财');
      expect(SHI_SHEN_LIST).toContain('偏财');
      expect(SHI_SHEN_LIST).toContain('正官');
      expect(SHI_SHEN_LIST).toContain('七杀');
      expect(SHI_SHEN_LIST).toContain('正印');
      expect(SHI_SHEN_LIST).toContain('偏印');
    });
  });

  describe('SHI_SHEN_CATEGORY', () => {
    it('应正确定义同我', () => {
      expect(SHI_SHEN_CATEGORY.tongWo).toContain('比肩');
      expect(SHI_SHEN_CATEGORY.tongWo).toContain('劫财');
    });

    it('应正确定义我生', () => {
      expect(SHI_SHEN_CATEGORY.woSheng).toContain('食神');
      expect(SHI_SHEN_CATEGORY.woSheng).toContain('伤官');
    });

    it('应正确定义我克', () => {
      expect(SHI_SHEN_CATEGORY.woKe).toContain('正财');
      expect(SHI_SHEN_CATEGORY.woKe).toContain('偏财');
    });

    it('应正确定义克我', () => {
      expect(SHI_SHEN_CATEGORY.keWo).toContain('正官');
      expect(SHI_SHEN_CATEGORY.keWo).toContain('七杀');
    });

    it('应正确定义生我', () => {
      expect(SHI_SHEN_CATEGORY.shengWo).toContain('正印');
      expect(SHI_SHEN_CATEGORY.shengWo).toContain('偏印');
    });
  });

  describe('calculateShiShen', () => {
    describe('阳日干甲', () => {
      const riGan: Gan = '甲';

      it('甲见甲应为比肩', () => {
        expect(calculateShiShen(riGan, '甲')).toBe('比肩');
      });

      it('甲见乙应为劫财', () => {
        expect(calculateShiShen(riGan, '乙')).toBe('劫财');
      });

      it('甲见丙应为食神', () => {
        expect(calculateShiShen(riGan, '丙')).toBe('食神');
      });

      it('甲见丁应为伤官', () => {
        expect(calculateShiShen(riGan, '丁')).toBe('伤官');
      });

      it('甲见戊应为偏财', () => {
        expect(calculateShiShen(riGan, '戊')).toBe('偏财');
      });

      it('甲见己应为正财', () => {
        expect(calculateShiShen(riGan, '己')).toBe('正财');
      });

      it('甲见庚应为七杀', () => {
        expect(calculateShiShen(riGan, '庚')).toBe('七杀');
      });

      it('甲见辛应为正官', () => {
        expect(calculateShiShen(riGan, '辛')).toBe('正官');
      });

      it('甲见壬应为偏印', () => {
        expect(calculateShiShen(riGan, '壬')).toBe('偏印');
      });

      it('甲见癸应为正印', () => {
        expect(calculateShiShen(riGan, '癸')).toBe('正印');
      });
    });

    describe('阴日干乙', () => {
      const riGan: Gan = '乙';

      it('乙见甲应为比肩', () => {
        expect(calculateShiShen(riGan, '甲')).toBe('比肩');
      });

      it('乙见乙应为劫财', () => {
        expect(calculateShiShen(riGan, '乙')).toBe('劫财');
      });

      it('乙见丙应为伤官', () => {
        expect(calculateShiShen(riGan, '丙')).toBe('伤官');
      });

      it('乙见丁应为食神', () => {
        expect(calculateShiShen(riGan, '丁')).toBe('食神');
      });
    });

    describe('其他日干', () => {
      it('丙见甲应为偏印', () => {
        expect(calculateShiShen('丙', '甲')).toBe('偏印');
      });

      it('戊见甲应为七杀', () => {
        expect(calculateShiShen('戊', '甲')).toBe('七杀');
      });

      it('庚见甲应为偏财', () => {
        expect(calculateShiShen('庚', '甲')).toBe('偏财');
      });

      it('壬见甲应为食神', () => {
        expect(calculateShiShen('壬', '甲')).toBe('食神');
      });
    });

    describe('错误处理', () => {
      it('应抛出错误对于无效日干', () => {
        expect(() => calculateShiShen('X' as Gan, '甲')).toThrow('Invalid 日干');
      });

      it('应抛出错误对于无效目标天干', () => {
        expect(() => calculateShiShen('甲', 'X' as Gan)).toThrow('Invalid target 天干');
      });
    });
  });

  describe('getShiShenWuXing', () => {
    it('应正确返回十神五行（木日主）', () => {
      expect(getShiShenWuXing('比肩', '木')).toBe('木');
      expect(getShiShenWuXing('劫财', '木')).toBe('木');
      expect(getShiShenWuXing('食神', '木')).toBe('火');
      expect(getShiShenWuXing('伤官', '木')).toBe('火');
      expect(getShiShenWuXing('正财', '木')).toBe('土');
      expect(getShiShenWuXing('偏财', '木')).toBe('土');
      expect(getShiShenWuXing('正官', '木')).toBe('金');
      expect(getShiShenWuXing('七杀', '木')).toBe('金');
      expect(getShiShenWuXing('正印', '木')).toBe('水');
      expect(getShiShenWuXing('偏印', '木')).toBe('水');
    });

    it('应正确返回十神五行（火日主）', () => {
      expect(getShiShenWuXing('食神', '火')).toBe('土');
      expect(getShiShenWuXing('伤官', '火')).toBe('土');
      expect(getShiShenWuXing('正财', '火')).toBe('金');
      expect(getShiShenWuXing('偏财', '火')).toBe('金');
    });
  });

  describe('isZheng', () => {
    it('应正确判断正十神', () => {
      expect(isZheng('比肩')).toBe(true);
      expect(isZheng('食神')).toBe(true);
      expect(isZheng('正财')).toBe(true);
      expect(isZheng('正官')).toBe(true);
      expect(isZheng('正印')).toBe(true);
    });

    it('应正确判断偏十神', () => {
      expect(isZheng('劫财')).toBe(false);
      expect(isZheng('伤官')).toBe(false);
      expect(isZheng('偏财')).toBe(false);
      expect(isZheng('七杀')).toBe(false);
      expect(isZheng('偏印')).toBe(false);
    });
  });

  describe('isJi', () => {
    it('应正确判断吉神', () => {
      expect(isJi('正印')).toBe(true);
      expect(isJi('正官')).toBe(true);
      expect(isJi('食神')).toBe(true);
      expect(isJi('正财')).toBe(true);
    });

    it('应正确判断凶神', () => {
      expect(isJi('七杀')).toBe(false);
      expect(isJi('伤官')).toBe(false);
      expect(isJi('劫财')).toBe(false);
      expect(isJi('偏印')).toBe(false);
    });

    it('应正确判断中性', () => {
      expect(isJi('比肩')).toBeNull();
      expect(isJi('偏财')).toBeNull();
    });
  });

  describe('SHI_SHEN_DESCRIPTION', () => {
    it('应包含所有十神的描述', () => {
      SHI_SHEN_LIST.forEach(shiShen => {
        expect(SHI_SHEN_DESCRIPTION[shiShen]).toBeDefined();
        expect(SHI_SHEN_DESCRIPTION[shiShen].length).toBeGreaterThan(0);
      });
    });
  });
});
