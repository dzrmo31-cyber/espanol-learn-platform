# -*- coding: utf-8 -*-
# يولّد supabase_data.sql من الفصول المحلية (BASE في index.html + RAW في lessons-extra.js)
# المخطط مُثبت بالفحص: id uuid, order_num int, is_free bool, vocabulary/options jsonb, createdAt timestamptz
import json, re, uuid

NS = uuid.uuid5(uuid.NAMESPACE_DNS, 'espaniol-curriculum.espanol.app')

def u(key):
    return str(uuid.uuid5(NS, key))

def q(s):
    return "'" + str(s).replace("'", "''") + "'"

def j(obj):
    return q(json.dumps(obj, ensure_ascii=False, separators=(',', ':'))) + '::jsonb'

def ar_ordinal(n):
    u_ = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع']
    tens = {20: 'العشرون', 30: 'الثلاثون', 40: 'الأربعون', 50: 'الخمسون', 60: 'الستون', 70: 'السبعون', 80: 'الثمانون', 90: 'التسعون', 100: 'المئة'}
    def part(x):
        if x < 10: return u_[x]
        if x == 10: return 'العاشر'
        if x == 11: return 'الحادي عشر'
        if x == 12: return 'الثاني عشر'
        if x < 20: return u_[x - 10] + ' عشر'
        if x % 10 == 0: return tens[x]
        one = x % 10
        return ('الحادي' if one == 1 else u_[one]) + ' و' + tens[x // 10 * 10]
    if n <= 100: return part(n)
    return 'المئة و' + part(n - 100)

# ---- قراءة BASE (17-24) ----
base = json.load(open('_base.json', encoding='utf-8'))

# ---- قراءة RAW (25-120) ----
s = open('lessons-extra.js', encoding='utf-8').read()
a = s.index('/*JSON_START*/') + len('/*JSON_START*/')
b = s.index('/*JSON_END*/')
raw = re.sub(r',?\s*/\*__APPEND__\*/', '', s[a:b]).strip()
raw = raw[:-1] if raw.endswith(';') else raw
raw_chapters = json.loads(raw)

out = []
out.append('-- ============================================================')
out.append('-- supabase_data.sql — المنهج الكامل للفصول المحلية (17-120)')
out.append('-- 104 فصلاً، 330 درساً، واختباراتها — تُنقل إلى قاعدة Supabase')
out.append('-- التشغيل: الصق كامل الملف في Supabase Dashboard → SQL Editor ثم Run')
out.append('-- آمن للتكرار: ON CONFLICT DO NOTHING يمنع التكرار إذا أُعيد التشغيل')
out.append('-- بعد تطبيقه يختفي الفصل المكرر من الواجهة تلقائياً (المطابقة بالعنوان)')
out.append('-- ============================================================')
out.append('BEGIN;')
out.append('')

ch_rows, les_rows, qz_rows = [], [], []

def add_chapter(num, ch, title):
    ch_id = u('chapter-%d' % num)
    ch_rows.append("(%s, %s, %s, %d, TRUE, %s, %s, %s, now())" % (
        q(ch_id), q(title), q(ch.get('description', '')), num,
        q(ch.get('icon', '📚')), q(ch.get('color', '#667eea')), q(ch['level'])))
    for li, l in enumerate(ch['lessons'], 1):
        les_id = u(l['id'])
        les_rows.append("(%s, %s, %s, %s, %s, %s, %s, %s, %d, TRUE, %d, %d, now())" % (
            q(les_id), q(ch_id), q(l['title']), q(l.get('description', '')), q(l['content']),
            j(l.get('vocabulary', [])), j(l.get('examples', [])), j([]),
            li, int(l.get('xp_reward', 30)), int(l.get('duration', 15))))
        for qi, quiz in enumerate(l.get('quizzes', []), 1):
            qz_rows.append("(%s, %s, %s, 'multiple_choice', %s, %s, %s, %d)" % (
                u(l['id'] + '-q%d' % qi), q(les_id), q(quiz['question']),
                j(quiz['options']), q(quiz['correct_answer']), q(quiz.get('explanation', '')), qi))

for i, ch in enumerate(base):
    add_chapter(17 + i, ch, ch['title'])  # عناوين BASE تتضمن رقم الفصل مسبقاً
for i, ch in enumerate(raw_chapters):
    add_chapter(25 + i, ch, 'الفصل ' + ar_ordinal(25 + i) + ': ' + ch['title'])

out.append('-- الفصول (%d)' % len(ch_rows))
out.append('INSERT INTO chapters (id, title, description, order_num, is_free, icon, color, level, createdAt) VALUES')
out.append(',\n'.join(ch_rows) + ' ON CONFLICT DO NOTHING;')
out.append('')
out.append('-- الدروس (%d)' % len(les_rows))
# تقسيم إلى دفعات 40 صفاً لتفادي حدود الجملة
for k in range(0, len(les_rows), 40):
    out.append('INSERT INTO lessons (id, chapter_id, title, description, content, vocabulary, examples, pronunciation, order_num, is_free, xp_reward, duration, createdAt) VALUES')
    out.append(',\n'.join(les_rows[k:k + 40]) + ' ON CONFLICT DO NOTHING;')
    out.append('')
out.append('-- الاختبارات (%d)' % len(qz_rows))
for k in range(0, len(qz_rows), 40):
    out.append('INSERT INTO quizzes (id, lesson_id, question, type, options, correct_answer, explanation, order_num) VALUES')
    out.append(',\n'.join(qz_rows[k:k + 40]) + ' ON CONFLICT DO NOTHING;')
    out.append('')
out.append('COMMIT;')
out.append('')

open('supabase_data.sql', 'w', encoding='utf-8').write('\n'.join(out))
print('chapters:', len(ch_rows), '| lessons:', len(les_rows), '| quizzes:', len(qz_rows))
