import type { NFT } from '../types/nft';
import { NFTRarity, NFT_THEMES, THEME_IMAGE_MAP, THEME_DESC_MAP } from '../types/nft';

// 用于存储已使用的编号
const usedNumbers = new Set<number>();

// 生成不重复的随机编号
function generateUniqueNumber(): number {
  let number: number;
  do {
    // 生成 1-9999 之间的随机数
    number = Math.floor(Math.random() * 9999) + 1;
  } while (usedNumbers.has(number));
  
  usedNumbers.add(number);
  return number;
}

export class LotterySystem {
  private static readonly RARITY_PROBABILITIES = {
    [NFTRarity.Common]: 0.6,
    [NFTRarity.Rare]: 0.3,
    [NFTRarity.Epic]: 0.08,
    [NFTRarity.Legendary]: 0.02
  };

  // 稀有度对应的形容词
  private static readonly RARITY_ADJECTIVES = {
    [NFTRarity.Common]: ['普通的', '平凡的', '寻常的'],
    [NFTRarity.Rare]: ['稀有的', '珍贵的', '罕见的'],
    [NFTRarity.Epic]: ['史诗的', '传奇的', '非凡的'],
    [NFTRarity.Legendary]: ['传说的', '神话的', '不朽的']
  };

  // 获取随机形容词
  private static getRandomAdjective(rarity: NFTRarity): string {
    const adjectives = this.RARITY_ADJECTIVES[rarity];
    return adjectives[Math.floor(Math.random() * adjectives.length)];
  }

  static async drawNFT(specifiedRarity?: NFTRarity): Promise<NFT> {
    // 如果指定了稀有度，就使用指定的稀有度，否则随机抽取
    const rarity = specifiedRarity || this.getRandomRarity();
    const theme = this.drawTheme(rarity);
    const id = `NFT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    // 生成不重复的随机编号
    const uniqueNumber = generateUniqueNumber();
    // 获取随机形容词
    const adjective = this.getRandomAdjective(rarity);
    // 获取图片和描述
    const imageFile = THEME_IMAGE_MAP[rarity][theme];
    const imageUrl = `/images/nft/${rarity}/${imageFile}`;
    const description = THEME_DESC_MAP[rarity][theme];
    return {
      id,
      name: `${adjective}${theme} #${uniqueNumber}`,
      rarity,
      theme,
      imageUrl,
      description
    };
  }

  private static getRandomRarity(): NFTRarity {
    const rand = Math.random();
    let cumulativeProbability = 0;
    for (const [rarity, probability] of Object.entries(this.RARITY_PROBABILITIES)) {
      cumulativeProbability += probability;
      if (rand <= cumulativeProbability) {
        return rarity as NFTRarity;
      }
    }
    return NFTRarity.Common; // 默认返回普通
  }

  private static drawTheme(rarity: NFTRarity): string {
    const themes = NFT_THEMES[rarity];
    const randomIndex = Math.floor(Math.random() * themes.length);
    return themes[randomIndex];
  }
} 