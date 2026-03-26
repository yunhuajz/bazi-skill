// ============================================================================
// bazi-skill 使用示例
// 演示：八字排盘始终使用真太阳时
// ============================================================================

import { paiPan, paiPanString, calculateShiShen, paiPanByCity, paiPanByLocation } from '../src';

// 示例1：公历输入（自动使用北京时间真太阳时）
console.log('=== 示例1：公历输入（默认北京时间真太阳时） ===');
const birthTime1 = {
  year: 1984,
  month: 2,
  day: 15,
  hour: 8,
};
console.log(paiPanString(birthTime1));

// 示例2：农历输入自动转公历，再转真太阳时
console.log('\n=== 示例2：农历输入 → 公历 → 真太阳时 ===');
const lunarBirthTime = {
  year: 1984,
  month: 1,  // 农历正月
  day: 15,   // 农历十五
  hour: 8,
  isLunar: true,  // 标记为农历
};
console.log(paiPanString(lunarBirthTime));

// 示例3：使用城市名进行真太阳时计算
console.log('\n=== 示例3：使用城市名（真太阳时） ===');
console.log(paiPanString({
  year: 1990,
  month: 5,
  day: 15,
  hour: 12,
  minute: 0,
  location: { cityName: '成都' },  // 成都经度约104°E，比北京时间晚约64分钟
}));

// 示例4：直接使用经纬度进行真太阳时计算
console.log('\n=== 示例4：使用经纬度（真太阳时） ===');
console.log(paiPanString({
  year: 1990,
  month: 5,
  day: 15,
  hour: 12,
  minute: 0,
  location: { longitude: 106.55, latitude: 29.56 },  // 重庆
}));

// 示例5：农历+真太阳时组合
console.log('\n=== 示例5：农历 + 真太阳时组合 ===');
console.log(paiPanString({
  year: 1990,
  month: 4,
  day: 12,
  hour: 12,
  isLunar: true,
  location: { cityName: '乌鲁木齐' },  // 乌鲁木齐经度约87°E
}));

// 示例6：便捷函数 - 按城市排盘
console.log('\n=== 示例6：便捷函数 - 按城市排盘 ===');
const resultByCity = paiPanByCity(1990, 6, 15, 14, '上海');
console.log('转换信息：', resultByCity.conversions);

// 示例7：便捷函数 - 按经纬度排盘
console.log('\n=== 示例7：便捷函数 - 按经纬度排盘 ===');
const resultByLocation = paiPanByLocation(1990, 6, 15, 14, 121.47, { latitude: 31.23 });
console.log('转换信息：', resultByLocation.conversions);

// 示例8：获取详细的排盘结果
console.log('\n=== 示例8：详细排盘结果 ===');
const result = paiPan(birthTime1);

console.log('四柱：');
console.log('  年柱：', result.baZi.siZhu.nianZhu);
console.log('  月柱：', result.baZi.siZhu.yueZhu);
console.log('  日柱：', result.baZi.siZhu.riZhu);
console.log('  时柱：', result.baZi.siZhu.shiZhu);

console.log('\n十神（相对于日主）：');
console.log('  年干：', result.shiShen.tianGan.nianGan);
console.log('  月干：', result.shiShen.tianGan.yueGan);
console.log('  时干：', result.shiShen.tianGan.shiGan);

console.log('\n五行统计：', result.wuXing.count);
console.log('日主旺衰：', result.wuXing.wangShuai);

// 示例9：地支藏干十神
console.log('\n=== 示例9：地支藏干十神 ===');
console.log('年支藏干：', result.shiShen.diZhiCangGan.nianZhi);
console.log('月支藏干：', result.shiShen.diZhiCangGan.yueZhi);
console.log('日支藏干：', result.shiShen.diZhiCangGan.riZhi);
console.log('时支藏干：', result.shiShen.diZhiCangGan.shiZhi);

// 示例10：十神计算
console.log('\n=== 示例10：十神计算 ===');
const riGan = '甲';
const ganList = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;

console.log(`日主为${riGan}时，各天干的十神关系：`);
ganList.forEach(gan => {
  const shiShen = calculateShiShen(riGan, gan);
  console.log(`  ${gan} -> ${shiShen}`);
});

// 示例11：分析五行强弱
console.log('\n=== 示例11：五行强弱分析 ===');
const wuXingCount = result.wuXing.count;
const sortedWuXing = Object.entries(wuXingCount)
  .sort((a, b) => b[1] - a[1]);

console.log('五行排序（从多到少）：');
sortedWuXing.forEach(([wx, count]) => {
  console.log(`  ${wx}: ${count}个`);
});

console.log('\n=== 示例完成 ===');
