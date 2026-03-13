import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { PROMPT_TEMPLATES } from '../constants/prompts';
import { BookOpen, Brain, PenTool } from 'lucide-react';

// Lazy load tools
const Chat = lazy(() => import('../tools/Chat'));
const StudyMode = lazy(() => import('../tools/StudyMode'));
const QuizGenerator = lazy(() => import('../tools/ToolInterface')); 
const FlashcardGenerator = lazy(() => import('../tools/FlashcardGenerator'));
const AssignmentWriter = lazy(() => import('../tools/ToolInterface'));
const CodeHelper = lazy(() => import('../tools/CodeHelper'));
const LectureNotesGenerator = lazy(() => import('../tools/LectureNotesGenerator'));
const ExamGenerator = lazy(() => import('../tools/ExamGenerator'));
const CitationGenerator = lazy(() => import('../tools/CitationGenerator'));

interface ToolRouterProps {
  toolId: string;
}

export default function ToolRouter({ toolId }: ToolRouterProps) {
  const renderTool = () => {
    switch (toolId) {
      case 'chat':
        return <Chat />;
      case 'study':
        return <StudyMode template={PROMPT_TEMPLATES.study} />;
      case 'quiz':
        return (
          <QuizGenerator 
            title="AI Quiz Generator"
            description="Generate practice questions to test your knowledge."
            placeholder="Enter a topic (e.g., Database Normalization)"
            icon={Brain}
            template={PROMPT_TEMPLATES.quiz}
          />
        );
      case 'flashcards':
        return <FlashcardGenerator template={PROMPT_TEMPLATES.flashcards} />;
      case 'homework':
      case 'assignment':
        return (
          <AssignmentWriter 
            title="AI Assignment Writer"
            description="Get structured academic answers for your assignments."
            placeholder="Enter your question here..."
            icon={PenTool}
            template={PROMPT_TEMPLATES.homework}
            isTextArea
          />
        );
      case 'code':
        return <CodeHelper template={PROMPT_TEMPLATES.codeHelper} />;
      case 'lecture':
        return <LectureNotesGenerator />;
      case 'exam':
        return <ExamGenerator template={PROMPT_TEMPLATES.exam} />;
      case 'citation':
        return <CitationGenerator />;
      case 'notes':
        return (
          <QuizGenerator 
            title="AI Notes Generator"
            description="Transform any topic into structured study notes."
            placeholder="Enter a topic (e.g., Operating System Scheduling)"
            icon={BookOpen}
            template={PROMPT_TEMPLATES.notes}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center p-12 text-center opacity-50">
            <h2 className="text-xl font-bold">Select a tool to get started</h2>
          </div>
        );
    }
  };

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner className="min-h-[400px]" />}>
        {renderTool()}
      </Suspense>
    </ErrorBoundary>
  );
}
