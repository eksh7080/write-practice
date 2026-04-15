"""
mp4 → gif 변환 스크립트

사용법:
    pip install moviepy
    python scripts/mp4_to_gif.py <입력.mp4> [출력.gif] [--fps 15] [--width 800] [--start 0] [--end None]

예시:
    python scripts/mp4_to_gif.py assets/demo.mp4
    python scripts/mp4_to_gif.py assets/demo.mp4 assets/demo.gif --fps 12 --width 720
    python scripts/mp4_to_gif.py assets/demo.mp4 --start 1.5 --end 8
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def convert(
    src: Path,
    dst: Path,
    fps: int,
    width: int | None,
    start: float,
    end: float | None,
) -> None:
    try:
        from moviepy import VideoFileClip
    except ImportError:
        print('moviepy가 설치되어 있지 않습니다. `pip install moviepy` 후 다시 실행하세요.', file=sys.stderr)
        sys.exit(1)

    clip = VideoFileClip(str(src))
    if start or end is not None:
        clip = clip.subclipped(start, end) if hasattr(clip, 'subclipped') else clip.subclip(start, end)
    if width and clip.w > width:
        clip = clip.resized(width=width) if hasattr(clip, 'resized') else clip.resize(width=width)

    dst.parent.mkdir(parents=True, exist_ok=True)
    clip.write_gif(str(dst), fps=fps)
    clip.close()

    size_mb = dst.stat().st_size / (1024 * 1024)
    print(f'완료: {dst} ({size_mb:.2f} MB, fps={fps}, width={width or clip.w})')
    if size_mb > 10:
        print('⚠ 10MB 초과 — GitHub README 로딩이 느려질 수 있습니다. fps/width를 낮춰보세요.')


def main() -> None:
    parser = argparse.ArgumentParser(description='mp4를 gif로 변환')
    parser.add_argument('src', type=Path, help='입력 mp4 파일')
    parser.add_argument('dst', type=Path, nargs='?', help='출력 gif 파일 (생략 시 입력과 같은 이름 .gif)')
    parser.add_argument('--fps', type=int, default=15, help='프레임레이트 (기본 15)')
    parser.add_argument('--width', type=int, default=800, help='가로 픽셀 (기본 800, 0이면 원본 유지)')
    parser.add_argument('--start', type=float, default=0, help='시작 시간(초)')
    parser.add_argument('--end', type=float, default=None, help='종료 시간(초)')
    args = parser.parse_args()

    if not args.src.exists():
        print(f'입력 파일을 찾을 수 없습니다: {args.src}', file=sys.stderr)
        sys.exit(1)

    dst = args.dst or args.src.with_suffix('.gif')
    convert(args.src, dst, args.fps, args.width or None, args.start, args.end)


if __name__ == '__main__':
    main()
