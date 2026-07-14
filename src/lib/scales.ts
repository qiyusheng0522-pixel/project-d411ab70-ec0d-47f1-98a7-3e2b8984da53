export type ScaleQuestion = {
  id: string;
  text: string;
  options: { label: string; score: number }[];
};

export type Scale = {
  id: string;
  name: string;
  fullName: string;
  description: string;
  duration: string;
  questions: ScaleQuestion[];
  interpret: (total: number) => { level: string; advice: string };
};

const yesNo = (yesScore = 1) => [
  { label: "是", score: yesScore },
  { label: "否", score: 0 },
];

const freq04 = [
  { label: "没有问题", score: 0 },
  { label: "轻微", score: 1 },
  { label: "中等", score: 2 },
  { label: "较重", score: 3 },
  { label: "严重", score: 4 },
];

const freq03 = [
  { label: "完全没有", score: 0 },
  { label: "有几天", score: 1 },
  { label: "一半以上天数", score: 2 },
  { label: "几乎每天", score: 3 },
];

export const scales: Record<string, Scale> = {
  essen: {
    id: "essen",
    name: "Essen",
    fullName: "Essen 脑卒中风险评估量表",
    description: "评估缺血性卒中复发风险,共8项危险因素,总分0-9。",
    duration: "约 2 分钟",
    questions: [
      { id: "age", text: "您的年龄属于以下哪一类?", options: [
        { label: "小于 65 岁", score: 0 },
        { label: "65~75 岁", score: 1 },
        { label: "大于 75 岁", score: 2 },
      ]},
      { id: "htn", text: "是否有高血压?", options: yesNo() },
      { id: "dm", text: "是否有糖尿病?", options: yesNo() },
      { id: "mi", text: "是否有既往心肌梗死?", options: yesNo() },
      { id: "heart", text: "是否有其他心脏病(不含心房颤动和心肌梗死)?", options: yesNo() },
      { id: "pad", text: "是否有外周动脉疾病?", options: yesNo() },
      { id: "smoke", text: "是否吸烟?", options: yesNo() },
      { id: "tia", text: "是否有既往 TIA 或缺血性卒中史?", options: yesNo() },
    ],
    interpret: (t) => {
      if (t <= 2) return { level: "低风险", advice: "维持健康生活方式,坚持二级预防随访。" };
      if (t <= 6) return { level: "高风险", advice: "建议规范抗血小板治疗与危险因素控制,定期专科随访。" };
      return { level: "极高风险", advice: "建议尽快就诊,进入重点随访与强化干预。" };
    },
  },
  mrs: {
    id: "mrs",
    name: "mRS",
    fullName: "简化自评改良 Rankin 量表",
    description: "评估卒中后患者的整体残障与生活独立程度,患者端展示 0-5 级。",
    duration: "约 2 分钟",
    questions: [
      {
        id: "level",
        text: "请选择最符合您目前生活能力的描述。",
        options: [
          { label: "0 - 完全没有症状", score: 0 },
          { label: "1 - 有症状,但不影响日常活动和角色", score: 1 },
          { label: "2 - 轻度残疾,能独立处理个人事务", score: 2 },
          { label: "3 - 中度残疾,需一些帮助但可独立行走", score: 3 },
          { label: "4 - 中重度残疾,不能独立行走或自理", score: 4 },
          { label: "5 - 重度残疾,卧床、失禁,需持续照料", score: 5 },
        ],
      },
    ],
    interpret: (t) => {
      if (t <= 2) return { level: "功能良好", advice: "坚持二级预防与定期复查,持续康复训练。" };
      if (t === 3) return { level: "中度依赖", advice: "建议家庭+门诊联合康复方案。" };
      return { level: "重度依赖", advice: "建议专业护理与综合康复支持。" };
    },
  },
  barthel: {
    id: "barthel",
    name: "Barthel",
    fullName: "Barthel 日常生活活动指数",
    description: "评估患者基础日常生活活动能力(ADL),满分 100 分。",
    duration: "约 3-5 分钟",
    questions: [
      { id: "eat", text: "进食能力如何?", options: [{ label: "可独立进食", score: 10 }, { label: "需部分帮助", score: 5 }, { label: "需极大帮助或留置胃管", score: 0 }] },
      { id: "bath", text: "洗澡能力如何?", options: [{ label: "可独立完成", score: 5 }, { label: "需他人帮助", score: 0 }] },
      { id: "groom", text: "修饰(洗脸、刷牙、梳头、刮脸)能力如何?", options: [{ label: "可独立完成", score: 5 }, { label: "需他人帮助", score: 0 }] },
      { id: "dress", text: "穿衣能力如何?", options: [{ label: "可独立完成", score: 10 }, { label: "需部分帮助", score: 5 }, { label: "完全依赖他人", score: 0 }] },
      { id: "bowel", text: "控制大便能力如何?", options: [{ label: "可控制", score: 10 }, { label: "偶尔失控", score: 5 }, { label: "完全失控", score: 0 }] },
      { id: "bladder", text: "控制小便能力如何?", options: [{ label: "可控制", score: 10 }, { label: "偶尔失控", score: 5 }, { label: "失控或留置导尿管", score: 0 }] },
      { id: "toilet", text: "如厕能力如何?", options: [{ label: "可独立完成", score: 10 }, { label: "需部分帮助", score: 5 }, { label: "完全依赖他人", score: 0 }] },
      { id: "transfer", text: "床椅转移能力如何?", options: [{ label: "可独立完成", score: 15 }, { label: "需部分帮助", score: 10 }, { label: "需极大帮助", score: 5 }, { label: "完全依赖", score: 0 }] },
      { id: "walk", text: "平地行走 45 米能力如何?", options: [{ label: "可独立行走", score: 15 }, { label: "需部分帮助/助行器", score: 10 }, { label: "坐轮椅可自行移动", score: 5 }, { label: "完全依赖", score: 0 }] },
      { id: "stairs", text: "上下楼梯能力如何?", options: [{ label: "可独立上下", score: 10 }, { label: "需部分帮助", score: 5 }, { label: "不能上下", score: 0 }] },
    ],
    interpret: (t) => {
      if (t === 100) return { level: "基本独立", advice: "继续保持,加强体能与平衡训练。" };
      if (t >= 61) return { level: "轻度依赖", advice: "针对薄弱项进行康复训练。" };
      if (t >= 41) return { level: "中度依赖", advice: "需要家人协助,建议规范康复计划。" };
      return { level: "重度依赖", advice: "需要长期照护,建议综合康复与专业护理。" };
    },
  },
  eat10: {
    id: "eat10",
    name: "EAT-10",
    fullName: "吞咽困难自评量表",
    description: "筛查吞咽功能障碍与误吸风险,10 题,总分 0-40。",
    duration: "约 2 分钟",
    questions: [
      { id: "q1", text: "吞咽问题导致我的体重下降。", options: freq04 },
      { id: "q2", text: "吞咽问题影响我外出就餐。", options: freq04 },
      { id: "q3", text: "吞咽液体需要额外用力。", options: freq04 },
      { id: "q4", text: "吞咽固体食物需要额外用力。", options: freq04 },
      { id: "q5", text: "吞咽药片需要额外用力。", options: freq04 },
      { id: "q6", text: "吞咽时疼痛。", options: freq04 },
      { id: "q7", text: "吞咽问题影响我享受进食的乐趣。", options: freq04 },
      { id: "q8", text: "吞咽时食物卡在喉咙里。", options: freq04 },
      { id: "q9", text: "吃饭时会咳嗽。", options: freq04 },
      { id: "q10", text: "吞咽让我感到紧张或有压力。", options: freq04 },
    ],
    interpret: (t) => {
      if (t <= 2) return { level: "未筛出明显吞咽问题", advice: "保持正常饮食,注意进食姿势。" };
      if (t < 10) return { level: "吞咽风险", advice: "建议调整食物性状,警惕呛咳误吸。" };
      return { level: "吞咽功能异常", advice: "建议优先转介吞咽专科评估。" };
    },
  },
  phq9: {
    id: "phq9",
    name: "PHQ-9",
    fullName: "抑郁症状筛查量表",
    description: "过去 2 周抑郁症状筛查,9 题,总分 0-27。",
    duration: "约 3 分钟",
    questions: [
      { id: "q1", text: "做事时提不起劲或没有兴趣。", options: freq03 },
      { id: "q2", text: "感到心情低落、沮丧或绝望。", options: freq03 },
      { id: "q3", text: "入睡困难、睡不安稳或睡眠过多。", options: freq03 },
      { id: "q4", text: "感觉疲倦或没有活力。", options: freq03 },
      { id: "q5", text: "食欲不振或吃太多。", options: freq03 },
      { id: "q6", text: "觉得自己很糟,或让家人失望。", options: freq03 },
      { id: "q7", text: "难以集中注意力,例如看报纸或电视。", options: freq03 },
      { id: "q8", text: "动作或说话变慢,或相反地烦躁不安。", options: freq03 },
      { id: "q9", text: "有不如死掉或用某种方式伤害自己的念头。", options: freq03 },
    ],
    interpret: (t) => {
      if (t <= 4) return { level: "无/极轻", advice: "情绪状态良好,继续保持。" };
      if (t <= 9) return { level: "轻度抑郁", advice: "建议规律作息、适度运动,持续观察。" };
      if (t <= 14) return { level: "中度抑郁", advice: "建议进一步心理评估或就诊咨询。" };
      if (t <= 19) return { level: "中重度抑郁", advice: "建议尽快就诊心理/精神专科。" };
      return { level: "重度抑郁", advice: "请立即就诊心理/精神专科,必要时联系家属陪同。" };
    },
  },
  gad7: {
    id: "gad7",
    name: "GAD-7",
    fullName: "焦虑症状筛查量表",
    description: "过去 2 周焦虑症状筛查,7 题,总分 0-21。",
    duration: "约 2 分钟",
    questions: [
      { id: "q1", text: "感到紧张、焦虑或急切。", options: freq03 },
      { id: "q2", text: "不能停止或控制担忧。", options: freq03 },
      { id: "q3", text: "对各种各样的事情担忧过多。", options: freq03 },
      { id: "q4", text: "很难放松下来。", options: freq03 },
      { id: "q5", text: "坐立不安,难以静坐。", options: freq03 },
      { id: "q6", text: "变得容易烦恼或急躁。", options: freq03 },
      { id: "q7", text: "感到害怕,好像有什么可怕的事会发生。", options: freq03 },
    ],
    interpret: (t) => {
      if (t <= 4) return { level: "无焦虑", advice: "情绪平稳,继续保持。" };
      if (t <= 9) return { level: "轻度焦虑", advice: "建议放松训练与规律作息。" };
      if (t <= 14) return { level: "中度焦虑", advice: "建议进一步心理评估。" };
      return { level: "重度焦虑", advice: "建议尽快就诊心理/精神专科。" };
    },
  },
  mnasf: {
    id: "mnasf",
    name: "MNA-SF",
    fullName: "微型营养评定简表",
    description: "筛查老年患者营养不良风险,6 题,总分 0-14。",
    duration: "约 3 分钟",
    questions: [
      { id: "q1", text: "近 3 个月内,是否由于食欲下降、消化或咀嚼吞咽困难而摄食减少?", options: [
        { label: "食欲完全丧失", score: 0 },
        { label: "食欲轻中度下降", score: 1 },
        { label: "食欲正常", score: 2 },
      ]},
      { id: "q2", text: "最近 3 个月内体重是否减轻?", options: [
        { label: "减轻大于 3kg", score: 0 },
        { label: "不知道", score: 1 },
        { label: "减轻 1~3kg", score: 2 },
        { label: "无体重下降", score: 3 },
      ]},
      { id: "q3", text: "活动能力如何?", options: [
        { label: "卧床或长期坐着", score: 0 },
        { label: "能离床/椅但不能外出", score: 1 },
        { label: "能独立外出", score: 2 },
      ]},
      { id: "q4", text: "过去 3 个月内是否受过心理创伤或患急性疾病?", options: [
        { label: "是", score: 0 },
        { label: "否", score: 2 },
      ]},
      { id: "q5", text: "是否存在神经精神问题?", options: [
        { label: "严重智力减退或抑郁", score: 0 },
        { label: "轻度智力减退", score: 1 },
        { label: "无精神问题", score: 2 },
      ]},
      { id: "q6", text: "体质指数 BMI 属于以下哪一类?", options: [
        { label: "BMI 小于 19", score: 0 },
        { label: "BMI 19~21", score: 1 },
        { label: "BMI 21~23", score: 2 },
        { label: "BMI 大于等于 23", score: 3 },
      ]},
    ],
    interpret: (t) => {
      if (t >= 12) return { level: "营养状况正常", advice: "维持均衡饮食,定期监测体重。" };
      if (t >= 8) return { level: "营养不良风险", advice: "建议加强蛋白质摄入,必要时营养门诊评估。" };
      return { level: "营养不良", advice: "建议尽快就诊营养科,制定营养干预方案。" };
    },
  },
  medadh: {
    id: "medadh",
    name: "用药依从性",
    fullName: "用药依从性自评",
    description: "评估慢病用药的依从水平,满分 8 分。",
    duration: "约 2 分钟",
    questions: [
      { id: "q1", text: "您是否有时忘记服药?", options: [{ label: "是", score: 0 }, { label: "否", score: 1 }] },
      { id: "q2", text: "近 2 周内您是否忘记过服药?", options: [{ label: "是", score: 0 }, { label: "否", score: 1 }] },
      { id: "q3", text: "症状加重或出现新症状时,是否未告知医生而自行减药或停药?", options: [{ label: "是", score: 0 }, { label: "否", score: 1 }] },
      { id: "q4", text: "您外出旅行时是否忘记带药?", options: [{ label: "是", score: 0 }, { label: "否", score: 1 }] },
      { id: "q5", text: "您昨天是否按时服药了?", options: [{ label: "是", score: 1 }, { label: "否", score: 0 }] },
      { id: "q6", text: "当您觉得症状好转或消失时,是否停止过服药?", options: [{ label: "是", score: 0 }, { label: "否", score: 1 }] },
      { id: "q7", text: "坚持治疗计划是否困难?", options: [{ label: "是", score: 0 }, { label: "否", score: 1 }] },
      { id: "q8", text: "您觉得要记得按时按量服药有困难吗?", options: [
        { label: "从不", score: 1 },
        { label: "偶尔", score: 1 },
        { label: "有时", score: 0 },
        { label: "经常", score: 0 },
        { label: "所有时间", score: 0 },
      ]},
    ],
    interpret: (t) => {
      if (t >= 8) return { level: "依从性好", advice: "坚持保持规律用药习惯。" };
      if (t >= 6) return { level: "依从性中等", advice: "建议设置服药提醒,避免漏服。" };
      return { level: "依从性差", advice: "建议与医生沟通调整方案,并使用服药提醒工具。" };
    },
  },
  fall: {
    id: "fall",
    name: "跌倒风险",
    fullName: "跌倒风险自评量表",
    description: "12 题是/否评估居家跌倒风险,总分 ≥4 提示明显风险。",
    duration: "约 2 分钟",
    questions: [
      { id: "q1", text: "过去一年内,我曾经跌倒过。", options: yesNo() },
      { id: "q2", text: "外出走路时,我需要或被建议使用拐杖或助行器。", options: yesNo() },
      { id: "q3", text: "走路时,我有时会感觉脚步不稳。", options: yesNo() },
      { id: "q4", text: "在家里走路时,我需要扶着家具保持平衡。", options: yesNo() },
      { id: "q5", text: "我担心会跌倒。", options: yesNo() },
      { id: "q6", text: "从椅子上站起来时,我需要双手辅助。", options: yesNo() },
      { id: "q7", text: "上台阶或楼梯时感到困难。", options: yesNo() },
      { id: "q8", text: "我经常匆忙去厕所,尤其是夜间。", options: yesNo() },
      { id: "q9", text: "我的脚掌有时会感觉麻木。", options: yesNo() },
      { id: "q10", text: "我服用的药物有时会让我头晕或比平时疲倦。", options: yesNo() },
      { id: "q11", text: "我有服用帮助睡眠或改善情绪的药物。", options: yesNo() },
      { id: "q12", text: "我时常感到情绪低落或抑郁。", options: yesNo() },
    ],
    interpret: (t) => {
      if (t < 4) return { level: "跌倒风险较低", advice: "保持规律锻炼,注意居家环境安全。" };
      return { level: "明显跌倒风险", advice: "建议进行防跌倒宣教,清理居家障碍,必要时家属陪同活动。" };
    },
  },
};

export const scaleList = Object.values(scales);