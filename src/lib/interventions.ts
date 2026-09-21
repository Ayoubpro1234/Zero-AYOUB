import { InterventionCategory, InterventionItem, BoredomChallenge, InterventionLog } from '../types';

export const EMERGENCY_90S_STEPS = [
  {
    step: 1,
    titleAr: 'ضع الهاتف بعيداً فوراً',
    titleEn: 'PUT THE PHONE DOWN',
    descAr: 'اترك الهاتف على طاولة بعيدة وافرغ يديك تماماً من الشاشة.',
    descEn: 'Place the phone face-down across the room and free your hands.',
    seconds: 12,
    icon: 'SmartphoneOff',
  },
  {
    step: 2,
    titleAr: 'غادر الغرفة الآن',
    titleEn: 'LEAVE THE ROOM',
    descAr: 'قف واخرج من الغرفة فوراً. تغيير المكان يقطع الاسترسال الذهني المعتاد.',
    descEn: 'Stand up and step out of the room. Changing physical space disrupts habitual momentum.',
    seconds: 12,
    icon: 'DoorOpen',
  },
  {
    step: 3,
    titleAr: 'انتقل لمكان مفتوح أو بجوار الآخرين',
    titleEn: 'MOVE NEAR PEOPLE / OPEN SPACE',
    descAr: 'اجلس حيث يوجد أفراد الأسرة أو في إضاءة جيدة ومكان مفتوح.',
    descEn: 'Sit in the living room, near family members, or in an open well-lit area.',
    seconds: 12,
    icon: 'Users',
  },
  {
    step: 4,
    titleAr: 'خذ 5 أنفاس بطيئة وعميقة',
    titleEn: 'TAKE 5 SLOW BREATHS',
    descAr: 'شهيق هادئ، حبس لطيف، ثم زفير ممتد لتهدئة سرعتك واستعادة تركيزك.',
    descEn: 'Slow inhale, gentle pause, and steady exhale to slow down rapid impulses.',
    seconds: 18,
    isBreathing: true,
    icon: 'Wind',
  },
  {
    step: 5,
    titleAr: 'اشرب رشفات ماء بارد',
    titleEn: 'DRINK A GLASS OF WATER',
    descAr: 'شرب الماء بتمهل يحدث تنبيهاً حسياً سريعاً يقطع الاندفاع الآلي.',
    descEn: 'Take slow sips of cool water. A simple physical reset to pause automatic reflexes.',
    seconds: 10,
    icon: 'GlassWater',
  },
  {
    step: 6,
    titleAr: 'حركة جسدية لمدة 30 ثانية',
    titleEn: 'MOVE FOR 30 SECONDS',
    descAr: 'تمشَّ قليلاً أو قم بتمارين تمدد أو قرفصاء خفيفة لتفريغ التوتر الحركي.',
    descEn: 'Pace around, do light stretches, or easy squats to redirect physical tension.',
    seconds: 14,
    icon: 'Activity',
  },
  {
    step: 7,
    titleAr: 'مرساة سكينة (وضوء / تفكر هادئ)',
    titleEn: 'PERSONAL RESET & GROUNDING',
    descAr: 'توضأ بماء منعش أو اقرأ آية الكرسي أو استشعر اللحظة الحاضرة بهدوء.',
    descEn: 'Take ablution (wudu), recite a calming verse, or quietly ground your thoughts.',
    seconds: 12,
    icon: 'Sparkles',
  },
  {
    step: 8,
    titleAr: 'مهمة آمنة لقتل الفراغ',
    titleEn: 'START A 5-MINUTE SAFE MISSION',
    descAr: 'وجّه تركيزك فوراً إلى مهمة محددة واضحة تنقل عقلك إلى حالة إنجاز نافع.',
    descEn: 'Channel your attention into an engaging, structured activity to fill the void.',
    seconds: 12,
    icon: 'Zap',
  },
];

export const INTERVENTION_POOL: InterventionItem[] = [
  {
    id: 'int_cold_face',
    category: 'cold_reset',
    titleAr: 'غسيل الوجه بالماء البارد',
    titleEn: 'Cold Water Facial Splash',
    instructionAr: 'اذهب إلى الحمام واغسل وجهك ورقبتك بماء بارد لإنعاش حسي سريع يقطع شرود الذهن.',
    instructionEn: 'Splash cold water onto your face and the back of your neck for a crisp sensory reset.',
    durationSeconds: 60,
    iconName: 'Droplets',
    actionTextAr: 'تم الإنعاش بالماء',
    actionTextEn: 'Splashed & Refreshed',
  },
  {
    id: 'int_pushups',
    category: 'movement',
    titleAr: '20 تمرين ضغط أو قرفصاء نشطة',
    titleEn: '20 Focused Push-Ups or Squats',
    instructionAr: 'انزل إلى الأرض وقم بحركات بدنية نشطة مع التنفس العميق لتحويل التوتر إلى طاقة مفيدة.',
    instructionEn: 'Perform active physical repetitions while focusing on steady breathing to channel restless tension.',
    durationSeconds: 90,
    iconName: 'Dumbbell',
    actionTextAr: 'أكملت التمرين',
    actionTextEn: 'Completed',
  },
  {
    id: 'int_box_breathing',
    category: 'breathing',
    titleAr: 'جلسة تنفس متزن (4-4-4-4)',
    titleEn: 'Steady Box Breathing',
    instructionAr: 'شهيق 4 ثوانٍ، حبس 4 ثوانٍ، زفير 4 ثوانٍ، حبس 4 ثوانٍ. كرر ذلك 4 دورات هادئة.',
    instructionEn: 'Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat for 4 measured calming cycles.',
    durationSeconds: 90,
    iconName: 'Wind',
    actionTextAr: 'أتممت التنفس',
    actionTextEn: 'Completed',
  },
  {
    id: 'int_leave_phone',
    category: 'leave_phone',
    titleAr: 'إيداع الهاتف بعيداً لمدة 15 دقيقة',
    titleEn: 'Phone Quarantine (15 Min)',
    instructionAr: 'ضع الهاتف على الشاحن في غرفة أخرى واجلس دون أي شاشة حتى تهدأ الرغبة تماماً.',
    instructionEn: 'Place your smartphone in another room. Remain screen-free until the urge dissolves.',
    durationSeconds: 120,
    iconName: 'SmartphoneOff',
    actionTextAr: 'وضعت الهاتف بعيداً',
    actionTextEn: 'Phone Put Away',
  },
  {
    id: 'int_walk_balcony',
    category: 'change_environment',
    titleAr: 'الخروج للشرفة أو الهواء المفتوح',
    titleEn: 'Step Outside into Fresh Air',
    instructionAr: 'اخرج إلى الشرفة أو الفناء، انظر إلى مسافة بعيدة وتنفس هواءً نقياً لمدة دقيقتين.',
    instructionEn: 'Step into open outdoor air, look at distant scenery, and take deep breaths.',
    durationSeconds: 90,
    iconName: 'Compass',
    actionTextAr: 'خرجت للهواء',
    actionTextEn: 'Stepped Outside',
  },
  {
    id: 'int_quran_reminder',
    category: 'spiritual_reminder',
    titleAr: 'قراءة آية الكرسي واستحضار المعية',
    titleEn: 'Ayat Al-Kursi & Reflection',
    instructionAr: 'اقرأ آية الكرسي بتمهل واستحضر عظمة الله ومعيته، واستعذ به من نزغات النفس والشيطان.',
    instructionEn: 'Recite Ayat Al-Kursi slowly with mindful reflection, anchoring your attention in calm faith.',
    durationSeconds: 90,
    iconName: 'BookOpen',
    actionTextAr: 'قرأت وتأملت',
    actionTextEn: 'Reflected',
  },
  {
    id: 'int_call_friend',
    category: 'talk_to_someone',
    titleAr: 'التحدث مع شخص أو الأهل',
    titleEn: 'Quick Conversation with Family',
    instructionAr: 'تحدث مع أحد أفراد الأسرة أو تواصل مع صديق في موضوع نافع لكسر حاجز العزلة.',
    instructionEn: 'Talk to family members or connect with a friend to break out of isolated brooding.',
    durationSeconds: 120,
    iconName: 'PhoneCall',
    actionTextAr: 'تحدثت مع أحدهم',
    actionTextEn: 'Connected',
  },
  {
    id: 'int_clean_desk',
    category: 'cleaning',
    titleAr: 'ترتيب وتنظيف المكتب أو الغرفة',
    titleEn: 'Tidy Desk or Room for 3 Min',
    instructionAr: 'تخلص من الفوضى على سطح مكتبك أو رتب سريرك. الترتيب الحسي يعيد النظام إلى الذهن.',
    instructionEn: 'Clear cluttered items from your desk or make your bed. Outer order aids inner calm.',
    durationSeconds: 120,
    iconName: 'Sparkle',
    actionTextAr: 'رتبت المكان',
    actionTextEn: 'Tidied',
  },
  {
    id: 'int_tea_water',
    category: 'water',
    titleAr: 'إعداد كوب شاي دافئ بتمهل',
    titleEn: 'Mindfully Brew Warm Herbal Tea',
    instructionAr: 'اذهب للمطبخ وقم بغلي الماء بهدوء وإعداد مشروب دافئ، مع التركيز على كل حركة.',
    instructionEn: 'Step into the kitchen and prepare a warm beverage with calm, attentive focus.',
    durationSeconds: 120,
    iconName: 'Coffee',
    actionTextAr: 'صنعت المشروب',
    actionTextEn: 'Brewed',
  },
  {
    id: 'int_coding_challenge',
    category: 'coding_task',
    titleAr: 'مسألة ذهنية أو لغز تحليلي',
    titleEn: '5-Minute Analytical Challenge',
    instructionAr: 'افتح لغزاً منطقياً أو مسألة رياضية وانقل انتباهك إلى التفكير التحليلي الهادئ.',
    instructionEn: 'Engage with a structured logic puzzle or math question to engage deliberate thinking.',
    durationSeconds: 180,
    iconName: 'Code',
    actionTextAr: 'أنجزت التحدي',
    actionTextEn: 'Solved',
  },
];

export const BOREDOM_CHALLENGES: BoredomChallenge[] = [
  {
    id: 'bc_pushups',
    titleAr: '20 عدة ضغط + 20 قرفصاء',
    titleEn: '20 Push-Ups + 20 Squats',
    descAr: 'حرك عضلاتك ونشط الدورة الدموية بدلاً من الجلوس الخامل.',
    descEn: 'Get moving and shake off lethargy with clean physical movement.',
    durationMinutes: 3,
    category: 'movement',
    icon: 'Activity',
  },
  {
    id: 'bc_tidy',
    titleAr: 'ترتيب زاوية واحدة من الغرفة',
    titleEn: 'Tidy One Corner of Your Room',
    descAr: 'اختر مكاناً غير مرتب (مكتب، رف، سرير) واجعله منظماً تماماً.',
    descEn: 'Pick one cluttered spot and restore complete order.',
    durationMinutes: 5,
    category: 'cleaning',
    icon: 'Sparkles',
  },
  {
    id: 'bc_read',
    titleAr: 'قراءة صفحتين من كتاب نافع',
    titleEn: 'Read 2 Pages of a Non-Fiction Book',
    descAr: 'افتح كتاباً ورقياً واقرأ صفحتين بتركيز مع استخراج فائدة عملية واحدة.',
    descEn: 'Open a physical book and read two full pages attentively.',
    durationMinutes: 5,
    category: 'study',
    icon: 'BookOpen',
  },
  {
    id: 'bc_memorize',
    titleAr: 'حفظ 5 أسطر / آيات',
    titleEn: 'Memorize 5 Lines or Verses',
    descAr: 'تحدَّ انتباهك بحفظ نص قصير وتكراره عدة مرات حتى يتقن.',
    descEn: 'Exercise active memory retention by learning 5 short lines.',
    durationMinutes: 7,
    category: 'faith',
    icon: 'Brain',
  },
  {
    id: 'bc_language',
    titleAr: 'تعلم 5 مفردات لغة جديدة',
    titleEn: 'Learn 5 Foreign Words',
    descAr: 'احفظ 5 كلمات في لغة تتعلمها وضع كلاً منها في جملة كاملة بصوت مسموع.',
    descEn: 'Learn 5 new vocabulary words and construct spoken sentences.',
    durationMinutes: 5,
    category: 'study',
    icon: 'Languages',
  },
  {
    id: 'bc_code',
    titleAr: 'كتابة سكريبت أو دالة برمجية',
    titleEn: 'Code a Small Script / Function',
    descAr: 'اكتب خوارزمية مفيدة أو نظف جزءاً برمجياً في أحد مشاريعك.',
    descEn: 'Write a small utility function or solve an algorithm puzzle.',
    durationMinutes: 10,
    category: 'coding',
    icon: 'Code',
  },
  {
    id: 'bc_math',
    titleAr: 'حل 3 مسائل منطقية أو ألغاز',
    titleEn: 'Solve 3 Logic Riddles',
    descAr: 'انقل تفكيرك إلى التحليل المنطقي واكسر حالة الانجراف العاطفي.',
    descEn: 'Shift your cognitive focus into deliberate analytical problem solving.',
    durationMinutes: 6,
    category: 'novelty',
    icon: 'Calculator',
  },
  {
    id: 'bc_tea',
    titleAr: 'إعداد مشروب دافئ بتمهل وحضور',
    titleEn: 'Mindfully Brew a Hot Cup of Tea',
    descAr: 'ركز في صوت غليان الماء ورائحة الأعشاب واستشعر الدفء والهدوء.',
    descEn: 'Focus attentively on the simple ritual: boiling water, aroma, warmth.',
    durationMinutes: 5,
    category: 'organization',
    icon: 'Coffee',
  },
  {
    id: 'bc_shower',
    titleAr: 'غسيل منعش أو دوش بارد',
    titleEn: 'Take a Refreshing Cool Shower',
    descAr: 'إنعاش حسي كامل للجسم يزيل الخمول والبلادة الذهنية.',
    descEn: 'A refreshing water rinse that sweeps away mental fog and sluggishness.',
    durationMinutes: 8,
    category: 'movement',
    icon: 'ShowerHead',
  },
  {
    id: 'bc_tomorrow_plan',
    titleAr: 'كتابة خطة الغد وأهم 3 أولويات',
    titleEn: 'Write Tomorrow\'s Top 3 Priorities',
    descAr: 'وضوح الأهداف يطرد القلق والملل ويبني وضوحاً مسبقاً لليوم التالي.',
    descEn: 'Clear priorities reduce aimless drifting and create intentional direction.',
    durationMinutes: 5,
    category: 'organization',
    icon: 'CheckSquare',
  },
  {
    id: 'bc_quran',
    titleAr: 'تلاوة ربع حزب من القرآن الكريم',
    titleEn: 'Recite a Portion of the Holy Quran',
    descAr: 'قراءة متأنية بصوت خاشع تزيل وحشة الصدر وتملأ الفراغ بالسكينة والاطمئنان.',
    descEn: 'Serene recitation bringing deep calm to the heart and replacing empty restlessness.',
    durationMinutes: 10,
    category: 'faith',
    icon: 'Heart',
  },
  {
    id: 'bc_walk',
    titleAr: 'المشي السريع لمدة 10 دقائق دون هاتف',
    titleEn: '10-Minute Phone-Free Brisk Walk',
    descAr: 'اترك الهاتف في المنزل واخرج للمشي في الهواء الطلق مع ملاحظة محيطك.',
    descEn: 'Leave your device at home and take a brisk outdoor walk noticing your surroundings.',
    durationMinutes: 10,
    category: 'movement',
    icon: 'Footprints',
  },
];

/**
 * Adaptive Intervention Selector:
 * Weighs each category according to its historical success rate from user logs.
 */
export function getAdaptiveIntervention(logs: InterventionLog[], excludeId?: string): InterventionItem {
  // Compute category weights
  const categoryStats: Record<string, { total: number; successes: number }> = {};

  logs.forEach((log) => {
    if (!categoryStats[log.category]) {
      categoryStats[log.category] = { total: 0, successes: 0 };
    }
    categoryStats[log.category].total += 1;
    if (log.success) {
      categoryStats[log.category].successes += 1;
    }
  });

  const available = INTERVENTION_POOL.filter((item) => item.id !== excludeId);
  if (available.length === 0) return INTERVENTION_POOL[0];

  // Weight array
  const weightedItems = available.map((item) => {
    const stat = categoryStats[item.category];
    let weight = 1.0;
    if (stat && stat.total > 0) {
      const rate = stat.successes / stat.total;
      // High success rate boosts weight up to 3x, low success reduces to 0.3x
      weight = Math.max(0.3, rate * 3.0);
    }
    return { item, weight };
  });

  const totalWeight = weightedItems.reduce((acc, curr) => acc + curr.weight, 0);
  let random = Math.random() * totalWeight;

  for (const entry of weightedItems) {
    if (random < entry.weight) {
      return entry.item;
    }
    random -= entry.weight;
  }

  return available[Math.floor(Math.random() * available.length)];
}
