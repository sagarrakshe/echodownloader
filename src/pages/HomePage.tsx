import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Film, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster, toast } from '@/components/ui/sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useDownloadStore } from '@/store/downloadStore';
import type { DownloadFormat } from '@/store/downloadStore';
import { DownloadCard } from '@/components/DownloadCard';
import { api } from '@/lib/api-client';
const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
export function HomePage() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState<DownloadFormat>('mp4');
  const [isProcessing, setIsProcessing] = useState(false);
  const downloads = useDownloadStore((state) => state.downloads);
  const addDownload = useDownloadStore((state) => state.addDownload);
  const setDownloadReady = useDownloadStore((state) => state.setDownloadReady);
  const setDownloadError = useDownloadStore((state) => state.setDownloadError);
  const isUrlValid = useMemo(() => YOUTUBE_URL_REGEX.test(url), [url]);
  const handleDownload = async () => {
    if (!isUrlValid) {
      toast.error('Invalid YouTube URL', { description: 'Please enter a valid YouTube video URL.' });
      return;
    }
    if (isProcessing) return;
    setIsProcessing(true);
    const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
    const videoId = videoIdMatch ? videoIdMatch[1] : 'video_' + Math.random().toString(36).substring(2, 9);
    const downloadId = addDownload({
      url,
      title: `YouTube Video ID: ${videoId}`,
      format,
    });
    toast.info('Processing your download...', { description: 'Please wait a moment.' });
    setUrl('');
    try {
      const response = await api<{ downloadUrl: string }>('/api/download', {
        method: 'POST',
        body: JSON.stringify({ url, format }),
      });
      setDownloadReady(downloadId, response.downloadUrl);
      toast.success('Download is ready!', { description: 'Your file is now available to download.' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setDownloadError(downloadId, errorMessage);
      toast.error('Download failed', { description: errorMessage });
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="min-h-screen w-full bg-background text-foreground relative overflow-x-hidden">
      <ThemeToggle className="fixed top-4 right-4" />
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-24 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 dark:from-gray-50 dark:to-gray-400">
              EchoDownloader
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              A visually stunning web application that provides a simulated experience of downloading YouTube videos as MP4 or MP3 files.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="mt-12 max-w-2xl mx-auto"
          >
            <div className="p-2 rounded-lg bg-card/50 backdrop-blur-sm border shadow-lg">
              <Tabs value={format} onValueChange={(v) => setFormat(v as DownloadFormat)} className="w-full">
                <div className="flex flex-col md:flex-row items-center gap-2 p-2">
                  <Input
                    type="text"
                    placeholder="Paste your YouTube URL here..."
                    className="flex-grow h-12 text-base bg-secondary/50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                    <TabsList className="grid w-full grid-cols-2 h-12 sm:w-auto">
                      <TabsTrigger value="mp4" className="h-full text-base"><Film className="w-5 h-5 mr-2" />MP4</TabsTrigger>
                      <TabsTrigger value="mp3" className="h-full text-base"><Music className="w-5 h-5 mr-2" />MP3</TabsTrigger>
                    </TabsList>
                    <Button
                      size="lg"
                      className="h-12 w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:bg-gray-500"
                      onClick={handleDownload}
                      disabled={!isUrlValid || isProcessing}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      {isProcessing ? 'Processing...' : 'Download'}
                    </Button>
                  </div>
                </div>
                <TabsContent value="mp4" />
                <TabsContent value="mp3" />
              </Tabs>
            </div>
          </motion.div>
        </section>
        <section className="py-16 md:py-24">
          <AnimatePresence>
            {downloads.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-bold text-center">Downloads</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {downloads.map((download) => (
                      <DownloadCard key={download.id} download={download} />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {downloads.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 px-6 border-2 border-dashed rounded-lg"
              >
                <Download className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No active downloads</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your downloads will appear here once you start them.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
      <footer className="py-8 text-center text-muted-foreground text-sm">
        <p>Built with ❤️ at Cloudflare</p>
      </footer>
      <Toaster richColors closeButton />
    </div>
  );
}