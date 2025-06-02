import os
import json
import requests
import time
import base64
from pathlib import Path
from typing import Dict, List

# API配置
API_KEY = "sk-WPdGlGkzIhthnoqAakWzA19TAk2G9g4A39VFZgbaH9qTcx0X"
API_HOST = 'https://api.stability.ai'
ENGINE_ID = 'stable-diffusion-xl-1024-v1-0'

# 图片保存路径
BASE_PATH = Path('public/images/nft')
RARITY_PATHS = {
    'Common': BASE_PATH / 'common',
    'Rare': BASE_PATH / 'rare',
    'Epic': BASE_PATH / 'epic',
    'Legendary': BASE_PATH / 'legendary'
}

def ensure_directories():
    """确保所有必要的目录都存在"""
    for path in RARITY_PATHS.values():
        path.mkdir(parents=True, exist_ok=True)

def read_prompts() -> Dict[str, List[str]]:
    """读取提示词文件"""
    prompts = {
        'Common': [],
        'Rare': [],
        'Epic': [],
        'Legendary': []
    }
    
    current_category = None
    with open(BASE_PATH / 'common/keywords.txt', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            if line.startswith('#'):
                if 'Common' in line:
                    current_category = 'Common'
                elif 'Rare' in line:
                    current_category = 'Rare'
                elif 'Epic' in line:
                    current_category = 'Epic'
                elif 'Legendary' in line:
                    current_category = 'Legendary'
            elif current_category:
                prompts[current_category].append(line)
    
    return prompts

def generate_image(prompt: str, rarity: str, custom_filename: str) -> bool:
    """使用Stability AI API生成单张图片"""
    try:
        print(f"正在生成图片，提示词: {prompt}")
        response = requests.post(
            f"{API_HOST}/v1/generation/{ENGINE_ID}/text-to-image",
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": f"Bearer {API_KEY}"
            },
            json={
                "text_prompts": [{"text": prompt}],
                "cfg_scale": 7,
                "height": 1024,
                "width": 1024,
                "samples": 1,
                "steps": 30,
            },
        )

        if response.status_code != 200:
            print(f"Error: {response.status_code}")
            print(response.text)
            return False

        data = response.json()
        
        # 使用自定义文件名保存图片
        image_path = RARITY_PATHS[rarity] / f"{custom_filename}.png"
        image_data = base64.b64decode(data["artifacts"][0]["base64"])
        with open(image_path, "wb") as f:
            f.write(image_data)
        print(f"图片已保存到: {image_path}")
        return True

    except Exception as e:
        print(f"生成图片时出错 {prompt}: {str(e)}")
        return False

def main():
    """主函数"""
    print("开始生成传说级 NFT 图片...")
    ensure_directories()
    
    # 使用新的提示词和指定的英文名称
    legendary_prompts = [
        ("A massive golden greatsword, centered, engulfed in abyssal flames, demonic eye on the hilt, shadows swirling around, purple-red lighting, dark fantasy weapon design, dramatic and evil look, high detail, symmetrical view, 1024x1024", "Judgment of the Abyss"),
        ("A golden arcane key, centered, floating in a vortex of time and space, surrounded by gears, glowing blue and gold lights, space fractals in the background, fantasy steampunk fusion, highly detailed and elegant, symmetrical artifact design, 1024x1024", "Key of Time and Space"),
        ("A ghostly golden casket, centered, mist and glowing spirits escaping, green and blue wisps swirling, ancient necromantic runes glowing, set in a mystical crypt, eerie lighting, dark high fantasy relic, detailed and haunting, 1024x1024", "Soul Casket of Nether"),
        ("A legendary battle glaive, centered, gold and crimson dragon motifs, blade on fire, molten energy core glowing, scorched battlefield behind, fiery aura radiating, epic fantasy weapon concept, intense detail and power, 1024x1024", "Drakefire Glaive"),
        ("A golden void crystal, centered, floating and pulsating with purple-black energy, surrounded by floating shards and dark lightning, cosmic horror elements, anti-gravity effect, surreal and high-detail rendering, void-themed relic, 1024x1024", "Core of the Void")
    ]
    
    for prompt, name in legendary_prompts:
        print(f"\n正在生成传说级 NFT 图片：{name}...")
        print(f"提示词：{prompt}")
        if generate_image(prompt, "Legendary", name):
            print(f"✓ 传说级 NFT 图片 {name} 生成成功！")
        else:
            print(f"✗ 传说级 NFT 图片 {name} 生成失败！")
        time.sleep(1)  # 添加短暂延迟，避免 API 限制
    
    print("\n所有传说级 NFT 图片生成完毕！")

if __name__ == "__main__":
    main() 