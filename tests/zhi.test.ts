import {
  getZhiInfo, getZhiYinYang, getZhiWuXing, nextZhi, prevZhi,
  DI_ZHI, ZHI_INDEX, LIU_CHONG, LIU_HE, SAN_HE, SAN_HUI
} from '../src/data/zhi';

describe('地支数据测试', () => {
  describe('DI_ZHI数据', () => {
    it('应包含12个地支', () => {
      expect(DI_ZHI).toHaveLength(12);
    });

    it('应按顺序排列', () => {
      expect(DI_ZHI[0].name).toBe('子');
      expect(DI_ZHI[1].name).toBe('丑');
      expect(DI_ZHI[11].name).toBe('亥');
    });

    it('应正确标记生肖', () => {
      expect(DI_ZHI[0].shengXiao).toBe('鼠');
      expect(DI_ZHI[1].shengXiao).toBe('牛');
      expect(DI_ZHI[11].shengXiao).toBe('猪');
    });

    it('应正确标记藏干', () => {
      expect(DI_ZHI[0].cangGan).toEqual(['癸']); // 子
      expect(DI_ZHI[2].cangGan).toEqual(['甲', '丙', '戊']); // 寅
    });
  });

  describe('ZHI_INDEX映射', () => {
    it('应正确映射地支索引', () => {
      expect(ZHI_INDEX['子']).toBe(0);
      expect(ZHI_INDEX['丑']).toBe(1);
      expect(ZHI_INDEX['亥']).toBe(11);
    });
  });

  describe('getZhiInfo', () => {
    it('应返回正确的地支信息', () => {
      const zhi = getZhiInfo('子');
      expect(zhi).toBeDefined();
      expect(zhi?.name).toBe('子');
      expect(zhi?.yinYang).toBe('阳');
      expect(zhi?.wuXing).toBe('水');
      expect(zhi?.shengXiao).toBe('鼠');
    });

    it('应返回undefined对于无效地支', () => {
      const zhi = getZhiInfo('X' as any);
      expect(zhi).toBeUndefined();
    });
  });

  describe('getZhiYinYang', () => {
    it('应返回正确的阴阳属性', () => {
      expect(getZhiYinYang('子')).toBe('阳');
      expect(getZhiYinYang('丑')).toBe('阴');
    });

    it('应返回空字符串对于无效地支', () => {
      expect(getZhiYinYang('X')).toBe('');
    });
  });

  describe('getZhiWuXing', () => {
    it('应返回正确的五行属性', () => {
      expect(getZhiWuXing('寅')).toBe('木');
      expect(getZhiWuXing('巳')).toBe('火');
      expect(getZhiWuXing('丑')).toBe('土');
      expect(getZhiWuXing('申')).toBe('金');
      expect(getZhiWuXing('子')).toBe('水');
    });

    it('应返回空字符串对于无效地支', () => {
      expect(getZhiWuXing('X')).toBe('');
    });
  });

  describe('nextZhi', () => {
    it('应返回下一个地支', () => {
      expect(nextZhi('子')).toBe('丑');
      expect(nextZhi('丑')).toBe('寅');
    });

    it('应循环回到子', () => {
      expect(nextZhi('亥')).toBe('子');
    });

    it('应返回空字符串对于无效地支', () => {
      expect(nextZhi('X')).toBe('');
    });
  });

  describe('prevZhi', () => {
    it('应返回上一个地支', () => {
      expect(prevZhi('丑')).toBe('子');
      expect(prevZhi('寅')).toBe('丑');
    });

    it('应循环回到亥', () => {
      expect(prevZhi('子')).toBe('亥');
    });

    it('应返回空字符串对于无效地支', () => {
      expect(prevZhi('X')).toBe('');
    });
  });

  describe('六冲关系', () => {
    it('应正确定义六冲', () => {
      expect(LIU_CHONG['子']).toBe('午');
      expect(LIU_CHONG['午']).toBe('子');
      expect(LIU_CHONG['寅']).toBe('申');
      expect(LIU_CHONG['申']).toBe('寅');
    });
  });

  describe('六合关系', () => {
    it('应正确定义六合', () => {
      expect(LIU_HE['子']).toBe('丑');
      expect(LIU_HE['丑']).toBe('子');
      expect(LIU_HE['寅']).toBe('亥');
      expect(LIU_HE['亥']).toBe('寅');
    });
  });

  describe('三合关系', () => {
    it('应正确定义三合', () => {
      expect(SAN_HE[0]).toContain('申');
      expect(SAN_HE[0]).toContain('子');
      expect(SAN_HE[0]).toContain('辰');
    });
  });

  describe('三会关系', () => {
    it('应正确定义三会', () => {
      expect(SAN_HUI[0]).toContain('寅');
      expect(SAN_HUI[0]).toContain('卯');
      expect(SAN_HUI[0]).toContain('辰');
    });
  });
});
