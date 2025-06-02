import { NFTRarity, GemType } from '../types/nft';
import { ImageCache } from './imageCache';

const STABLE_DIFFUSION_API_KEY = import.meta.env.VITE_STABLE_DIFFUSION_API_KEY;
const API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

// 检查API密钥是否存在
if (!STABLE_DIFFUSION_API_KEY) {
  console.error('错误: 未找到Stable Diffusion API密钥。请确保在.env文件中设置了VITE_STABLE_DIFFUSION_API_KEY');
}

// 稀有度对应的图片风格
const RARITY_STYLES = {
  [NFTRarity.COMMON]: '普通的，简单的',
  [NFTRarity.RARE]: '精致的，闪耀的',
  [NFTRarity.EPIC]: '华丽的，神秘的',
  [NFTRarity.LEGENDARY]: '传奇的，超凡的'
} as const;

// 宝石类型对应的颜色描述
const GEM_COLORS = {
  [GemType.RUBY]: '深红色的',
  [GemType.SAPPHIRE]: '深蓝色的',
  [GemType.EMERALD]: '翠绿色的',
  [GemType.DIAMOND]: '透明的',
  [GemType.AMETHYST]: '紫色的',
  [GemType.TOPAZ]: '金黄色的',
  [GemType.PEARL]: '珍珠白色的',
  [GemType.JADE]: '翡翠绿色的'
} as const;

export class ImageGenerator {
  private static async generateImage(prompt: string): Promise<string> {
    if (!STABLE_DIFFUSION_API_KEY) {
      throw new Error('未配置Stable Diffusion API密钥');
    }

    try {
      console.log('开始生成图片，提示词:', prompt);
      console.log('API密钥前6位:', STABLE_DIFFUSION_API_KEY.substring(0, 6) + '...');

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STABLE_DIFFUSION_API_KEY}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
          style_preset: "photographic"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API响应错误:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`图片生成失败: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('图片生成成功');
      return result.artifacts[0].base64;
    } catch (error) {
      console.error('生成图片时出错:', error);
      if (error instanceof Error) {
        console.error('错误详情:', {
          message: error.message,
          stack: error.stack
        });
      }
      throw error;
    }
  }

  public static async generateNFTImage(rarity: NFTRarity, gemType: GemType): Promise<string> {
    const style = RARITY_STYLES[rarity];
    const color = GEM_COLORS[gemType];
    
    const prompt = `A ${style} ${color} ${gemType} gemstone, highly detailed 3D render, perfect gem cut, dark gradient background, dramatic lighting, photorealistic, 8K resolution, professional photography`;

    try {
      console.log('开始生成NFT图片:', { rarity, gemType });
      
      // 使用缓存系统获取或生成图片
      const imageUrl = await ImageCache.getOrGenerate(
        rarity,
        gemType,
        async () => {
          const base64Image = await this.generateImage(prompt);
          return `data:image/png;base64,${base64Image}`;
        }
      );

      console.log('NFT图片获取成功');
      return imageUrl;
    } catch (error) {
      console.error('生成NFT图片失败:', error);
      throw error;
    }
  }
} 