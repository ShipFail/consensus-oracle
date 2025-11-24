import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { ModelAnswer } from '@/lib/types';

type ModelAnswersProps = {
  modelAnswers: ModelAnswer[];
  summary: string;
};

export function ModelAnswers({ modelAnswers, summary }: ModelAnswersProps) {
  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg">Model Agreement Summary</CardTitle>
        <p className="text-muted-foreground pt-2">{summary}</p>
      </CardHeader>
      <CardContent>
        <Separator className="my-4" />
        <h3 className="text-base font-semibold mb-4 text-foreground">
          Individual Model Votes
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modelAnswers.map((model) => (
            <Card key={model.modelName} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-primary">
                  {model.modelName}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-foreground/80">{model.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
