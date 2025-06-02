import { NFTRarity, GemType } from '../types/nft';

// 预设图片的映射关系
export const DEFAULT_IMAGES: Record<NFTRarity, Record<GemType, string[]>> = {
  [NFTRarity.COMMON]: {
    [GemType.RUBY]: [
      '/images/default/common-ruby-1.png',
      '/images/default/common-ruby-2.png',
      '/images/default/common-ruby-3.png'
    ],
    [GemType.SAPPHIRE]: [
      '/images/default/common-sapphire-1.png',
      '/images/default/common-sapphire-2.png',
      '/images/default/common-sapphire-3.png'
    ],
    [GemType.EMERALD]: [
      '/images/default/common-emerald-1.png',
      '/images/default/common-emerald-2.png',
      '/images/default/common-emerald-3.png'
    ],
    [GemType.DIAMOND]: [
      '/images/default/common-diamond-1.png',
      '/images/default/common-diamond-2.png',
      '/images/default/common-diamond-3.png'
    ],
    [GemType.AMETHYST]: [
      '/images/default/common-amethyst-1.png',
      '/images/default/common-amethyst-2.png',
      '/images/default/common-amethyst-3.png'
    ],
    [GemType.TOPAZ]: [
      '/images/default/common-topaz-1.png',
      '/images/default/common-topaz-2.png',
      '/images/default/common-topaz-3.png'
    ],
    [GemType.PEARL]: [
      '/images/default/common-pearl-1.png',
      '/images/default/common-pearl-2.png',
      '/images/default/common-pearl-3.png'
    ],
    [GemType.JADE]: [
      '/images/default/common-jade-1.png',
      '/images/default/common-jade-2.png',
      '/images/default/common-jade-3.png'
    ]
  },
  [NFTRarity.RARE]: {
    [GemType.RUBY]: [
      '/images/default/rare-ruby-1.png',
      '/images/default/rare-ruby-2.png',
      '/images/default/rare-ruby-3.png'
    ],
    // ... 其他宝石类型的稀有图片
  },
  [NFTRarity.EPIC]: {
    [GemType.RUBY]: [
      '/images/default/epic-ruby-1.png',
      '/images/default/epic-ruby-2.png',
      '/images/default/epic-ruby-3.png'
    ],
    // ... 其他宝石类型的史诗图片
  },
  [NFTRarity.LEGENDARY]: {
    [GemType.RUBY]: [
      '/images/default/legendary-ruby-1.png',
      '/images/default/legendary-ruby-2.png',
      '/images/default/legendary-ruby-3.png'
    ],
    // ... 其他宝石类型的传说图片
  }
};

// 获取随机预设图片
export function getRandomDefaultImage(rarity: NFTRarity, gemType: GemType): string {
  const images = DEFAULT_IMAGES[rarity][gemType];
  return images[Math.floor(Math.random() * images.length)];
} 