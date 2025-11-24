'use client';

import { useHistory } from '@/hooks/use-history';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const getConfidenceIcon = (label: string) => {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('strong')) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  if (lowerLabel.includes('partial')) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  return <XCircle className="h-5 w-5 text-red-500" />;
};

export default function HistoryPage() {
  const { history } = useHistory();

  return (
    <div className="container mx-auto max-w-4xl flex-1 p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline">Question History</h1>
      </div>

      {history.length === 0 ? (
        <Card className="text-center py-20">
          <CardContent>
            <p className="text-muted-foreground mb-4">You haven't asked any questions yet.</p>
            <Button asChild>
              <Link href="/">Ask Your First Question</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Link
              key={item.id}
              href={`/q/${item.id}?question=${encodeURIComponent(item.question)}`}
              className="block"
            >
              <Card className="hover:bg-card/80 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle className="text-lg">{item.question}</CardTitle>
                      <CardDescription className="mt-2 text-sm">
                        {item.goldenTruthAnswer.length > 100
                          ? `${item.goldenTruthAnswer.substring(0, 100)}...`
                          : item.goldenTruthAnswer}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-xs text-muted-foreground flex-shrink-0">
                      <span>
                        {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                      </span>
                      <div className="flex items-center gap-1" title={item.confidenceLabel}>
                        {getConfidenceIcon(item.confidenceLabel)}
                        <span className={cn(
                            "font-semibold",
                             item.confidenceLabel.toLowerCase().includes('strong') && "text-green-600",
                             item.confidenceLabel.toLowerCase().includes('partial') && "text-yellow-600",
                             !item.confidenceLabel.toLowerCase().includes('strong') && !item.confidenceLabel.toLowerCase().includes('partial') && "text-red-600",
                        )}>
                            {item.confidenceLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
