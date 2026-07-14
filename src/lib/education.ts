export type Article = {
  id: string;
  title: string;
  category: string;
  readTime: string;
  cover: string; // tailwind gradient classes
  summary: string;
  body: string[];
};

export const articles: Article[] = [
  {
    id: "recovery",
    title: "卒中后运动康复指南",
    category: "康复训练",
    readTime: "5 分钟",
    cover: "from-blue-300 to-sky-200",
    summary: "黄金康复期把握、循序渐进的训练方法与居家训练动作。",
    body: [
      "卒中后的前 3-6 个月是功能恢复的黄金期,应在医生指导下尽早开始康复训练。",
      "训练遵循循序渐进原则:从被动活动、坐起、站立平衡逐步过渡到步行训练。",
      "居家可进行的训练:握力球、踝泵运动、桥式运动、坐站转换等,每日 2-3 次,每次 20 分钟。",
      "训练中如出现明显头晕、胸闷、血压异常,请立即停止并联系医生。",
    ],
  },
  {
    id: "diet",
    title: "卒中患者饮食管理",
    category: "营养支持",
    readTime: "4 分钟",
    cover: "from-emerald-300 to-teal-200",
    summary: "低盐低脂、地中海饮食模式与吞咽障碍患者的饮食技巧。",
    body: [
      "推荐地中海饮食模式:多蔬果、全谷物、深海鱼,适量坚果,少红肉与精制糖。",
      "每日食盐 ≤ 5g,烹调油 25-30g,避免腌制与油炸食品。",
      "存在吞咽障碍者应选择糊状或浓稠液体,小口缓慢进食,进食时坐直,餐后保持坐位 30 分钟。",
      "充足饮水(1500-2000ml/日,无禁忌情况下),预防便秘与血液浓缩。",
    ],
  },
  {
    id: "medication",
    title: "二级预防用药须知",
    category: "用药管理",
    readTime: "6 分钟",
    cover: "from-violet-300 to-purple-200",
    summary: "抗血小板、他汀类药物的服用注意与常见副作用识别。",
    body: [
      "抗血小板药物(阿司匹林、氯吡格雷)需长期规律服用,切勿自行停药。",
      "他汀类降脂药物可显著降低卒中复发风险,通常晚上服用效果更佳。",
      "服药期间注意观察:皮肤出血点、黑便、肌肉酸痛,出现异常及时就医。",
      "定期复查肝功能、肌酶、血脂,每 3-6 个月一次。",
    ],
  },
  {
    id: "warning",
    title: "卒中复发预警信号 FAST",
    category: "预警识别",
    readTime: "3 分钟",
    cover: "from-rose-300 to-orange-200",
    summary: "Face-Arm-Speech-Time:一分钟学会识别卒中。",
    body: [
      "F (Face) 面部:微笑时一侧嘴角下垂。",
      "A (Arm) 手臂:双手平举,一侧无力下落。",
      "S (Speech) 言语:讲话含糊或不能讲话。",
      "T (Time) 时间:发现以上任一症状,立即拨打 120,记录发病时间。",
      "卒中救治讲究'时间就是大脑',黄金救治时间窗为 4.5 小时内。",
    ],
  },
  {
    id: "mood",
    title: "卒中后情绪与心理调节",
    category: "心理支持",
    readTime: "4 分钟",
    cover: "from-pink-300 to-rose-200",
    summary: "识别卒中后抑郁,家属如何提供有效情感支持。",
    body: [
      "约 1/3 的卒中患者会出现卒中后抑郁,表现为情绪低落、兴趣减退、睡眠障碍。",
      "家属应给予耐心倾听与鼓励,避免责备或催促。",
      "鼓励患者参与社交活动、轻度运动与兴趣爱好,有助情绪改善。",
      "症状持续 2 周以上请及时就诊神经科或精神心理科。",
    ],
  },
];