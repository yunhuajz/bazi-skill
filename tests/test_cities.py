import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent.parent / "scripts"
sys.path.insert(0, str(SCRIPTS_DIR))

import bazi_engine


def test_major_prefecture_cities_coverage():
    """测试省会、直辖市及重点地级市全面覆盖(>300城)"""
    # 验证城市库规模显著扩充
    assert len(bazi_engine.CHINA_CITIES) >= 300

    # 验证之前30城之外的各地级市可精准解析
    sample_cities = [
        ('保定', 115.4648, 38.8738),
        ('洛阳', 112.4540, 34.6197),
        ('临沂', 118.3564, 35.1047),
        ('乌鲁木齐', 87.6168, 43.8256),
        ('拉萨', 91.1409, 29.6456),
        ('呼和浩特', 111.7492, 40.8426),
        ('南宁', 108.3661, 22.8172),
        ('海口', 110.3312, 20.0319),
        ('贵阳', 106.6302, 26.6477),
        ('银川', 106.2309, 38.4872),
        ('西宁', 101.7782, 36.6171),
        ('兰州', 103.8343, 36.0611),
        ('福州', 119.3062, 26.0753),
        ('南昌', 115.8579, 28.6830),
        ('青岛', 120.3826, 36.0671),
    ]

    for city, expected_lon, expected_lat in sample_cities:
        coords = bazi_engine.get_city_coordinates(city)
        assert coords is not None, f"城市 {city} 应该在城市库中"
        lon, lat = coords
        assert abs(lon - expected_lon) < 0.2, f"{city} 经度偏差过大"
        assert abs(lat - expected_lat) < 0.2, f"{city} 纬度偏差过大"


def test_city_suffix_matching():
    """测试支持带'市'/'县'后缀的模糊匹配，如'石家庄市'能匹配'石家庄'"""
    coords1 = bazi_engine.get_city_coordinates("石家庄")
    coords2 = bazi_engine.get_city_coordinates("石家庄市")
    assert coords1 == coords2


def test_unknown_city_fallback():
    """测试未知城市返回默认值或提示，不导致真太阳时崩溃"""
    chart = bazi_engine.BaZiChart("2026-10-05 12:00:00", city="未知神秘岛")
    assert chart.true_dt is not None
