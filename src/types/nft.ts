export const NFTRarity = {
  COMMON: '普通',
  RARE: '稀有',
  EPIC: '史诗',
  LEGENDARY: '传说'
} as const;

export type NFTRarity = typeof NFTRarity[keyof typeof NFTRarity];

export interface NFT {
  id: string;
  name: string;
  rarity: NFTRarity;
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