import { LevelInfo, Milestone } from '../types';

export const LEVELS: LevelInfo[] = [
  {
    level: 1,
    titleAr: 'إعادة الضبط',
    titleEn: 'Resetting',
    minXp: 0,
    maxXp: 100,
    descriptionAr: 'البداية وكسر حلقة الاندفاع التلقائي والتعرف على المشتتات الأولى.',
    descriptionEn: 'Breaking the automatic impulsive loop and noticing initial triggers.',
    badge: '🌱',
  },
  {
    level: 2,
    titleAr: 'واعي',
    titleEn: 'Aware',
    minXp: 100,
    maxXp: 400,
    descriptionAr: 'القدرة على رصد لحظة الرغبة قبل أن تتحول إلى بحث أو سلوك متكرر.',
    descriptionEn: 'Spotting the urge before it transitions into search or impulsive browsing.',
    badge: '👁️',
  },
  {
    level: 3,
    titleAr: 'متحكم',
    titleEn: 'Controlled',
    minXp: 400,
    maxXp: 800,
    descriptionAr: 'امتلاك عادات فورية ناجحة لتغيير البيئة وقطع التسلسل مبكراً.',
    descriptionEn: 'Equipped with fast behavioral anchors to shift environments and pause momentum.',
    badge: '🛡️',
  },
  {
    level: 4,
    titleAr: 'ثابت',
    titleEn: 'Consistent',
    minXp: 800,
    maxXp: 1400,
    descriptionAr: 'بناء حدود ليلية منتظمة وتجنب العزلة مع الهاتف في أوقات الفراغ.',
    descriptionEn: 'Solid evening boundaries and avoiding isolation with devices in quiet hours.',
    badge: '⚡',
  },
  {
    level: 5,
    titleAr: 'صلب',
    titleEn: 'Locked In',
    minXp: 1400,
    maxXp: 2200,
    descriptionAr: 'إتقان حقيقي لإعادة توجيه طاقة الفراغ والملل مباشرة إلى إنجاز وبناء.',
    descriptionEn: 'Channelling boredom and solitude directly into creative construction and learning.',
    badge: '🔥',
  },
  {
    level: 6,
    titleAr: 'نمط الصفر',
    titleEn: 'Zero Mode',
    minXp: 2200,
    maxXp: 10000,
    descriptionAr: 'حالة تركيز وسيطرة شخصية عالية. الرغبة إشارة عابرة لا تستدعي الاستجابة.',
    descriptionEn: 'High behavioral clarity and control. Urges are transient moments without grip.',
    badge: '👑',
  },
];

export const MILESTONES: Milestone[] = [
  {
    days: 3,
    xpReward: 50,
    titleAr: 'المحطة الأولى (3 أيام)',
    titleEn: 'First Checkpoint (3 Days)',
    descriptionAr: 'وصلتي لأول محطة. كسر الاندفاع الحاد الأولي.',
    descriptionEn: 'Reached the first milestone. Overcame the acute initial urges.',
    icon: '🏁',
  },
  {
    days: 7,
    xpReward: 100,
    titleAr: 'أسبوع النصر (7 أيام)',
    titleEn: 'Victory Week (7 Days)',
    descriptionAr: 'أسبوع كامل من الصمود والسيطرة الواعية.',
    descriptionEn: 'A full week of resilience and conscious control.',
    icon: '🏆',
  },
  {
    days: 14,
    xpReward: 150,
    titleAr: 'حصن الأسبوعين (14 يوم)',
    titleEn: 'Two Weeks Strong (14 Days)',
    descriptionAr: 'بداية استقرار الدوبامين الطبيعي وانخفاض حساسية المحفزات.',
    descriptionEn: 'Natural dopamine stabilization and reduced trigger sensitivity.',
    icon: '🔥',
  },
  {
    days: 30,
    xpReward: 300,
    titleAr: 'حاجز الشهر (30 يوم)',
    titleEn: 'One Month Barrier (30 Days)',
    descriptionAr: 'شهر كامل من البناء والوضوح وتثبيت الهوية الجديدة.',
    descriptionEn: 'One full month of building clarity and cementing a new identity.',
    icon: '💪',
  },
  {
    days: 40,
    xpReward: 400,
    titleAr: 'عتبة التحول (40 يوم)',
    titleEn: 'Transformation Threshold (40 Days)',
    descriptionAr: 'إعادة هيكلة المسارات العصبية وبداية التحكم التلقائي.',
    descriptionEn: 'Neural pathway reorganization and emerging automatic control.',
    icon: '⚡',
  },
  {
    days: 60,
    xpReward: 600,
    titleAr: 'الدرع الفولاذي (60 يوم)',
    titleEn: 'Iron Shield (60 Days)',
    descriptionAr: 'مناعة سلوكية قوية أمام أصعب اللحظات.',
    descriptionEn: 'Strong behavioral immunity in the face of demanding moments.',
    icon: '🛡️',
  },
  {
    days: 90,
    xpReward: 1000,
    titleAr: 'سيادة نمط الصفر (90 يوم)',
    titleEn: 'Zero Sovereignty (90 Days)',
    descriptionAr: 'إعادة ضبط كاملة. الرغبة أصبحت إشارة عابرة بلا أي تأثير.',
    descriptionEn: 'Complete reset. Urges are now transient background noise.',
    icon: '👑',
  },
];

export interface CalculatedLevel extends LevelInfo {
  descAr: string;
  descEn: string;
  nextLevelXp: number;
  progressPercent: number;
}

export function getLevelForXp(xp: number): CalculatedLevel {
  let matched = LEVELS[0];
  let nextLvl = LEVELS[1] || LEVELS[0];

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      matched = LEVELS[i];
      nextLvl = LEVELS[i + 1] || LEVELS[i];
      break;
    }
  }

  const range = Math.max(1, nextLvl.minXp - matched.minXp);
  const currentInRange = xp - matched.minXp;
  const progressPercent =
    matched.level === LEVELS[LEVELS.length - 1].level
      ? 100
      : Math.min(100, Math.max(0, Math.round((currentInRange / range) * 100)));

  return {
    ...matched,
    descAr: matched.descriptionAr,
    descEn: matched.descriptionEn,
    nextLevelXp: nextLvl.minXp > matched.minXp ? nextLvl.minXp : matched.maxXp,
    progressPercent,
  };
}
