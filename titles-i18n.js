// ============================================================
// titles-i18n.js — ترجمة عناوين المنهج (المستويات + الفصول + الدروس)
// es يُستخرج تلقائياً من العنوان نفسه (بعد « - » أو داخل الأقواس)
// القاموس: [الإنجليزية, البرتغالية, الروسية]
// ============================================================
(function () {
  'use strict';

  var CHAPTER_WORD = { ar: 'الفصل', en: 'Chapter', es: 'Capítulo', pt: 'Capítulo', ru: 'Глава' };

  var LEVELS = {
    'A1': { ar: 'المستوى المبتدئ', en: 'Beginner Level', es: 'Nivel Principiante', pt: 'Nível Iniciante', ru: 'Начальный уровень' },
    'A2': { ar: 'المستوى الأساسي', en: 'Elementary Level', es: 'Nivel Elemental', pt: 'Nível Básico', ru: 'Элементарный уровень' },
    'B1': { ar: 'المستوى المتوسط', en: 'Intermediate Level', es: 'Nivel Intermedio', pt: 'Nível Intermédio', ru: 'Средний уровень' },
    'B2': { ar: 'المستوى المتقدم', en: 'Advanced Level', es: 'Nivel Avanzado', pt: 'Nível Avançado', ru: 'Продвинутый уровень' }
  };

  // كلمات صغيرة تتكرر في البطاقات
  var WORDS = {
    'درس': { en: 'lesson', es: 'lección', pt: 'lição', ru: 'урок' },
    'دروس': { en: 'lessons', es: 'lecciones', pt: 'lições', ru: 'уроки' },
    'فصول': { en: 'chapters', es: 'capítulos', pt: 'capítulos', ru: 'глав' },
    'فصل': { en: 'chapter', es: 'capítulo', pt: 'capítulo', ru: 'глава' },
    'مجاني': { en: 'Free', es: 'Gratis', pt: 'Grátis', ru: 'Бесплатно' },
    'مميز': { en: 'Premium', es: 'Premium', pt: 'Premium', ru: 'Премиум' },
    'دقيقة': { en: 'min', es: 'min', pt: 'min', ru: 'мин' },
    'مكتمل': { en: 'Completed', es: 'Completado', pt: 'Concluído', ru: 'Завершено' },
    'سؤال': { en: 'question', es: 'pregunta', pt: 'pergunta', ru: 'вопрос' },
    'أسئلة': { en: 'questions', es: 'preguntas', pt: 'perguntas', ru: 'вопросов' },
    'نقطة': { en: 'point', es: 'punto', pt: 'ponto', ru: 'очко' },
    'نقاط': { en: 'points', es: 'puntos', pt: 'pontos', ru: 'очков' },
    'أقسام': { en: 'sections', es: 'secciones', pt: 'seções', ru: 'разделов' },
    'قواعد': { en: 'Grammar', es: 'Gramática', pt: 'Gramática', ru: 'Грамматика' },
    'مفردات': { en: 'Vocabulary', es: 'Vocabulario', pt: 'Vocabulário', ru: 'Лексика' },
    'استماع': { en: 'Listening', es: 'Comprensión', pt: 'Compreensão', ru: 'Аудирование' },
    'إملاء': { en: 'Dictation', es: 'Dictado', pt: 'Ditado', ru: 'Диктант' },
    'نطق': { en: 'Speaking', es: 'Pronunciación', pt: 'Pronúncia', ru: 'Произношение' },
    'النجاح': { en: 'Pass', es: 'Aprobado', pt: 'Aprovação', ru: 'Проходной' },
    'القواعد والتراكيب': { en: 'Grammar and Structures', es: 'Gramática y estructuras', pt: 'Gramática e estruturas', ru: 'Грамматика и структуры' },
    'المفردات': { en: 'Vocabulary', es: 'Vocabulario', pt: 'Vocabulário', ru: 'Лексика' },
    'الاستماع والفهم': { en: 'Listening and Comprehension', es: 'Comprensión auditiva', pt: 'Compreensão auditiva', ru: 'Аудирование и понимание' },
    'الإملاء': { en: 'Dictation', es: 'Dictado', pt: 'Ditado', ru: 'Диктант' },
    'النطق والمحادثة': { en: 'Speaking and Conversation', es: 'Pronunciación y conversación', pt: 'Pronúncia e conversação', ru: 'Произношение и разговор' },
    'ابدأ الامتحان الرسمي': { en: 'Start the Official Exam', es: 'Comenzar el examen oficial', pt: 'Iniciar o exame oficial', ru: 'Начать официальный экзамен' },
    'فصلاً شاملاً في 4 مستويات تأخذك من الصفر إلى الاحتراف': { en: 'comprehensive chapters across 4 levels take you from zero to pro', es: 'capítulos completos en 4 niveles te llevan de cero a experto', pt: 'capítulos completos em 4 níveis te levam do zero ao profissional', ru: 'всесторонних глав в 4 уровнях — с нуля до профессионала' }
  };

  var CHAPTERS = {
    'الأخبار الحالية': ['Current News', 'Notícias atuais', 'Актуальные новости'],
    'الأدب': ['Literature', 'Literatura', 'Литература'],
    'الأدب الإسباني الكلاسيكي': ['Spanish Classics', 'Clássicos espanhóis', 'Классика испанской литературы'],
    'الأرقام والحساب': ['Numbers and Counting', 'Números e cálculo', 'Числа и счёт'],
    'الأسلوب الأكاديمي': ['Academic Style', 'Estilo acadêmico', 'Академический стиль'],
    'الألوان والأشكال': ['Colors and Shapes', 'Cores e formas', 'Цвета и формы'],
    'الأيام والتواريخ': ['Days and Dates', 'Dias e datas', 'Дни и даты'],
    'الإعلام الرقمي': ['Digital Media', 'Mídia digital', 'Цифровые медиа'],
    'الاحتفالات': ['Celebrations', 'Comemorações', 'Праздники'],
    'الاستعداد لشهادة DELE': ['DELE Exam Preparation', 'Preparação para o DELE', 'Подготовка к экзамену DELE'],
    'الاقتصاد العالمي': ['Global Economy', 'Economia global', 'Мировая экономика'],
    'الانتقال للخارج': ['Moving Abroad', 'Mudança para o exterior', 'Переезд за границу'],
    'البريد والشحن': ['Mail and Shipping', 'Correio e encomendas', 'Почта и доставка'],
    'البنك والمال': ['Bank and Money', 'Banco e dinheiro', 'Банк и деньги'],
    'البيئة والتلوث': ['Environment and Pollution', 'Meio ambiente e poluição', 'Экология и загрязнение'],
    'البيت الجديد والانتقال': ['New Home and Moving', 'Casa nova e mudança', 'Новый дом и переезд'],
    'التاريخ والحضارة': ['History and Civilization', 'História e civilização', 'История и цивилизация'],
    'الترجمة والفروق الدقيقة': ['Translation and Nuances', 'Tradução e nuances', 'Перевод и нюансы'],
    'التسوق الإلكتروني': ['Online Shopping', 'Compras online', 'Онлайн-покупки'],
    'التسويق والإعلان': ['Marketing and Advertising', 'Marketing e publicidade', 'Маркетинг и реклама'],
    'التعابير المتقدمة والأمثال': ['Advanced Expressions and Proverbs', 'Expressões avançadas e provérbios', 'Продвинутые выражения и пословицы'],
    'التعبير عن الرأي': ['Giving Your Opinion', 'Expressar opinião', 'Выражение мнения'],
    'التعليم المستمر': ['Lifelong Learning', 'Educação contínua', 'Непрерывное обучение'],
    'التقارير والمستندات': ['Reports and Documents', 'Relatórios e documentos', 'Отчёты и документы'],
    'التكنولوجيا الحديثة': ['Modern Technology', 'Tecnologia moderna', 'Современные технологии'],
    'التلفاز والإعلام': ['Television and Press', 'TV e imprensa', 'Телевидение и пресса'],
    'الثقافات والعادات': ['Cultures and Customs', 'Culturas e costumes', 'Культуры и обычаи'],
    'الجامعة والدراسة': ['University and Studies', 'Universidade e estudos', 'Университет и учёба'],
    'الجدل والحوار': ['Debate and Dialogue', 'Debate e diálogo', 'Дискуссия и диалог'],
    'الجسم والصحة': ['Body and Health', 'Corpo e saúde', 'Тело и здоровье'],
    'الجيران والحياة الاجتماعية': ['Neighbors and Social Life', 'Vizinhos e vida social', 'Соседи и социальная жизнь'],
    'الحيوانات': ['Animals', 'Animais', 'Животные'],
    'الحيوانات الأليفة ورعايتها': ['Pets and Their Care', 'Animais de estimação e cuidados', 'Домашние животные и уход за ними'],
    'الخدمات العامة والصيانة': ['Public Services and Repairs', 'Serviços públicos e reparos', 'Городские услуги и ремонт'],
    'الخطاب الرسمي': ['Formal Register', 'Registro formal', 'Официальный стиль речи'],
    'الخطط المستقبلية': ['Future Plans', 'Planos futuros', 'Планы на будущее'],
    'الدول والجنسيات': ['Countries and Nationalities', 'Países e nacionalidades', 'Страны и национальности'],
    'الرحلات البرية': ['Trips and Excursions', 'Excursões', 'Поездки и экскурсии'],
    'الروابط المتقدمة': ['Advanced Connectors', 'Conectores avançados', 'Продвинутые связки'],
    'الروتين اليومي': ['Daily Routine', 'Rotina diária', 'Ежедневная рутина'],
    'الرياضة': ['Sports', 'Esportes', 'Спорт'],
    'الرياضة والأحداث': ['Sports and Events', 'Esportes e eventos', 'Спорт и соревнования'],
    'السياسة والمجتمع': ['Politics and Society', 'Política e sociedade', 'Политика и общество'],
    'السينما اللاتينية': ['Latin American Cinema', 'Cinema latino', 'Латиноамериканское кино'],
    'السينما والنقد': ['Cinema and Criticism', 'Cinema e crítica', 'Кино и кинокритика'],
    'الصحة النفسية والرفاه': ['Mental Health and Wellbeing', 'Saúde mental e bem-estar', 'Психическое здоровье и благополучие'],
    'الصيدلية والصحة': ['Pharmacy and Health', 'Farmácia e saúde', 'Аптека и здоровье'],
    'الطبخ والوصفات': ['Cooking and Recipes', 'Culinária e receitas', 'Кулинария и рецепты'],
    'الطريق والقيادة': ['Roads and Driving', 'Estrada e direção', 'Дорога и вождение'],
    'الطعام والشراب': ['Food and Drink', 'Comida e bebida', 'Еда и напитки'],
    'الطقس المتقدم': ['Advanced Weather', 'Meteorologia avançada', 'Погода: продвинутый уровень'],
    'الطقس والفصول': ['Weather and Seasons', 'Clima e estações', 'Погода и времена года'],
    'العائلة والأقارب': ['Family and Relatives', 'Família e parentes', 'Семья и родственники'],
    'العروض المهنية والإقناع': ['Professional Pitches and Persuasion', 'Apresentações profissionais e persuasão', 'Профессиональные презентации и убеждение'],
    'العروض والتقديم': ['Presentations', 'Apresentações', 'Презентации'],
    'العطلات والسفر': ['Holidays and Travel', 'Férias e viagens', 'Отпуск и путешествия'],
    'العقارات والإسكان': ['Real Estate and Housing', 'Imóveis e moradia', 'Недвижимость и жильё'],
    'العلوم والبحث': ['Science and Research', 'Ciência e pesquisa', 'Наука и исследования'],
    'العمل بدوام جزئي': ['Part-Time Work', 'Trabalho de meio período', 'Работа с частичной занятостью'],
    'العمل عن بُعد': ['Remote Work', 'Trabalho remoto', 'Удалённая работа'],
    'الفندق والإقامة': ['Hotel and Accommodation', 'Hotel e hospedagem', 'Отель и проживание'],
    'القانون والعقود': ['Law and Contracts', 'Direito e contratos', 'Право и договоры'],
    'القراءة والمكتبة': ['Reading and the Library', 'Leitura e biblioteca', 'Чтение и библиотека'],
    'القضايا الاجتماعية': ['Social Issues', 'Questões sociais', 'Общественные проблемы'],
    'القطار والمحطة': ['Train and Station', 'Trem e estação', 'Поезд и вокзал'],
    'القواعد المتقدمة ١': ['Advanced Grammar I', 'Gramática avançada I', 'Продвинутая грамматика I'],
    'القواعد المتقدمة ٢': ['Advanced Grammar II', 'Gramática avançada II', 'Продвинутая грамматика II'],
    'الكتابة الإبداعية': ['Creative Writing', 'Escrita criativa', 'Творческое письмо'],
    'اللباقة والعبارات اليومية': ['Politeness and Everyday Phrases', 'Cortesia e frases do dia a dia', 'Вежливость и бытовые фразы'],
    'الماضي القريب': ['Recent Past', 'Passado recente', 'Недавнее прошедшее время'],
    'المال والاقتصاد الشخصي': ['Money and Personal Finance', 'Dinheiro e finanças pessoais', 'Деньги и личные финансы'],
    'المتاحف والفنون': ['Museums and Arts', 'Museus e artes', 'Музеи и искусство'],
    'المجال الطبي المتقدم': ['Advanced Medical Field', 'Medicina avançada', 'Продвинутая медицина'],
    'المدرسة والدراسة': ['School and Studying', 'Escola e estudos', 'Школа и учёба'],
    'المدينة والأماكن': ['City and Places', 'Cidade e lugares', 'Город и места'],
    'المسرح والخطابة': ['Theater and Public Speaking', 'Teatro e oratória', 'Театр и ораторское искусство'],
    'المشاعر والحالات': ['Feelings and Moods', 'Sentimentos e estados de ânimo', 'Чувства и состояния'],
    'المطبخ الإقليمي': ['Regional Cuisine', 'Gastronomia regional', 'Региональная кухня'],
    'المفاوضات': ['Negotiations', 'Negociações', 'Переговоры'],
    'المقابلات المتقدمة': ['Advanced Interviews', 'Entrevistas avançadas', 'Продвинутые собеседования'],
    'الملابس والتسوق': ['Clothing and Shopping', 'Roupas e compras', 'Одежда и покупки'],
    'الملابس والموضة': ['Clothing and Fashion', 'Roupas e moda', 'Одежда и мода'],
    'المناظرة الرسمية': ['Formal Debate', 'Debate formal', 'Официальные дебаты'],
    'المنزل والغرف': ['Home and Rooms', 'Casa e cômodos', 'Дом и комнаты'],
    'المهرجانات الإسبانية': ['Spanish Festivals', 'Festas da Espanha', 'Испанские праздники'],
    'الموسيقى والحفلات': ['Music and Concerts', 'Música e shows', 'Музыка и концерты'],
    'الهاتف والتطبيقات': ['Phone and Apps', 'Celular e aplicativos', 'Телефон и приложения'],
    'الهوايات': ['Hobbies', 'Passatempos', 'Хобби'],
    'الوظائف والمهن': ['Jobs and Professions', 'Empregos e profissões', 'Работа и профессии'],
    'الوقت والساعة': ['Telling Time', 'As horas', 'Который час'],
    'بناء الجمل ١': ['Sentence Building I', 'Construção de frases I', 'Построение фраз I'],
    'بناء الجمل ٢': ['Sentence Building II', 'Construção de frases II', 'Построение фраз II'],
    'تنويعات اللغة': ['Varieties of Spanish', 'Variedades do espanhol', 'Разновидности испанского языка'],
    'عالم العمل': ['The Work World', 'Mundo do trabalho', 'Мир работы'],
    'في السوق': ['At the Market', 'No mercado', 'На рынке'],
    'في المطعم': ['At the Restaurant', 'No restaurante', 'В ресторане'],
    'قواعد الأزمنة ١': ['Verb Tenses I', 'Tempos verbais I', 'Глагольные времена I'],
    'قواعد الأزمنة ٢': ['Verb Tenses II', 'Tempos verbais II', 'Глагольные времена II'],
    'قيادة الفرق': ['Team Leadership', 'Liderança de equipes', 'Лидерство и управление командой'],
    'مراجعة شاملة للقواعد': ['Complete Grammar Review', 'Revisão completa da gramática', 'Полное повторение грамматики'],
    'مراسلات العمل': ['Business Correspondence', 'Correspondência de trabalho', 'Деловая переписка'],
    'مفردات الحياة اليومية': ['Everyday Vocabulary', 'Vocabulário diário', 'Бытовая лексика'],
    'مهارات اللغة': ['Language Skills', 'Habilidades do idioma', 'Языковые навыки'],
    'وسائل النقل': ['Transportation', 'Meios de transporte', 'Транспорт']
  };

  // ---------- محرك الترجمة ----------
  function currentLang() { return (window.currentLang ? window.currentLang() : (localStorage.getItem('site_lang') || 'ar')); }

  function splitBi(title) {
    var m = title.match(/^(.*?)\s+[-–]\s+(.+)$/);
    if (m && m[2].length > 1) return { ar: m[1].trim(), es: m[2].trim() };
    var p = title.match(/^(.*?)\s*\(([^()]+)\)\s*$/);
    if (p) return { ar: p[1].trim(), es: p[2].trim() };
    return { ar: title.trim(), es: null };
  }

  // توليد خريطة الاسم العدلي → رقم (نفس منطق lessons-extra.js)
  var ORD = (function () {
    var u = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع'];
    var t = { 20: 'العشرون', 30: 'الثلاثون', 40: 'الأربعون', 50: 'الخمسون', 60: 'الستون', 70: 'السبعون', 80: 'الثمانون', 90: 'التسعون', 100: 'المئة' };
    function tens(x) { return t[Math.floor(x / 10) * 10]; }
    function part(x) {
      if (x < 10) return u[x];
      if (x === 10) return 'العاشر';
      if (x === 11) return 'الحادي عشر';
      if (x === 12) return 'الثاني عشر';
      if (x < 20) return u[x - 10] + ' عشر';
      if (x % 10 === 0) return t[x];
      var one = x % 10;
      return (one === 1 ? 'الحادي' : u[one]) + ' و' + tens(x);
    }
    var map = {};
    for (var n = 1; n <= 120; n++) {
      var w = n <= 100 ? part(n) : 'المئة و' + part(n - 100);
      map[w] = n;
    }
    return map;
  })();

  function chapterHead(lang, ordinalWord) {
    var num = ORD[ordinalWord.trim()];
    var word = CHAPTER_WORD[lang] || CHAPTER_WORD.ar;
    return word + ' ' + (num || ordinalWord) + ': ';
  }

  function lookup(ar) {
    if (CHAPTERS[ar]) return CHAPTERS[ar];
    var LS = window.TITLES_I18N_LESSONS || {};
    if (LS[ar]) return LS[ar];
    return null;
  }

  function T(title) {
    if (!title || typeof title !== 'string') return title;
    var lang = currentLang();
    if (!lang || lang === 'ar') return title;
    // المستويات: "A1 - المستوى المبتدئ"
    var lv = title.match(/^((?:A1|A2|B1|B2))\s*[-–]\s*(.+)$/);
    if (lv && LEVELS[lv[1]]) {
      var L = LEVELS[lv[1]];
      return lv[1] + ' - ' + (L[lang] || L.ar);
    }
    var ch = title.match(/^الفصل\s+(.+?):\s*([\s\S]*)$/);
    var rest = ch ? ch[2] : title;
    var bi = splitBi(rest);
    var dict = lookup(bi.ar);
    if (lang === 'es') {
      var headEs = ch ? chapterHead('es', ch[1]) : '';
      return headEs + (bi.es || rest);
    }
    if (!dict) return title;
    var idx = lang === 'en' ? 0 : lang === 'pt' ? 1 : lang === 'ru' ? 2 : -1;
    if (idx < 0 || !dict[idx]) return title;
    var head = ch ? chapterHead(lang, ch[1]) : '';
    return head + dict[idx];
  }

  // كلمة صغيرة مفردة: T('درس')
  function TW(word) {
    var lang = currentLang();
    if (!lang || lang === 'ar') return word;
    var w = WORDS[word];
    return (w && w[lang]) || word;
  }

  window.TITLES_I18N = { CHAPTER_WORD: CHAPTER_WORD, LEVELS: LEVELS, WORDS: WORDS, CHAPTERS: CHAPTERS, ORD: ORD };
  window.T = T;
  window.TW = TW;
})();

// ============================================================
// titles-i18n-lessons.js — قاموس ترجمة عناوين الدروس [en, pt, ru]
// الإسبانية تُستخرج تلقائياً من العنوان الأصلي (بعد « - »)
// ============================================================
window.TITLES_I18N_LESSONS = {
'Saber و Conocer': ['Saber vs. Conocer', 'Saber vs. Conocer', 'Saber и Conocer'],
'أثناء الرحلة': ['During the Trip', 'Durante a viagem', 'Во время поездки'],
'أجزاء اليوم': ['Parts of the Day', 'Partes do dia', 'Части дня'],
'أحداث أمس': ['Yesterday\'s Events', 'O que aconteceu ontem', 'Вчерашние события'],
'أخطاء مزمنة': ['Chronic Mistakes', 'Erros típicos', 'Типичные ошибки'],
'أدوات الإلقاء': ['Public Speaking Tools', 'Recursos para falar em público', 'Приёмы публичного выступления'],
'أدوار المناظرة': ['Debate Roles', 'Papéis no debate', 'Роли в дебатах'],
'أسئلة الجمهور': ['Audience Questions', 'Perguntas do público', 'Вопросы из зала'],
'أسئلة المواقف': ['Situational Questions', 'Perguntas situacionais', 'Ситуативные вопросы'],
'أسماء الإشارة': ['Demonstratives', 'Demonstrativos', 'Указательные местоимения'],
'أعضاء الجسم': ['Body Parts', 'Partes do corpo', 'Части тела'],
'أفراد العائلة': ['Family Members', 'Membros da família', 'Члены семьи'],
'أفعال القدرة والوجوب': ['Modal Verbs', 'Verbos modais', 'Модальные глаголы'],
'أفلام لا تُنسى': ['Unforgettable Films', 'Filmes inesquecíveis', 'Незабываемые фильмы'],
'أقسام الامتحان': ['Exam Sections', 'Partes do exame', 'Части экзамена'],
'أماكن المدينة': ['Places in the City', 'Lugares da cidade', 'Места в городе'],
'أمثال شائعة': ['Common Proverbs', 'Provérbios populares', 'Распространённые пословицы'],
'أنشطة يومية': ['Daily Activities', 'Atividades diárias', 'Повседневные занятия'],
'أنواع الأفلام': ['Film Genres', 'Gêneros de filme', 'Жанры кино'],
'أنواع الكتب': ['Book Genres', 'Gêneros literários', 'Жанры книг'],
'أنواع الموسيقى': ['Music Genres', 'Gêneros musicais', 'Жанры музыки'],
'أيام الأسبوع': ['Days of the Week', 'Dias da semana', 'Дни недели'],
'إتمام الطلب': ['Completing the Order', 'Fazer o pedido', 'Завершение заказа'],
'إجراء مكالمة': ['Making a Call', 'Fazer uma chamada', 'Телефонный разговор'],
'إسبانيا وأمريكا': ['Spain and Latin America', 'Espanha e América', 'Испания и Латинская Америка'],
'إشارات الطريق': ['Road Signs', 'Placas de trânsito', 'Дорожные знаки'],
'إغلاق الصفقة': ['Closing the Deal', 'Fechar o acordo', 'Завершение сделки'],
'اختيار التخصص': ['Choosing a Major', 'Escolher a carreira', 'Выбор специальности'],
'اختيار حيوان أليف': ['Choosing a Pet', 'Escolher um animal de estimação', 'Выбор домашнего питомца'],
'استراتيجيات الحل': ['Problem-Solving Strategies', 'Estratégias', 'Стратегии решения'],
'الآلات الموسيقية': ['Musical Instruments', 'Instrumentos musicais', 'Музыкальные инструменты'],
'الأثاث': ['Furniture', 'Móveis', 'Мебель'],
'الأجهزة': ['Devices', 'Dispositivos', 'Устройства'],
'الأحلام': ['Dreams', 'Sonhos', 'Мечты'],
'الأخطاء الشائعة': ['Common Mistakes', 'Erros comuns', 'Распространённые ошибки'],
'الأدوات المدرسية': ['School Supplies', 'Material escolar', 'Школьные принадлежности'],
'الأرقام 1-100': ['Numbers 1-100', 'Números 1-100', 'Числа 1-100'],
'الأرقام والجداول': ['Figures and Tables', 'Cifras e tabelas', 'Цифры и таблицы'],
'الأزمات الاقتصادية': ['Economic Crises', 'Crises econômicas', 'Экономические кризисы'],
'الأسعار': ['Prices', 'Preços', 'Цены'],
'الأسماء والجنس': ['Nouns and Gender', 'Substantivos e gênero', 'Существительные и род'],
'الأشكال': ['Shapes', 'Formas', 'Фигуры'],
'الأشهر والفصول': ['Months and Seasons', 'Meses e estações', 'Месяцы и времена года'],
'الأعداد الترتيبية': ['Ordinal Numbers', 'Números ordinais', 'Порядковые числительные'],
'الأفعال الشاذة في المضارع': ['Irregular Present Verbs', 'Verbos irregulares', 'Неправильные глаголы в настоящем времени'],
'الأفعال المنتظمة': ['Regular Verbs', 'Verbos regulares', 'Правильные глаголы'],
'الأقارب': ['Relatives', 'Parentes', 'Родственники'],
'الألوان': ['Colors', 'Cores', 'Цвета'],
'الأنماط الفنية': ['Art Styles', 'Estilos artísticos', 'Художественные стили'],
'الإقناع بالبيانات': ['Persuading with Data', 'Persuadir com dados', 'Убеждение с помощью данных'],
'الإلقاء الواثق': ['Confident Delivery', 'Falar com segurança', 'Уверенное выступление'],
'الإيجار والشراء': ['Renting or Buying', 'Alugar ou comprar', 'Аренда или покупка'],
'الاتجاهات': ['Directions', 'Direções', 'Направления'],
'الاجتماعات عبر الإنترنت': ['Online Meetings', 'Reuniões online', 'Онлайн-встречи'],
'الاحترام والتسامح': ['Respect and Tolerance', 'Respeito e tolerância', 'Уважение и терпимость'],
'الاختصاران Al و Del': ['The Contractions Al and Del', 'Contrações Al e Del', 'Сокращения Al и Del'],
'الاختلاف بلباقة': ['Disagreeing Politely', 'Discordar com respeito', 'Вежливое несогласие'],
'الادخار': ['Saving Money', 'Poupar dinheiro', 'Накопления'],
'الارتجال': ['Improvising', 'Improvisar', 'Импровизация'],
'الامتحانات': ['Exams', 'Exames', 'Экзамены'],
'الانتخابات': ['Elections', 'Eleições', 'Выборы'],
'الانطباعات الفنية': ['Artistic Impressions', 'Impressões', 'Впечатления об искусстве'],
'الباييلا': ['Paella', 'A paella', 'Паэлья'],
'البحث عن سكن': ['Looking for Housing', 'Procurar apartamento', 'Поиск жилья'],
'البحث والمقارنة': ['Searching and Comparing', 'Pesquisar e comparar', 'Поиск и сравнение'],
'البرامج السياسية': ['Political Programs', 'Programas políticos', 'Политические программы'],
'البريد الإلكتروني الرسمي': ['Formal Email', 'E-mail formal', 'Официальное письмо'],
'البطولات': ['Tournaments', 'Torneios', 'Турниры'],
'التاباس': ['Tapas', 'As tapas', 'Тапас'],
'التجارة الدولية': ['International Trade', 'Comércio internacional', 'Международная торговля'],
'التجربة': ['The Experiment', 'O experimento', 'Эксперимент'],
'التحيات الرسمية': ['Formal Greetings', 'Saudações formais', 'Официальные приветствия'],
'التخصصات الطبية': ['Medical Specialties', 'Especialidades médicas', 'Медицинские специальности'],
'التذاكر': ['Tickets', 'Bilhetes', 'Билеты'],
'التراكيب الفعلية': ['Verbal Periphrases', 'Perífrases verbais', 'Глагольные перифразы'],
'الترقية والعطلة': ['Promotion and Vacation', 'Ascenso e férias', 'Повышение и отпуск'],
'التشجيع': ['Encouraging the Team', 'Animar a equipe', 'Поддержка команды'],
'التشخيص': ['The Diagnosis', 'O diagnóstico', 'Диагностика'],
'التطوع': ['Volunteering', 'Voluntariado', 'Волонтёрство'],
'التعارف بالجيران': ['Getting to Know Neighbors', 'Conhecer os vizinhos', 'Знакомство с соседями'],
'التعبير عن الذوق': ['Saying What You Like', 'Dizer o que gostamos', 'Выражение вкуса'],
'التعبير عن الضغط': ['Talking About Stress', 'Falar do estresse', 'Разговор о стрессе'],
'التعبير عن النية': ['Expressing Intention', 'Expressar intenção', 'Выражение намерения'],
'التعبير عن الوجود': ['Expressing Existence (Hay)', 'Expressar existência', 'Выражение наличия (Hay)'],
'التعبير عن قراءة': ['Opinions About a Book', 'Opinar sobre um livro', 'Мнение о книге'],
'التفضيلات': ['Preferences', 'Preferências', 'Предпочтения'],
'التقرير المختصر': ['The Brief Report', 'O relatório breve', 'Краткий отчёт'],
'التكيف': ['Adapting', 'Adaptar-se', 'Адаптация'],
'التنازل والمقابل': ['Conceding and Gaining', 'Ceder e ganhar', 'Уступки и компромисс'],
'التنبؤ الجوي': ['The Weather Forecast', 'A previsão do tempo', 'Прогноз погоды'],
'التهاني': ['Congratulations', 'Felicitações', 'Поздравления'],
'التوازن بين العمل والحياة': ['Work-Life Balance', 'Equilíbrio vida-trabalho', 'Баланс работы и жизни'],
'التوثيق': ['Citing and Referencing', 'Citar e referenciar', 'Цитирование и ссылки'],
'التوصيل والمشاكل': ['Delivery and Problems', 'Entrega e problemas', 'Доставка и проблемы'],
'الجمل الشرطية': ['Conditional Sentences', 'Frases condicionais', 'Условные предложения'],
'الجمل الموصولة': ['Relative Clauses', 'Orações relativas', 'Придаточные определительные'],
'الجنسيات': ['Nationalities', 'Nacionalidades', 'Национальности'],
'الجوائز والمهرجانات': ['Awards and Festivals', 'Prêmios e festivais', 'Награды и фестивали'],
'الحالة الاجتماعية': ['Marital Status', 'Estado civil', 'Семейное положение'],
'الحجج المضادة': ['Counterarguments', 'Contra-argumentos', 'Контраргументы'],
'الحجز في الفندق': ['Booking a Hotel', 'Reservar um hotel', 'Бронирование отеля'],
'الحساب البسيط': ['Simple Arithmetic', 'Cálculo simples', 'Простые вычисления'],
'الحساب البنكي': ['The Bank Account', 'A conta bancária', 'Банковский счёт'],
'الحفلات': ['Concerts', 'Shows', 'Концерты'],
'الحقوق والالتزامات': ['Rights and Obligations', 'Direitos e obrigações', 'Права и обязанности'],
'الحلويات الإسبانية': ['Spanish Desserts', 'Sobremesas espanholas', 'Испанские десерты'],
'الحملات': ['Campaigns', 'Campanhas', 'Кампании'],
'الحملة الإعلانية': ['The Ad Campaign', 'A campanha publicitária', 'Рекламная кампания'],
'الحياة الجامعية': ['University Life', 'Vida universitária', 'Студенческая жизнь'],
'الحياة الفطرية': ['Wildlife', 'Animais selvagens', 'Дикая природа'],
'الخصوصية والأمان': ['Privacy and Security', 'Privacidade e segurança', 'Конфиденциальность и безопасность'],
'الخوارزميات': ['Algorithms', 'Algoritmos', 'Алгоритмы'],
'الدعوة والرد': ['Inviting and Responding', 'Convidar e responder', 'Приглашение и ответ'],
'الدفع في المتجر': ['Paying in the Store', 'Pagar na loja', 'Оплата в магазине'],
'الدواء': ['Medication', 'O medicamento', 'Лекарства'],
'الدورات التدريبية': ['Training Courses', 'Cursos', 'Учебные курсы'],
'الديون': ['Debts', 'Dívidas', 'Долги'],
'الرسائل': ['Messages', 'Mensagens', 'Сообщения'],
'السؤال عن السعر': ['Asking the Price', 'Perguntar o preço', 'Как узнать цену'],
'السيرة الذاتية': ['The CV', 'O currículo', 'Резюме'],
'الشخصيات التاريخية': ['Historical Figures', 'Personagens históricos', 'Исторические личности'],
'الشراء الإلكتروني': ['Online Buying', 'Comprar online', 'Онлайн-покупки'],
'الشرط المركب': ['The Compound Conditional', 'O condicional composto', 'Сложное условное наклонение'],
'الشكر والاعتذار': ['Thanks and Apologies', 'Agradecimentos e desculpas', 'Благодарность и извинения'],
'الشكوى الرسمية': ['Filing a Complaint', 'Apresentar uma reclamação', 'Официальная жалоба'],
'الشهادات': ['Certificates', 'Certificados', 'Сертификаты'],
'الصرف والتحويل': ['Exchanging and Transferring', 'Trocar e transferir', 'Обмен и перевод денег'],
'الصيانة المنزلية': ['Home Repairs', 'Reparos em casa', 'Домашний ремонт'],
'الصيغ المهذبة': ['Polite Formulas', 'Fórmulas de cortesia', 'Вежливые формулы'],
'الضجيج والحلول': ['Noise and Solutions', 'O barulho', 'Шум и решения'],
'الطرود والشحن': ['Parcels and Shipping', 'Pacotes e envios', 'Посылки и доставка'],
'الطقس والأنشطة': ['Weather and Plans', 'Clima e planos', 'Погода и планы'],
'الطلب في المطعم': ['Ordering at the Restaurant', 'Fazer um pedido', 'Заказ в ресторане'],
'الظواهر الجوية': ['Weather Phenomena', 'Fenômenos meteorológicos', 'Погодные явления'],
'العطلة القادمة': ['The Next Vacation', 'As próximas férias', 'Следующий отпуск'],
'العقد': ['The Contract', 'O contrato', 'Договор'],
'العلاج والمتابعة': ['Treatment and Follow-up', 'Tratamento e acompanhamento', 'Лечение и наблюдение'],
'الغرفة والمشاكل': ['The Room and Problems', 'O quarto e problemas', 'Номер и проблемы'],
'الفاتورة والدفع': ['The Bill and Payment', 'A conta', 'Счёт и оплата'],
'الفرق بين Por و Para': ['Por vs. Para', 'Por vs. Para', 'Por и Para'],
'الفروق الثقافية': ['Cultural Differences', 'Diferenças culturais', 'Культурные различия'],
'الفصول الأربعة': ['The Four Seasons', 'As quatro estações', 'Четыре времени года'],
'الفواكه والخضار': ['Fruits and Vegetables', 'Frutas e verduras', 'Фрукты и овощи'],
'القراءة والأفلام': ['Books and Films', 'Livros e filmes', 'Книги и фильмы'],
'القصة القصيرة': ['The Short Story', 'O conto', 'Короткий рассказ'],
'القنوات الرقمية': ['Digital Channels', 'Canais digitais', 'Цифровые каналы'],
'القنوات والبرامج': ['Channels and Programs', 'Canais e programas', 'Каналы и передачи'],
'القيادة': ['Driving', 'Dirigir', 'Вождение'],
'الكتابة والتعبير': ['Writing and Expression', 'A escrita', 'Письмо и выражение мыслей'],
'الكتب': ['Books', 'Livros', 'Книги'],
'الكلام غير المباشر': ['Indirect Speech', 'O estilo indireto', 'Косвенная речь'],
'الكليشيهات': ['Stereotypes', 'Os estereótipos', 'Стереотипы'],
'اللغات': ['Languages', 'Os idiomas', 'Языки'],
'المؤسسات': ['Institutions', 'As instituições', 'Институты'],
'المؤشرات الاقتصادية': ['Economic Indicators', 'Indicadores', 'Экономические показатели'],
'الماضي الأسبق': ['The Past Perfect', 'O mais-que-perfeito', 'Давнопрошедшее время'],
'الماضي التابع': ['The Imperfect Subjunctive', 'O imperfeito do subjuntivo', 'Imperfecto de subjuntivo'],
'الماضي القريب': ['The Present Perfect', 'O pretérito perfeito', 'Ближайшее прошедшее (Pretérito Perfecto)'],
'المباراة': ['The Match', 'A partida', 'Матч'],
'المبني للمجهول': ['The Passive Voice', 'A voz passiva', 'Пассивный залог'],
'المتابعة': ['Following Up', 'Fazer seguimento', 'Контроль исполнения'],
'المتاحف والمعارض': ['Museums and Exhibitions', 'Museus e exposições', 'Музеи и выставки'],
'المساواة': ['Equality', 'A igualdade', 'Равенство'],
'المستقبل التام': ['The Future Perfect', 'O futuro perfeito', 'Будущее совершенное'],
'المستقبل القريب': ['The Near Future', 'O futuro próximo', 'Ближайшее будущее'],
'المسرح الإسباني': ['Spanish Theater', 'O teatro espanhol', 'Испанский театр'],
'المضارع المستمر': ['The Present Continuous', 'O presente contínuo', 'Настоящее продолженное'],
'المطابقة النحوية': ['Grammatical Agreement', 'A concordância', 'Согласование'],
'المعالم التاريخية': ['Historic Landmarks', 'Monumentos', 'Исторические памятники'],
'المقارنة والتفضيل': ['Comparisons and Superlatives', 'Comparativos e superlativos', 'Сравнительная степень'],
'المقاسات': ['Sizes', 'Os tamanhos', 'Размеры'],
'المقاسات والقماش': ['Sizes and Fabric', 'Tamanhos e tecidos', 'Размеры и ткань'],
'المكتبة والاستعارة': ['The Library and Borrowing', 'Emprestar na biblioteca', 'Библиотека и абонемент'],
'المكونات': ['Ingredients', 'Os ingredientes', 'Ингредиенты'],
'الملابس': ['Clothing', 'As roupas', 'Одежда'],
'الملابس والطقس': ['Dressing for the Weather', 'Vestir-se conforme o clima', 'Одежда по погоде'],
'الملعب والمعدات': ['Field and Equipment', 'Equipe e campo', 'Поле и снаряжение'],
'المناسبات': ['Special Dates', 'Datas especiais', 'Особые даты'],
'المنهجية': ['Methodology', 'A metodologia', 'Методология'],
'المهارات الجديدة': ['New Skills', 'Novas habilidades', 'Новые навыки'],
'المهام المنزلية': ['Household Chores', 'As tarefas de casa', 'Домашние дела'],
'المهرجانات السينمائية': ['Film Festivals', 'Festivais de cinema', 'Кинофестивали'],
'المهن الشائعة': ['Common Professions', 'Profissões comuns', 'Распространённые профессии'],
'المواد الدراسية': ['School Subjects', 'Disciplinas', 'Школьные предметы'],
'المواصلات': ['Means of Transport', 'Meios de transporte', 'Городской транспорт'],
'المواعيد': ['Appointments', 'As consultas', 'Приёмы и записи'],
'الموافقة': ['Agreeing', 'Estar de acordo', 'Согласие'],
'الموسيقى والرسم': ['Music and Drawing', 'Música e desenho', 'Музыка и рисование'],
'الميزانية الشهرية': ['The Monthly Budget', 'O orçamento mensal', 'Месячный бюджет'],
'النبر والترقيم': ['Accents and Punctuation', 'Acentos e pontuação', 'Ударения и пунктуация'],
'النتائج والنشر': ['Results and Publication', 'Resultados e publicação', 'Результаты и публикация'],
'النزاع والمحكمة': ['Disputes and Court', 'Disputa e julgamento', 'Споры и суд'],
'النطق واللهجات': ['Accents and Dialects', 'Acentos e dialetos', 'Произношение и диалекты'],
'النطق والمحادثة': ['Pronunciation and Conversation', 'Pronúncia e conversação', 'Произношение и разговор'],
'النفي': ['Negation', 'A negação', 'Отрицание'],
'الوثائق والتصاريح': ['Documents and Visas', 'Documentos e vistos', 'Документы и визы'],
'الوزن والكمية': ['Weight and Quantity', 'Peso e quantidade', 'Вес и количество'],
'الوسيط العقاري': ['The Real Estate Agent', 'A imobiliária', 'Риелтор'],
'الوصف البصري': ['Describing What We See', 'Descrever o que vemos', 'Описание увиденного'],
'بريد عمل فعّال': ['Effective Work Emails', 'E-mails eficazes', 'Эффективная рабочая почта'],
'بضاعة السوق': ['Market Products', 'Produtos do mercado', 'Товары на рынке'],
'بناء الحجة': ['Building an Argument', 'Construir um argumento', 'Построение аргумента'],
'بنية التقرير': ['Report Structure', 'Estrutura do relatório', 'Структура отчёта'],
'بنية المقال': ['Essay Structure', 'Estrutura do ensaio', 'Структура эссе'],
'تبرير الرأي': ['Justifying an Opinion', 'Justificar a opinião', 'Обоснование мнения'],
'تجهيز الحقيبة': ['Packing the Suitcase', 'Fazer a mala', 'Сборы чемодана'],
'تحديات العمل عن بعد': ['Remote Work Challenges', 'Desafios do teletrabalho', 'Трудности удалённой работы'],
'تحفيز الفريق': ['Motivating the Team', 'Motivar a equipe', 'Мотивация команды'],
'تخطيط رحلة': ['Planning a Trip', 'Planejar uma excursão', 'Планирование поездки'],
'تطبيقات مفيدة': ['Useful Apps', 'Apps úteis', 'Полезные приложения'],
'تعابير مجازية': ['Figurative Expressions', 'Expressões figuradas', 'Фразеологизмы'],
'تعبئة النماذج': ['Filling Out Forms', 'Preencher formulários', 'Заполнение бланков'],
'تفاوض الراتب': ['Negotiating Salary', 'Negociar o salário', 'Переговоры о зарплате'],
'تكوين الأسئلة': ['Forming Questions', 'As perguntas', 'Построение вопросов'],
'تكوين الجمع': ['Forming the Plural', 'O plural', 'Образование множественного числа'],
'توزيع المهام': ['Delegating Tasks', 'Delegar tarefas', 'Распределение задач'],
'ثيرفانتس ودون كيخوت': ['Cervantes and Don Quixote', 'Cervantes e o Quixote', 'Сервантес и Дон Кихот'],
'جسم الإنسان': ['The Human Body', 'O corpo humano', 'Тело человека'],
'حالات نفسية': ['Mood States', 'Estados de ânimo', 'Душевные состояния'],
'حالة الجو': ['What\'s the Weather Like?', 'Que tempo faz?', 'Какая погода?'],
'حروف الجر': ['Prepositions', 'Preposições', 'Предлоги'],
'حزم القواعد': ['Consolidating Grammar', 'Consolidar a gramática', 'Закрепление грамматики'],
'حل الخلافات': ['Resolving Conflicts', 'Resolver conflitos', 'Разрешение конфликтов'],
'حلول بيئية': ['Green Solutions', 'Soluções verdes', 'Экологичные решения'],
'حنين الوطن': ['Homesickness', 'A nostalgia', 'Тоска по дому'],
'حيوانات الأليفة': ['Pets', 'Animais de estimação', 'Домашние питомцы'],
'حيوانات المزرعة': ['Farm Animals', 'Animais da fazenda', 'Сельскохозяйственные животные'],
'خاتمة مقنعة': ['A Strong Closing', 'Encerrar com força', 'Убедительное заключение'],
'خدمات البلدية': ['Municipal Services', 'Serviços municipais', 'Муниципальные услуги'],
'خدمات الفندق': ['Hotel Services', 'Serviços do hotel', 'Услуги отеля'],
'خزانة الملابس': ['The Wardrobe', 'O armário', 'Гардероб'],
'خطوات الوصفة': ['Recipe Steps', 'Passos da receita', 'Шаги рецепта'],
'خلاصة النقاش': ['Concluding the Debate', 'Concluir o debate', 'Завершение дебатов'],
'دعوة إلى حفلة': ['Party Invitation', 'Convite para uma festa', 'Приглашение на вечеринку'],
'دول العالم': ['Countries of the World', 'Países do mundo', 'Страны мира'],
'ذكريات الرحلة': ['Travel Memories', 'Recordações da viagem', 'Воспоминания о поездке'],
'رحلة قصيرة': ['A Short Trip', 'Uma viagem curta', 'Короткая поездка'],
'رعاية الحيوان': ['Caring for Your Pet', 'Cuidar do animal', 'Уход за питомцем'],
'روابط إضافية': ['Additive Connectors', 'Conectores aditivos', 'Соединительные связки'],
'روابط تناقضية': ['Concessive Connectors', 'Conectores concessivos', 'Уступительные связки'],
'روابط سببية': ['Causal Connectors', 'Conectores causais', 'Причинные связки'],
'روتين الصباح': ['Morning Routine', 'Pela manhã', 'Утренняя рутина'],
'روتين المساء': ['Evening Routine', 'Pela noite', 'Вечерняя рутина'],
'رياضات شائعة': ['Popular Sports', 'Esportes populares', 'Популярные виды спорта'],
'زمن المضارع': ['The Present Tense', 'O presente', 'Настоящее время'],
'سان فيرمين': ['San Fermín', 'San Fermín', 'Сан-Фермин'],
'سرد الإنجازات': ['Describing Achievements', 'Contar conquistas', 'Рассказ о достижениях'],
'شراء التذاكر': ['Buying Tickets', 'Comprar entradas', 'Покупка билетов'],
'شراء تذكرة القطار': ['Buying a Train Ticket', 'Comprar um bilhete', 'Покупка билета на поезд'],
'صفات الملكية': ['Possessives', 'Possessivos', 'Притяжательные местоимения'],
'صيغة الأمر': ['The Imperative', 'O imperativo', 'Повелительное наклонение'],
'ضمائر المفعول به': ['Object Pronouns', 'Pronomes de objeto', 'Прямые дополнения'],
'طلب الدعم': ['Asking for Support', 'Pedir apoio', 'Просьба о поддержке'],
'طلب المساعدة': ['Asking for a Favor', 'Pedir um favor', 'Просьба об услуге'],
'طلب المساعدة التقنية': ['Asking for Tech Help', 'Pedir ajuda técnica', 'Просьба о техпомощи'],
'طلب عمل': ['Asking for Work', 'Pedir trabalho', 'Поиск работы'],
'طِفولتي': ['My Childhood', 'Minha infância', 'Моё детство'],
'ظروف التكرار': ['Adverbs of Frequency', 'Advérbios de frequência', 'Наречия частотности'],
'عادات خضراء': ['Eco-Friendly Habits', 'Hábitos ecológicos', 'Экологичные привычки'],
'عادات صحية': ['Healthy Habits', 'Hábitos saudáveis', 'Здоровые привычки'],
'عرض الفكرة': ['Presenting Your Pitch', 'Apresentar um pitch', 'Презентация идеи'],
'عقد الإيجار': ['The Rental Agreement', 'O contrato de aluguel', 'Договор аренды'],
'عناوين الأخبار': ['Headlines', 'Manchetes', 'Заголовки новостей'],
'عند البيطري': ['At the Vet', 'No veterinário', 'У ветеринара'],
'عند الطبيب': ['At the Doctor', 'No médico', 'У врача'],
'عيد الميلاد': ['Birthday', 'O aniversário', 'День рождения'],
'غرف البيت': ['Rooms of the House', 'Os cômodos', 'Комнаты дома'],
'فتح التفاوض': ['Opening the Negotiation', 'Abrir a negociação', 'Начало переговоров'],
'فترات تاريخية': ['Historical Periods', 'Épocas históricas', 'Исторические эпохи'],
'فروق Ser و Estar': ['Ser vs. Estar', 'Ser vs. Estar', 'Ser и Estar'],
'فروق الأزمنة': ['Tense Nuances', 'Nuanças dos tempos', 'Оттенки времён'],
'فن الخطابة': ['The Art of Oratory', 'A oratória', 'Ораторское искусство'],
'فن السرد': ['The Art of Narration', 'A arte de narrar', 'Искусство повествования'],
'فهم المسموع': ['Listening Comprehension', 'Compreensão auditiva', 'Аудирование'],
'فهم النصوص': ['Reading Comprehension', 'Compreensão leitora', 'Чтение и понимание'],
'في الطبيعة': ['In Nature', 'Na natureza', 'На природе'],
'في الفندق': ['At the Hotel', 'No hotel', 'В отеле'],
'في المحطة': ['At the Station', 'Na estação', 'На вокзале'],
'في المطبخ': ['In the Kitchen', 'Na cozinha', 'На кухне'],
'في مكتب البريد': ['At the Post Office', 'Nos correios', 'На почте'],
'قراءة الأخبار': ['Reading the News', 'Ler as notícias', 'Чтение новостей'],
'قراءة الساعة': ['Telling the Time', 'Dizer as horas', 'Как сказать время'],
'قريب وبعيد': ['Near and Far', 'Perto e longe', 'Близко и далеко'],
'قطع الملابس': ['Garments', 'Peças de roupa', 'Предметы одежды'],
'قياس النتائج': ['Measuring Results', 'Medir resultados', 'Измерение результатов'],
'كتابة الحوار': ['Writing Dialogue', 'Escrever diálogos', 'Написание диалогов'],
'كلاسيكيات إسبانيا': ['Spanish Classics', 'Clássicos espanhóis', 'Классика Испании'],
'لا فالنسية': ['Las Fallas', 'As Fallas', 'Фальяс'],
'لغة موضوعية': ['Objective Language', 'Linguagem objetiva', 'Объективный язык'],
'لوركا والشعر': ['Lorca and Poetry', 'Lorca e a poesia', 'Лорка и поэзия'],
'ماتشادو والمشي': ['Machado and the Walk', 'Machado e o caminho', 'Мачадо и путь'],
'متى نستخدم المجاز': ['When to Use Them', 'Quando usá-las', 'Когда употреблять'],
'محاذير الترجمة': ['Translation Traps', 'Falsos amigos', 'Ложные друзья переводчика'],
'محطة البنزين': ['The Gas Station', 'O posto de gasolina', 'Заправка'],
'مخرجون عظام': ['Great Directors', 'Grandes diretores', 'Великие режиссёры'],
'مراجعة الترجمة': ['Reviewing a Translation', 'Revisar a tradução', 'Редактирование перевода'],
'مراجعة فيلم': ['Writing a Review', 'Fazer uma crítica', 'Написание рецензии'],
'مراسلة رسمية': ['Formal Letter', 'Carta formal', 'Официальное письмо'],
'مزايا العمل عن بعد': ['Remote Work Benefits', 'Vantagens do teletrabalho', 'Преимущества удалённой работы'],
'مشاعر أساسية': ['Basic Emotions', 'Emoções básicas', 'Базовые эмоции'],
'مشاكل المال': ['Money Problems', 'Problemas com dinheiro', 'Проблемы с деньгами'],
'مشاكل بيئية': ['Environmental Problems', 'Problemas ambientais', 'Экологические проблемы'],
'مشاكل تقنية': ['Technical Problems', 'Problemas técnicos', 'Технические проблемы'],
'مشاهدة الشقق': ['Viewing Apartments', 'Visitar apartamentos', 'Осмотр квартир'],
'مصادر الأخبار': ['News Sources', 'Fontes de informação', 'Источники новостей'],
'معادلات الترجمة': ['Translation Equivalents', 'Equivalências', 'Эквиваленты перевода'],
'مفردات تختلف': ['Different Words', 'Palavras distintas', 'Различающаяся лексика'],
'مقابلة العمل': ['The Job Interview', 'A entrevista', 'Собеседование'],
'مقابلة قصيرة': ['A Short Interview', 'Entrevista curta', 'Короткое интервью'],
'مكان العمل': ['The Workplace', 'O local de trabalho', 'Рабочее место'],
'منصات المحتوى': ['Content Platforms', 'Plataformas de conteúdo', 'Контент-платформы'],
'مهرجانات أخرى': ['Other Festivals', 'Outras festas', 'Другие праздники'],
'مواساة وتشجيع': ['Consoling and Encouraging', 'Consolar e animar', 'Утешение и поддержка'],
'نصيحة الصيدلية': ['Pharmacy Advice', 'Conselhos do farmacêutico', 'Совет аптекаря'],
'نقاش خبر': ['Discussing a News Item', 'Comentar uma notícia', 'Обсуждение новости'],
'نهاية الأسبوع': ['The Weekend', 'O fim de semana', 'Выходные'],
'نهاية الأسبوع الماضي': ['Last Weekend', 'O fim de semana passado', 'Прошлые выходные'],
'هيكل العرض': ['Presentation Structure', 'Estrutura da apresentação', 'Структура выступления'],
'وجبات اليوم': ['Meals of the Day', 'As refeições do dia', 'Приёмы пищи'],
'وسائل السفر': ['Ways to Travel', 'Formas de viajar', 'Способы путешествовать'],
'وصف الأعراض': ['Describing Symptoms', 'Descrever sintomas', 'Описание симптомов'],
'وصف الأماكن والأشخاص': ['Describing Places and People', 'Descrever', 'Описание мест и людей'],
'وظائف الطلاب': ['Student Jobs', 'Trabalhos para estudantes', 'Студенческая подработка'],
'يوم الامتحان': ['Exam Day', 'O dia do exame', 'День экзамена'],
'يوم الانتقال': ['Moving Day', 'O dia da mudança', 'День переезда'],
'يوم العمل': ['The Workday', 'O dia de trabalho', 'Рабочий день'],
'يوم مدرسي': ['A School Day', 'Um dia de aula', 'Школьный день']
};
