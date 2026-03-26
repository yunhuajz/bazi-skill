// ============================================================================
// 真太阳时计算模块
// ============================================================================

export interface Location {
  longitude: number;  // 经度，东经为正，西经为负
  latitude: number;   // 纬度，北纬为正，南纬为负
}

/**
 * 中国主要城市经纬度数据
 */
export const CHINA_CITIES: Record<string, Location> = {
  // 直辖市
  '北京': { longitude: 116.4074, latitude: 39.9042 },
  '上海': { longitude: 121.4737, latitude: 31.2304 },
  '天津': { longitude: 117.2008, latitude: 39.0842 },
  '重庆': { longitude: 106.5516, latitude: 29.5630 },
  // 省会及主要城市
  '广州': { longitude: 113.2644, latitude: 23.1291 },
  '深圳': { longitude: 114.0579, latitude: 22.5431 },
  '杭州': { longitude: 120.1551, latitude: 30.2741 },
  '南京': { longitude: 118.7969, latitude: 32.0603 },
  '成都': { longitude: 104.0668, latitude: 30.5728 },
  '武汉': { longitude: 114.3055, latitude: 30.5928 },
  '西安': { longitude: 108.9398, latitude: 34.3416 },
  '郑州': { longitude: 113.6253, latitude: 34.7466 },
  '长沙': { longitude: 112.9388, latitude: 28.2282 },
  '沈阳': { longitude: 123.4315, latitude: 41.8057 },
  '青岛': { longitude: 120.3826, latitude: 36.0671 },
  '大连': { longitude: 121.6147, latitude: 38.9140 },
  '厦门': { longitude: 118.0894, latitude: 24.4798 },
  '昆明': { longitude: 102.8329, latitude: 24.8801 },
  '合肥': { longitude: 117.2272, latitude: 31.8206 },
  '南昌': { longitude: 115.8540, latitude: 28.6820 },
  '济南': { longitude: 117.1205, latitude: 36.6510 },
  '太原': { longitude: 112.5489, latitude: 37.8706 },
  '石家庄': { longitude: 114.5149, latitude: 38.0423 },
  '长春': { longitude: 125.3235, latitude: 43.8171 },
  '哈尔滨': { longitude: 126.5340, latitude: 45.8038 },
  '福州': { longitude: 119.2965, latitude: 26.0745 },
  '南宁': { longitude: 108.3661, latitude: 22.8172 },
  '贵阳': { longitude: 106.6302, latitude: 26.6477 },
  '兰州': { longitude: 103.8343, latitude: 36.0611 },
  '海口': { longitude: 110.3492, latitude: 20.0174 },
  '呼和浩特': { longitude: 111.7492, latitude: 40.8414 },
  '乌鲁木齐': { longitude: 87.6168, latitude: 43.8256 },
  '拉萨': { longitude: 91.1409, latitude: 29.6456 },
  '银川': { longitude: 106.2309, latitude: 38.4872 },
  '西宁': { longitude: 101.7782, latitude: 36.6171 },
  '台北': { longitude: 121.5654, latitude: 25.0330 },
  '香港': { longitude: 114.1694, latitude: 22.3193 },
  '澳门': { longitude: 113.5491, latitude: 22.1987 },
  // 其他城市（按拼音排序）
  '安阳': { longitude: 114.3924, latitude: 36.0976 },
  '包头': { longitude: 109.8404, latitude: 40.6574 },
  '宝鸡': { longitude: 107.2370, latitude: 34.3630 },
  '保定': { longitude: 115.4646, latitude: 38.8740 },
  '常州': { longitude: 119.9741, latitude: 31.8112 },
  '潮州': { longitude: 116.6328, latitude: 23.6567 },
  '大理': { longitude: 100.2676, latitude: 25.6065 },
  '丹东': { longitude: 124.3547, latitude: 40.0005 },
  '佛山': { longitude: 113.1214, latitude: 23.0215 },
  '桂林': { longitude: 110.1794, latitude: 25.2345 },
  '湖州': { longitude: 120.1024, latitude: 30.8672 },
  '吉林': { longitude: 126.5530, latitude: 43.8378 },
  '嘉兴': { longitude: 120.7555, latitude: 30.7450 },
  '开封': { longitude: 114.3073, latitude: 34.7973 },
  '洛阳': { longitude: 112.4345, latitude: 34.6185 },
  '丽江': { longitude: 100.2330, latitude: 26.8721 },
  '临沂': { longitude: 118.3564, latitude: 35.1042 },
  '柳州': { longitude: 109.4161, latitude: 24.3255 },
  '牡丹江': { longitude: 129.6335, latitude: 44.5510 },
  '宁波': { longitude: 121.5503, latitude: 29.8739 },
  '齐齐哈尔': { longitude: 123.9182, latitude: 47.3543 },
  '秦皇岛': { longitude: 119.6005, latitude: 39.9354 },
  '泉州': { longitude: 118.6759, latitude: 24.8744 },
  '三亚': { longitude: 109.5121, latitude: 18.2525 },
  '苏州': { longitude: 120.5853, latitude: 31.2989 },
  '泰安': { longitude: 117.0876, latitude: 36.2003 },
  '威海': { longitude: 122.1204, latitude: 37.5135 },
  '温州': { longitude: 120.6994, latitude: 27.9943 },
  '无锡': { longitude: 120.3119, latitude: 31.4912 },
  '芜湖': { longitude: 118.4331, latitude: 31.3529 },
  '烟台': { longitude: 121.4481, latitude: 37.4638 },
  '扬州': { longitude: 119.4210, latitude: 32.3942 },
  '宜昌': { longitude: 111.2864, latitude: 30.6919 },
  '岳阳': { longitude: 113.1289, latitude: 29.3573 },
  '湛江': { longitude: 110.3594, latitude: 21.2707 },
  '肇庆': { longitude: 112.4652, latitude: 23.0472 },
  '镇江': { longitude: 119.4250, latitude: 32.1896 },
  '中山': { longitude: 113.3928, latitude: 22.5180 },
  '珠海': { longitude: 113.5767, latitude: 22.2707 },
  '淄博': { longitude: 118.0551, latitude: 36.8135 },
};

/**
 * 通过城市名称获取经纬度
 * @param cityName 城市名称
 * @returns 经纬度，如果找不到返回null
 */
export function getLocationByCity(cityName: string): Location | null {
  // 尝试直接匹配
  if (CHINA_CITIES[cityName]) {
    return CHINA_CITIES[cityName];
  }

  // 尝试去除"市"后缀
  if (cityName.endsWith('市')) {
    const name = cityName.slice(0, -1);
    if (CHINA_CITIES[name]) {
      return CHINA_CITIES[name];
    }
  }

  // 尝试添加"市"后缀
  if (!cityName.endsWith('市')) {
    const name = cityName + '市';
    if (CHINA_CITIES[name]) {
      return CHINA_CITIES[name];
    }
  }

  return null;
}

/**
 * 计算均时差（equation of time）
 * 真太阳时与平太阳时的差值
 * @param date 日期
 * @returns 均时差，单位分钟
 */
function getEquationOfTime(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 计算从当年1月1日开始的天数
  const startOfYear = new Date(year, 0, 1);
  const currentDate = new Date(year, month - 1, day);
  const dayOfYear = Math.floor((currentDate.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;

  // 计算黄经（近似值）
  const n = dayOfYear - 1;
  const L = 280.46 + 0.9856474 * n;
  const g = 357.528 + 0.9856003 * n;

  // 归一化到0-360度
  const L_norm = L % 360;
  const g_rad = (g * Math.PI) / 180;

  // 均时差计算（单位：度）
  const E = 1.915 * Math.sin(g_rad) + 0.020 * Math.sin(2 * g_rad);
  const lambda = L_norm + E;

  // 转换为分钟（每度4分钟）
  const equationOfTime = (L_norm - lambda) * 4;

  return equationOfTime;
}

/**
 * 计算真太阳时
 * @param standardTime 标准时区时间（公历）
 * @param location 出生地点经纬度
 * @returns 真太阳时（公历）
 */
export function getTrueSolarTime(
  standardTime: { year: number; month: number; day: number; hour: number; minute?: number },
  location: Location
): { year: number; month: number; day: number; hour: number; minute: number; adjustmentMinutes: number } {
  const { year, month, day, hour, minute = 0 } = standardTime;
  const { longitude } = location;

  // 中国标准时间以120°E为基准
  const STANDARD_LONGITUDE = 120;

  // 1. 计算经度差造成的时间差
  // 每度经度相差4分钟
  const longitudeDiff = longitude - STANDARD_LONGITUDE;
  const longitudeTimeDiff = longitudeDiff * 4; // 单位：分钟

  // 2. 计算均时差
  const date = new Date(year, month - 1, day);
  const equationOfTime = getEquationOfTime(date);

  // 3. 总调整时间（分钟）
  const totalAdjustment = longitudeTimeDiff + equationOfTime;

  // 4. 转换为时间
  const standardMinutes = hour * 60 + minute;
  const trueSolarMinutes = standardMinutes + totalAdjustment;

  // 5. 处理日期变化
  let finalMinutes = trueSolarMinutes;
  let dayOffset = 0;

  if (finalMinutes < 0) {
    dayOffset = -1;
    finalMinutes += 24 * 60;
  } else if (finalMinutes >= 24 * 60) {
    dayOffset = 1;
    finalMinutes -= 24 * 60;
  }

  const finalHour = Math.floor(finalMinutes / 60);
  const finalMinute = Math.floor(finalMinutes % 60);

  // 6. 计算最终日期
  const resultDate = new Date(year, month - 1, day + dayOffset);

  return {
    year: resultDate.getFullYear(),
    month: resultDate.getMonth() + 1,
    day: resultDate.getDate(),
    hour: finalHour,
    minute: finalMinute,
    adjustmentMinutes: totalAdjustment,
  };
}

/**
 * 格式化真太阳时调整信息
 * @param adjustmentMinutes 调整分钟数
 * @returns 格式化字符串
 */
export function formatAdjustment(adjustmentMinutes: number): string {
  const sign = adjustmentMinutes >= 0 ? '+' : '';
  const hours = Math.floor(Math.abs(adjustmentMinutes) / 60);
  const minutes = Math.floor(Math.abs(adjustmentMinutes) % 60);

  if (hours > 0) {
    return `${sign}${hours}小时${minutes}分钟`;
  }
  return `${sign}${minutes}分钟`;
}

/**
 * 验证经纬度是否有效
 * @param location 经纬度
 * @returns 是否有效
 */
export function isValidLocation(location: Location): boolean {
  return (
    location.longitude >= -180 &&
    location.longitude <= 180 &&
    location.latitude >= -90 &&
    location.latitude <= 90
  );
}
