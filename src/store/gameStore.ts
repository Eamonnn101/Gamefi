import { create } from 'zustand';
import type { NFT } from '../types/nft';
import { SYNTHESIS_RULES } from '../types/nft';

const MARKET_FEE_RATE = 0.025; // 2.5% 市场手续费

interface GameState {
  balance: number;
  nfts: NFT[];
  marketListings: NFT[]; // 市场列表
  selectedForSynthesis: string[]; // 选中的用于合成的NFT
  addNFT: (nft: NFT) => void;
  removeNFT: (nftId: string) => void;
  updateBalance: (amount: number) => void;
  listNFT: (nftId: string, price: number) => void;
  unlistNFT: (nftId: string) => void; // 下架NFT
  buyNFT: (nftId: string) => Promise<void>; // 购买NFT
  toggleSynthesisSelection: (nftId: string) => void; // 切换NFT的合成选中状态
  clearSynthesisSelection: () => void; // 清空合成选择
  synthesizeNFTs: () => Promise<void>; // 合成NFT
}

export const useGameStore = create<GameState>()((set, get) => ({
  balance: 10000, // 初始余额10000元
  nfts: [],
  marketListings: [],
  selectedForSynthesis: [],
  
  addNFT: (nft: NFT) => set((state: GameState) => ({
    nfts: [...state.nfts, nft]
  })),
  
  removeNFT: (nftId: string) => set((state: GameState) => ({
    nfts: state.nfts.filter((nft: NFT) => nft.id !== nftId)
  })),
  
  updateBalance: (amount: number) => set((state: GameState) => ({
    balance: state.balance + amount
  })),
  
  listNFT: (nftId: string, price: number) => {
    const { nfts } = get();
    const nft = nfts.find((n) => n.id === nftId);
    if (!nft) return;

    // 直接使用卖家设置的价格，不预先计算手续费
    set((state) => ({
      nfts: state.nfts.filter((n) => n.id !== nftId),
      marketListings: [...state.marketListings, { ...nft, price }],
    }));
  },

  unlistNFT: (nftId: string) => {
    const { marketListings } = get();
    const nft = marketListings.find((n) => n.id === nftId);
    if (!nft) return;

    const { price, ...nftWithoutPrice } = nft;
    set((state) => ({
      marketListings: state.marketListings.filter((n) => n.id !== nftId),
      nfts: [...state.nfts, nftWithoutPrice],
    }));
  },

  buyNFT: async (nftId: string) => {
    const { marketListings, balance, updateBalance } = get();
    const nft = marketListings.find((n) => n.id === nftId);
    if (!nft || !nft.price) throw new Error('NFT不存在或未设置价格');

    if (balance < nft.price) throw new Error('余额不足');

    // 计算手续费和卖家实际获得金额
    const marketFee = nft.price * MARKET_FEE_RATE;
    const sellerAmount = nft.price - marketFee;

    // 更新买家余额（支付全额）
    updateBalance(-nft.price);
    
    // 更新卖家余额（扣除手续费后）
    // 在实际应用中，这里应该调用智能合约来处理转账
    console.log(`卖家获得: ${sellerAmount.toFixed(2)}元 (已扣除${marketFee.toFixed(2)}元手续费)`);

    const { price, ...nftWithoutPrice } = nft;
    set((state) => ({
      marketListings: state.marketListings.filter((n) => n.id !== nftId),
      nfts: [...state.nfts, nftWithoutPrice],
    }));
  },

  toggleSynthesisSelection: (nftId: string) => set((state: GameState) => {
    const nft = state.nfts.find(n => n.id === nftId);
    if (!nft) return state;

    const isSelected = state.selectedForSynthesis.includes(nftId);
    const selectedNFTs = state.selectedForSynthesis.map(id => 
      state.nfts.find(n => n.id === id)
    ).filter((n): n is NFT => n !== undefined);

    // 检查是否可以选择该NFT进行合成
    if (!isSelected) {
      // 如果已经有选中的NFT，检查稀有度是否相同
      if (selectedNFTs.length > 0 && selectedNFTs[0].rarity !== nft.rarity) {
        alert('只能选择相同稀有度的NFT进行合成！');
        return state;
      }
      // 检查是否达到合成所需数量
      if (selectedNFTs.length >= SYNTHESIS_RULES[nft.rarity as keyof typeof SYNTHESIS_RULES]?.required) {
        alert('已达到合成所需数量！');
        return state;
      }
    }

    return {
      selectedForSynthesis: isSelected
        ? state.selectedForSynthesis.filter(id => id !== nftId)
        : [...state.selectedForSynthesis, nftId]
    };
  }),

  clearSynthesisSelection: () => set({ selectedForSynthesis: [] }),

  synthesizeNFTs: async () => {
    const state = get();
    const selectedNFTs = state.selectedForSynthesis.map(id => 
      state.nfts.find(n => n.id === id)
    ).filter((n): n is NFT => n !== undefined);

    if (selectedNFTs.length === 0) return;

    const firstNFT = selectedNFTs[0];
    const synthesisRule = SYNTHESIS_RULES[firstNFT.rarity as keyof typeof SYNTHESIS_RULES];

    if (!synthesisRule || selectedNFTs.length !== synthesisRule.required) {
      alert('合成条件不满足！');
      return;
    }

    if (state.balance < synthesisRule.fee) {
      alert('余额不足，无法支付合成费用！');
      return;
    }

    // 创建新的NFT
    const newNFT: NFT = {
      id: `NFT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      rarity: synthesisRule.target,
      name: `${synthesisRule.target} NFT #${Date.now().toString().slice(-4)}`,
      price: 0
    };

    set((state) => ({
      balance: state.balance - synthesisRule.fee,
      nfts: [
        ...state.nfts.filter(nft => !state.selectedForSynthesis.includes(nft.id)),
        newNFT
      ],
      selectedForSynthesis: []
    }));
  }
})); 