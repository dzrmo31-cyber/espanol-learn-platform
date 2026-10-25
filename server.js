const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Datastore = require('nedb-promises');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'espanol_learn_secret_key_2024_secure';
const ADMIN_JWT_SECRET = 'admin_espanol_secret_key_2024_admin';

// ======================== MIDDLEWARE ========================
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('.'));
app.use('/uploads', express.static('uploads'));

// ======================== NEDB SETUP ========================
if (!fs.existsSync('db')) fs.mkdirSync('db');

const db = {
  users:    Datastore.create({ filename: 'db/users.db',    autoload: true }),
  chapters: Datastore.create({ filename: 'db/chapters.db', autoload: true }),
  lessons:  Datastore.create({ filename: 'db/lessons.db',  autoload: true }),
  quizzes:  Datastore.create({ filename: 'db/quizzes.db',  autoload: true }),
  progress: Datastore.create({ filename: 'db/progress.db', autoload: true }),
  payments: Datastore.create({ filename: 'db/payments.db', autoload: true }),
  settings: Datastore.create({ filename: 'db/settings.db', autoload: true }),
  admins:   Datastore.create({ filename: 'db/admins.db',   autoload: true }),
};

// Ensure unique indexes
db.users.ensureIndex({ fieldName: 'email', unique: true });
db.admins.ensureIndex({ fieldName: 'username', unique: true });
db.settings.ensureIndex({ fieldName: 'key', unique: true });
db.progress.ensureIndex({ fieldName: 'uid_lid' });

// ======================== INIT DEFAULT DATA ========================
async function initData() {
  const adminExists = await db.admins.findOne({ username: 'admin' });
  if (!adminExists) {
    const hashed = bcrypt.hashSync('admin123', 10);
    await db.admins.insert({ _id: uuidv4(), username: 'admin', password: hashed, createdAt: new Date() });
  }

  const defaultSettings = [
    { key: 'site_bg_image', value: '' },
    { key: 'site_bg_opacity', value: '0.3' },
    { key: 'site_bg_blur', value: '0' },
    { key: 'site_bg_size', value: 'cover' },
    { key: 'site_bg_color', value: '#0f0c29' },
    { key: 'site_name', value: 'إسبانيول - تعلم الإسبانية' },
    { key: 'site_subtitle', value: 'تعلم اللغة الإسبانية بطريقة سهلة وممتعة' },
  ];
  for (const s of defaultSettings) {
    const exists = await db.settings.findOne({ key: s.key });
    if (!exists) await db.settings.insert({ _id: uuidv4(), ...s });
  }

  const seedDatabase = require('./seed');
  await seedDatabase(db);
}

// ======================== UPLOADS SETUP ========================
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('uploads/backgrounds')) fs.mkdirSync('uploads/backgrounds');
if (!fs.existsSync('uploads/lessons')) fs.mkdirSync('uploads/lessons');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, req.uploadDest || 'uploads/'),
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// ======================== AUTH MIDDLEWARE ========================
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'غير مصرح' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(403).json({ error: 'رمز المصادقة غير صالح' }); }
};

const verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'غير مصرح' });
  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ error: 'صلاحيات المدير مطلوبة' });
    req.admin = decoded; next();
  } catch { res.status(403).json({ error: 'رمز المصادقة غير صالح' }); }
};

// Helper to get user subscription
async function getUserSub(token) {
  if (!token) return { userId: null, sub: 'free' };
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const u = await db.users.findOne({ _id: decoded.id });
    return { userId: decoded.id, sub: u ? u.subscription_status : 'free' };
  } catch { return { userId: null, sub: 'free' }; }
}

// ======================== AUTH ROUTES ========================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    if (password.length < 6) return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    const hashed = bcrypt.hashSync(password, 10);
    const userId = uuidv4();
    await db.users.insert({ _id: userId, name, email, password: hashed, level: 'مبتدئ', xp: 0, total_xp: 0, streak: 0, subscription_status: 'free', is_active: true, createdAt: new Date() });
    const token = jwt.sign({ id: userId, email, name }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, token, user: { id: userId, name, email, level: 'مبتدئ', xp: 0, subscription_status: 'free' } });
  } catch (e) {
    if (e.errorType === 'uniqueViolated') return res.status(400).json({ error: 'البريد الإلكتروني مستخدم بالفعل' });
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.users.findOne({ email });
    if (!user) return res.status(400).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    if (!user.is_active) return res.status(403).json({ error: 'الحساب موقوف. تواصل مع الإدارة' });
    if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    await db.users.update({ _id: user._id }, { $set: { last_active: new Date() } });
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, level: user.level, xp: user.xp, subscription_status: user.subscription_status } });
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }); }
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await db.admins.findOne({ username });
    if (!admin || !bcrypt.compareSync(password, admin.password)) return res.status(400).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    const token = jwt.sign({ id: admin._id, username: admin.username, isAdmin: true }, ADMIN_JWT_SECRET, { expiresIn: '8h' });
    res.json({ success: true, token, admin: { id: admin._id, username: admin.username } });
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }); }
});

app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await db.users.findOne({ _id: req.user.id });
    if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' });
    const { password, ...safe } = user;
    res.json({ ...safe, id: safe._id });
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }); }
});



// ======================== ANALYTICS ========================
app.get('/api/analytics/user', verifyToken, async (req, res) => {
  try {
    const user = await db.users.findOne({ _id: req.user.id });
    const progress = await db.progress.find({ user_id: req.user.id, completed: true });
    
    // Group progress by level
    const completedLessonIds = progress.map(p => p.lesson_id);
    const lessons = await db.lessons.find({ _id: { $in: completedLessonIds } });
    const chapterIds = [...new Set(lessons.map(l => l.chapter_id))];
    const chapters = await db.chapters.find({ _id: { $in: chapterIds } });
    
    const levelStats = {};
    chapters.forEach(ch => {
      const lvl = ch.level || 'عام';
      if(!levelStats[lvl]) levelStats[lvl] = 0;
      // Count how many completed lessons belong to this chapter
      const count = lessons.filter(l => l.chapter_id === ch._id).length;
      levelStats[lvl] += count;
    });

    const stats = {
      xp: user.xp || 0,
      total_lessons: progress.length,
      level: user.level || 'مبتدئ',
      levelStats
    };
    res.json(stats);
  } catch (e) { res.status(500).json({ error: 'خطأ في الخادم' }); }
});

app.get('/api/admin/analytics', verifyAdmin, async (req, res) => {
  try {
    const usersCount = await db.users.count({});
    const paidUsersCount = await db.users.count({ subscription_status: 'paid' });
    const paymentsCount = await db.payments.count({ status: 'pending' });
    const progressCount = await db.progress.count({ completed: true });
    res.json({ usersCount, paidUsersCount, paymentsCount, progressCount });
  } catch (e) { res.status(500).json({ error: 'خطأ في الخادم' }); }
});

// ======================== SUBSCRIPTIONS ========================
app.post('/api/subscription/free', verifyToken, async (req, res) => {
  try {
    await db.users.update({ _id: req.user.id }, { $set: { subscription_status: 'free' } });
    res.json({ success: true, message: 'تم تفعيل الخطة المجانية' });
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }); }
});

app.post('/api/subscription/request', verifyToken, async (req, res) => {
  try {
    const existing = await db.payments.findOne({ user_id: req.user.id, status: 'pending' });
    if (existing) return res.status(400).json({ error: 'لديك طلب قيد المراجعة بالفعل' });
    
    await db.payments.insert({ 
      _id: uuidv4(), 
      user_id: req.user.id, 
      user_name: req.user.name,
      user_email: req.user.email,
      amount: 1500, 
      status: 'pending', 
      createdAt: new Date() 
    });
    res.json({ success: true, message: 'تم إرسال طلبك للإدارة للتواصل معك' });
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }); }
});

app.get('/api/admin/payments', verifyAdmin, async (req, res) => {
  try {
    const requests = await db.payments.find({}).sort({ createdAt: -1 });
    res.json(requests);
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }); }
});

app.post('/api/admin/payments/:id/accept', verifyAdmin, async (req, res) => {
  try {
    const payment = await db.payments.findOne({ _id: req.params.id });
    if (!payment) return res.status(404).json({ error: 'الطلب غير موجود' });
    
    await db.payments.update({ _id: req.params.id }, { $set: { status: 'accepted' } });
    await db.users.update({ _id: payment.user_id }, { $set: { subscription_status: 'paid' } });
    
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }); }
});

// ======================== CHAPTERS & LESSONS (PUBLIC) ========================
app.get('/api/chapters', async (req, res) => {
  try {
    const { userId, sub } = await getUserSub(req.headers['authorization']?.split(' ')[1]);
    const chapters = await db.chapters.find({}).sort({ order_num: 1 });
    const result = [];
    for (const ch of chapters) {
      const lessons = await db.lessons.find({ chapter_id: ch._id }).sort({ order_num: 1 });
      let completedCount = 0;
      if (userId) {
        const progs = await db.progress.find({ user_id: userId, lesson_id: { $in: lessons.map(l => l._id) }, completed: true });
        completedCount = progs.length;
      }
      
      const isChapterLocked = !ch.is_free && sub === 'free';
      
      result.push({
        ...ch, id: ch._id,
        locked: isChapterLocked,
        lessons: lessons.map(l => ({ ...l, id: l._id, locked: isChapterLocked || (!l.is_free && sub === 'free') })),
        progress: lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0,
      });
    }
    res.json(result);
  } catch (e) { console.error(e); res.status(500).json({ error: 'خطأ في الخادم' }); }
});

app.get('/api/lessons/:id', async (req, res) => {
  try {
    const lesson = await db.lessons.findOne({ _id: req.params.id });
    if (!lesson) return res.status(404).json({ error: 'الدرس غير موجود' });
    const { userId, sub } = await getUserSub(req.headers['authorization']?.split(' ')[1]);
    if (!lesson.is_free && sub === 'free') return res.status(403).json({ error: 'هذا الدرس يتطلب اشتراكاً مدفوعاً', requiresSubscription: true });
    const quizzes = await db.quizzes.find({ lesson_id: lesson._id }).sort({ order_num: 1 });
    const progress = userId ? await db.progress.findOne({ user_id: userId, lesson_id: lesson._id }) : null;
    res.json({ ...lesson, id: lesson._id, quizzes, userProgress: progress });
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }); }
});

// ======================== PROGRESS ========================
app.post('/api/progress/complete', verifyToken, async (req, res) => {
  try {
    const { lessonId, score, timeSpent } = req.body;
    const lesson = await db.lessons.findOne({ _id: lessonId });
    if (!lesson) return res.status(404).json({ error: 'الدرس غير موجود' });
    const existing = await db.progress.findOne({ user_id: req.user.id, lesson_id: lessonId });
    if (existing) {
      await db.progress.update({ _id: existing._id }, { $set: { completed: true, score: Math.max(existing.score || 0, score || 100), last_attempt: new Date() }, $inc: { attempts: 1, time_spent: timeSpent || 0 } });
    } else {
      await db.progress.insert({ _id: uuidv4(), user_id: req.user.id, lesson_id: lessonId, completed: true, score: score || 100, attempts: 1, last_attempt: new Date(), time_spent: timeSpent || 0 });
      await db.users.update({ _id: req.user.id }, { $inc: { xp: lesson.xp_reward || 10, total_xp: lesson.xp_reward || 10 } });
    }
    const user = await db.users.findOne({ _id: req.user.id });
    res.json({ success: true, xpEarned: lesson.xp_reward || 10, totalXp: user.total_xp });
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }); }
});

app.get('/api/progress', verifyToken, async (req, res) => {
  try {
    const progress = await db.progress.find({ user_id: req.user.id }).sort({ last_attempt: -1 });
    const user = await db.users.findOne({ _id: req.user.id });
    const totalLessons = await db.lessons.count({});
    const completedLessons = await db.progress.count({ user_id: req.user.id, completed: true });
    res.json({ progress, user: { xp: user.xp, total_xp: user.total_xp, level: user.level, streak: user.streak }, stats: { totalLessons, completedLessons, percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0 } });
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }); }
});

// ======================== PAYMENTS ========================
app.post('/api/payments/submit', verifyToken, async (req, res) => {
  try {
    const { amount, payment_method, reference } = req.body;
    if (!amount || !payment_method || !reference) return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    const user = await db.users.findOne({ _id: req.user.id });
    await db.payments.insert({ _id: uuidv4(), user_id: req.user.id, user_name: user.name, user_email: user.email, amount: parseFloat(amount), currency: 'DZD', payment_method, reference, status: 'pending', admin_notes: '', createdAt: new Date() });
    res.json({ success: true, message: 'تم إرسال طلب الدفع. سيتم مراجعته خلال 24 ساعة' });
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }); }
});

app.get('/api/payments/my', verifyToken, async (req, res) => {
  try { res.json(await db.payments.find({ user_id: req.user.id }).sort({ createdAt: -1 })); }
  catch { res.status(500).json({ error: 'خطأ في الخادم' }); }
});

// ======================== SETTINGS ========================
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await db.settings.find({});
    const obj = {}; settings.forEach(s => obj[s.key] = s.value);
    res.json(obj);
  } catch { res.status(500).json({ error: 'خطأ' }); }
});

// ======================== ADMIN ROUTES ========================
app.get('/api/admin/users', verifyAdmin, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) query = { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] };
    const users = await db.users.find(query).sort({ createdAt: -1 });
    res.json(users.map(u => { const { password, ...safe } = u; return { ...safe, id: safe._id }; }));
  } catch { res.status(500).json({ error: 'خطأ' }); }
});

app.patch('/api/admin/users/:id', verifyAdmin, async (req, res) => {
  try {
    const { is_active, subscription_status, subscription_expires } = req.body;
    const update = {};
    if (is_active !== undefined) update.is_active = Boolean(parseInt(is_active));
    if (subscription_status !== undefined) update.subscription_status = subscription_status;
    if (subscription_expires !== undefined) update.subscription_expires = subscription_expires;
    await db.users.update({ _id: req.params.id }, { $set: update });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'خطأ' }); }
});

// Chapters CRUD
app.get('/api/admin/chapters', verifyAdmin, async (req, res) => {
  try { res.json((await db.chapters.find({}).sort({ order_num: 1 })).map(c => ({ ...c, id: c._id }))); }
  catch { res.status(500).json({ error: 'خطأ' }); }
});
app.post('/api/admin/chapters', verifyAdmin, async (req, res) => {
  try {
    const { title, description, is_free, icon, color } = req.body;
    if (!title) return res.status(400).json({ error: 'العنوان مطلوب' });
    const maxDoc = await db.chapters.find({}).sort({ order_num: -1 }).limit(1);
    const maxOrder = maxDoc.length ? maxDoc[0].order_num : 0;
    const id = uuidv4();
    await db.chapters.insert({ _id: id, title, description: description || '', order_num: maxOrder + 1, is_free: is_free !== false && is_free !== 'false' && is_free !== 0, icon: icon || '📚', color: color || '#667eea', createdAt: new Date() });
    res.json({ success: true, id });
  } catch { res.status(500).json({ error: 'خطأ' }); }
});
app.put('/api/admin/chapters/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, description, is_free, icon, color, order_num } = req.body;
    await db.chapters.update({ _id: req.params.id }, { $set: { title, description, is_free: is_free === true || is_free === 'true' || is_free === 1 || is_free === '1', icon, color, order_num: parseInt(order_num) } });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'خطأ' }); }
});
app.delete('/api/admin/chapters/:id', verifyAdmin, async (req, res) => {
  try {
    await db.chapters.remove({ _id: req.params.id });
    const lessons = await db.lessons.find({ chapter_id: req.params.id });
    for (const l of lessons) { await db.quizzes.remove({ lesson_id: l._id }, { multi: true }); await db.progress.remove({ lesson_id: l._id }, { multi: true }); }
    await db.lessons.remove({ chapter_id: req.params.id }, { multi: true });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'خطأ' }); }
});

// Lessons CRUD
app.get('/api/admin/lessons', verifyAdmin, async (req, res) => {
  try {
    const { chapter_id } = req.query;
    const query = chapter_id ? { chapter_id } : {};
    const lessons = await db.lessons.find(query).sort({ chapter_id: 1, order_num: 1 });
    const result = [];
    for (const l of lessons) {
      const ch = await db.chapters.findOne({ _id: l.chapter_id });
      result.push({ ...l, id: l._id, chapter_title: ch ? ch.title : '' });
    }
    res.json(result);
  } catch { res.status(500).json({ error: 'خطأ' }); }
});
app.post('/api/admin/lessons', verifyAdmin, async (req, res) => {
  try {
    const { chapter_id, title, description, content, vocabulary, examples, pronunciation, is_free, xp_reward, duration } = req.body;
    if (!chapter_id || !title) return res.status(400).json({ error: 'الفصل والعنوان مطلوبان' });
    const maxDoc = await db.lessons.find({ chapter_id }).sort({ order_num: -1 }).limit(1);
    const maxOrder = maxDoc.length ? maxDoc[0].order_num : 0;
    const id = uuidv4();
    let parsedVocab = [], parsedEx = [];
    try { parsedVocab = typeof vocabulary === 'string' ? JSON.parse(vocabulary) : vocabulary || []; } catch {}
    try { parsedEx = typeof examples === 'string' ? JSON.parse(examples) : examples || []; } catch {}
    await db.lessons.insert({ _id: id, chapter_id, title, description: description || '', content: content || '', vocabulary: parsedVocab, examples: parsedEx, pronunciation: pronunciation || '', order_num: maxOrder + 1, is_free: is_free === true || is_free === 'true' || is_free === '1', xp_reward: parseInt(xp_reward) || 10, duration: parseInt(duration) || 15, createdAt: new Date() });
    res.json({ success: true, id });
  } catch { res.status(500).json({ error: 'خطأ' }); }
});
app.put('/api/admin/lessons/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, description, content, vocabulary, examples, pronunciation, is_free, xp_reward, duration, order_num } = req.body;
    let parsedVocab = [], parsedEx = [];
    try { parsedVocab = typeof vocabulary === 'string' ? JSON.parse(vocabulary) : vocabulary || []; } catch {}
    try { parsedEx = typeof examples === 'string' ? JSON.parse(examples) : examples || []; } catch {}
    await db.lessons.update({ _id: req.params.id }, { $set: { title, description, content, vocabulary: parsedVocab, examples: parsedEx, pronunciation, is_free: is_free === true || is_free === 'true' || is_free === '1', xp_reward: parseInt(xp_reward) || 10, duration: parseInt(duration) || 15, order_num: parseInt(order_num) } });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'خطأ' }); }
});
app.delete('/api/admin/lessons/:id', verifyAdmin, async (req, res) => {
  try {
    await db.lessons.remove({ _id: req.params.id });
    await db.quizzes.remove({ lesson_id: req.params.id }, { multi: true });
    await db.progress.remove({ lesson_id: req.params.id }, { multi: true });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'خطأ' }); }
});

// Quizzes
app.get('/api/admin/quizzes/:lessonId', verifyAdmin, async (req, res) => {
  try { res.json(await db.quizzes.find({ lesson_id: req.params.lessonId }).sort({ order_num: 1 })); }
  catch { res.status(500).json({ error: 'خطأ' }); }
});
app.post('/api/admin/quizzes', verifyAdmin, async (req, res) => {
  try {
    const { lesson_id, question, type, options, correct_answer, explanation } = req.body;
    if (!lesson_id || !question || !correct_answer) return res.status(400).json({ error: 'بيانات ناقصة' });
    const maxDoc = await db.quizzes.find({ lesson_id }).sort({ order_num: -1 }).limit(1);
    const id = uuidv4();
    await db.quizzes.insert({ _id: id, lesson_id, question, type: type || 'multiple_choice', options: Array.isArray(options) ? options : [], correct_answer, explanation: explanation || '', order_num: maxDoc.length ? maxDoc[0].order_num + 1 : 1 });
    res.json({ success: true, id });
  } catch { res.status(500).json({ error: 'خطأ' }); }
});
app.delete('/api/admin/quizzes/:id', verifyAdmin, async (req, res) => {
  try { await db.quizzes.remove({ _id: req.params.id }); res.json({ success: true }); }
  catch { res.status(500).json({ error: 'خطأ' }); }
});

// Payments
app.get('/api/admin/payments', verifyAdmin, async (req, res) => {
  try { res.json((await db.payments.find({}).sort({ createdAt: -1 })).map(p => ({ ...p, id: p._id }))); }
  catch { res.status(500).json({ error: 'خطأ' }); }
});
app.patch('/api/admin/payments/:id', verifyAdmin, async (req, res) => {
  try {
    const { status, admin_notes } = req.body;
    await db.payments.update({ _id: req.params.id }, { $set: { status, admin_notes: admin_notes || '', updatedAt: new Date() } });
    if (status === 'approved') {
      const payment = await db.payments.findOne({ _id: req.params.id });
      if (payment) {
        const exp = new Date(); exp.setMonth(exp.getMonth() + 1);
        await db.users.update({ _id: payment.user_id }, { $set: { subscription_status: 'premium', subscription_expires: exp } });
      }
    }
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'خطأ' }); }
});

// Background
app.post('/api/admin/background/upload', verifyAdmin, (req, res, next) => {
  req.uploadDest = 'uploads/backgrounds'; next();
}, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'لم يتم رفع صورة' });
    const imageUrl = `/uploads/backgrounds/${req.file.filename}`;
    const { opacity, blur, size, color } = req.body;
    const updates = { site_bg_image: imageUrl };
    if (opacity !== undefined) updates.site_bg_opacity = opacity;
    if (blur !== undefined) updates.site_bg_blur = blur;
    if (size !== undefined) updates.site_bg_size = size;
    if (color !== undefined) updates.site_bg_color = color;
    for (const [key, value] of Object.entries(updates)) {
      await db.settings.update({ key }, { $set: { value } });
    }
    res.json({ success: true, imageUrl });
  } catch { res.status(500).json({ error: 'خطأ في رفع الصورة' }); }
});
app.delete('/api/admin/background', verifyAdmin, async (req, res) => {
  try {
    const s = await db.settings.findOne({ key: 'site_bg_image' });
    if (s && s.value) { const p = '.' + s.value; if (fs.existsSync(p)) fs.unlinkSync(p); }
    await db.settings.update({ key: 'site_bg_image' }, { $set: { value: '' } });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'خطأ' }); }
});

// Settings
app.post('/api/admin/settings', verifyAdmin, async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await db.settings.update({ key }, { $set: { value } });
    }
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'خطأ' }); }
});

// Dashboard stats
app.get('/api/admin/stats', verifyAdmin, async (req, res) => {
  try {
    const totalUsers    = await db.users.count({});
    const premiumUsers  = await db.users.count({ subscription_status: 'premium' });
    const totalChapters = await db.chapters.count({});
    const totalLessons  = await db.lessons.count({});
    const pendingPayments = await db.payments.count({ status: 'pending' });
    const approvedPayments = await db.payments.find({ status: 'approved' });
    const totalRevenue = approvedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const recentUsers = await db.users.find({}).sort({ createdAt: -1 }).limit(5);
    res.json({ totalUsers, premiumUsers, totalChapters, totalLessons, pendingPayments, totalRevenue, recentUsers: recentUsers.map(u => { const { password, ...s } = u; return { ...s, id: s._id }; }) });
  } catch { res.status(500).json({ error: 'خطأ' }); }
});

// ======================== START ========================
initData().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 الخادم يعمل على: http://localhost:${PORT}`);
    console.log(`📚 الموقع العام:  http://localhost:${PORT}/index.html`);
    console.log(`🔐 لوحة الإدارة: http://localhost:${PORT}/admin.html`);
    console.log(`👤 بيانات المدير: admin / admin123\n`);
  });
}).catch(console.error);
