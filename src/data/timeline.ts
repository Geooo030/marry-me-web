import type { TimelineNode } from "../types";

export const eventMeta = {
  couple: "班主任小王吧 × 瑶瑶",
  date: "2026.08.15",
  venue: "水印长堤2栋",
  proposalTime: "17:30 - 18:00",
};

export const timeline: TimelineNode[] = [
  {
    id: "shopping",
    timeLabel: "11:00 - 13:00",
    title: "瑶瑶出门买烧烤材料",
    location: "出发",
    detail: "贵妇嘉全程陪同，保持轻松自然，不让瑶瑶起疑。",
    icon: "cart",
  },
  {
    id: "decorating",
    timeLabel: "12:00 - 17:00",
    title: "策划布置时间",
    location: "水印长堤2栋",
    detail: "布置、道具与音响陆续就位；四月蛋糕由蜻蜓队长送到瑶瑶家。",
    icon: "tools",
  },
  {
    id: "prep",
    timeLabel: "14:00 - 16:00",
    title: "瑶瑶备料 · 嘉宾陆续到场",
    location: "瑶瑶家 / 水印长堤2栋",
    detail: "瑶瑶在家备料化妆，欣子有话说、蜻蜓队长、binke、烧烤师傅分批行动。",
    icon: "users",
  },
  {
    id: "decoy",
    timeLabel: "17:00 - 17:30",
    title: "binke 引导瑶瑶到现场",
    location: "水印长堤2栋",
    detail: "瑶瑶出门后，binke 按定位接上鸡叔叔，一起把瑶瑶引到现场；瑶瑶家的伙伴坐烧烤师傅的车到现场归位。",
    icon: "car",
  },
  {
    id: "proposal",
    timeLabel: "17:30 - 18:00",
    title: "求婚时刻",
    location: "水印长堤2栋",
    detail: "班主任小王吧向瑶瑶求婚，全场一起见证。",
    icon: "heart",
  },
];
