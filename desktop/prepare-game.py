from pathlib import Path
import re
import subprocess
import sys

source = Path('Crimson Vigil/index.html').read_text(encoding='utf-8')
three = Path(sys.argv[1]).read_text(encoding='utf-8')
if len(three) < 400000:
    raise RuntimeError('Downloaded Three.js is incomplete')

# The onerror fallback embeds a > character, so replace its entire line.
lines = source.splitlines(keepends=True)
indices = [i for i, line in enumerate(lines)
           if line.lstrip().startswith('<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"')]
if len(indices) != 1:
    raise RuntimeError(f'Expected exactly one pinned Three.js script, found {len(indices)}')
replacement = '<script>\n' + three.replace('</script', '<\\/script') + '\n</script>\n'
lines[indices[0]] = replacement
source = ''.join(lines)
if 'src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"' in source:
    raise RuntimeError('External Three.js script was not replaced')

target = Path('desktop/game/index.html')
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(source, encoding='utf-8')
scripts = re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>', source, re.S)
if len(scripts) < 2:
    raise RuntimeError('Missing game scripts')
for i, script in enumerate(scripts):
    p = target.parent / f'check-{i}.js'
    try:
        p.write_text(script, encoding='utf-8')
        subprocess.run(['node', '--check', str(p)], check=True)
    finally:
        p.unlink(missing_ok=True)
print(f'Prepared {target} ({target.stat().st_size} bytes); validated {len(scripts)} scripts')
