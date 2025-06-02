import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { NFT } from '../types/nft';
import { NFTRarity } from '../types/nft';
import '../styles/market.css';

const MARKET_FEE_RATE = 0.025; // 2.5% 市场手续费

const RARITY_COLORS = {
  [NFTRarity.Common]: 'var(--rarity-common)',
  [NFTRarity.Rare]: 'var(--rarity-rare)',
  [NFTRarity.Epic]: 'var(--rarity-epic)',
  [NFTRarity.Legendary]: 'var(--rarity-legendary)'
};

export function Market() {
  const { balance, listedNFTs, buyNFT, unlistNFT } = useGameStore();
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [showFeeInfo, setShowFeeInfo] = useState(false);

  const handleBuy = async () => {
    if (!selectedNFT || !selectedNFT.price) return;
    if (balance < selectedNFT.price) {
      alert('余额不足！');
      return;
    }

    const marketFee = selectedNFT.price * MARKET_FEE_RATE;
    const sellerAmount = selectedNFT.price - marketFee;

    if (confirm(
      `确定要购买 ${selectedNFT.name} 吗？\n` +
      `价格: ${selectedNFT.price.toFixed(2)} 元\n` +
      `卖家将获得: ${sellerAmount.toFixed(2)} 元\n` +
      `(已扣除 ${marketFee.toFixed(2)} 元手续费)`
    )) {
      try {
        await buyNFT(selectedNFT.id);
        setSelectedNFT(null);
        alert('购买成功！');
      } catch (error) {
        alert(error instanceof Error ? error.message : '购买失败！');
      }
    }
  };

  const handleUnlist = (nftId: string) => {
    if (confirm('确定要下架这个NFT吗？')) {
      unlistNFT(nftId);
      setSelectedNFT(null);
    }
  };

  const getRarityColor = (rarity: NFTRarity) => {
    return RARITY_COLORS[rarity];
  };

  return (
    <div className="market-container">
      <div className="market-header">
        <h2>NFT市场</h2>
        <div className="market-info">
          <p className="balance">当前余额: {balance.toFixed(2)} 元</p>
          <button 
            className="btn"
            onClick={() => setShowFeeInfo(!showFeeInfo)}
          >
            {showFeeInfo ? '隐藏' : '查看'}手续费说明
          </button>
        </div>
      </div>

      {showFeeInfo && (
        <div className="fee-info">
          <h3>市场手续费说明</h3>
          <p>• 市场收取成交价格的 2.5% 作为手续费</p>
          <p>• 手续费在交易完成时自动扣除</p>
          <p>• 例如：NFT售价 100元，买家支付 100元，卖家实际获得 97.5元，手续费 2.5元</p>
        </div>
      )}

      <div className="market-grid">
        {listedNFTs.length === 0 ? (
          <div className="empty-state">
            <p>市场暂无NFT</p>
          </div>
        ) : (
          <div className="grid">
            {listedNFTs.map(nft => (
              <div 
                key={nft.id}
                className="nft-card"
                style={{ borderColor: getRarityColor(nft.rarity) }}
                onClick={() => setSelectedNFT(nft)}
              >
                <div className="nft-image">
                  <img src={nft.imageUrl} alt={nft.name} />
                </div>
                <span 
                  className="nft-rarity" 
                  data-rarity={nft.rarity}
                >
                  {nft.rarity}
                </span>
                <h4>{nft.name}</h4>
                <p className="nft-description">{nft.description}</p>
                <p className="price">{nft.price?.toFixed(2)} 元</p>
                <div className="card-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNFT(nft);
                    }}
                    disabled={!nft.price || balance < nft.price}
                  >
                    购买
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedNFT && (
        <div className="modal">
          <div className="modal-content">
            <h3>NFT详情</h3>
            <div className="nft-details">
              <div className="nft-image">
                <img src={selectedNFT.imageUrl} alt={selectedNFT.name} />
              </div>
              <div className="nft-info">
                <p>稀有度: {selectedNFT.rarity}</p>
                <p>名称: {selectedNFT.name}</p>
                <p>描述: {selectedNFT.description}</p>
                <p>ID: {selectedNFT.id}</p>
                <p className="price">价格: {selectedNFT.price?.toFixed(2)} 元</p>
                {selectedNFT.price && (
                  <div className="fee-details">
                    <p>买家支付: {selectedNFT.price.toFixed(2)} 元</p>
                    <p>手续费 (2.5%): {(selectedNFT.price * MARKET_FEE_RATE).toFixed(2)} 元</p>
                    <p>卖家获得: {(selectedNFT.price * (1 - MARKET_FEE_RATE)).toFixed(2)} 元</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-primary"
                onClick={handleBuy}
                disabled={!selectedNFT.price || balance < selectedNFT.price}
              >
                确认购买
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleUnlist(selectedNFT.id)}
              >
                下架NFT
              </button>
              <button 
                className="btn"
                onClick={() => setSelectedNFT(null)}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 