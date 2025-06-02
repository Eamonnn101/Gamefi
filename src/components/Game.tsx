import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { NFT } from '../types/nft';
import { NFTRarity, SYNTHESIS_RULES } from '../types/nft';
import { LotterySystem } from '../utils/lottery';
import '../styles/game.css';

const TICKET_PRICE = 100; // 每张刮刮乐100元

const getRarityColor = (rarity: NFTRarity) => {
  const colors: Record<NFTRarity, string> = {
    [NFTRarity.Common]: 'var(--rarity-common)',
    [NFTRarity.Rare]: 'var(--rarity-rare)',
    [NFTRarity.Epic]: 'var(--rarity-epic)',
    [NFTRarity.Legendary]: 'var(--rarity-legendary)'
  };
  return colors[rarity];
};

const NFTCard = ({ nft, onClick, isSelected }: { 
  nft: NFT; 
  onClick: () => void; 
  isSelected?: boolean;
}) => (
  <div 
    className={`nft-card ${isSelected ? 'selected' : ''}`}
    style={{ borderColor: getRarityColor(nft.rarity) }}
    onClick={onClick}
  >
    <div className="nft-image">
      <img src={nft.imageUrl} alt={nft.name} />
    </div>
    <div className="nft-info">
      <span className="nft-rarity" data-rarity={nft.rarity}>
        {nft.rarity}
      </span>
      <h4>{nft.name}</h4>
      <p className="nft-description">{nft.description}</p>
    </div>
    {isSelected && (
      <div className="selection-indicator">已选择</div>
    )}
  </div>
);

interface SynthesisInfo {
  current: number;
  required: number;
  cost: number;
  nextRarity: NFTRarity | null;
}

export function Game() {
  const { 
    balance, 
    nfts, 
    addNFT, 
    updateBalance, 
    listNFT,
    selectedForSynthesis,
    toggleSynthesisSelection,
    clearSynthesisSelection,
    synthesizeNFTs
  } = useGameStore();
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastDrawnNFT, setLastDrawnNFT] = useState<NFT | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [listPrice, setListPrice] = useState('');
  const [showSynthesis, setShowSynthesis] = useState(false);

  const handleDraw = async () => {
    if (balance < TICKET_PRICE) {
      alert('余额不足！');
      return;
    }

    setIsDrawing(true);
    updateBalance(-TICKET_PRICE);

    try {
      // 模拟抽奖动画
      await new Promise(resolve => setTimeout(resolve, 2000));

      const nft = await LotterySystem.drawNFT();
      addNFT(nft);
      setLastDrawnNFT(nft);
    } catch (error) {
      alert(error instanceof Error ? error.message : '抽奖失败！');
      updateBalance(TICKET_PRICE); // 如果失败，返还金币
    } finally {
      setIsDrawing(false);
    }
  };

  const handleListNFT = () => {
    if (!selectedNFT) return;
    const price = parseFloat(listPrice);
    if (isNaN(price) || price <= 0) {
      alert('请输入有效的价格！');
      return;
    }
    listNFT(selectedNFT.id, price);
    setSelectedNFT(null);
    setListPrice('');
  };

  const getSynthesisInfo = (): SynthesisInfo => {
    if (selectedForSynthesis.length === 0) {
      return { current: 0, required: 3, cost: 0, nextRarity: null };
    }

    const selectedNFTs = nfts.filter(nft => selectedForSynthesis.includes(nft.id));
    if (selectedNFTs.length === 0) {
      return { current: 0, required: 3, cost: 0, nextRarity: null };
    }

    const rarity = selectedNFTs[0].rarity;
    if (rarity === NFTRarity.Legendary) {
      return { current: selectedNFTs.length, required: 3, cost: 0, nextRarity: null };
    }

    const rule = SYNTHESIS_RULES[rarity as keyof typeof SYNTHESIS_RULES];
    return {
      current: selectedNFTs.length,
      required: 3,
      cost: rule.cost,
      nextRarity: rule.target
    };
  };

  const handleSynthesize = async () => {
    if (selectedForSynthesis.length !== 3) {
      alert('请选择3个相同稀有度的NFT进行合成');
      return;
    }

    const selectedNFTs = nfts.filter(nft => selectedForSynthesis.includes(nft.id));
    const rarity = selectedNFTs[0].rarity;
    if (rarity === NFTRarity.Legendary) {
      alert('传说级NFT无法合成');
      return;
    }

    const rule = SYNTHESIS_RULES[rarity as keyof typeof SYNTHESIS_RULES];
    const cost = rule.cost;

    if (balance < cost) {
      alert(`余额不足，合成需要${cost}元`);
      return;
    }

    try {
      await synthesizeNFTs();
      alert('合成成功！');
      setShowSynthesis(false);
      clearSynthesisSelection();
    } catch (error) {
      alert('合成失败：' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const synthesisInfo = getSynthesisInfo();

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="balance-card">
          <h2>当前余额</h2>
          <p className="balance">{balance.toFixed(2)} 元</p>
          <button
            className="btn btn-primary"
            onClick={handleDraw}
            disabled={isDrawing || balance < TICKET_PRICE}
          >
            {isDrawing ? '抽奖中...' : `购买刮刮乐 (${TICKET_PRICE}元)`}
          </button>
        </div>

        {lastDrawnNFT && (
          <div className="last-drawn-card" style={{ borderColor: getRarityColor(lastDrawnNFT.rarity) }}>
            <h3>最新获得</h3>
            <NFTCard nft={lastDrawnNFT} onClick={() => setSelectedNFT(lastDrawnNFT)} />
          </div>
        )}
      </div>

      <div className="game-controls">
        <button 
          className={`btn ${showSynthesis ? 'btn-primary' : ''}`}
          onClick={() => {
            setShowSynthesis(!showSynthesis);
            if (!showSynthesis) {
              clearSynthesisSelection();
            }
          }}
        >
          {showSynthesis ? '取消合成' : '合成NFT'}
        </button>
      </div>

      {showSynthesis && (
        <div className="synthesis-panel">
          <div className="synthesis-rules">
            <h3>合成规则</h3>
            <ul>
              <li>3个普通NFT → 1个稀有NFT (费用: 10元)</li>
              <li>3个稀有NFT → 1个史诗NFT (费用: 10元)</li>
              <li>3个史诗NFT → 1个传说NFT (费用: 10元)</li>
            </ul>
          </div>

          {synthesisInfo.nextRarity ? (
            <div className="synthesis-info">
              <p>已选择: {synthesisInfo.current}/{synthesisInfo.required} 个{synthesisInfo.nextRarity}NFT</p>
              <p>合成费用: {synthesisInfo.cost}元</p>
              <button 
                className="btn btn-primary"
                onClick={handleSynthesize}
                disabled={synthesisInfo.current !== synthesisInfo.required || balance < synthesisInfo.cost}
              >
                合成 ({synthesisInfo.current}/{synthesisInfo.required})
                {synthesisInfo.cost > 0 && ` - ${synthesisInfo.cost}元`}
              </button>
            </div>
          ) : (
            <p>请选择要合成的NFT</p>
          )}
        </div>
      )}

      <div className="nft-grid">
        <h2>我的NFT收藏</h2>
        <div className="grid">
          {nfts.map(nft => (
            <NFTCard
              key={nft.id}
              nft={nft}
              onClick={() => {
                if (showSynthesis) {
                  toggleSynthesisSelection(nft.id);
                } else {
                  setSelectedNFT(nft);
                }
              }}
              isSelected={selectedForSynthesis.includes(nft.id)}
            />
          ))}
        </div>
      </div>

      {selectedNFT && !showSynthesis && (
        <div className="modal">
          <div className="modal-content">
            <h3>NFT详情</h3>
            <div className="nft-details">
              <NFTCard nft={selectedNFT} onClick={() => {}} />
              <div className="nft-info">
                <p>稀有度: {selectedNFT.rarity}</p>
                <p>主题: {selectedNFT.theme}</p>
                <p>ID: {selectedNFT.id}</p>
              </div>
            </div>
            <div className="modal-actions">
              <input
                type="number"
                value={listPrice}
                onChange={(e) => setListPrice(e.target.value)}
                placeholder="输入上架价格"
                min="0"
                step="0.01"
              />
              <button 
                className="btn btn-primary"
                onClick={handleListNFT}
                disabled={!listPrice || parseFloat(listPrice) <= 0}
              >
                上架到市场
              </button>
              <button 
                className="btn"
                onClick={() => {
                  setSelectedNFT(null);
                  setListPrice('');
                }}
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