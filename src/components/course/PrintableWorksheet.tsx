import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer, X, CheckSquare, PenLine, Target, Lightbulb } from "lucide-react";

interface PrintableWorksheetProps {
  lesson: {
    title: string;
    subtitle: string;
    weekNumber: number;
    description: string;
    modules: {
      title: string;
      content: string[];
      keyStats?: string[];
    }[];
    quizQuestions: {
      question: string;
      options: string[];
    }[];
    reflectionPrompts: string[];
    practicalExercise: {
      title: string;
      steps: string[];
    };
  };
  onClose: () => void;
}

const PrintableWorksheet = ({ lesson, onClose }: PrintableWorksheetProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-auto">
      {/* Print Controls - Hidden when printing */}
      <div className="print:hidden sticky top-0 bg-background border-b p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
          <span className="text-sm text-muted-foreground">
            Preview your worksheet below
          </span>
        </div>
        <Button onClick={handlePrint} size="sm">
          <Printer className="w-4 h-4 mr-2" />
          Print / Save as PDF
        </Button>
      </div>

      {/* Printable Content */}
      <div ref={printRef} className="max-w-4xl mx-auto p-8 print:p-6 print:max-w-none">
        {/* Header */}
        <div className="border-b-2 border-primary pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary">Recovery & Wealth • Week {lesson.weekNumber}</p>
              <h1 className="text-2xl font-bold mt-1">{lesson.title}</h1>
              <p className="text-muted-foreground">{lesson.subtitle}</p>
            </div>
            <div className="text-right print:block hidden">
              <p className="text-sm text-muted-foreground">Date: ________________</p>
            </div>
          </div>
        </div>

        {/* Overview */}
        <section className="mb-8">
          <p className="text-base leading-relaxed bg-muted/50 p-4 rounded-lg print:bg-muted/20">
            {lesson.description}
          </p>
        </section>

        {/* Key Concepts Summary */}
        <section className="mb-8">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-primary">
            <Target className="w-5 h-5" />
            Key Concepts
          </h2>
          {lesson.modules.map((module, idx) => (
            <div key={idx} className="mb-6 break-inside-avoid">
              <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                {module.title}
              </h3>
              <ul className="space-y-1 ml-8">
                {module.content.slice(0, 3).map((point, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{point.length > 150 ? point.substring(0, 150) + "..." : point}</span>
                  </li>
                ))}
              </ul>
              {module.keyStats && module.keyStats.length > 0 && (
                <div className="mt-2 ml-8 p-2 bg-primary/5 rounded text-xs print:bg-muted/20">
                  <strong>Key Stats:</strong> {module.keyStats.join(" • ")}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Reflection Section */}
        <section className="mb-8 break-inside-avoid">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-primary">
            <PenLine className="w-5 h-5" />
            Personal Reflection
          </h2>
          <div className="space-y-6">
            {lesson.reflectionPrompts.map((prompt, idx) => (
              <div key={idx} className="break-inside-avoid">
                <p className="text-sm font-medium mb-2">{idx + 1}. {prompt}</p>
                <div className="border-b border-dashed border-muted-foreground/30 h-16 print:h-20"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Quiz Questions Section */}
        <section className="mb-8 break-inside-avoid">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-primary">
            <CheckSquare className="w-5 h-5" />
            Knowledge Check
          </h2>
          <div className="space-y-6">
            {lesson.quizQuestions.slice(0, 3).map((q, idx) => (
              <div key={idx} className="break-inside-avoid">
                <p className="text-sm font-medium mb-2">{idx + 1}. {q.question}</p>
                <div className="grid grid-cols-2 gap-2 ml-4">
                  {q.options.map((option, optIdx) => (
                    <label key={optIdx} className="flex items-center gap-2 text-sm">
                      <span className="w-4 h-4 border border-muted-foreground/50 rounded-sm flex-shrink-0"></span>
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Action Steps */}
        <section className="mb-8 break-inside-avoid">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-primary">
            <Lightbulb className="w-5 h-5" />
            {lesson.practicalExercise.title}
          </h2>
          <div className="space-y-3">
            {lesson.practicalExercise.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="w-5 h-5 border-2 border-primary rounded flex-shrink-0 mt-0.5"></span>
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Notes Section */}
        <section className="break-inside-avoid">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-primary">
            <PenLine className="w-5 h-5" />
            Additional Notes
          </h2>
          <div className="border border-dashed border-muted-foreground/30 rounded-lg h-32 print:h-40"></div>
        </section>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground print:mt-12">
          <p>Recovery & Wealth • Sober Money Mindset Program</p>
          <p className="mt-1">www.recovery-and-wealth.lovable.app</p>
        </footer>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          #printable-worksheet, #printable-worksheet * {
            visibility: visible;
          }
          #printable-worksheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            margin: 0.75in;
            size: letter;
          }
          .break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintableWorksheet;
