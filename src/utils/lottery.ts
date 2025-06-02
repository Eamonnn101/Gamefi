import type { NFT } from '../types/nft';
import { NFTRarity, RARITY_PROBABILITIES } from '../types/nft';

export class LotterySystem {
  private static generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private static generateName(rarity: NFTRarity): string {
    const prefixes = {
      [NFTRarity.COMMON]: ['普通的', '平凡的', '普通的'],
      [NFTRarity.RARE]: ['稀有的', '珍贵的', '罕见的'],
      [NFTRarity.EPIC]: ['史诗的', '传奇的', '非凡的'],
      [NFTRarity.LEGENDARY]: ['传说的', '神话的', '不朽的']
    };

    const suffixes = ['宝石', '水晶', '钻石', '珍珠', '翡翠', '玛瑙', '红宝石', '蓝宝石'];

    const prefix = prefixes[rarity][Math.floor(Math.random() * prefixes[rarity].length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${prefix}${suffix}`;
  }

  private static drawRarity(): NFTRarity {
    const rand = Math.random();
    let cumulativeProbability = 0;

    for (const [rarity, probability] of Object.entries(RARITY_PROBABILITIES)) {
      cumulativeProbability += probability;
      if (rand <= cumulativeProbability) {
        return rarity as NFTRarity;
      }
    }

    return NFTRarity.COMMON;
  }

  static drawNFT(): NFT {
    const rarity = this.drawRarity();
    return {
      id: this.generateId(),
      name: this.generateName(rarity),
      rarity
    };
  }
} 