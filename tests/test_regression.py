import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent.parent / "scripts"
sys.path.insert(0, str(SCRIPTS_DIR))

import bazi_engine


def test_standard_bazi_benchmark_regression():
    """回归测试：基准四柱八字（1990-05-20 14:30 北京）排盘一致性校验"""
    chart = bazi_engine.BaZiChart("1990-05-20 14:30:00", gender="male", city="北京")
    
    # 四柱天干地支
    assert chart.year_gz == "庚午"
    assert chart.month_gz == "辛巳"
    assert chart.day_gz == "乙酉"
    assert chart.hour_gz == "癸未"
    assert chart.ri_gan == "乙"

    # 大运走向与前4步大运
    assert chart.forward is True  # 阳男顺行
    assert chart.dayun_list[0] == "壬午"
    assert chart.dayun_list[1] == "癸未"
    assert chart.dayun_list[2] == "甲申"
    assert chart.dayun_list[3] == "乙酉"


def test_qimen_yin7_benchmark_regression():
    """回归测试：奇门经典排盘基准用例（秋分上元，壬子日 己酉时 阴遁7局）"""
    qm = bazi_engine.QimenChart("2026-10-05 17:36:00")

    assert qm.day_gz == "壬子"
    assert qm.hour_gz == "己酉"
    assert qm.solar_term == "秋分"
    assert qm.is_yang is False
    assert qm.ju == 7  # 阴遁7局
    assert qm.xun_shou_gz == "甲辰"
    assert qm.xun_shou_liu_yi == "壬"

    # 值符与值使
    assert qm.zhi_fu_star == "天冲"
    assert qm.zhi_shi_door == "伤门"

    # 关键宫位落星门神校验
    # 乾六宫(西北)：日干壬/值符/天冲/杜门/驿马
    assert qm.god_palace[6] == "值符"
    assert qm.star_palace[6] == "天冲"
    assert qm.door_palace[6] == "杜门"
    assert qm.tian_pan[6] == "壬"

    # 巽四宫(东南)：开门/白虎/天柱
    assert qm.god_palace[4] == "白虎"
    assert qm.star_palace[4] == "天柱"
    assert qm.door_palace[4] == "开门"

    # 坤二宫(西南)：生门/太阴/天蓬
    assert qm.god_palace[2] == "太阴"
    assert qm.star_palace[2] == "天蓬"
    assert qm.door_palace[2] == "生门"


def test_qimen_fu_yin_benchmark_regression():
    """回归测试：奇门全盘伏吟基准用例（秋分中元，甲寅日 甲子时 阴遁1局）"""
    qm = bazi_engine.QimenChart("2026-10-07 23:05:00")

    assert qm.day_gz == "甲寅"
    assert qm.hour_gz == "甲子"
    assert qm.solar_term == "秋分"
    assert qm.is_yang is False
    assert qm.ju == 1  # 阴遁1局
    assert qm.xun_shou_gz == "甲子"
    assert qm.xun_shou_liu_yi == "戊"

    # 全盘九星八门伏吟
    star_orig = {1: '天蓬', 8: '天任', 3: '天冲', 4: '天辅', 9: '天英', 2: '天芮', 7: '天柱', 6: '天心'}
    door_orig = {1: '休门', 8: '生门', 3: '伤门', 4: '杜门', 9: '景门', 2: '死门', 7: '惊门', 6: '开门'}
    for p in range(1, 10):
        if p != 5:
            assert qm.star_palace[p] == star_orig[p], f"{p}宫九星未伏吟"
            assert qm.door_palace[p] == door_orig[p], f"{p}宫八门未伏吟"

    # 坤二宫：死门/天芮/六合
    assert qm.god_palace[2] == "六合"
    assert qm.door_palace[2] == "死门"

    # 乾六宫：开门/天心/螣蛇/空亡
    assert qm.god_palace[6] == "螣蛇"
    assert "乾" in qm.kong_wang
