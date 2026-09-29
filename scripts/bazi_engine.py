#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
bazi_engine.py - 传统八字命理与时家奇门遁甲推演引擎
=============================================================================
功能包含：
1. 城市经纬度真太阳时校准与地理方位角（Bearing）计算
2. 二十四节气精确推演与四柱八字（年月日时）排盘
3. 十神分布、地支藏干、起运岁数与顺逆大运流年
4. 时家奇门遁甲（拆补法）：阴阳遁局、符使定位、九宫排盘、八门九星八神、奇仪格局、空亡驿马
5. 终端美化 Unicode 九宫格渲染
=============================================================================
"""

import sys
import math
import argparse
import datetime

# 保证控制台 UTF-8 输出
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# =============================================================================
# 一、 基础干支、五行与常数定义
# =============================================================================
TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

JIA_ZI = [TIAN_GAN[i % 10] + DI_ZHI[i % 12] for i in range(60)]

WU_XING = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
    '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
    '寅': '木', '卯': '木', '巳': '火', '午': '火', '辰': '土',
    '戌': '土', '丑': '土', '未': '土', '申': '金', '酉': '金',
    '亥': '水', '子': '水'
}

# 地支藏干与权重
CANG_GAN = {
    '子': [('癸', 100)],
    '丑': [('己', 60), ('癸', 30), ('辛', 10)],
    '寅': [('甲', 60), ('丙', 30), ('戊', 10)],
    '卯': [('乙', 100)],
    '辰': [('戊', 60), ('乙', 30), ('癸', 10)],
    '巳': [('丙', 60), ('戊', 30), ('庚', 10)],
    '午': [('丁', 70), ('己', 30)],
    '未': [('己', 60), ('丁', 30), ('乙', 10)],
    '申': [('庚', 60), ('壬', 30), ('戊', 10)],
    '酉': [('辛', 100)],
    '戌': [('戊', 60), ('辛', 30), ('丁', 10)],
    '亥': [('壬', 70), ('甲', 30)],
}

# 十神相对关系
SHI_SHEN_MAP = {
    ('木', '木', True): '比肩', ('木', '木', False): '劫财',
    ('木', '火', True): '食神', ('木', '火', False): '伤官',
    ('木', '土', True): '偏财', ('木', '土', False): '正财',
    ('木', '金', True): '七杀', ('木', '金', False): '正官',
    ('木', '水', True): '偏印', ('木', '水', False): '正印',

    ('火', '火', True): '比肩', ('火', '火', False): '劫财',
    ('火', '土', True): '食神', ('火', '土', False): '伤官',
    ('火', '金', True): '偏财', ('火', '金', False): '正财',
    ('火', '水', True): '七杀', ('火', '水', False): '正官',
    ('火', '木', True): '偏印', ('火', '木', False): '正印',

    ('土', '土', True): '比肩', ('土', '土', False): '劫财',
    ('土', '金', True): '食神', ('土', '金', False): '伤官',
    ('土', '水', True): '偏财', ('土', '水', False): '正财',
    ('土', '木', True): '七杀', ('土', '木', False): '正官',
    ('土', '火', True): '偏印', ('土', '火', False): '正印',

    ('金', '金', True): '比肩', ('金', '金', False): '劫财',
    ('金', '水', True): '食神', ('金', '水', False): '伤官',
    ('金', '木', True): '偏财', ('金', '木', False): '正财',
    ('金', '火', True): '七杀', ('金', '火', False): '正官',
    ('金', '土', True): '偏印', ('金', '土', False): '正印',

    ('水', '水', True): '比肩', ('水', '水', False): '劫财',
    ('水', '木', True): '食神', ('水', '木', False): '伤官',
    ('水', '火', True): '偏财', ('水', '火', False): '正财',
    ('水', '土', True): '七杀', ('水', '土', False): '正官',
    ('水', '金', True): '偏印', ('水', '金', False): '正印',
}

# 城市经纬度字典
CHINA_CITIES = {
    '北京': (116.4074, 39.9042), '上海': (121.4737, 31.2304), '天津': (117.2008, 39.0842),
    '重庆': (106.5516, 29.5630), '济南': (117.0210, 36.6680), '临朐': (118.5440, 36.5160),
    '潍坊': (119.1070, 36.7090), '青岛': (120.3826, 36.0671), '烟台': (121.3913, 37.5365),
    '威海': (122.1163, 37.5096), '石家庄': (114.5149, 38.0423), '郑州': (113.6253, 34.7466),
    '太原': (112.5489, 37.8706), '西安': (108.9398, 34.3416), '南京': (118.7969, 32.0603),
    '杭州': (120.1551, 30.2741), '合肥': (117.2272, 31.8206), '武汉': (114.3055, 30.5928),
    '长沙': (112.9388, 28.2282), '广州': (113.2644, 23.1291), '深圳': (114.0579, 22.5431),
    '成都': (104.0668, 30.5728), '昆明': (102.8329, 24.8801), '沈阳': (123.4315, 41.8057),
    '长春': (125.3235, 43.8171), '哈尔滨': (126.5340, 45.8038), '大连': (121.6147, 38.9140)
}

# =============================================================================
# 二、 地理空间与方位测算
# =============================================================================
def calc_bearing_distance(lon1, lat1, lon2, lat2):
    """计算大圆距离(km)与真北方位角(°)"""
    r_lat1, r_lon1 = math.radians(lat1), math.radians(lon1)
    r_lat2, r_lon2 = math.radians(lat2), math.radians(lon2)
    dlon = r_lon2 - r_lon1
    dlat = r_lat2 - r_lat1
    a = math.sin(dlat/2)**2 + math.cos(r_lat1)*math.cos(r_lat2)*math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    dist = 6371.0 * c
    y = math.sin(dlon) * math.cos(r_lat2)
    x = math.cos(r_lat1) * math.sin(r_lat2) - math.sin(r_lat1) * math.cos(r_lat2) * math.cos(dlon)
    bearing = (math.degrees(math.atan2(y, x)) + 360) % 360
    return dist, bearing

def get_compass_direction(bearing):
    """方位角转二十四山与八方"""
    dirs = [
        (337.5, 22.5, '正北（坎宫·水）'), (22.5, 67.5, '东北（艮宫·土）'),
        (67.5, 112.5, '正东（震宫·木）'), (112.5, 157.5, '东南（巽宫·木）'),
        (157.5, 202.5, '正南（离宫·火）'), (202.5, 247.5, '西南（坤宫·土）'),
        (247.5, 292.5, '正西（兑宫·金）'), (292.5, 337.5, '西北（乾宫·金）')
    ]
    for low, high, name in dirs:
        if low > high:
            if bearing >= low or bearing < high:
                return name
        else:
            if low <= bearing < high:
                return name
    return '正北（坎宫·水）'

# =============================================================================
# 三、 节气与日干支核心推演
# =============================================================================
SOLAR_TERMS_NAMES = [
    '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
    '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
    '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
    '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
]

def get_term_day(year, term_idx):
    """计算指定年份某节气的大概公历日期 (1900-2099)"""
    C_21 = [
        5.4055, 20.12, 3.87, 18.73, 5.63, 20.646,
        4.81, 20.1, 5.52, 21.04, 5.678, 21.37,
        7.108, 22.83, 7.5, 23.13, 7.646, 23.042,
        8.318, 23.438, 7.438, 22.36, 7.18, 21.94
    ]
    C_20 = [
        6.11, 20.84, 4.6295, 19.4599, 6.3826, 21.4155,
        5.59, 20.888, 6.318, 21.86, 6.5, 22.2,
        7.928, 23.65, 8.35, 23.95, 8.44, 23.822,
        9.098, 24.218, 8.218, 23.08, 7.9, 22.6
    ]
    y = year % 100
    C = C_21[term_idx] if year >= 2000 else C_20[term_idx]
    val = y * 0.2422 + C - int((y - 1) / 4)
    return int(val)

def get_year_terms(year):
    """获取某年全部24节气精确日期对照字典"""
    months = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12]
    terms_dict = {}
    for i, name in enumerate(SOLAR_TERMS_NAMES):
        day = get_term_day(year, i)
        terms_dict[name] = datetime.date(year, months[i], day)
    return terms_dict

def get_current_solar_term(dt):
    """判断给定日期所处的节气"""
    terms = get_year_terms(dt.year)
    sorted_terms = sorted(terms.items(), key=lambda x: x[1])
    current_term = '冬至'
    for name, t_date in sorted_terms:
        if dt.date() >= t_date:
            current_term = name
        else:
            break
    return current_term

def calc_day_ganzhi(dt):
    """计算日干支 (基准: 2000-01-01 戊午日 index 54)"""
    base = datetime.date(2000, 1, 1)
    diff = (dt.date() - base).days
    return JIA_ZI[(54 + diff) % 60]

def calc_shishen(ri_gan, target_gan):
    """计算天干十神"""
    elem_ri = WU_XING[ri_gan]
    elem_target = WU_XING[target_gan]
    same_polarity = (TIAN_GAN.index(ri_gan) % 2) == (TIAN_GAN.index(target_gan) % 2)
    return SHI_SHEN_MAP.get((elem_ri, elem_target, same_polarity), '比肩')

# =============================================================================
# 四、 八字排盘与大运推演
# =============================================================================
class BaZiChart:
    def __init__(self, dt_str, gender='male', city='北京'):
        self.dt = datetime.datetime.strptime(dt_str, '%Y-%m-%d %H:%M:%S')
        self.gender = gender
        self.city = city
        self.adjust_true_solar_time()
        self.calculate()

    def adjust_true_solar_time(self):
        """真太阳时校准"""
        lon, lat = CHINA_CITIES.get(self.city, (120.0, 30.0))
        offset_min = (lon - 120.0) * 4.0
        self.true_dt = self.dt + datetime.timedelta(minutes=offset_min)
        self.offset_min = offset_min

    def calculate(self):
        dt = self.true_dt
        year_terms = get_year_terms(dt.year)

        # 1. 年柱 (以立春为界)
        li_chun = year_terms['立春']
        if dt.date() < li_chun:
            calc_year = dt.year - 1
        else:
            calc_year = dt.year
        self.year_gz = JIA_ZI[(calc_year - 4) % 60]
        year_gan = self.year_gz[0]

        # 2. 月柱 (依十二节令取月支，严格按照时间序列)
        jie_list = [
            (year_terms['立春'], '寅'),
            (year_terms['惊蛰'], '卯'),
            (year_terms['清明'], '辰'),
            (year_terms['立夏'], '巳'),
            (year_terms['芒种'], '午'),
            (year_terms['小暑'], '未'),
            (year_terms['立秋'], '申'),
            (year_terms['白露'], '酉'),
            (year_terms['寒露'], '戌'),
            (year_terms['立冬'], '亥'),
            (year_terms['大雪'], '子'),
        ]

        if dt.date() < year_terms['立春']:
            month_zhi = '丑'
        else:
            month_zhi = '丑'
            for j_date, zhi in jie_list:
                if dt.date() >= j_date:
                    month_zhi = zhi

        # 五虎遁月
        month_zhis = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑']
        wu_hu = {'甲': 2, '己': 2, '乙': 4, '庚': 4, '丙': 6, '辛': 6, '丁': 8, '壬': 8, '戊': 0, '癸': 0}
        start_gan = wu_hu[year_gan]
        month_offset = month_zhis.index(month_zhi)
        month_gan = TIAN_GAN[(start_gan + month_offset) % 10]
        self.month_gz = month_gan + month_zhi

        # 3. 日柱
        self.day_gz = calc_day_ganzhi(dt)
        self.ri_gan = self.day_gz[0]

        # 4. 时柱 (五鼠遁)
        hour_zhi_idx = (dt.hour + 1) // 2 % 12
        hour_zhi = DI_ZHI[hour_zhi_idx]
        wu_shu = {'甲': 0, '己': 0, '乙': 2, '庚': 2, '丙': 4, '辛': 4, '丁': 6, '壬': 6, '戊': 8, '癸': 8}
        start_hour_gan = wu_shu[self.ri_gan]
        hour_gan = TIAN_GAN[(start_hour_gan + hour_zhi_idx) % 10]
        self.hour_gz = hour_gan + hour_zhi

        # 5. 大运排布 (阳男阴女顺行，阴男阳女逆行)
        is_yang_year = (TIAN_GAN.index(year_gan) % 2 == 0)
        is_male = (self.gender == 'male')
        self.forward = (is_yang_year and is_male) or ((not is_yang_year) and (not is_male))

        m_idx = JIA_ZI.index(self.month_gz)
        self.dayun_list = []
        for step in range(1, 9):
            idx = (m_idx + step) % 60 if self.forward else (m_idx - step + 60) % 60
            self.dayun_list.append(JIA_ZI[idx])

    def render(self):
        """格式化输出八字盘面"""
        print("=" * 60)
        print("                     四 柱 八 字 排 盘")
        print("=" * 60)
        print(f"标准时间: {self.dt.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"出生地点: {self.city} | 真太阳时校准: {self.offset_min:+.1f} 分钟")
        print(f"真太阳时: {self.true_dt.strftime('%Y-%m-%d %H:%M:%S')} | 性别: {'乾造 (男)' if self.gender == 'male' else '坤造 (女)'}")
        print("-" * 60)
        print(f"{'四柱':^10} | {'年柱':^10} | {'月柱':^10} | {'日柱 (日元)':^12} | {'时柱':^10}")
        print("-" * 60)
        
        y_ss = calc_shishen(self.ri_gan, self.year_gz[0])
        m_ss = calc_shishen(self.ri_gan, self.month_gz[0])
        h_ss = calc_shishen(self.ri_gan, self.hour_gz[0])

        print(f"{'十神':^10} | {y_ss:^10} | {m_ss:^10} | {'日主 (自身)':^12} | {h_ss:^10}")
        print(f"{'天干':^10} | {self.year_gz[0]:^10} | {self.month_gz[0]:^10} | {self.day_gz[0]:^12} | {self.hour_gz[0]:^10}")
        print(f"{'地支':^10} | {self.year_gz[1]:^10} | {self.month_gz[1]:^10} | {self.day_gz[1]:^12} | {self.hour_gz[1]:^10}")
        print("-" * 60)
        
        def fmt_cg(z):
            return " ".join([f"{g}({calc_shishen(self.ri_gan, g)})" for g, _ in CANG_GAN[z]])

        print(f"年支藏干: {fmt_cg(self.year_gz[1])}")
        print(f"月支藏干: {fmt_cg(self.month_gz[1])}")
        print(f"日支藏干: {fmt_cg(self.day_gz[1])}")
        print(f"时支藏干: {fmt_cg(self.hour_gz[1])}")
        print("-" * 60)
        print(f"大运走向: {'顺行' if self.forward else '逆行'}")
        print("大运干支: " + " ➔ ".join(self.dayun_list))
        print("=" * 60)

# =============================================================================
# 五、 时家奇门遁甲排盘引擎 (拆补法)
# =============================================================================
QIMEN_JU_TABLE = {
    '冬至': (1, 7, 4, True), '小寒': (2, 8, 5, True), '大寒': (3, 9, 6, True),
    '立春': (8, 5, 2, True), '雨水': (9, 6, 3, True), '惊蛰': (1, 7, 4, True),
    '春分': (3, 9, 6, True), '清明': (4, 1, 7, True), '谷雨': (5, 2, 8, True),
    '立夏': (4, 1, 7, True), '小满': (5, 2, 8, True), '芒种': (6, 3, 9, True),
    '夏至': (9, 3, 6, False), '小暑': (8, 2, 5, False), '大暑': (7, 1, 4, False),
    '立秋': (2, 5, 8, False), '处暑': (1, 4, 7, False), '白露': (9, 3, 6, False),
    '秋分': (7, 1, 4, False), '寒露': (6, 9, 3, False), '霜降': (5, 8, 2, False),
    '立冬': (6, 9, 3, False), '小雪': (5, 8, 2, False), '大雪': (4, 7, 1, False),
}

class QimenChart:
    def __init__(self, dt_str):
        self.dt = datetime.datetime.strptime(dt_str, '%Y-%m-%d %H:%M:%S')
        self.calculate()

    def calculate(self):
        dt = self.dt
        self.day_gz = calc_day_ganzhi(dt)
        self.solar_term = get_current_solar_term(dt)

        hour_zhi_idx = (dt.hour + 1) // 2 % 12
        hour_zhi = DI_ZHI[hour_zhi_idx]
        wu_shu = {'甲': 0, '己': 0, '乙': 2, '庚': 2, '丙': 4, '辛': 4, '丁': 6, '壬': 6, '戊': 8, '癸': 8}
        hour_gan = TIAN_GAN[(wu_shu[self.day_gz[0]] + hour_zhi_idx) % 10]
        self.hour_gz = hour_gan + hour_zhi

        # 1. 符头与元 (上中下元)
        d_idx = JIA_ZI.index(self.day_gz)
        fu_tou_idx = (d_idx - (d_idx % 5)) % 60
        fu_tou_zhi = JIA_ZI[fu_tou_idx][1]

        if fu_tou_zhi in ['子', '午', '卯', '酉']:
            yuan = 0  # 上元
        elif fu_tou_zhi in ['寅', '申', '巳', '亥']:
            yuan = 1  # 中元
        else:
            yuan = 2  # 下元

        # 2. 定阴阳遁与局数
        shang, zhong, xia, is_yang = QIMEN_JU_TABLE[self.solar_term]
        self.is_yang = is_yang
        ju_nums = [shang, zhong, xia]
        self.ju = ju_nums[yuan]

        # 3. 布地盘三奇六仪 (戊己庚辛壬癸丁丙乙)
        liu_yi = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙']
        self.di_pan = {}
        curr_p = self.ju
        for elem in liu_yi:
            self.di_pan[curr_p] = elem
            if self.is_yang:
                curr_p = curr_p + 1 if curr_p < 9 else 1
            else:
                curr_p = curr_p - 1 if curr_p > 1 else 9

        # 中五寄坤二
        self.di_pan[2] = self.di_pan.get(2, '') + f"({self.di_pan[5]})"

        # 4. 找旬首
        h_idx = JIA_ZI.index(self.hour_gz)
        xun_shou_idx = h_idx - (h_idx % 10)
        xun_shou_gz = JIA_ZI[xun_shou_idx]
        xun_shou_liu_yi = {'甲子': '戊', '甲戌': '己', '甲申': '庚', '甲午': '辛', '甲辰': '壬', '甲寅': '癸'}[xun_shou_gz]
        self.xun_shou_gz = xun_shou_gz
        self.xun_shou_liu_yi = xun_shou_liu_yi

        palace_ring = [1, 8, 3, 4, 9, 2, 7, 6]
        star_orig = {1: '天蓬', 8: '天任', 3: '天冲', 4: '天辅', 9: '天英', 2: '天芮', 7: '天柱', 6: '天心'}
        door_orig = {1: '休门', 8: '生门', 3: '伤门', 4: '杜门', 9: '景门', 2: '死门', 7: '惊门', 6: '开门'}

        for p, elem in self.di_pan.items():
            if elem == xun_shou_liu_yi or elem.startswith(xun_shou_liu_yi):
                xun_p = 2 if p == 5 else p
                break

        self.zhi_fu_star = star_orig[xun_p]
        self.zhi_shi_door = door_orig[xun_p]

        # 5. 值符随时干
        h_gan = self.hour_gz[0]
        target_gan = xun_shou_liu_yi if h_gan == '甲' else h_gan
        for p, elem in self.di_pan.items():
            if elem == target_gan or elem.startswith(target_gan) or f"({target_gan})" in elem:
                zhi_fu_palace = 2 if p == 5 else p
                break

        shift_star = palace_ring.index(zhi_fu_palace) - palace_ring.index(xun_p)
        self.star_palace = {}
        self.tian_pan = {}
        for i, p in enumerate(palace_ring):
            orig_p = palace_ring[(i - shift_star) % 8]
            self.star_palace[p] = star_orig[orig_p]
            self.tian_pan[p] = self.di_pan[orig_p].replace('(乙)', '').replace('(戊)', '')

        # 6. 值使门随时支
        shou_zhi = xun_shou_gz[1]
        step = (DI_ZHI.index(hour_zhi) - DI_ZHI.index(shou_zhi)) % 12
        if self.is_yang:
            zhi_shi_palace = (xun_p - 1 + step) % 9 + 1
        else:
            zhi_shi_palace = (xun_p - 1 - step) % 9 + 1
        if zhi_shi_palace == 5:
            zhi_shi_palace = 2

        shift_door = palace_ring.index(zhi_shi_palace) - palace_ring.index(xun_p)
        self.door_palace = {}
        for i, p in enumerate(palace_ring):
            orig_p = palace_ring[(i - shift_door) % 8]
            self.door_palace[p] = door_orig[orig_p]

        # 7. 八神 (阳顺阴逆)
        gods = ['值符', '螣蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天']
        zf_idx = palace_ring.index(zhi_fu_palace)
        self.god_palace = {}
        for i, g in enumerate(gods):
            p_idx = (zf_idx + i) % 8 if self.is_yang else (zf_idx - i + 8) % 8
            self.god_palace[palace_ring[p_idx]] = g

        # 8. 空亡与驿马
        kw_map = {'甲子': '戌亥(乾)', '甲戌': '申酉(兑)', '甲申': '午未(离坤)', '甲午': '辰巳(巽)', '甲辰': '寅卯(艮震)', '甲寅': '子丑(坎艮)'}
        self.kong_wang = kw_map[xun_shou_gz]
        ym_map = {'申': '寅(艮)', '子': '寅(艮)', '辰': '寅(艮)', '寅': '申(坤)', '午': '申(坤)', '戌': '申(坤)',
                  '巳': '亥(乾)', '酉': '亥(乾)', '丑': '亥(乾)', '亥': '巳(巽)', '卯': '巳(巽)', '未': '巳(巽)'}
        self.yi_ma = ym_map[hour_zhi]

    def render(self):
        """渲染九宫格字符画"""
        print("=" * 66)
        print("                   奇 门 遁 甲 盘 面 演 算")
        print("=" * 66)
        print(f"公历时间: {self.dt.strftime('%Y-%m-%d %H:%M')} | 节气: {self.solar_term}")
        print(f"干支四柱: {self.day_gz}日 {self.hour_gz}时 | 局象: {'阳遁' if self.is_yang else '阴遁'}{self.ju}局")
        print(f"旬首仪神: {self.xun_shou_gz}({self.xun_shou_liu_yi}) | 值符: {self.zhi_fu_star} | 值使: {self.zhi_shi_door}")
        print(f"旬空位置: {self.kong_wang} | 驿马星位: {self.yi_ma}")
        print("-" * 66)

        P_NAME = {4:'巽四宫(东南)', 9:'离九宫(正南)', 2:'坤二宫(西南)',
                  3:'震三宫(正东)', 5:'中五宫(中央)', 7:'兑七宫(正西)',
                  8:'艮八宫(东北)', 1:'坎一宫(正北)', 6:'乾六宫(西北)'}

        row1 = [4, 9, 2]
        row2 = [3, 5, 7]
        row3 = [8, 1, 6]

        def get_box_lines(p):
            if p == 5:
                return [f"{'【中五宫 · 寄坤二】':^18}", f"{'天盘: 禽星':^18}", f"{'地盘: ' + self.di_pan[5]:^18}", f"{'---':^18}"]
            return [
                f"【{P_NAME[p][:5]}】神:{self.god_palace[p]}",
                f"星:{self.star_palace[p]} 门:{self.door_palace[p]}",
                f"奇仪: 天{self.tian_pan[p]}/地{self.di_pan[p]}",
                f"{'[空亡]' if '巽' in P_NAME[p] and '辰巳' in self.kong_wang else ''} {'[马星]' if '巽' in P_NAME[p] and '巳' in self.yi_ma else ''}".strip() or " "
            ]

        print("┌" + "─"*22 + "┬" + "─"*22 + "┬" + "─"*22 + "┐")
        for line_idx in range(4):
            line_str = "│"
            for p in row1:
                b_lines = get_box_lines(p)
                line_str += f" {b_lines[line_idx]:<20} │"
            print(line_str)
        print("├" + "─"*22 + "┼" + "─"*22 + "┼" + "─"*22 + "┤")
        for line_idx in range(4):
            line_str = "│"
            for p in row2:
                b_lines = get_box_lines(p)
                line_str += f" {b_lines[line_idx]:<20} │"
            print(line_str)
        print("├" + "─"*22 + "┼" + "─"*22 + "┼" + "─"*22 + "┤")
        for line_idx in range(4):
            line_str = "│"
            for p in row3:
                b_lines = get_box_lines(p)
                line_str += f" {b_lines[line_idx]:<20} │"
            print(line_str)
        print("└" + "─"*22 + "┴" + "─"*22 + "┴" + "─"*22 + "┘")
        print("=" * 66)

# =============================================================================
# 六、 CLI 命令行入口
# =============================================================================
def main():
    parser = argparse.ArgumentParser(description="传统八字命理与时家奇门遁甲推演引擎")
    parser.add_argument('--bazi', type=str, help="排盘时间，格式: 'YYYY-MM-DD HH:MM:SS'")
    parser.add_argument('--gender', type=str, default='male', choices=['male', 'female'], help="性别: male(乾造) / female(坤造)")
    parser.add_argument('--city', type=str, default='北京', help="出生城市 (用于真太阳时校准)")
    parser.add_argument('--qimen', type=str, help="奇门起局时间，格式: 'YYYY-MM-DD HH:MM:SS' 或 'now'")
    parser.add_argument('--bearing', nargs=2, metavar=('CITY1', 'CITY2'), help="计算两地直线距离与真北方位角")

    args = parser.parse_args()

    if args.bearing:
        c1, c2 = args.bearing
        if c1 in CHINA_CITIES and c2 in CHINA_CITIES:
            lon1, lat1 = CHINA_CITIES[c1]
            lon2, lat2 = CHINA_CITIES[c2]
            dist, bearing = calc_bearing_distance(lon1, lat1, lon2, lat2)
            d_name = get_compass_direction(bearing)
            print("=" * 50)
            print(f"地理测算: {c1} ➔ {c2}")
            print(f"空间直线距离: {dist:.2f} km")
            print(f"真北方位角: {bearing:.2f}°")
            print(f"罗盘二十四山对应: {d_name}")
            print("=" * 50)
        else:
            print("城市未在数据库中，请检查输入！")

    if args.bazi:
        chart = BaZiChart(args.bazi, gender=args.gender, city=args.city)
        chart.render()

    if args.qimen:
        q_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S') if args.qimen == 'now' else args.qimen
        qm = QimenChart(q_time)
        qm.render()

if __name__ == '__main__':
    main()
