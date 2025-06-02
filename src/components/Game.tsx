import { useState } from 'react';
import { LotterySystem } from '../utils/lottery';
import { useGameStore } from '../store/gameStore';
import type { NFT } from '../types/nft';
import { NFTRarity, SYNTHESIS_RULES, getNextRarity } from '../types/nft';
import '../styles/game.css';

const TICKET_PRICE = 100; // 每张刮刮乐100元

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

    // 模拟抽奖动画
    await new Promise(resolve => setTimeout(resolve, 2000));

    const nft = LotterySystem.drawNFT();
    addNFT(nft);
    setLastDrawnNFT(nft);
    setIsDrawing(false);
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

  const handleSynthesis = async () => {
    if (selectedForSynthesis.length === 0) return;
    const selectedNFTs = nfts.filter(nft => selectedForSynthesis.includes(nft.id));
    if (selectedNFTs.length === 0) return;

    const rarity = selectedNFTs[0].rarity;
    const rule = SYNTHESIS_RULES[rarity as keyof typeof SYNTHESIS_RULES];
    if (!rule) return;

    if (balance < rule.fee) {
      alert('余额不足！');
      return;
    }

    try {
      await synthesizeNFTs();
      alert('合成成功！');
      setShowSynthesis(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : '合成失败！');
    }
  };

  const getSynthesisInfo = () => {
    if (selectedForSynthesis.length === 0) return null;
    const selectedNFTs = nfts.filter(nft => selectedForSynthesis.includes(nft.id));
    if (selectedNFTs.length === 0) return null;

    const rarity = selectedNFTs[0].rarity;
    const rule = SYNTHESIS_RULES[rarity as keyof typeof SYNTHESIS_RULES];
    if (!rule) return null;

    return {
      current: selectedNFTs.length,
      required: rule.required,
      fee: rule.fee,
      nextRarity: getNextRarity(rarity)
    };
  };

  const getRarityColor = (rarity: NFTRarity) => {
    const colors: Record<NFTRarity, string> = {
      [NFTRarity.COMMON]: 'var(--rarity-common)',
      [NFTRarity.RARE]: 'var(--rarity-rare)',
      [NFTRarity.EPIC]: 'var(--rarity-epic)',
      [NFTRarity.LEGENDARY]: 'var(--rarity-legendary)'
    };
    return colors[rarity];
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
            <div className="nft-card">
              <span 
                className="nft-rarity" 
                data-rarity={lastDrawnNFT.rarity}
              >
                {lastDrawnNFT.rarity}
              </span>
              <h4>{lastDrawnNFT.name}</h4>
              <p>ID: {lastDrawnNFT.id}</p>
            </div>
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

          {synthesisInfo && (
            <div className="synthesis-info">
              <p>已选择: {synthesisInfo.current}/{synthesisInfo.required} 个{synthesisInfo.nextRarity}NFT</p>
              <p>合成费用: {synthesisInfo.fee}元</p>
              <button 
                className="btn btn-primary"
                onClick={handleSynthesis}
                disabled={synthesisInfo.current !== synthesisInfo.required || balance < synthesisInfo.fee}
              >
                确认合成
              </button>
            </div>
          )}
        </div>
      )}

      <div className="nft-grid">
        <h2>我的NFT收藏</h2>
        <div className="grid">
          {nfts.map(nft => (
            <div 
              key={nft.id} 
              className={`nft-card ${showSynthesis ? 'selectable' : ''} ${selectedForSynthesis.includes(nft.id) ? 'selected' : ''}`}
              style={{ borderColor: getRarityColor(nft.rarity) }}
              onClick={() => {
                if (showSynthesis) {
                  toggleSynthesisSelection(nft.id);
                } else {
                  setSelectedNFT(nft);
                }
              }}
            >
              <span 
                className="nft-rarity" 
                data-rarity={nft.rarity}
              >
                {nft.rarity}
              </span>
              <h4>{nft.name}</h4>
              <p>ID: {nft.id}</p>
              {showSynthesis && selectedForSynthesis.includes(nft.id) && (
                <div className="selection-indicator">已选择</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedNFT && !showSynthesis && (
        <div className="modal">
          <div className="modal-content">
            <h3>NFT详情</h3>
            <div className="nft-details">
              <p>稀有度: {selectedNFT.rarity}</p>
              <p>名称: {selectedNFT.name}</p>
              <p>ID: {selectedNFT.id}</p>
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