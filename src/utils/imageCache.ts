import { NFTRarity, GemType } from '../types/nft';
import { getRandomDefaultImage } from '../config/defaultImages';

const CACHE_KEY_PREFIX = 'nft_image_cache_';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7天过期

interface CacheEntry {
  imageUrl: string;
  timestamp: number;
}

export class ImageCache {
  private static getCacheKey(rarity: NFTRarity, gemType: GemType): string {
    return `${CACHE_KEY_PREFIX}${rarity}_${gemType}`;
  }

  private static isCacheValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < CACHE_EXPIRY;
  }

  public static get(rarity: NFTRarity, gemType: GemType): string | null {
    try {
      const key = this.getCacheKey(rarity, gemType);
      const cached = localStorage.getItem(key);
      
      if (!cached) return null;

      const entry: CacheEntry = JSON.parse(cached);
      if (!this.isCacheValid(entry)) {
        localStorage.removeItem(key);
        return null;
      }

      return entry.imageUrl;
    } catch (error) {
      console.error('读取图片缓存失败:', error);
      return null;
    }
  }

  public static set(rarity: NFTRarity, gemType: GemType, imageUrl: string): void {
    try {
      const key = this.getCacheKey(rarity, gemType);
      const entry: CacheEntry = {
        imageUrl,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.error('保存图片缓存失败:', error);
    }
  }

  public static getOrGenerate(
    rarity: NFTRarity, 
    gemType: GemType, 
    generateFn: () => Promise<string>
  ): Promise<string> {
    // 首先尝试从缓存获取
    const cached = this.get(rarity, gemType);
    if (cached) {
      console.log('使用缓存的图片');
      return Promise.resolve(cached);
    }

    // 如果没有缓存，使用默认图片作为临时显示
    const defaultImage = getRandomDefaultImage(rarity, gemType);
    
    // 异步生成新图片
    return generateFn().then(newImageUrl => {
      // 生成成功后保存到缓存
      this.set(rarity, gemType, newImageUrl);
      return newImageUrl;
    }).catch(error => {
      console.error('生成图片失败，使用默认图片:', error);
      return defaultImage;
    });
  }

  public static clear(): void {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(CACHE_KEY_PREFIX))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('清除图片缓存失败:', error);
    }
  }
} 