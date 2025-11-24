'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const GUEST_CHAR_LIMIT = 170;

export function QuestionForm() {
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const charCount = question.length;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim()) {
      toast({
        title: 'Empty Question',
        description: 'Please enter a question to get a golden truth answer.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);
    const questionId = Date.now().toString();
    router.push(`/q/${questionId}?question=${encodeURIComponent(question)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="relative">
        <Input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={GUEST_CHAR_LIMIT}
          className="h-14 pl-4 pr-28 text-lg"
          aria-label="Ask a question"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          size="lg"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          disabled={isSubmitting || !question.trim()}
          aria-label="Submit question"
        >
          {isSubmitting ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              <span>Ask</span>
              <ArrowRight />
            </>
          )}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-2 text-right">
        {charCount} / {GUEST_CHAR_LIMIT}
      </p>
    </form>
  );
}
