import type { NFT } from '../types/nft';
import { NFTRarity } from '../types/nft';
import '../styles/nft.css';

const RARITY_BG_COLORS = {
  [NFTRarity.Common]: 'bg-gray-200',
  [NFTRarity.Rare]: 'bg-blue-200',
  [NFTRarity.Epic]: 'bg-purple-200',
  [NFTRarity.Legendary]: 'bg-yellow-200'
};

const RARITY_TEXT_COLORS = {
  [NFTRarity.Common]: 'text-gray-700',
  [NFTRarity.Rare]: 'text-blue-700',
  [NFTRarity.Epic]: 'text-purple-700',
  [NFTRarity.Legendary]: 'text-yellow-700'
};

const RARITY_BORDER_COLORS = {
  [NFTRarity.Common]: 'border-gray-300',
  [NFTRarity.Rare]: 'border-blue-300',
  [NFTRarity.Epic]: 'border-purple-300',
  [NFTRarity.Legendary]: 'border-yellow-300'
};

const RARITY_NAMES = {
  [NFTRarity.Common]: '普通',
  [NFTRarity.Rare]: '稀有',
  [NFTRarity.Epic]: '史诗',
  [NFTRarity.Legendary]: '传说'
};

interface NFTDisplayProps {
  nft: NFT;
  onClose?: () => void;
}

export const NFTDisplay: React.FC<NFTDisplayProps> = ({ nft, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`bg-white rounded-lg p-6 max-w-md w-full mx-4 ${RARITY_BORDER_COLORS[nft.rarity]} border-2`}>
        <div className="flex justify-between items-start mb-4">
          <h2 className={`text-2xl font-bold ${RARITY_TEXT_COLORS[nft.rarity]}`}>{nft.name}</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>

        <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
          <img
            src={nft.imageUrl}
            alt={nft.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className={`${RARITY_BG_COLORS[nft.rarity]} p-3 rounded-lg mb-4`}>
          <p className={`font-semibold ${RARITY_TEXT_COLORS[nft.rarity]}`}>
            稀有度: {RARITY_NAMES[nft.rarity]}
          </p>
        </div>

        <p className="text-gray-600 mb-4">{nft.description}</p>

        {nft.price && (
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-800">
              价格: {nft.price} 金币
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 