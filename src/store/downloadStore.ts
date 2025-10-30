import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
export type DownloadStatus = 'processing' | 'ready' | 'error' | 'cancelled';
export type DownloadFormat = 'mp4' | 'mp3';
export interface Download {
  id: string;
  url: string;
  title: string;
  format: DownloadFormat;
  status: DownloadStatus;
  downloadUrl?: string;
  error?: string;
}
interface DownloadState {
  downloads: Download[];
}
interface DownloadActions {
  addDownload: (download: Omit<Download, 'id' | 'status'>) => string;
  setDownloadReady: (id: string, downloadUrl: string) => void;
  setDownloadError: (id: string, error: string) => void;
  setStatus: (id: string, status: DownloadStatus) => void;
  removeDownload: (id: string) => void;
}
export const useDownloadStore = create<DownloadState & DownloadActions>()(
  immer((set) => ({
    downloads: [],
    addDownload: (download) => {
      const newDownload: Download = {
        ...download,
        id: crypto.randomUUID(),
        status: 'processing',
      };
      set((state) => {
        state.downloads.unshift(newDownload);
      });
      return newDownload.id;
    },
    setDownloadReady: (id, downloadUrl) =>
      set((state) => {
        const download = state.downloads.find((d) => d.id === id);
        if (download) {
          download.status = 'ready';
          download.downloadUrl = downloadUrl;
          download.error = undefined;
        }
      }),
    setDownloadError: (id, error) =>
      set((state) => {
        const download = state.downloads.find((d) => d.id === id);
        if (download) {
          download.status = 'error';
          download.error = error;
          download.downloadUrl = undefined;
        }
      }),
    setStatus: (id, status) =>
      set((state) => {
        const download = state.downloads.find((d) => d.id === id);
        if (download) {
          download.status = status;
        }
      }),
    removeDownload: (id) =>
      set((state) => {
        state.downloads = state.downloads.filter((d) => d.id !== id);
      }),
  }))
);