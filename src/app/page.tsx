import { QuestionForm } from '@/components/thoth/question-form';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-primary">
          Thoth
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Ask multiple frontier AI models the same question. When they agree, get a{' '}
          <span className="font-semibold text-foreground">
            single golden truth answer
          </span>
          .
        </p>
        <div className="mt-12">
          <QuestionForm />
        </div>
      </div>
    </div>
  );
}
