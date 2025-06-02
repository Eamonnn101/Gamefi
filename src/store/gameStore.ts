import { create } from 'zustand';
import type { NFT } from '../types/nft';
import { NFTRarity, SYNTHESIS_RULES } from '../types/nft';
import { LotterySystem } from '../utils/lottery';

const MARKET_FEE_RATE = 0.025; // 2.5% 市场手续费

interface GameState {
  balance: number;
  nfts: NFT[];
  listedNFTs: NFT[];
  selectedForSynthesis: string[];
  addNFT: (nft: NFT) => void;
  updateBalance: (amount: number) => void;
  listNFT: (nftId: string, price: number) => void;
  buyNFT: (nftId: string) => void;
  unlistNFT: (nftId: string) => void;
  toggleSynthesisSelection: (nftId: string) => void;
  clearSynthesisSelection: () => void;
  synthesizeNFTs: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  balance: 10000,
  nfts: [],
  listedNFTs: [],
  selectedForSynthesis: [],

  addNFT: (nft) => set((state) => ({ nfts: [...state.nfts, nft] })),

  updateBalance: (amount) => set((state) => ({ balance: state.balance + amount })),

  listNFT: (nftId, price) => {
    const state = get();
    const nft = state.nfts.find((n) => n.id === nftId);
    if (!nft) return;

    set((state) => ({
      nfts: state.nfts.filter((n) => n.id !== nftId),
      listedNFTs: [...state.listedNFTs, { ...nft, price }]
    }));
  },

  buyNFT: (nftId) => {
    const state = get();
    const listedNFT = state.listedNFTs.find((n) => n.id === nftId);
    if (!listedNFT) {
      throw new Error('NFT不存在');
    }
    if (!listedNFT.price) {
      throw new Error('NFT未设置价格');
    }

    const totalCost = listedNFT.price * (1 + MARKET_FEE_RATE);
    if (state.balance < totalCost) {
      throw new Error('余额不足');
    }

    set((state) => ({
      balance: state.balance - totalCost,
      nfts: [...state.nfts, { ...listedNFT, price: undefined }],
      listedNFTs: state.listedNFTs.filter((n) => n.id !== nftId)
    }));
  },

  unlistNFT: (nftId) => {
    const state = get();
    const listedNFT = state.listedNFTs.find((n) => n.id === nftId);
    if (!listedNFT) return;
    
    set((state) => ({
      nfts: [...state.nfts, { ...listedNFT, price: undefined }],
      listedNFTs: state.listedNFTs.filter((n) => n.id !== nftId)
    }));
  },

  toggleSynthesisSelection: (nftId) => {
    const state = get();
    const nft = state.nfts.find((n) => n.id === nftId);
    if (!nft) return;

    const selectedNFTs = state.nfts.filter((n) => 
      state.selectedForSynthesis.includes(n.id)
    );

    // 如果已经选择了3个NFT，不允许继续选择
    if (selectedNFTs.length >= 3 && !state.selectedForSynthesis.includes(nftId)) {
      return;
    }

    // 如果选择的NFT稀有度与已选的不同，不允许选择
    if (selectedNFTs.length > 0 && selectedNFTs[0].rarity !== nft.rarity) {
      return;
    }

    set((state) => ({
      selectedForSynthesis: state.selectedForSynthesis.includes(nftId)
        ? state.selectedForSynthesis.filter((id) => id !== nftId)
        : [...state.selectedForSynthesis, nftId]
    }));
  },

  clearSynthesisSelection: () => set({ selectedForSynthesis: [] }),

  synthesizeNFTs: async () => {
    const state = get();
    const selectedNFTs = state.nfts.filter((nft) => 
      state.selectedForSynthesis.includes(nft.id)
    );

    if (selectedNFTs.length !== 3) {
      throw new Error('请选择3个相同稀有度的NFT进行合成');
    }

    const rarity = selectedNFTs[0].rarity;
    if (rarity === NFTRarity.Legendary) {
      throw new Error('传说级NFT无法合成');
    }

    const synthesisRule = SYNTHESIS_RULES[rarity as keyof typeof SYNTHESIS_RULES];
    if (!synthesisRule) {
      throw new Error('无效的合成规则');
    }

    if (state.balance < synthesisRule.cost) {
      throw new Error(`余额不足，合成需要${synthesisRule.cost}元`);
    }

    const newNFT = await LotterySystem.drawNFT(synthesisRule.target);

    set((state) => ({
      balance: state.balance - synthesisRule.cost,
      nfts: [
        ...state.nfts.filter((nft) => !state.selectedForSynthesis.includes(nft.id)),
        newNFT
      ],
      selectedForSynthesis: []
    }));
  }
})); 