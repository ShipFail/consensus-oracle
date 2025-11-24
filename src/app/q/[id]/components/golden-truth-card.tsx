import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type GoldenTruthCardProps = {
  question: string;
  goldenTruthAnswer: string;
  timestamp: string;
  confidenceLabel: string;
};

const isDisagreement = (label: string) =>
  label.toLowerCase().includes('disagree') ||
  label.toLowerCase().includes('not enough');

export function GoldenTruthCard({
  question,
  goldenTruthAnswer,
  timestamp,
  confidenceLabel,
}: GoldenTruthCardProps) {
  const disagreement = isDisagreement(confidenceLabel);

  return (
    <Card
      className={cn(
        'border-2 shadow-lg',
        disagreement
          ? 'border-muted'
          : 'border-accent'
      )}
    >
      <CardHeader>
        <CardDescription className="text-sm">Question</CardDescription>
        <CardTitle className="text-2xl md:text-3xl font-headline">
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'p-6 rounded-lg',
            disagreement
              ? 'bg-secondary'
              : 'bg-accent/20'
          )}
        >
          <p className="text-lg md:text-xl text-foreground/90">
            {goldenTruthAnswer}
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-right">
          Answer generated on {format(new Date(timestamp), 'yyyy-MM-dd HH:mm')} UTC
        </p>
      </CardContent>
    </Card>
  );
}
