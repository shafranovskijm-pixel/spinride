import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { mockProducts } from "@/data/mock-products";
import { Product } from "@/types/shop";
import { cn } from "@/lib/utils";

interface QuizOption {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

interface QuizStep {
  id: string;
  question: string;
  subtitle?: string;
  options: QuizOption[];
  multiSelect?: boolean;
}

const quizSteps: QuizStep[] = [
  {
    id: "rider",
    question: "Для кого выбираете?",
    subtitle: "Выберите, кто будет кататься",
    options: [
      { id: "adult", label: "Взрослый", icon: "🧑", description: "От 14 лет" },
      { id: "teen", label: "Подросток", icon: "🧒", description: "10-14 лет" },
      { id: "child", label: "Ребёнок", icon: "👶", description: "До 10 лет" },
    ],
  },
  {
    id: "purpose",
    question: "Для чего будете использовать?",
    subtitle: "Можно выбрать несколько",
    multiSelect: true,
    options: [
      { id: "city", label: "Город", icon: "🏙️", description: "Поездки по городу" },
      { id: "nature", label: "Природа", icon: "🌲", description: "Бездорожье, лес, горы" },
      { id: "tricks", label: "Трюки", icon: "🔥", description: "BMX, скейт-парк" },
      { id: "fitness", label: "Фитнес", icon: "💪", description: "Спортивные тренировки" },
    ],
  },
  {
    id: "experience",
    question: "Какой у вас опыт катания?",
    options: [
      { id: "beginner", label: "Новичок", icon: "🌱", description: "Только учусь" },
      { id: "intermediate", label: "Средний", icon: "⭐", description: "Катаюсь периодически" },
      { id: "advanced", label: "Продвинутый", icon: "🏆", description: "Опытный райдер" },
    ],
  },
  {
    id: "budget",
    question: "Какой у вас бюджет?",
    subtitle: "Выберите ценовой диапазон",
    options: [
      { id: "economy", label: "До 15 000 ₽", icon: "💰", description: "Эконом" },
      { id: "standard", label: "15 000 — 35 000 ₽", icon: "💳", description: "Стандарт" },
      { id: "premium", label: "35 000 — 60 000 ₽", icon: "💎", description: "Премиум" },
      { id: "pro", label: "От 60 000 ₽", icon: "🚀", description: "Профессионал" },
    ],
  },
  {
    id: "priority",
    question: "Что для вас важнее всего?",
    options: [
      { id: "price", label: "Низкая цена", icon: "🏷️", description: "Главное — экономия" },
      { id: "quality", label: "Качество", icon: "✨", description: "Надёжность и комфорт" },
      { id: "style", label: "Дизайн", icon: "🎨", description: "Стильный внешний вид" },
      { id: "features", label: "Функции", icon: "⚙️", description: "Технические характеристики" },
    ],
  },
];

type Answers = Record<string, string | string[]>;

function getRecommendations(answers: Answers): Product[] {
  let products = [...mockProducts];

  // Filter by rider type
  if (answers.rider === "child") {
    products = products.filter(
      (p) => p.category_id === "kids" || p.name.toLowerCase().includes("детск")
    );
  }

  // Filter by purpose
  const purposes = answers.purpose as string[];
  if (purposes?.includes("tricks")) {
    products = products.filter(
      (p) => p.category_id === "bmx" || p.name.toLowerCase().includes("bmx")
    );
  }

  // Filter by budget
  const budgetRanges: Record<string, [number, number]> = {
    economy: [0, 15000],
    standard: [15000, 35000],
    premium: [35000, 60000],
    pro: [60000, Infinity],
  };
  
  const range = budgetRanges[answers.budget as string];
  if (range) {
    products = products.filter((p) => {
      const price = p.sale_price ?? p.price;
      return price >= range[0] && price <= range[1];
    });
  }

  // Sort by rating and featured
  products.sort((a, b) => {
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
    return b.rating_average - a.rating_average;
  });

  // If no exact matches, return top rated products
  if (products.length === 0) {
    products = [...mockProducts]
      .sort((a, b) => b.rating_average - a.rating_average)
      .slice(0, 4);
  }

  return products.slice(0, 4);
}

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);

  const step = quizSteps[currentStep];
  const progress = ((currentStep + 1) / quizSteps.length) * 100;
  const isLastStep = currentStep === quizSteps.length - 1;

  const currentAnswer = answers[step?.id];
  const hasAnswer = step?.multiSelect
    ? (currentAnswer as string[])?.length > 0
    : !!currentAnswer;

  const handleSelect = (optionId: string) => {
    if (step.multiSelect) {
      const current = (answers[step.id] as string[]) || [];
      const newValue = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      setAnswers({ ...answers, [step.id]: newValue });
    } else {
      setAnswers({ ...answers, [step.id]: optionId });
      // Auto-advance for single select
      setTimeout(() => {
        if (!isLastStep) {
          setCurrentStep(currentStep + 1);
        }
      }, 300);
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      setShowResults(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  };

  const isSelected = (optionId: string) => {
    if (step?.multiSelect) {
      return (currentAnswer as string[])?.includes(optionId);
    }
    return currentAnswer === optionId;
  };

  // Results screen
  if (showResults) {
    const recommendations = getRecommendations(answers);

    return (
      <ShopLayout>
        <div className="container-shop py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <Check className="h-10 w-10 text-secondary-foreground" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Мы подобрали для вас!
            </h1>
            <p className="text-muted-foreground">
              На основе ваших ответов мы нашли {recommendations.length} подходящих вариантов
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            {recommendations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={handleRestart}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Пройти заново
            </Button>
            <Button asChild>
              <Link to="/catalog">
                Смотреть весь каталог
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </ShopLayout>
    );
  }

  // Quiz screen
  return (
    <ShopLayout>
      <div className="container-shop py-8 max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Шаг {currentStep + 1} из {quizSteps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">{step.options[0]?.icon.split("")[0] === "🧑" ? "🎯" : "🚴"}</span>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{step.question}</h1>
          {step.subtitle && (
            <p className="text-muted-foreground">{step.subtitle}</p>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {step.options.map((option) => (
            <Card
              key={option.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                isSelected(option.id) && "ring-2 ring-primary bg-primary/5"
              )}
              onClick={() => handleSelect(option.id)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  )}
                </div>
                {isSelected(option.id) && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          
          {step.multiSelect && (
            <Button
              onClick={handleNext}
              disabled={!hasAnswer}
            >
              {isLastStep ? "Показать результаты" : "Далее"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
          
          {!step.multiSelect && isLastStep && hasAnswer && (
            <Button onClick={handleNext}>
              Показать результаты
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </ShopLayout>
  );
}
