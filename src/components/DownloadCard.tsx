import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, X, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import type { Download as DownloadType } from '@/store/downloadStore';
import { useDownloadStore } from '@/store/downloadStore';
import { cn } from '@/lib/utils';
interface DownloadCardProps {
  download: DownloadType;
}
export function DownloadCard({ download }: DownloadCardProps) {
  const removeDownload = useDownloadStore((state) => state.removeDownload);
  const handleCancel = () => removeDownload(download.id);
  const getStatusInfo = () => {
    switch (download.status) {
      case 'processing':
        return { text: 'Processing...', color: 'text-blue-400', icon: <Loader2 className="h-4 w-4 animate-spin" /> };
      case 'ready':
        return { text: 'Ready to Download', color: 'text-teal-400', icon: <CheckCircle2 className="h-4 w-4" /> };
      case 'error':
        return { text: 'Error', color: 'text-red-400', icon: <AlertTriangle className="h-4 w-4" /> };
      case 'cancelled':
        return { text: 'Cancelled', color: 'text-gray-400', icon: <X className="h-4 w-4" /> };
      default:
        return { text: 'Waiting...', color: 'text-gray-400', icon: null };
    }
  };
  const { text, color, icon } = getStatusInfo();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
        <CardHeader className="p-0">
          <div className="aspect-video bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center">
            <Download className="h-16 w-16 text-white/20" />
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4 flex flex-col flex-grow">
          <div className="space-y-1 flex-grow">
            <p className="font-semibold text-foreground truncate" title={download.title}>
              {download.title}
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <span className={cn("font-medium", color)}>{icon}</span>
              <span className={cn("font-medium", color)}>{text}</span>
            </div>
            {download.status === 'error' && (
              <p className="text-xs text-red-400 pt-2">{download.error}</p>
            )}
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs font-mono text-muted-foreground uppercase">{download.format}</span>
            <div className="flex items-center space-x-2">
              {download.status === 'ready' && download.downloadUrl && (
                <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95">
                  <a href={download.downloadUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Download Now
                  </a>
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={handleCancel} className="h-8 w-8 text-red-500 hover:text-red-400">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}