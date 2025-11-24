'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';

export function ShareSection() {
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link Copied!',
      description: 'You can now share the golden truth with others.',
    });
  };

  return (
    <Button onClick={handleCopyLink} variant="secondary">
      <Copy className="mr-2 h-4 w-4" />
      Copy Link to Share
    </Button>
  );
}
