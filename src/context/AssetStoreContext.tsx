import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Background, Creator, Frame } from "../types/assets";
import { mockAssetStore } from "../lib/mockAssetStore";

interface AssetStoreContextValue {
  creators: Creator[];
  backgrounds: Background[];
  frames: Frame[];
  activeBackground: Background | undefined;
  activeFrame: Frame | undefined;

  addCreator: (input: { name: string; imageUrl: string }) => Promise<void>;
  deleteCreator: (id: string) => Promise<void>;

  addBackground: (input: { label: string; imageUrl: string }) => Promise<void>;
  deleteBackground: (id: string) => Promise<void>;
  setActiveBackground: (id: string) => Promise<void>;

  addFrame: (input: { label: string; imageUrl: string }) => Promise<void>;
  deleteFrame: (id: string) => Promise<void>;
  setActiveFrame: (id: string) => Promise<void>;
}

const EMPTY_DATA = { creators: [], backgrounds: [], frames: [] };

const AssetStoreContext = createContext<AssetStoreContextValue | null>(null);

export function AssetStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<{
    creators: Creator[];
    backgrounds: Background[];
    frames: Frame[];
  }>(EMPTY_DATA);

  const refresh = useCallback(async () => {
    setData(await mockAssetStore.getAll());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo<AssetStoreContextValue>(
    () => ({
      creators: data.creators,
      backgrounds: data.backgrounds,
      frames: data.frames,
      activeBackground: data.backgrounds.find((b) => b.isActive),
      activeFrame: data.frames.find((f) => f.isActive),

      addCreator: async (input) => {
        await mockAssetStore.addCreator(input);
        await refresh();
      },
      deleteCreator: async (id) => {
        await mockAssetStore.deleteCreator(id);
        await refresh();
      },

      addBackground: async (input) => {
        await mockAssetStore.addBackground(input);
        await refresh();
      },
      deleteBackground: async (id) => {
        await mockAssetStore.deleteBackground(id);
        await refresh();
      },
      setActiveBackground: async (id) => {
        await mockAssetStore.setActiveBackground(id);
        await refresh();
      },

      addFrame: async (input) => {
        await mockAssetStore.addFrame(input);
        await refresh();
      },
      deleteFrame: async (id) => {
        await mockAssetStore.deleteFrame(id);
        await refresh();
      },
      setActiveFrame: async (id) => {
        await mockAssetStore.setActiveFrame(id);
        await refresh();
      },
    }),
    [data, refresh],
  );

  return <AssetStoreContext.Provider value={value}>{children}</AssetStoreContext.Provider>;
}

export function useAssetStore(): AssetStoreContextValue {
  const ctx = useContext(AssetStoreContext);
  if (!ctx) throw new Error("useAssetStore must be used within AssetStoreProvider");
  return ctx;
}
