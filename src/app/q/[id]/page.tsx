import { Suspense } from 'react';
import { ResultView } from './components/result-view';
import Loading from './loading';

type QuestionPageProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function QuestionPage({
  params,
  searchParams,
}: QuestionPageProps) {
  const question = Array.isArray(searchParams.question)
    ? searchParams.question[0]
    : searchParams.question;

  if (!question) {
    return (
      <div className="container mx-auto max-w-5xl flex-1 p-4 text-center">
        <h1 className="text-2xl font-bold">Question not found</h1>
        <p className="text-muted-foreground">
          Please go back to the home page and ask a question.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl flex-1 p-4 md:p-8">
      <Suspense fallback={<Loading />}>
        <ResultView question={question} id={params.id} />
      </Suspense>
    </div>
  );
}
