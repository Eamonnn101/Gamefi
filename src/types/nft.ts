export const NFTRarity = {
  COMMON: '普通',
  RARE: '稀有',
  EPIC: '史诗',
  LEGENDARY: '传说'
} as const;

export type NFTRarity = typeof NFTRarity[keyof typeof NFTRarity];

export const GemType = {
  RUBY: '红宝石',
  SAPPHIRE: '蓝宝石',
  EMERALD: '绿宝石',
  DIAMOND: '钻石',
  AMETHYST: '紫水晶',
  TOPAZ: '黄玉',
  PEARL: '珍珠',
  JADE: '翡翠'
} as const;

export type GemType = typeof GemType[keyof typeof GemType];

export interface NFT {
  id: string;
  name: string;
  rarity: NFTRarity;
  gemType: GemType;
  imageUrl: string;  // AI生成的图片URL
  price?: number;
}

export const RARITY_PROBABILITIES = {
  [NFTRarity.COMMON]: 0.6,  // 60%
  [NFTRarity.RARE]: 0.25,  // 25%
  [NFTRarity.EPIC]: 0.1, // 10%
  [NFTRarity.LEGENDARY]: 0.05   // 5%
};

export const RARITY_PRICES = {
  [NFTRarity.COMMON]: 100,
  [NFTRarity.RARE]: 300,
  [NFTRarity.EPIC]: 1000,
  [NFTRarity.LEGENDARY]: 5000
};

// 修改RARITY_PROBABILITIES，添加宝石类型的概率
export const GEM_TYPE_PROBABILITIES = {
  [GemType.RUBY]: 0.2,      // 20%
  [GemType.SAPPHIRE]: 0.2,  // 20%
  [GemType.EMERALD]: 0.15,  // 15%
  [GemType.DIAMOND]: 0.1,   // 10%
  [GemType.AMETHYST]: 0.15, // 15%
  [GemType.TOPAZ]: 0.1,     // 10%
  [GemType.PEARL]: 0.05,    // 5%
  [GemType.JADE]: 0.05      // 5%
} as const;

// 合成规则
export const SYNTHESIS_RULES = {
  [NFTRarity.COMMON]: {
    target: NFTRarity.RARE,
    required: 3,
    fee: 10
  },
  [NFTRarity.RARE]: {
    target: NFTRarity.EPIC,
    required: 3,
    fee: 10
  },
  [NFTRarity.EPIC]: {
    target: NFTRarity.LEGENDARY,
    required: 3,
    fee: 10
  }
} as const;

// 获取下一个稀有度
export function getNextRarity(rarity: NFTRarity): NFTRarity {
  switch (rarity) {
    case NFTRarity.COMMON:
      return NFTRarity.RARE;
    case NFTRarity.RARE:
      return NFTRarity.EPIC;
    case NFTRarity.EPIC:
      return NFTRarity.LEGENDARY;
    default:
      return rarity;
  }
} 