export type NFTRarity = 'common' | 'rare' | 'epic' | 'legendary';

export const NFTRarity = {
  Common: 'common',
  Rare: 'rare',
  Epic: 'epic',
  Legendary: 'legendary'
} as const;

export const RARITY_PROBABILITIES = {
  [NFTRarity.Common]: 0.6,
  [NFTRarity.Rare]: 0.3,
  [NFTRarity.Epic]: 0.08,
  [NFTRarity.Legendary]: 0.02
};

export const NFT_THEMES = {
  [NFTRarity.Common]: [
    '苔藓', '杂草', '土壤', '沙漠', '野花', '树枝', '枯叶', '鹅卵石', '木棍', '贝壳'
  ],
  [NFTRarity.Rare]: [
    '玛瑙', '琥珀', '水晶', '翡翠', '珍珠', '红宝石', '蓝宝石', '祖母绿', '紫水晶', '黄玉'
  ],
  [NFTRarity.Epic]: [
    '天琴', '独角兽之角', '水晶球', '凤凰', '人鱼鳞片', '魔法箭矢', '魔法指南针', '魔法书', '天使之羽', '龙蛋'
  ],
  [NFTRarity.Legendary]: [
    '启示之刃', '混沌宝箱', '永恒圣杯', '星界裂隙', '天空守护者', '深渊审判', '时空之钥', '冥界魂棺', '龙焰长矛', '虚空核心'
  ]
};

// 主题到图片文件名的映射
export const THEME_IMAGE_MAP: Record<NFTRarity, Record<string, string>> = {
  common: {
    '苔藓': 'moss.png',
    '杂草': 'weed.png',
    '土壤': 'soil.png',
    '沙漠': 'sand.png',
    '野花': 'wildflower.png',
    '树枝': 'branch.png',
    '枯叶': 'leaf.png',
    '鹅卵石': 'pebble.png',
    '木棍': 'stick.png',
    '贝壳': 'seashell.png',
  },
  rare: {
    '玛瑙': 'agate.png',
    '琥珀': 'amber.png',
    '水晶': 'crystal.png',
    '翡翠': 'jade.png',
    '珍珠': 'pearl.png',
    '红宝石': 'ruby.png',
    '蓝宝石': 'sapphire.png',
    '祖母绿': 'emerald.png',
    '紫水晶': 'amethyst.png',
    '黄玉': 'topaz.png',
  },
  epic: {
    '天琴': 'harp.png',
    '独角兽之角': 'horn.png',
    '水晶球': 'orb.png',
    '凤凰': 'phoenix.png',
    '人鱼鳞片': 'scale.png',
    '魔法箭矢': 'arrow.png',
    '魔法指南针': 'compass.png',
    '魔法书': 'grimoire.png',
    '天使之羽': 'feather.png',
    '龙蛋': 'egg.png',
  },
  legendary: {
    '启示之刃': 'Blade of Revelation.png',
    '混沌宝箱': 'Chest of Chaos.png',
    '永恒圣杯': 'Grail of Eternity.png',
    '星界裂隙': 'Rift of Stars.png',
    '天空守护者': 'Guardian of the Skies.png',
    '深渊审判': 'Judgment of the Abyss.png',
    '时空之钥': 'Key of Time and Space.png',
    '冥界魂棺': 'Soul Casket of Nether.png',
    '龙焰长矛': 'Drakefire Glaive.png',
    '虚空核心': 'Core of the Void.png',
  }
};

// 主题到介绍的映射
export const THEME_DESC_MAP: Record<NFTRarity, Record<string, string>> = {
  common: {
    '苔藓': '一片普通的苔藓，简单的绿色纹理。',
    '杂草': '一株普通的杂草，顽强的生命力。',
    '土壤': '一捧普通的土壤，肥沃的质地。',
    '沙漠': '一把普通的沙子，细腻的颗粒。',
    '野花': '一朵普通的野花，自然的色彩。',
    '树枝': '一根普通的树枝，自然的木质纹理。',
    '枯叶': '一片普通的枯叶，秋天的颜色。',
    '鹅卵石': '一颗普通的鹅卵石，光滑的灰色表面。',
    '木棍': '一根普通的木棍，简单的形状。',
    '贝壳': '一个普通的贝壳，带有自然的螺旋纹路。',
  },
  rare: {
    '玛瑙': '一块珍贵的玛瑙，带有条纹图案，抛光表面。',
    '琥珀': '一块珍贵的琥珀，内含远古生物，金色光泽。',
    '水晶': '一块珍贵的水晶，透明，几何刻面。',
    '翡翠': '一块珍贵的翡翠，翠绿通透，温润细腻。',
    '珍珠': '一颗珍贵的珍珠，圆润光泽，温润如玉。',
    '红宝石': '一颗珍贵的红宝石，深红色泽，闪耀光芒。',
    '蓝宝石': '一颗珍贵的蓝宝石，深邃蓝色，星光闪耀。',
    '祖母绿': '一颗珍贵的祖母绿，翠绿通透，光芒四射。',
    '紫水晶': '一颗珍贵的紫水晶，紫色透明，神秘光芒。',
    '黄玉': '一颗珍贵的黄玉，金黄色泽，温暖光芒。',
  },
  epic: {
    '天琴': '一把天界竖琴，金色琴弦，星光共鸣。',
    '独角兽之角': '一根神秘的独角兽之角，螺旋纹路，彩虹光环。',
    '水晶球': '一个传奇的水晶球，内部旋转着魔法雾气。',
    '凤凰': '一只神秘的凤凰，展开雄伟的翅膀，金色火焰。',
    '人鱼鳞片': '一片传奇的人鱼鳞片，彩虹光泽，海洋魔法。',
    '魔法箭矢': '一支传奇的魔法箭矢，闪耀着元素光芒。',
    '魔法指南针': '一个神秘的魔法指南针，指向命运的方向。',
    '魔法书': '一本古老的魔法书，记载着失传的咒语。',
    '天使之羽': '一根天使的羽毛，散发着圣洁的光芒。',
    '龙蛋': '一颗神秘的龙蛋，表面覆盖着鳞片纹路。',
  },
  legendary: {
    '启示之刃': '一把传奇的金色长剑，闪耀着神圣的光芒。',
    '混沌宝箱': '一个金色的混沌宝箱，被黑暗锁链束缚。',
    '永恒圣杯': '一个发光的金色圣杯，盛满星光液体。',
    '星界裂隙': '一个宇宙裂隙神器，内部旋转着星系和星辰。',
    '天空守护者': '一面带翼的金色盾牌，闪耀着蓝色能量。',
    '深渊审判': '一把巨大的金色巨剑，被深渊火焰吞噬。',
    '时空之钥': '一把金色的奥术钥匙，漂浮在时空漩涡中。',
    '冥界魂棺': '一个幽灵般的金色棺材，雾气与发光灵魂逸出。',
    '龙焰长矛': '一把传奇的战矛，金色和深红色的龙纹装饰。',
    '虚空核心': '一个金色的虚空水晶，脉动着紫黑色能量。',
  }
};

// NFT图片路径生成函数
export function getNFTImagePath(rarity: NFTRarity, theme: string): string {
  return `/images/nft/${rarity}/${theme}.png`;
}

export interface NFT {
  id: string;
  name: string;
  rarity: NFTRarity;
  theme: string;
  imageUrl: string;
  description: string;
  price?: number;
}

export const RARITY_PRICES = {
  [NFTRarity.Common]: 100,
  [NFTRarity.Rare]: 300,
  [NFTRarity.Epic]: 1000,
  [NFTRarity.Legendary]: 5000
};

// 合成规则
export const SYNTHESIS_RULES = {
  [NFTRarity.Common]: {
    target: NFTRarity.Rare,
    cost: 10
  },
  [NFTRarity.Rare]: {
    target: NFTRarity.Epic,
    cost: 10
  },
  [NFTRarity.Epic]: {
    target: NFTRarity.Legendary,
    cost: 10
  }
};

// 获取下一个稀有度
export function getNextRarity(rarity: NFTRarity): NFTRarity {
  switch (rarity) {
    case NFTRarity.Common:
      return NFTRarity.Rare;
    case NFTRarity.Rare:
      return NFTRarity.Epic;
    case NFTRarity.Epic:
      return NFTRarity.Legendary;
    default:
      return NFTRarity.Common;
  }
}

export interface NFTData {
  themes: {
    [key in NFTRarity]: string[];
  };
  adjectives: {
    [key in NFTRarity]: string[];
  };
} 