import { NFTRarity, GemType } from '../src/types/nft';
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

const STABLE_DIFFUSION_API_KEY = process.env.STABLE_DIFFUSION_API_KEY;
const API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

// 稀有度对应的风格描述
const RARITY_STYLES = {
  [NFTRarity.COMMON]: 'simple, basic',
  [NFTRarity.RARE]: 'elegant, refined',
  [NFTRarity.EPIC]: 'magnificent, mystical',
  [NFTRarity.LEGENDARY]: 'legendary, divine'
} as const;

// 宝石类型对应的颜色描述
const GEM_COLORS = {
  [GemType.RUBY]: 'deep red',
  [GemType.SAPPHIRE]: 'deep blue',
  [GemType.EMERALD]: 'emerald green',
  [GemType.DIAMOND]: 'clear',
  [GemType.AMETHYST]: 'purple',
  [GemType.TOPAZ]: 'golden yellow',
  [GemType.PEARL]: 'pearl white',
  [GemType.JADE]: 'jade green'
} as const;

async function generateImage(prompt: string): Promise<Buffer> {
  if (!STABLE_DIFFUSION_API_KEY) {
    throw new Error('未配置Stable Diffusion API密钥');
  }

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
    throw new Error(`图片生成失败: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  const base64Image = result.artifacts[0].base64;
  return Buffer.from(base64Image, 'base64');
}

async function generateDefaultImages() {
  const outputDir = path.join(process.cwd(), 'public', 'images', 'default');
  
  // 确保输出目录存在
  await fs.mkdir(outputDir, { recursive: true });

  // 生成所有组合的图片
  for (const rarity of Object.values(NFTRarity)) {
    for (const gemType of Object.values(GemType)) {
      const style = RARITY_STYLES[rarity];
      const color = GEM_COLORS[gemType];
      
      // 为每种组合生成3张图片
      for (let i = 1; i <= 3; i++) {
        const prompt = `A ${style} ${color} ${gemType} gemstone, highly detailed 3D render, perfect gem cut, dark gradient background, dramatic lighting, photorealistic, 8K resolution, professional photography, unique perspective ${i}`;
        
        try {
          console.log(`生成图片: ${rarity} ${gemType} #${i}`);
          const imageBuffer = await generateImage(prompt);
          
          const fileName = `${rarity.toLowerCase()}-${gemType.toLowerCase()}-${i}.png`;
          const filePath = path.join(outputDir, fileName);
          
          await fs.writeFile(filePath, imageBuffer);
          console.log(`保存图片: ${fileName}`);
          
          // 添加延迟以避免API限制
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`生成图片失败 ${rarity} ${gemType} #${i}:`, error);
        }
      }
    }
  }
}

// 运行脚本
generateDefaultImages().catch(console.error); 