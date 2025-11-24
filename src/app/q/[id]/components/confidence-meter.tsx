import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ConfidenceMeterProps = {
  score: number;
  label: string;
};

const getConfidenceDetails = (
  label: string
): { Icon: LucideIcon; color: string; description: string } => {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('strong')) {
    return {
      Icon: CheckCircle2,
      color: 'text-green-500',
      description:
        'Several strong models gave essentially the same answer. This is a high-confidence golden truth answer.',
    };
  }
  if (lowerLabel.includes('partial')) {
    return {
      Icon: AlertCircle,
      color: 'text-yellow-500',
      description:
        'Models overlap but differ in details. Treat this as a plausible answer and use judgment.',
    };
  }
  return {
    Icon: XCircle,
    color: 'text-red-500',
    description:
      'Models gave noticeably different answers. Thoth cannot surface a single truth here.',
  };
};

export function ConfidenceMeter({ score, label }: ConfidenceMeterProps) {
  const { Icon, color, description } = getConfidenceDetails(label);
  const percentage = Math.round(score * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Truth Confidence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Icon className={cn('h-8 w-8', color)} />
          <div className="flex-1">
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-semibold text-foreground">{label}</span>
              <span className="font-mono text-lg font-bold">{percentage}%</span>
            </div>
            <Progress value={percentage} aria-label={`Confidence: ${percentage}%`} />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
