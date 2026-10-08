import sys
import datetime
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent.parent / "scripts"
sys.path.insert(0, str(SCRIPTS_DIR))

import bazi_engine


def test_year_terms_returns_datetime_with_minute_precision():
    """测试二十四节气返回精确到时分秒的 datetime.datetime 对象"""
    terms = bazi_engine.get_year_terms(2026)
    assert len(terms) == 24
    for name, dt in terms.items():
        assert isinstance(dt, datetime.datetime), f"{name} 应该是 datetime.datetime 类型"
        # 验证不是千篇一律的 00:00:00（说明具备时分秒级推演）
    # 2026 寒露应在 10月8日 14点左右（14:28前后几分钟）
    hanlu = terms['寒露']
    assert hanlu.year == 2026
    assert hanlu.month == 10
    assert hanlu.day == 8
    assert hanlu.hour in (14, 15)


def test_solar_term_minute_level_transition_hanlu_2026():
    """测试交节当日时分秒精确临界点判断（以2026寒露为例）"""
    terms = bazi_engine.get_year_terms(2026)
    hanlu_dt = terms['寒露']

    # 交节前30分钟：必须仍属于【秋分】
    before_hanlu = hanlu_dt - datetime.timedelta(minutes=30)
    assert bazi_engine.get_current_solar_term(before_hanlu) == '秋分'

    # 交节后30分钟：必须已进入【寒露】
    after_hanlu = hanlu_dt + datetime.timedelta(minutes=30)
    assert bazi_engine.get_current_solar_term(after_hanlu) == '寒露'


def test_bazi_month_pillar_minute_boundary():
    """测试八字排盘在交节时刻前后，月柱与年柱严格依时分秒换令"""
    terms = bazi_engine.get_year_terms(2026)
    lichun_dt = terms['立春']

    # 立春前30分钟：年柱仍为旧年
    before_lc = lichun_dt - datetime.timedelta(minutes=30)
    chart_before = bazi_engine.BaZiChart(before_lc.strftime('%Y-%m-%d %H:%M:%S'))

    # 立春后30分钟：年柱进入新年，月柱进入寅月
    after_lc = lichun_dt + datetime.timedelta(minutes=30)
    chart_after = bazi_engine.BaZiChart(after_lc.strftime('%Y-%m-%d %H:%M:%S'))

    assert chart_before.year_gz != chart_after.year_gz
    assert chart_after.month_gz.endswith('寅')
