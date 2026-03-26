import {
  WU_XING_SHENG, WU_XING_KE, WU_XING_COLOR, WU_XING_DIRECTION, WU_XING_SEASON,
  isXiangSheng, isXiangKe, getShengWo, getWoSheng, getKeWo, getWoKe
} from '../src/data/wuxing';

describe('五行数据测试', () => {
  describe('相生关系', () => {
    it('木生火', () => {
      expect(WU_XING_SHENG['木']).toBe('火');
    });

    it('火生土', () => {
      expect(WU_XING_SHENG['火']).toBe('土');
    });

    it('土生金', () => {
      expect(WU_XING_SHENG['土']).toBe('金');
    });

    it('金生水', () => {
      expect(WU_XING_SHENG['金']).toBe('水');
    });

    it('水生木', () => {
      expect(WU_XING_SHENG['水']).toBe('木');
    });
  });

  describe('相克关系', () => {
    it('木克土', () => {
      expect(WU_XING_KE['木']).toBe('土');
    });

    it('土克水', () => {
      expect(WU_XING_KE['土']).toBe('水');
    });

    it('水克火', () => {
      expect(WU_XING_KE['水']).toBe('火');
    });

    it('火克金', () => {
      expect(WU_XING_KE['火']).toBe('金');
    });

    it('金克木', () => {
      expect(WU_XING_KE['金']).toBe('木');
    });
  });

  describe('五行颜色', () => {
    it('应正确定义颜色', () => {
      expect(WU_XING_COLOR['木']).toBe('青');
      expect(WU_XING_COLOR['火']).toBe('赤');
      expect(WU_XING_COLOR['土']).toBe('黄');
      expect(WU_XING_COLOR['金']).toBe('白');
      expect(WU_XING_COLOR['水']).toBe('黑');
    });
  });

  describe('五行方位', () => {
    it('应正确定义方位', () => {
      expect(WU_XING_DIRECTION['木']).toBe('东');
      expect(WU_XING_DIRECTION['火']).toBe('南');
      expect(WU_XING_DIRECTION['土']).toBe('中');
      expect(WU_XING_DIRECTION['金']).toBe('西');
      expect(WU_XING_DIRECTION['水']).toBe('北');
    });
  });

  describe('五行季节', () => {
    it('应正确定义季节', () => {
      expect(WU_XING_SEASON['木']).toBe('春');
      expect(WU_XING_SEASON['火']).toBe('夏');
      expect(WU_XING_SEASON['土']).toBe('四季');
      expect(WU_XING_SEASON['金']).toBe('秋');
      expect(WU_XING_SEASON['水']).toBe('冬');
    });
  });

  describe('isXiangSheng', () => {
    it('应正确判断相生', () => {
      expect(isXiangSheng('木', '火')).toBe(true);
      expect(isXiangSheng('火', '土')).toBe(true);
      expect(isXiangSheng('水', '火')).toBe(false);
    });
  });

  describe('isXiangKe', () => {
    it('应正确判断相克', () => {
      expect(isXiangKe('木', '土')).toBe(true);
      expect(isXiangKe('火', '金')).toBe(true);
      expect(isXiangKe('木', '火')).toBe(false);
    });
  });

  describe('getShengWo', () => {
    it('应返回生我的五行', () => {
      expect(getShengWo('火')).toBe('木');
      expect(getShengWo('土')).toBe('火');
      expect(getShengWo('金')).toBe('土');
      expect(getShengWo('水')).toBe('金');
      expect(getShengWo('木')).toBe('水');
    });
  });

  describe('getWoSheng', () => {
    it('应返回我生的五行', () => {
      expect(getWoSheng('木')).toBe('火');
      expect(getWoSheng('火')).toBe('土');
      expect(getWoSheng('土')).toBe('金');
      expect(getWoSheng('金')).toBe('水');
      expect(getWoSheng('水')).toBe('木');
    });
  });

  describe('getKeWo', () => {
    it('应返回克我的五行', () => {
      expect(getKeWo('木')).toBe('金');
      expect(getKeWo('火')).toBe('水');
      expect(getKeWo('土')).toBe('木');
      expect(getKeWo('金')).toBe('火');
      expect(getKeWo('水')).toBe('土');
    });
  });

  describe('getWoKe', () => {
    it('应返回我克的五行', () => {
      expect(getWoKe('木')).toBe('土');
      expect(getWoKe('火')).toBe('金');
      expect(getWoKe('土')).toBe('水');
      expect(getWoKe('金')).toBe('木');
      expect(getWoKe('水')).toBe('火');
    });
  });
});
