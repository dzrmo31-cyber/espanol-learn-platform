const { v4: uuidv4 } = require('uuid');

async function seedDatabase(db) {
  const chCount = await db.chapters.count({});
  if (chCount > 0) return;

  const data = [
    {
      level: 'A1 - المستوى المبتدئ',
      chapters: [
        {
          title: 'الفصل الأول: البدايات والتحيات (Fundamentos)', description: 'أساسيات اللغة والتعارف اليومي', order_num: 1, is_free: true, icon: '👋', color: '#667eea',
          lessons: [
            { 
              title: 'التحيات الأساسية - Saludos', desc: 'كيف تلقي التحية في مختلف أوقات اليوم', 
              content: 'الإسبانية تعتمد كثيراً على الوقت لقول التحية المناسبة.',
              voc: [{es:'Hola',ar:'مرحباً'}, {es:'Buenos días',ar:'صباح الخير'}, {es:'Buenas tardes',ar:'مساء الخير'}, {es:'Buenas noches',ar:'تصبح على خير'}], 
              ex: [{es:'Hola, buenos días.', ar:'مرحباً، صباح الخير.'}], 
              quizQ: 'كيف تقول "صباح الخير"؟', quizA: 'Buenos días', options: ['Hola', 'Buenas noches', 'Adiós'] 
            },
            { 
              title: 'الوداع والشكر - Despedidas y Cortesía', desc: 'اللباقة والوداع', 
              content: 'من المهم دائماً استخدام كلمات الشكر في الثقافة الإسبانية.',
              voc: [{es:'Adiós',ar:'وداعاً'}, {es:'Hasta luego',ar:'أراك لاحقاً'}, {es:'Gracias',ar:'شكراً'}, {es:'Por favor',ar:'من فضلك'}, {es:'De nada',ar:'عفواً'}], 
              ex: [{es:'Gracias por tu ayuda.', ar:'شكراً على مساعدتك.'}, {es:'Hasta luego amigo.', ar:'أراك لاحقاً يا صديقي.'}], 
              quizQ: 'كيف تقول "من فضلك"؟', quizA: 'Por favor', options: ['Gracias', 'Adiós', 'De nada'] 
            },
            { 
              title: 'التعريف بالنفس - Presentaciones', desc: 'كيف تخبر الآخرين من أنت', 
              content: 'لتقديم نفسك نستخدم الفعل llamarse أو Ser.',
              voc: [{es:'Me llamo',ar:'اسمي'}, {es:'Soy',ar:'أنا أكون'}, {es:'Mucho gusto',ar:'تشرفنا'}, {es:'¿Cómo te llamas?',ar:'ما اسمك؟'}], 
              ex: [{es:'Me llamo Ahmed.', ar:'اسمي أحمد.'}, {es:'Soy de Argelia.', ar:'أنا من الجزائر.'}], 
              quizQ: 'أفضل طريقة لقول "اسمي أحمد" هي:', quizA: 'Me llamo Ahmed', options: ['Yo Ahmed', 'Llamo Ahmed', 'Soy nombre Ahmed'] 
            }
          ]
        },
        {
          title: 'الفصل الثاني: العائلة والأرقام (Familia y Números)', description: 'وصف العائلة وعد الأشياء', order_num: 2, is_free: true, icon: '👨‍👩‍👦', color: '#10b981',
          lessons: [
            { 
              title: 'أفراد العائلة - La Familia', desc: 'أسماء أفراد العائلة والأقارب', 
              content: 'تذكر أن الأسماء التي تنتهي بـ o غالباً مذكر، وبـ a مؤنث.',
              voc: [{es:'El padre',ar:'الأب'}, {es:'La madre',ar:'الأم'}, {es:'El hermano',ar:'الأخ'}, {es:'La hermana',ar:'الأخت'}, {es:'El hijo',ar:'الابن'}], 
              ex: [{es:'Mi hermano es alto.', ar:'أخي طويل.'}], 
              quizQ: 'ما معنى "El hermano"؟', quizA: 'الأخ', options: ['الأب', 'العم', 'الجد'] 
            },
            { 
              title: 'الأرقام 1 إلى 20 - Números del 1 al 20', desc: 'تعلم العد باللغة الإسبانية', 
              content: 'الأرقام من 1 إلى 15 لها أسماء خاصة، ثم تتبع نمطاً محدداً.',
              voc: [{es:'Uno',ar:'واحد'}, {es:'Dos',ar:'اثنان'}, {es:'Tres',ar:'ثلاثة'}, {es:'Diez',ar:'عشرة'}, {es:'Veinte',ar:'عشرون'}], 
              ex: [{es:'Tengo dos hermanos.', ar:'لدي أخوان.'}], 
              quizQ: 'الرقم "Diez" يعني:', quizA: 'عشرة', options: ['واحد', 'عشرون', 'خمسة'] 
            },
            { 
              title: 'الأيام والشهور - Días y Meses', desc: 'الزمن والتاريخ', 
              content: 'أيام الأسبوع في الإسبانية لا تُكتب بحرف كبير (capital letter) إلا في بداية الجملة.',
              voc: [{es:'Lunes',ar:'الاثنين'}, {es:'Martes',ar:'الثلاثاء'}, {es:'Enero',ar:'يناير'}, {es:'Febrero',ar:'فبراير'}, {es:'Hoy',ar:'اليوم'}], 
              ex: [{es:'Hoy es lunes.', ar:'اليوم هو الاثنين.'}], 
              quizQ: 'أي يوم هو "Lunes"؟', quizA: 'الاثنين', options: ['الأحد', 'الثلاثاء', 'الخميس'] 
            }
          ]
        },
        {
          title: 'الفصل الثالث: الطعام والمطعم (Comida y Restaurante)', description: 'الأكل والشرب والطلب', order_num: 3, is_free: false, icon: '🍽️', color: '#f59e0b',
          lessons: [
            { 
              title: 'الطعام والمشروبات - Comida y Bebidas', desc: 'المفردات الأساسية في المطبخ', 
              content: 'تعلم المفردات الأساسية لتتمكن من قراءة أي قائمة طعام (menú).',
              voc: [{es:'El agua',ar:'الماء'}, {es:'El pan',ar:'الخبز'}, {es:'La carne',ar:'اللحم'}, {es:'El pollo',ar:'الدجاج'}, {es:'El café',ar:'القهوة'}], 
              ex: [{es:'Quiero agua, por favor.', ar:'أريد ماءً، من فضلك.'}], 
              quizQ: 'كيف تقول "الماء"؟', quizA: 'El agua', options: ['El pan', 'La carne', 'El café'] 
            },
            { 
              title: 'الطلب في المطعم - Pedir en un restaurante', desc: 'استخدام الفعل Querer لطلب الطعام', 
              content: 'نستخدم الفعل Querer (أريد) للطلب بأدب.',
              voc: [{es:'Quiero',ar:'أريد'}, {es:'La cuenta',ar:'الفاتورة'}, {es:'El camarero',ar:'النادل'}, {es:'Delicioso',ar:'لذيذ'}], 
              ex: [{es:'La cuenta, por favor.', ar:'الفاتورة، من فضلك.'}, {es:'Quiero un café.', ar:'أريد قهوة.'}], 
              quizQ: 'ما معنى "La cuenta"؟', quizA: 'الفاتورة', options: ['النادل', 'المطعم', 'الكرسي'] 
            }
          ]
        }
      ]
    },
    {
      level: 'A2 - المستوى الأساسي',
      chapters: [
        {
          title: 'الفصل الأول: الروتين والأنشطة (Rutina Diaria)', description: 'الأفعال الانعكاسية ووصف اليوم', order_num: 4, is_free: false, icon: '⏰', color: '#06b6d4',
          lessons: [
            { 
              title: 'الأفعال الانعكاسية - Verbos Reflexivos', desc: 'الأفعال التي تقع على الفاعل نفسه', 
              content: 'الأفعال الانعكاسية تنتهي بـ se في المصدر، وتأخذ ضمائر (me, te, se, nos, os, se).',
              voc: [{es:'Despertarse',ar:'يستيقظ'}, {es:'Levantarse',ar:'ينهض'}, {es:'Ducharse',ar:'يستحم'}, {es:'Vestirse',ar:'يرتدي ملابسه'}], 
              ex: [{es:'Me levanto a las ocho.', ar:'أنهض في الثامنة.'}], 
              quizQ: 'أي من التالية فعل انعكاسي؟', quizA: 'Ducharse', options: ['Comer', 'Hablar', 'Vivir'] 
            },
            { 
              title: 'أوقات الفراغ - Tiempo Libre', desc: 'الرياضة والهوايات', 
              content: 'للتحدث عن الهوايات نستخدم الفعل Gustar (يعجبني).',
              voc: [{es:'Leer',ar:'يقرأ'}, {es:'Jugar',ar:'يلعب'}, {es:'Nadar',ar:'يسبح'}, {es:'Me gusta',ar:'يعجبني / أحب'}], 
              ex: [{es:'Me gusta leer libros.', ar:'أحب قراءة الكتب.'}], 
              quizQ: 'كيف تقول "أحب القراءة"؟', quizA: 'Me gusta leer', options: ['Yo leer', 'Me leer', 'Gusto leer'] 
            }
          ]
        },
        {
          title: 'الفصل الثاني: الماضي البسيط (Pretérito Indefinido)', description: 'التحدث عن تجارب الماضي', order_num: 5, is_free: false, icon: '⏪', color: '#8b5cf6',
          lessons: [
            { 
              title: 'أفعال AR في الماضي - Verbos en AR', desc: 'تصريف الأفعال المنتظمة المنتهية بـ AR', 
              content: 'النهايات هي: é, aste, ó, amos, asteis, aron.',
              voc: [{es:'Ayer',ar:'أمس'}, {es:'Hablé',ar:'تحدثتُ'}, {es:'Trabajó',ar:'عملَ (هو)'}, {es:'Viajamos',ar:'سافرنا'}], 
              ex: [{es:'Ayer hablé con María.', ar:'أمس تحدثت مع ماريا.'}], 
              quizQ: 'تصريف فعل Trabajar مع Yo في الماضي هو:', quizA: 'Trabajé', options: ['Trabajaste', 'Trabajo', 'Trabajó'] 
            },
            { 
              title: 'أفعال ER/IR في الماضي - Verbos en ER/IR', desc: 'تصريف الأفعال المنتظمة المنتهية بـ ER و IR', 
              content: 'النهايات هي: í, iste, ió, imos, isteis, ieron.',
              voc: [{es:'Comí',ar:'أكلتُ'}, {es:'Vivió',ar:'عاشَ (هو)'}, {es:'Salieron',ar:'خرجوا'}], 
              ex: [{es:'Comí una pizza anoche.', ar:'أكلت بيتزا الليلة الماضية.'}], 
              quizQ: 'ما معنى "Vivió"؟', quizA: 'عاش (هو)', options: ['عشتُ', 'عاشوا', 'نعيش'] 
            },
            { 
              title: 'الأفعال الشاذة - Verbos Irregulares', desc: 'أهم الأفعال الشاذة في الماضي (Ser, Ir, Hacer)', 
              content: 'الأفعال Ser (يكون) و Ir (يذهب) لها نفس التصريف في الماضي البسيط: Fui, fuiste, fue...',
              voc: [{es:'Fui',ar:'ذهبتُ / كنتُ'}, {es:'Fue',ar:'ذهبَ / كان'}, {es:'Hice',ar:'فعلتُ / صنعتُ'}], 
              ex: [{es:'Fui a España en 2020.', ar:'ذهبت إلى إسبانيا عام 2020.'}], 
              quizQ: 'ما هو الماضي البسيط لفعل Ir مع الضمير Yo؟', quizA: 'Fui', options: ['Iba', 'Fuy', 'Irí'] 
            }
          ]
        }
      ]
    },
    {
      level: 'B1 - المستوى المتوسط',
      chapters: [
        {
          title: 'الفصل الأول: المستقبل والمشروط (Futuro y Condicional)', description: 'التعبير عن الخطط والاحتمالات', order_num: 6, is_free: false, icon: '🔮', color: '#ec4899',
          lessons: [
            { 
              title: 'المستقبل البسيط - Futuro Simple', desc: 'التحدث عما سيحدث', 
              content: 'نُبقي الفعل في المصدر ونضيف: é, ás, á, emos, éis, án.',
              voc: [{es:'Mañana',ar:'غداً'}, {es:'Viajaré',ar:'سأسافر'}, {es:'Comerá',ar:'سيأكل'}], 
              ex: [{es:'Mañana viajaré a Madrid.', ar:'غداً سأسافر إلى مدريد.'}], 
              quizQ: 'تصريف فعل Trabajar مع (Yo) في المستقبل هو:', quizA: 'Trabajaré', options: ['Trabajo', 'Trabajaba', 'Trabajaría'] 
            },
            { 
              title: 'الزمن المشروط - El Condicional', desc: 'الطلبات المهذبة والمواقف الافتراضية', 
              content: 'نُبقي الفعل في المصدر ونضيف: ía, ías, ía, íamos, íais, ían.',
              voc: [{es:'Me gustaría',ar:'أود / سيعجبني'}, {es:'Podrías',ar:'هل يمكنك (لو سمحت)'}, {es:'Compraría',ar:'كنت سأشتري'}], 
              ex: [{es:'Me gustaría un café.', ar:'أود الحصول على قهوة.'}], 
              quizQ: 'كيف تطلب شيئاً بأدب شديد باستخدام Gustar؟', quizA: 'Me gustaría', options: ['Me gusta', 'Quiero', 'Gusté'] 
            }
          ]
        },
        {
          title: 'الفصل الثاني: صيغة الشك (El Subjuntivo)', description: 'الأمنيات والمشاعر والآراء', order_num: 7, is_free: false, icon: '🤔', color: '#f43f5e',
          lessons: [
            { 
              title: 'مقدمة في الشك - Introducción al Subjuntivo', desc: 'متى نستخدم هذه الصيغة؟', 
              content: 'نستخدم Subjuntivo للتعبير عن الرغبات، الشكوك، والمشاعر (مثال: أتمنى أن...).',
              voc: [{es:'Espero que',ar:'أتمنى أن'}, {es:'Quiero que',ar:'أريد أن'}, {es:'Vengas',ar:'تأتي (شك)'}, {es:'Hables',ar:'تتحدث (شك)'}], 
              ex: [{es:'Quiero que vengas.', ar:'أريد أن تأتي.'}, {es:'Espero que hables español.', ar:'أتمنى أن تتحدث الإسبانية.'}], 
              quizQ: 'أي الجمل التالية تستخدم Subjuntivo بشكل صحيح؟', quizA: 'Quiero que estudies', options: ['Quiero que estudias', 'Quiero estudias', 'Quiero que estudiar'] 
            }
          ]
        }
      ]
    },
    {
      level: 'B2 - المستوى المتقدم',
      chapters: [
        {
          title: 'الفصل الأول: الإسبانية الاحترافية (Español Profesional)', description: 'بيئة العمل والأعمال', order_num: 8, is_free: false, icon: '💼', color: '#3b82f6',
          lessons: [
            { 
              title: 'مقابلة العمل - La Entrevista de Trabajo', desc: 'الأسئلة والإجابات الشائعة', 
              content: 'في هذا الدرس سنتعلم المصطلحات اللازمة لاجتياز مقابلة عمل بنجاح.',
              voc: [{es:'El currículum',ar:'السيرة الذاتية'}, {es:'La experiencia',ar:'الخبرة'}, {es:'El puesto',ar:'المنصب / الوظيفة'}, {es:'Contratar',ar:'يوظف'}], 
              ex: [{es:'Tengo cinco años de experiencia en este puesto.', ar:'لدي خمس سنوات من الخبرة في هذا المنصب.'}], 
              quizQ: 'ما معنى "El currículum"؟', quizA: 'السيرة الذاتية', options: ['الخبرة', 'الوظيفة', 'الراتب'] 
            },
            { 
              title: 'إدارة الاجتماعات - Reuniones', desc: 'إدارة النقاش وطرح الآراء', 
              content: 'الكلمات المفتاحية لبدء وإدارة الاجتماعات بشكل احترافي.',
              voc: [{es:'El objetivo',ar:'الهدف'}, {es:'Discutir',ar:'يناقش'}, {es:'De acuerdo',ar:'موافق'}, {es:'La propuesta',ar:'الاقتراح'}], 
              ex: [{es:'El objetivo de esta reunión es discutir la propuesta.', ar:'هدف هذا الاجتماع هو مناقشة الاقتراح.'}], 
              quizQ: 'كيف تقول "أنا موافق"؟', quizA: 'Estoy de acuerdo', options: ['Soy acuerdo', 'Tengo acuerdo', 'Hago acuerdo'] 
            }
          ]
        }
      ]
    }
  ];

  for (const lvlData of data) {
    for (const ch of lvlData.chapters) {
      const chId = uuidv4();
      await db.chapters.insert({ 
        _id: chId, title: ch.title, description: ch.description, order_num: ch.order_num, 
        is_free: ch.is_free, icon: ch.icon, color: ch.color, level: lvlData.level, createdAt: new Date() 
      });

      let lessonOrder = 1;
      for (const l of ch.lessons) {
        const lId = uuidv4();
        await db.lessons.insert({ 
          _id: lId, chapter_id: chId, title: l.title, description: l.desc, content: l.content,
          vocabulary: l.voc, examples: l.ex, pronunciation: l.pron || '', 
          order_num: lessonOrder, is_free: ch.is_free, xp_reward: 20 + (ch.order_num * 5), duration: 15, createdAt: new Date()
        });

        await db.quizzes.insert({
          _id: uuidv4(), lesson_id: lId, question: l.quizQ, type: 'multiple_choice',
          options: l.options.concat([l.quizA]).sort(() => Math.random() - 0.5), // simple shuffle
          correct_answer: l.quizA, explanation: 'الإجابة الصحيحة هي: ' + l.quizA, order_num: 1
        });
        lessonOrder++;
      }
    }
  }
  console.log('✅ Seed Data Inserted Successfully');
}

module.exports = seedDatabase;
