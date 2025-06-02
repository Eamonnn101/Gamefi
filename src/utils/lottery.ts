import type { NFT } from '../types/nft';
import { NFTRarity, GemType, RARITY_PROBABILITIES, GEM_TYPE_PROBABILITIES } from '../types/nft';
import { ImageGenerator } from './imageGenerator';

function getRandomItem<T>(items: T[], probabilities: number[]): T {
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < probabilities.length; i++) {
    sum += probabilities[i];
    if (random < sum) {
      return items[i];
    }
  }
  
  return items[items.length - 1];
}

export class LotterySystem {
  public static async drawNFT(): Promise<NFT> {
    // 随机选择稀有度
    const rarities = Object.values(NFTRarity);
    const rarityProbabilities = Object.values(RARITY_PROBABILITIES);
    const rarity = getRandomItem(rarities, rarityProbabilities);

    // 随机选择宝石类型
    const gemTypes = Object.values(GemType);
    const gemTypeProbabilities = Object.values(GEM_TYPE_PROBABILITIES);
    const gemType = getRandomItem(gemTypes, gemTypeProbabilities);

    // 生成NFT ID
    const id = `NFT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // 生成NFT名称
    const name = `${rarity}${gemType} #${Date.now().toString().slice(-4)}`;

    // 生成NFT图片
    const imageUrl = await ImageGenerator.generateNFTImage(rarity, gemType);

    return {
      id,
      name,
      rarity,
      gemType,
      imageUrl,
      price: 0
    };
  }
} 