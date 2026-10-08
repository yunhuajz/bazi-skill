import sys
from pathlib import Path

# Add scripts directory to path
SCRIPTS_DIR = Path(__file__).resolve().parent.parent / "scripts"
sys.path.insert(0, str(SCRIPTS_DIR))

import bazi_engine


def test_display_width():
    """测试宽字符与半角字符的终端显示宽度计算"""
    assert bazi_engine.display_width("abc") == 3
    assert bazi_engine.display_width("中文") == 4
    assert bazi_engine.display_width("【巽四宫(东南)】") == 16


def test_pad_display_width():
    """测试基于终端宽度的等宽对齐补白"""
    s = "【巽四宫(东南)】"
    w = bazi_engine.display_width(s)
    padded = bazi_engine.pad_display_width(s, 24, align='left')
    assert bazi_engine.display_width(padded) == 24
    assert padded.startswith(s)
    assert padded.endswith(" " * (24 - w))


def test_qimen_box_lines_not_truncated():
    """测试奇门九宫格渲染中宫位名称完整，不被截断成【巽四宫(东】"""
    qm = bazi_engine.QimenChart("2026-10-05 17:36:00")
    lines = qm.get_box_lines(4)
    # 第一行必须包含完整方位名称，不可被截断
    assert "【巽四宫(东南)】" in lines[0]
    # 每一行的显示宽度必须严格等于单元格宽度(24)
    for line in lines:
        assert bazi_engine.display_width(line) == 24


def test_qimen_full_render(capsys):
    """测试九宫格完整打印无崩溃且格式规整"""
    qm = bazi_engine.QimenChart("2026-10-05 17:36:00")
    qm.render()
    captured = capsys.readouterr().out
    assert "【巽四宫(东南)】" in captured
    assert "【离九宫(正南)】" in captured
    assert "【坤二宫(西南)】" in captured
    assert "【乾六宫(西北)】" in captured
    assert "【中五宫 · 寄坤二】" in captured


