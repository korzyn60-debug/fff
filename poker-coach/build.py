import json,re,sys,os
SP='/tmp/claude-0/-home-user-fff/a97f84f5-1dec-5ee8-bc8b-d5438a95a846/scratchpad/scenarios.json'
bank=[]
for f in ['bank.json','exploit_extra.json','simple.json']:
    if os.path.exists(f): bank+=json.load(open(f))
CARD=re.compile(r'^[2-9TJQKA][shdc]$')
ids=set();errs=[]
for q in bank:
    assert q['id'] not in ids, q['id']; ids.add(q['id'])
    assert q['cat'] in ['math','ranges','postflop','exploit','preflop','mental'],q['id']
    assert q['level'] in (1,2,3),q['id']
    assert 2<=len(q['opts'])<=4 and 0<=q['ans']<len(q['opts']),q['id']
    cs=[]
    for k in ('hero','board'):
        v=(q.get(k) or '').strip()
        q[k]=v
        for c in v.split():
            if not CARD.match(c): errs.append((q['id'],k,c))
            cs.append(c)
    if len(cs)!=len(set(cs)): errs.append((q['id'],'dup cards',cs))
if errs: print('ERRORS',errs); sys.exit(1)
import random
rnd=random.Random(7)
for q in bank:
    o=q['opts'];right=o[q['ans']]
    if any(x.startswith(('Зависит',)) for x in o): continue
    perm=o[:];rnd.shuffle(perm);q['opts']=perm;q['ans']=perm.index(right)
from collections import Counter
print(Counter((q['cat'],q['level']) for q in bank))
print(len(bank),Counter(q['cat'] for q in bank),Counter(q['ans'] for q in bank))
t=open('app.template.html').read()
data='const BANK='+json.dumps(bank,ensure_ascii=False,separators=(',',':'))+';'
hands=json.load(open('hands.json')) if os.path.exists('hands.json') else []
for h in hands:
    cs=h['hero'].split()
    for st in h['steps']:
        bd=st['board'].split()
        for c in cs+bd: assert CARD.match(c),(h['id'],c)
        assert len(set(cs+bd))==len(cs+bd),(h['id'],'dup',cs+bd)
        assert sum(st['range'].values())==100,(h['id'],st['range'])
        assert 0<=st['best']<len(st['opts']),h['id']
print('hands',len(hands))
lessons=open('lessons.js').read()
open('index.html','w').write(t.replace('/*__DATA__*/',data).replace('/*__LESSONS__*/',lessons).replace('/*__HANDS__*/','const HANDS='+json.dumps(hands,ensure_ascii=False,separators=(',',':'))+';'))
