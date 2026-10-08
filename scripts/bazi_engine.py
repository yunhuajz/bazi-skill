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
import unicodedata
import functools


# 保证控制台 UTF-8 输出
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass


def display_width(text):
    """计算字符串在终端中的实际显示列宽（全角CJK占2列宽，半角占1列宽）"""
    width = 0
    for ch in str(text):
        w = unicodedata.east_asian_width(ch)
        if w in ('W', 'F'):
            width += 2
        else:
            width += 1
    return width


def pad_display_width(text, target_width, align='left'):
    """基于终端显示列宽对齐字符串"""
    s = str(text)
    current_w = display_width(s)
    pad_len = max(0, target_width - current_w)
    if align == 'center':
        left = pad_len // 2
        right = pad_len - left
        return " " * left + s + " " * right
    elif align == 'right':
        return " " * pad_len + s
    else:  # left
        return s + " " * pad_len


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

# 城市经纬度字典（覆盖全国各省直辖市、地级市及重点区县）
CHINA_CITIES = {
    # 直辖市与特别行政区
    '北京': (116.4074, 39.9042), '上海': (121.4737, 31.2304), '天津': (117.2008, 39.0842), '重庆': (106.5516, 29.5630),
    '香港': (114.1733, 22.3200), '澳门': (113.5491, 22.1987), '台北': (121.5654, 25.0330), '高雄': (120.3014, 22.6273),
    # 河北
    '石家庄': (114.5149, 38.0423), '唐山': (118.1802, 39.6309), '秦皇岛': (119.6005, 39.9354), '邯郸': (114.5390, 36.6256),
    '邢台': (114.5048, 37.0706), '保定': (115.4648, 38.8738), '张家口': (114.8863, 40.7684), '承德': (117.9627, 40.9530),
    '沧州': (116.8388, 38.3045), '廊坊': (116.6838, 39.5380), '衡水': (115.6703, 37.7389), '雄安': (115.9866, 39.0345),
    # 山西
    '太原': (112.5489, 37.8706), '大同': (113.3001, 40.0768), '阳泉': (113.5805, 37.8570), '长治': (113.1163, 36.1954),
    '晋城': (112.8513, 35.4976), '朔州': (112.4334, 39.3313), '晋中': (112.7527, 37.6875), '运城': (111.0074, 35.0267),
    '忻州': (112.7342, 38.4167), '临汾': (111.5190, 36.0880), '吕梁': (111.1343, 37.5244),
    # 内蒙古
    '呼和浩特': (111.7492, 40.8426), '包头': (109.8404, 40.6582), '乌海': (106.8256, 39.6737), '赤峰': (118.9568, 42.2753),
    '通辽': (122.2632, 43.6174), '鄂尔多斯': (109.9903, 39.8171), '呼伦贝尔': (119.7658, 49.2122), '巴彦淖尔': (107.4170, 40.7575),
    '乌兰察布': (113.1326, 41.0341), '兴安': (122.0703, 46.0763), '锡林郭勒': (116.0909, 43.9440), '阿拉善': (105.7064, 38.8448),
    # 辽宁
    '沈阳': (123.4315, 41.8057), '大连': (121.6147, 38.9140), '鞍山': (122.9943, 41.1086), '抚顺': (123.9572, 41.8794),
    '本溪': (123.7665, 41.2941), '丹东': (124.3838, 40.1249), '锦州': (121.1270, 41.0951), '营口': (122.2352, 40.6674),
    '阜新': (121.6489, 42.0118), '辽阳': (123.1733, 41.2679), '盘锦': (122.0707, 41.1199), '铁岭': (123.8442, 42.2905),
    '朝阳': (120.4512, 41.5768), '葫芦岛': (120.8564, 40.7556),
    # 吉林
    '长春': (125.3235, 43.8171), '吉林': (126.5530, 43.8436), '四平': (124.3708, 43.1703), '辽源': (125.1453, 42.9027),
    '通化': (125.9365, 41.7212), '白山': (126.4278, 41.9426), '松原': (124.8236, 45.1418), '白城': (122.8411, 45.6190),
    '延边': (129.5132, 42.9048), '延吉': (129.5132, 42.9048),
    # 黑龙江
    '哈尔滨': (126.5340, 45.8038), '齐齐哈尔': (123.9535, 47.3481), '鸡西': (130.9759, 45.3000), '鹤岗': (130.2775, 47.3321),
    '双鸭山': (131.1573, 46.6434), '大庆': (125.1127, 46.5878), '伊春': (128.8994, 47.7248), '佳木斯': (130.3616, 46.8096),
    '七台河': (130.8459, 45.7750), '牡丹江': (129.6186, 44.5826), '黑河': (127.4990, 50.2496), '绥化': (126.9929, 46.6374),
    '大兴安岭': (124.7115, 52.3353),
    # 江苏
    '南京': (118.7969, 32.0603), '无锡': (120.3017, 31.5747), '徐州': (117.1848, 34.2618), '常州': (119.9740, 31.8106),
    '苏州': (120.6195, 31.2994), '南通': (120.8943, 31.9802), '连云港': (119.1788, 34.6000), '淮安': (119.0213, 33.5975),
    '盐城': (120.1399, 33.3776), '扬州': (119.4210, 32.3932), '镇江': (119.4528, 32.2044), '泰州': (119.9229, 32.4555),
    '宿迁': (118.2752, 33.9630), '昆山': (120.9807, 31.3846), '江阴': (120.2852, 31.9198), '常熟': (120.7523, 31.6537),
    # 浙江
    '杭州': (120.1551, 30.2741), '宁波': (121.5498, 29.8684), '温州': (120.6721, 28.0006), '嘉兴': (120.7509, 30.7627),
    '湖州': (120.1024, 30.8672), '绍兴': (120.5821, 29.9971), '金华': (119.6495, 29.0895), '衢州': (118.8726, 28.9417),
    '舟山': (122.1069, 29.9972), '台州': (121.4286, 28.6614), '丽水': (119.9218, 28.4519), '义乌': (120.0744, 29.3056),
    # 安徽
    '合肥': (117.2272, 31.8206), '芜湖': (118.3765, 31.3263), '蚌埠': (117.3632, 32.9397), '淮南': (117.0183, 32.6476),
    '马鞍山': (118.5079, 31.6894), '淮北': (116.7947, 33.9717), '铜陵': (117.8166, 30.9299), '安庆': (117.0536, 30.5255),
    '黄山': (118.3173, 29.7092), '滁州': (118.3162, 32.3036), '阜阳': (115.8197, 32.8970), '宿州': (116.9840, 33.6339),
    '六安': (116.5077, 31.7529), '亳州': (115.7829, 33.8693), '池州': (117.4892, 30.6560), '宣城': (118.7579, 30.9407),
    '砀山': (116.3500, 34.4300),
    # 福建
    '福州': (119.3062, 26.0753), '厦门': (118.1102, 24.4905), '莆田': (119.0076, 25.4310), '三明': (117.6350, 26.2654),
    '泉州': (118.5894, 24.9089), '漳州': (117.6618, 24.5109), '南平': (118.1785, 26.6420), '龙岩': (117.0298, 25.0916),
    '宁德': (119.5271, 26.6593), '晋江': (118.5750, 24.7814),
    # 江西
    '南昌': (115.8579, 28.6830), '景德镇': (117.2147, 29.2926), '萍乡': (113.8546, 27.6229), '九江': (115.9928, 29.7120),
    '新余': (114.9308, 27.8108), '鹰潭': (117.0338, 28.2386), '赣州': (114.9403, 25.8509), '吉安': (114.9864, 27.1117),
    '宜春': (114.3911, 27.8043), '抚州': (116.3584, 27.9839), '上饶': (117.9712, 28.4444),
    # 山东
    '济南': (117.0210, 36.6680), '青岛': (120.3826, 36.0671), '淄博': (118.0476, 36.8149), '枣庄': (117.5579, 34.8564),
    '东营': (118.6647, 37.4346), '烟台': (121.3913, 37.5365), '潍坊': (119.1070, 36.7090), '济宁': (116.5872, 35.4154),
    '泰安': (117.1290, 36.1950), '威海': (122.1163, 37.5096), '日照': (119.4612, 35.4286), '临沂': (118.3564, 35.1047),
    '德州': (116.3074, 37.4540), '聊城': (115.9804, 36.4560), '滨州': (117.9707, 37.3820), '菏泽': (115.4694, 35.2465),
    '临朐': (118.5440, 36.5160), '寿光': (118.7401, 36.8812), '青州': (118.4795, 36.6850), '诸城': (119.4098, 35.9963),
    # 河南
    '郑州': (113.6253, 34.7466), '开封': (114.3414, 34.7970), '洛阳': (112.4540, 34.6197), '平顶山': (113.3077, 33.7352),
    '安阳': (114.3525, 36.1034), '鹤壁': (114.2954, 35.7482), '新乡': (113.8839, 35.3026), '焦作': (113.2383, 35.2390),
    '濮阳': (115.0413, 35.7682), '许昌': (113.8261, 34.0230), '漯河': (114.0264, 33.5758), '三门峡': (111.1944, 34.7773),
    '南阳': (112.5409, 32.9908), '商丘': (115.6505, 34.4371), '信阳': (114.0750, 32.1233), '周口': (114.6497, 33.6204),
    '驻马店': (114.0247, 32.9794), '济源': (112.5900, 35.0904),
    # 湖北
    '武汉': (114.3055, 30.5928), '黄石': (115.0770, 30.2201), '十堰': (110.7852, 32.6470), '宜昌': (111.2908, 30.7026),
    '襄阳': (112.1441, 32.0424), '鄂州': (114.8906, 30.3965), '荆门': (112.2043, 31.0354), '孝感': (113.9267, 30.9264),
    '荆州': (112.2382, 30.3269), '黄冈': (114.8794, 30.4477), '咸宁': (114.3289, 29.8328), '随州': (113.3738, 31.7179),
    '恩施': (109.4870, 30.2831), '仙桃': (113.4539, 30.3644), '天门': (113.1659, 30.6531), '潜江': (112.8969, 30.4212),
    # 湖南
    '长沙': (112.9388, 28.2282), '株洲': (113.1517, 27.8358), '湘潭': (112.9441, 27.8297), '衡阳': (112.6077, 26.9004),
    '邵阳': (111.4692, 27.2378), '岳阳': (113.1329, 29.3703), '常德': (111.6913, 29.0402), '张家界': (110.4799, 29.1274),
    '益阳': (112.3550, 28.5701), '郴州': (113.0321, 25.7936), '永州': (111.6080, 26.4345), '怀化': (109.9782, 27.5501),
    '娄底': (111.9940, 27.7028), '湘西': (109.7397, 28.3121),
    # 广东
    '广州': (113.2644, 23.1291), '韶关': (113.5915, 24.8013), '深圳': (114.0579, 22.5431), '珠海': (113.5767, 22.2707),
    '汕头': (116.7085, 23.3710), '佛山': (113.1228, 23.0288), '江门': (113.0815, 22.5787), '湛江': (110.3649, 21.2749),
    '茂名': (110.9192, 21.6598), '肇庆': (112.4725, 23.0515), '惠州': (114.4172, 23.1118), '梅州': (116.1176, 24.2991),
    '汕尾': (115.3642, 22.7745), '河源': (114.6978, 23.7463), '阳江': (111.9751, 21.8592), '清远': (113.0512, 23.6850),
    '东莞': (113.7518, 23.0207), '中山': (113.3824, 22.5211), '潮州': (116.6323, 23.6617), '揭阳': (116.3557, 23.5438),
    '云浮': (112.0444, 22.9298),
    # 广西
    '南宁': (108.3661, 22.8172), '柳州': (109.4117, 24.3146), '桂林': (110.2991, 25.2742), '梧州': (111.2976, 23.4748),
    '北海': (109.1193, 21.4733), '防城港': (108.3455, 21.6146), '钦州': (108.6242, 21.9671), '贵港': (109.6021, 23.0936),
    '玉林': (110.1544, 22.6314), '百色': (106.6163, 23.8977), '贺州': (111.5521, 24.4141), '河池': (108.0621, 24.6959),
    '来宾': (109.2298, 23.7338), '崇左': (107.3539, 22.4041),
    # 海南
    '海口': (110.3312, 20.0319), '三亚': (109.5083, 18.2479), '三沙': (112.3488, 16.8387), '儋州': (109.5768, 19.5175),
    '琼海': (110.4668, 19.2460), '文昌': (110.7539, 19.6129), '万宁': (110.3888, 18.7962), '东方': (108.6538, 19.1019),
    # 四川
    '成都': (104.0668, 30.5728), '自贡': (104.7734, 29.3528), '攀枝花': (101.7160, 26.5804), '泸州': (105.4419, 28.8891),
    '德阳': (104.3986, 31.1270), '绵阳': (104.7417, 31.4640), '广元': (105.8297, 32.4337), '遂宁': (105.5713, 30.5133),
    '内江': (105.0661, 29.5871), '乐山': (103.7613, 29.5820), '南充': (106.0829, 30.7953), '眉山': (103.8318, 30.0483),
    '宜宾': (104.6308, 28.7602), '广安': (106.6334, 30.4564), '达州': (107.5023, 31.2094), '雅安': (103.0010, 29.9877),
    '巴中': (106.7537, 31.8588), '资阳': (104.6419, 30.1222), '阿坝': (102.2214, 31.8998), '甘孜': (101.9638, 30.0507),
    '凉山': (102.2673, 27.8815),
    # 贵州
    '贵阳': (106.6302, 26.6477), '六盘水': (104.8467, 26.5846), '遵义': (106.9373, 27.7066), '安顺': (105.9321, 26.2455),
    '毕节': (105.2850, 27.3017), '铜仁': (109.1915, 27.7183), '黔西南': (104.8979, 25.0881), '黔东南': (107.9775, 26.5834),
    '黔南': (107.5172, 26.2582),
    # 云南
    '昆明': (102.8329, 24.8801), '曲靖': (103.7978, 25.5015), '玉溪': (102.5439, 24.3505), '保山': (99.1671, 25.1118),
    '昭通': (103.7172, 27.3369), '丽江': (100.2330, 26.8721), '普洱': (100.9723, 22.7773), '临沧': (100.0869, 23.8866),
    '楚雄': (101.5460, 25.0419), '红河': (103.3850, 23.3668), '文山': (104.2441, 23.3692), '西双版纳': (100.7979, 22.0017),
    '大理': (100.2257, 25.5894), '德宏': (98.5784, 24.4367), '怒江': (98.8543, 25.8509), '迪庆': (99.7065, 27.8269),
    # 西藏
    '拉萨': (91.1409, 29.6456), '日喀则': (88.8849, 29.2638), '昌都': (97.1785, 31.1369), '林芝': (94.3623, 29.6547),
    '山南': (91.7665, 29.2361), '那曲': (92.0602, 31.4760), '阿里': (80.1055, 32.5009),
    # 陕西
    '西安': (108.9398, 34.3416), '铜川': (108.9796, 34.9166), '宝鸡': (107.1449, 34.3693), '咸阳': (108.7051, 34.3294),
    '渭南': (109.5029, 34.4994), '延安': (109.4908, 36.5965), '汉中': (107.0286, 33.0777), '榆林': (109.7412, 38.2902),
    '安康': (109.0293, 32.6903), '商洛': (109.9397, 33.8683),
    # 甘肃
    '兰州': (103.8343, 36.0611), '嘉峪关': (98.2773, 39.7865), '金昌': (102.1879, 38.5142), '白银': (104.1736, 36.5457),
    '天水': (105.7249, 34.5785), '武威': (102.6347, 37.9299), '张掖': (100.4555, 38.9328), '平凉': (106.6846, 35.5427),
    '酒泉': (98.5108, 39.7444), '庆阳': (107.6384, 35.7342), '定西': (104.6263, 35.5796), '陇南': (104.9294, 33.3886),
    '临夏': (103.2105, 35.5992), '甘南': (102.9110, 34.9864),
    # 青海
    '西宁': (101.7782, 36.6171), '海东': (102.1033, 36.5029), '海北': (100.9010, 36.9594), '黄南': (102.0152, 35.5177),
    '海南': (100.6195, 36.2804), '果洛': (100.2421, 34.4736), '玉树': (97.0085, 33.0062), '海西': (97.3708, 37.3746), '格尔木': (94.9033, 36.4024),
    # 宁夏
    '银川': (106.2309, 38.4872), '石嘴山': (106.3762, 39.0133), '吴忠': (106.1994, 37.9862), '固原': (106.2852, 36.0046), '中卫': (105.1896, 37.5149),
    # 新疆
    '乌鲁木齐': (87.6168, 43.8256), '克拉玛依': (84.8739, 45.5959), '吐鲁番': (89.1841, 42.9476), '哈密': (93.5132, 42.8332),
    '昌吉': (87.3040, 44.0146), '博尔塔拉': (82.0748, 44.9004), '巴音郭楞': (86.1500, 41.7641), '阿克苏': (80.2634, 41.1718),
    '克孜勒苏': (76.1728, 39.7134), '喀什': (75.9891, 39.4677), '和田': (79.9253, 37.1107), '伊犁': (81.3179, 43.9219),
    '塔城': (82.9857, 46.7463), '阿勒泰': (88.1396, 47.8484), '石河子': (86.0411, 44.3059)
}


def get_city_coordinates(city_name):
    """获取城市经纬度，支持自动去除'特别行政区'/'自治州'/'地区'/'盟'/'市'/'县'/'区'等后缀模糊匹配"""
    if not city_name:
        return None
    name = str(city_name).strip()
    if name in CHINA_CITIES:
        return CHINA_CITIES[name]
    for suffix in ('特别行政区', '蒙古族自治州', '哈萨克自治州', '藏族自治州', '自治州', '地区', '盟', '市', '县', '区'):
        if name.endswith(suffix) and len(name) > len(suffix):
            base_name = name[:-len(suffix)]
            if base_name in CHINA_CITIES:
                return CHINA_CITIES[base_name]
    for k, v in CHINA_CITIES.items():
        if name.startswith(k) or k.startswith(name):
            return v
    return None


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
SOLAR_TERMS_INFO = [
    ('小寒', 285.0, 1, 5), ('大寒', 300.0, 1, 20),
    ('立春', 315.0, 2, 4), ('雨水', 330.0, 2, 19),
    ('惊蛰', 345.0, 3, 5), ('春分', 0.0, 3, 20),
    ('清明', 15.0, 4, 4),  ('谷雨', 30.0, 4, 20),
    ('立夏', 45.0, 5, 5),  ('小满', 60.0, 5, 21),
    ('芒种', 75.0, 6, 5),  ('夏至', 90.0, 6, 21),
    ('小暑', 105.0, 7, 7), ('大暑', 120.0, 7, 23),
    ('立秋', 135.0, 8, 7), ('处暑', 150.0, 8, 23),
    ('白露', 165.0, 9, 7), ('秋分', 180.0, 9, 23),
    ('寒露', 195.0, 10, 8),('霜降', 210.0, 10, 23),
    ('立冬', 225.0, 11, 7),('小雪', 240.0, 11, 22),
    ('大雪', 255.0, 12, 7),('冬至', 270.0, 12, 22)
]
SOLAR_TERMS_NAMES = [name for name, _, _, _ in SOLAR_TERMS_INFO]


def _julian_day(y, m, d, h=0, minute=0, s=0):
    if m <= 2:
        y -= 1
        m += 12
    A = int(y / 100)
    B = 2 - A + int(A / 4)
    return int(365.25 * (y + 4716)) + int(30.6001 * (m + 1)) + d + (h + minute / 60.0 + s / 3600.0) / 24.0 + B - 1524.5


def _jd_to_datetime_utc(jd):
    Z = int(jd + 0.5)
    F = (jd + 0.5) - Z
    alpha = int((Z - 1867216.25) / 36524.25) if Z >= 2299161 else 0
    A = Z + 1 + alpha - int(alpha / 4) if Z >= 2299161 else Z
    B = A + 1524
    C = int((B - 122.1) / 365.25)
    D = int(365.25 * C)
    E = int((B - D) / 30.6001)
    day_frac = B - D - int(30.6001 * E) + F
    day = int(day_frac)
    time_frac = (day_frac - day) * 24.0
    hour = int(time_frac)
    min_frac = (time_frac - hour) * 60.0
    minute = int(min_frac)
    second = int((min_frac - minute) * 60.0 + 0.5)
    month = E - 1 if E < 14 else E - 13
    year = C - 4716 if month > 2 else C - 4715
    return datetime.datetime(year, month, day, hour, minute, second)


def _sun_apparent_longitude(jd):
    T = (jd - 2451545.0) / 36525.0
    L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T
    M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T
    M_rad = math.radians(M % 360.0)
    C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * math.sin(M_rad)
    C += (0.019993 - 0.000101 * T) * math.sin(2 * M_rad)
    C += 0.000289 * math.sin(3 * M_rad)
    sun_true_lon = (L0 + C) % 360.0
    omega = (125.04 - 1934.136 * T) % 360.0
    apparent_lon = (sun_true_lon - 0.00569 - 0.00478 * math.sin(math.radians(omega))) % 360.0
    return apparent_lon


def _calc_solar_term_moment(year, target_deg, est_month, est_day):
    jd = _julian_day(year, est_month, est_day, 0, 0, 0)
    for _ in range(12):
        lon = _sun_apparent_longitude(jd)
        diff = (lon - target_deg + 180.0) % 360.0 - 180.0
        if abs(diff) < 1e-6:
            break
        jd -= diff / (360.0 / 365.25)
    dt_utc = _jd_to_datetime_utc(jd)
    return dt_utc + datetime.timedelta(hours=8)


@functools.lru_cache(maxsize=128)
def get_year_terms(year):
    """获取某年全部24节气的高精度时刻字典（返回北京时间 datetime.datetime，精确到分秒）"""
    terms_dict = {}
    for name, deg, m, d in SOLAR_TERMS_INFO:
        terms_dict[name] = _calc_solar_term_moment(year, deg, m, d)
    return terms_dict


def get_current_solar_term(dt):
    """判断给定时间所处的节气（支持 datetime.datetime 与 datetime.date，精确到分秒）"""
    if isinstance(dt, datetime.date) and not isinstance(dt, datetime.datetime):
        check_dt = datetime.datetime(dt.year, dt.month, dt.day, 12, 0, 0)
    else:
        check_dt = dt

    terms = get_year_terms(check_dt.year)
    sorted_terms = sorted(terms.items(), key=lambda x: x[1])
    current_term = '冬至'
    for name, t_dt in sorted_terms:
        if check_dt >= t_dt:
            current_term = name
        else:
            break
    if check_dt < sorted_terms[0][1]:
        prev_terms = get_year_terms(check_dt.year - 1)
        current_term = '冬至' if check_dt >= prev_terms['冬至'] else '大雪'
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
        coords = get_city_coordinates(self.city)
        if coords is not None:
            lon, lat = coords
            self.city_found = True
        else:
            lon, lat = (120.0, 39.9042)
            self.city_found = False
        offset_min = (lon - 120.0) * 4.0
        self.true_dt = self.dt + datetime.timedelta(minutes=offset_min)
        self.offset_min = offset_min


    def calculate(self):
        dt = self.true_dt
        year_terms = get_year_terms(dt.year)

        # 1. 年柱 (以立春时刻为界，精确到分秒)
        li_chun = year_terms['立春']
        if dt < li_chun:
            calc_year = dt.year - 1
        else:
            calc_year = dt.year
        self.year_gz = JIA_ZI[(calc_year - 4) % 60]
        year_gan = self.year_gz[0]

        # 2. 月柱 (依十二节令取月支，严格按照时间序列与精确时刻)
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

        if dt < year_terms['立春']:
            month_zhi = '丑'
        else:
            month_zhi = '丑'
            for j_date, zhi in jie_list:
                if dt >= j_date:
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

    P_NAME = {
        4: '巽四宫(东南)', 9: '离九宫(正南)', 2: '坤二宫(西南)',
        3: '震三宫(正东)', 5: '中五宫(中央)', 7: '兑七宫(正西)',
        8: '艮八宫(东北)', 1: '坎一宫(正北)', 6: '乾六宫(西北)'
    }

    def get_box_lines(self, p):
        """生成单宫位4行对齐文本（每行严格对齐至 24 终端列宽）"""
        if p == 5:
            return [
                pad_display_width("【中五宫 · 寄坤二】", 24, align='center'),
                pad_display_width("天盘: 禽星", 24, align='center'),
                pad_display_width("地盘: " + self.di_pan[5], 24, align='center'),
                pad_display_width("---", 24, align='center')
            ]

        p_full = self.P_NAME[p]
        p_char = p_full[0]  # 巽/离/坤/震/兑/艮/坎/乾
        is_kw = f"({p_char})" in self.kong_wang or p_char in self.kong_wang
        is_ym = f"({p_char})" in self.yi_ma

        tags = []
        if is_kw:
            tags.append("[空亡]")
        if is_ym:
            tags.append("[马星]")
        tag_str = " ".join(tags)

        return [
            pad_display_width(f"【{p_full}】神:{self.god_palace[p]}", 24),
            pad_display_width(f"星:{self.star_palace[p]} 门:{self.door_palace[p]}", 24),
            pad_display_width(f"奇仪: 天{self.tian_pan[p]}/地{self.di_pan[p]}", 24),
            pad_display_width(tag_str, 24)
        ]

    def render(self):
        """渲染九宫格字符画（全角等宽严格对齐）"""
        cell_w = 24
        border_h = "─" * (cell_w + 2)
        banner_w = (cell_w + 2) * 3 + 4

        print("=" * banner_w)
        print(pad_display_width("奇 门 遁 甲 盘 面 演 算", banner_w, align='center'))
        print("=" * banner_w)
        print(f"公历时间: {self.dt.strftime('%Y-%m-%d %H:%M')} | 节气: {self.solar_term}")
        print(f"干支四柱: {self.day_gz}日 {self.hour_gz}时 | 局象: {'阳遁' if self.is_yang else '阴遁'}{self.ju}局")
        print(f"旬首仪神: {self.xun_shou_gz}({self.xun_shou_liu_yi}) | 值符: {self.zhi_fu_star} | 值使: {self.zhi_shi_door}")
        print(f"旬空位置: {self.kong_wang} | 驿马星位: {self.yi_ma}")
        print("-" * banner_w)

        row1 = [4, 9, 2]
        row2 = [3, 5, 7]
        row3 = [8, 1, 6]

        print(f"┌{border_h}┬{border_h}┬{border_h}┐")
        for line_idx in range(4):
            line_str = "│"
            for p in row1:
                b_lines = self.get_box_lines(p)
                line_str += f" {b_lines[line_idx]} │"
            print(line_str)
        print(f"├{border_h}┼{border_h}┼{border_h}┤")
        for line_idx in range(4):
            line_str = "│"
            for p in row2:
                b_lines = self.get_box_lines(p)
                line_str += f" {b_lines[line_idx]} │"
            print(line_str)
        print(f"├{border_h}┼{border_h}┼{border_h}┤")
        for line_idx in range(4):
            line_str = "│"
            for p in row3:
                b_lines = self.get_box_lines(p)
                line_str += f" {b_lines[line_idx]} │"
            print(line_str)
        print(f"└{border_h}┴{border_h}┴{border_h}┘")
        print("=" * banner_w)


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
        coord1 = get_city_coordinates(c1)
        coord2 = get_city_coordinates(c2)
        if coord1 and coord2:
            lon1, lat1 = coord1
            lon2, lat2 = coord2
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
