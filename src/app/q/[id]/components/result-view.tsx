import { getThothAnswer } from '@/lib/thoth-ai';
import { GoldenTruthCard } from './golden-truth-card';
import { ConfidenceMeter } from './confidence-meter';
import { ModelAnswers } from './model-answers';
import { ShareSection } from './share-section';
import { SaveToHistory } from './save-to-history';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type ResultViewProps = {
  question: string;
  id: string;
};

export async function ResultView({ question, id }: ResultViewProps) {
  const result = await getThothAnswer(question, id);

  return (
    <div className="flex flex-col gap-8">
      <SaveToHistory result={result} />
      <GoldenTruthCard
        question={result.question}
        goldenTruthAnswer={result.goldenTruthAnswer}
        timestamp={result.timestamp}
        confidenceLabel={result.confidenceLabel}
      />
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1 flex flex-col gap-4 sticky top-20">
          <ConfidenceMeter
            score={result.confidenceScore}
            label={result.confidenceLabel}
          />
          <ShareSection />
           <Button asChild variant="outline">
            <Link href="/">Ask Another Question</Link>
          </Button>
        </div>
        <div className="md:col-span-2">
          <ModelAnswers
            modelAnswers={result.modelAnswers}
            summary={result.summary}
          />
        </div>
      </div>
    </div>
  );
}
