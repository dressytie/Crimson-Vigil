from pathlib import Path
import re
import subprocess
import sys
src=Path('Crimson Vigil/index.html').read_text(encoding='utf-8')
lib=Path(sys.argv[1]).read_text(encoding='utf-8')
assert len(lib)>400000, 'Three.js dependency is incomplete'
# The original onerror fallback embeds a literal '>' inside an attribute.
# Match the entire single-line script tag rather than stopping at the first '>'.
pattern=r'^<script\\s+src="https://cdnjs\\.cloudflare\\.com/ajax/libs/three\\.js/r128/three\\.min\\.js"[^\\n]*</script>\\s*
src,n=re.subn(pattern,lambda _: '<script>\n'+lib.replace('</script','<\\/script')+'\n</script>',src,count=1,flags=re.S)
assert n==1, 'Could not find pinned Three.js dependency'
assert 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js' not in src
target=Path('desktop/game/index.html')
target.parent.mkdir(parents=True,exist_ok=True)
target.write_text(src,encoding='utf-8')
scripts=re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>',src,re.S)
assert len(scripts)>=2, 'Missing game scripts'
for i,script in enumerate(scripts):
    p=Path('desktop/game')/f'check-{i}.js'
    p.write_text(script,encoding='utf-8')
    subprocess.run(['node','--check',str(p)],check=True)
    p.unlink()
print('Prepared bundled game:',target.stat().st_size,'bytes; scripts:',len(scripts))

src,n=re.subn(pattern,lambda _: '<script>\n'+lib.replace('</script','<\\/script')+'\n</script>',src,count=1,flags=re.S)
assert n==1, 'Could not find pinned Three.js dependency'
assert 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js' not in src
target=Path('desktop/game/index.html')
target.parent.mkdir(parents=True,exist_ok=True)
target.write_text(src,encoding='utf-8')
scripts=re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>',src,re.S)
assert len(scripts)>=2, 'Missing game scripts'
for i,script in enumerate(scripts):
    p=Path('desktop/game')/f'check-{i}.js'
    p.write_text(script,encoding='utf-8')
    subprocess.run(['node','--check',str(p)],check=True)
    p.unlink()
print('Prepared bundled game:',target.stat().st_size,'bytes; scripts:',len(scripts))
