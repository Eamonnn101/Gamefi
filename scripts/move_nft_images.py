import shutil
from pathlib import Path

def move_nft_images():
    """移动 NFT 图片到新的英文目录结构"""
    base_path = Path('public/images/nft')
    
    # 定义目录映射
    dir_mapping = {
        '普通': 'common',
        '稀有': 'rare',
        '史诗': 'epic',
        '传说': 'legendary'
    }
    
    # 创建新的英文目录
    for new_dir in dir_mapping.values():
        (base_path / new_dir).mkdir(parents=True, exist_ok=True)
    
    # 移动文件
    for old_dir, new_dir in dir_mapping.items():
        old_path = base_path / old_dir
        new_path = base_path / new_dir
        
        if old_path.exists():
            print(f"正在移动 {old_dir} 目录下的图片到 {new_dir}...")
            for file in old_path.glob('*.png'):
                shutil.move(str(file), str(new_path / file.name))
                print(f"已移动: {file.name}")
            
            # 删除旧目录
            shutil.rmtree(old_path)
            print(f"已删除旧目录: {old_dir}")
    
    print("\n所有 NFT 图片已成功移动到新的英文目录结构！")

if __name__ == "__main__":
    move_nft_images() 