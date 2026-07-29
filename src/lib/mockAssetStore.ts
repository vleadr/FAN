import { get, set } from "idb-keyval";
import type { Background, Creator, Frame } from "../types/assets";
import { ASSET_PATHS, ASSET_STORE_KEY } from "./constants";

interface AssetStoreData {
  creators: Creator[];
  backgrounds: Background[];
  frames: Frame[];
}

function seedData(): AssetStoreData {
  return {
    // Real transparent cutouts — each overlays centered on top of the active background.
    creators: [
      { id: "creator-abu-dakhil", name: "أبو دخيل", imageUrl: `${ASSET_PATHS.creators}/ابو دخيل.webp` },
      { id: "creator-abu-slo", name: "أبو سلو", imageUrl: `${ASSET_PATHS.creators}/ابو سلو.webp` },
      { id: "creator-bodi", name: "بودي", imageUrl: `${ASSET_PATHS.creators}/بودي.webp` },
      { id: "creator-thamer", name: "ثامر", imageUrl: `${ASSET_PATHS.creators}/ثامر.webp` },
      { id: "creator-dabi", name: "دابي", imageUrl: `${ASSET_PATHS.creators}/دابي.webp` },
      { id: "creator-saeed", name: "سعيد", imageUrl: `${ASSET_PATHS.creators}/سعيد.webp` },
      { id: "creator-tarbakh", name: "طرباخ", imageUrl: `${ASSET_PATHS.creators}/طرباخ.webp` },
      { id: "creator-shehri", name: "عبدالرحمن الشهري", imageUrl: `${ASSET_PATHS.creators}/عبدالرحمن الشهري.webp` },
      { id: "creator-faisal", name: "فيصل", imageUrl: `${ASSET_PATHS.creators}/فيصل.webp` },
      { id: "creator-ko3ib", name: "كعيب", imageUrl: `${ASSET_PATHS.creators}/كعيب.webp` },
      { id: "creator-yazeed", name: "يزيد", imageUrl: `${ASSET_PATHS.creators}/يزيد.webp` },
    ],
    backgrounds: [
      {
        id: "bg-header-empty-redsea",
        label: "هيدر — البحر الأحمر",
        imageUrl: `${ASSET_PATHS.headers}/Red-Sea-Fan-Header-background.webp`,
        isActive: true,
      },
      {
        id: "bg-header-group-redsea",
        label: "هيدر — جميع صناع المحتوى",
        imageUrl: `${ASSET_PATHS.headers}/Peaks_Header_RedSeaNew.webp`,
        isActive: false,
      },
      {
        id: "bg-header-yt-redsea",
        label: "هيدر — يوتيوب — البحر الأحمر",
        imageUrl: `${ASSET_PATHS.headers}/Peaks_HeaderYT_RedSeaNew.jpg`,
        isActive: false,
      },
    ],
    frames: [
      {
        id: "frame-pfp-redsea",
        label: "إطار الصورة الشخصية — البحر الأحمر",
        imageUrl: `${ASSET_PATHS.frames}/Community_PFP.webp`,
        isActive: true,
      },
    ],
  };
}

// Backed by IndexedDB (via idb-keyval) rather than localStorage: localStorage
// caps out around 5-10MB per origin, which a handful of uploaded photos can
// exceed on their own. IndexedDB's quota is tied to available disk space
// (typically hundreds of MB to GB), so this removes that ceiling entirely.
async function save(data: AssetStoreData) {
  try {
    await set(ASSET_STORE_KEY, data);
  } catch {
    throw new Error("تعذّر حفظ العنصر — قد تكون مساحة التخزين ممتلئة على هذا الجهاز.");
  }
}

async function load(): Promise<AssetStoreData> {
  const raw = await get<AssetStoreData>(ASSET_STORE_KEY);
  if (!raw) {
    const seeded = seedData();
    await save(seeded);
    return seeded;
  }
  return raw;
}

function makeId(prefix: string): string {
  // Avoids crypto.randomUUID(), which throws outside secure contexts
  // (e.g. viewing the dev server over a plain-HTTP LAN address).
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

export const mockAssetStore = {
  getAll(): Promise<AssetStoreData> {
    return load();
  },

  async addCreator(input: { name: string; imageUrl: string }): Promise<Creator> {
    const data = await load();
    const creator: Creator = { id: makeId("creator"), ...input };
    data.creators.push(creator);
    await save(data);
    return creator;
  },
  async deleteCreator(id: string) {
    const data = await load();
    data.creators = data.creators.filter((c) => c.id !== id);
    await save(data);
  },

  async addBackground(input: { label: string; imageUrl: string }): Promise<Background> {
    const data = await load();
    const background: Background = {
      id: makeId("bg"),
      isActive: data.backgrounds.length === 0,
      ...input,
    };
    data.backgrounds.push(background);
    await save(data);
    return background;
  },
  async deleteBackground(id: string) {
    const data = await load();
    const wasActive = data.backgrounds.find((b) => b.id === id)?.isActive;
    data.backgrounds = data.backgrounds.filter((b) => b.id !== id);
    if (wasActive && data.backgrounds.length > 0) {
      data.backgrounds[0].isActive = true;
    }
    await save(data);
  },
  async setActiveBackground(id: string) {
    const data = await load();
    data.backgrounds = data.backgrounds.map((b) => ({ ...b, isActive: b.id === id }));
    await save(data);
  },

  async addFrame(input: { label: string; imageUrl: string }): Promise<Frame> {
    const data = await load();
    const frame: Frame = {
      id: makeId("frame"),
      isActive: data.frames.length === 0,
      ...input,
    };
    data.frames.push(frame);
    await save(data);
    return frame;
  },
  async deleteFrame(id: string) {
    const data = await load();
    const wasActive = data.frames.find((f) => f.id === id)?.isActive;
    data.frames = data.frames.filter((f) => f.id !== id);
    if (wasActive && data.frames.length > 0) {
      data.frames[0].isActive = true;
    }
    await save(data);
  },
  async setActiveFrame(id: string) {
    const data = await load();
    data.frames = data.frames.map((f) => ({ ...f, isActive: f.id === id }));
    await save(data);
  },
};
