import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CallbackState = "loading" | "success" | "error";

export default function CallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<CallbackState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      // Check for error in URL params (OAuth error)
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        setState("error");
        setErrorMessage(
          errorDescription || 
          getErrorMessage(error)
        );
        return;
      }

      // Listen for auth state change
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "SIGNED_IN" && session) {
            setState("success");
            // Small delay to show success state
            setTimeout(() => {
              navigate("/", { replace: true });
            }, 1000);
          } else if (event === "TOKEN_REFRESHED") {
            // Token refreshed, user is authenticated
            setState("success");
            setTimeout(() => {
              navigate("/", { replace: true });
            }, 1000);
          }
        }
      );

      // Check if already authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setState("error");
        setErrorMessage(sessionError.message);
        subscription.unsubscribe();
        return;
      }

      if (session) {
        setState("success");
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
        subscription.unsubscribe();
        return;
      }

      // Set a timeout for the callback
      const timeout = setTimeout(() => {
        setState("error");
        setErrorMessage("Время ожидания истекло. Попробуйте войти снова.");
        subscription.unsubscribe();
      }, 30000); // 30 second timeout

      return () => {
        clearTimeout(timeout);
        subscription.unsubscribe();
      };
    };

    handleCallback();
  }, [navigate, searchParams]);

  const getErrorMessage = (error: string): string => {
    const errorMessages: Record<string, string> = {
      "access_denied": "Доступ был отклонён. Попробуйте снова.",
      "invalid_request": "Неверный запрос авторизации.",
      "unauthorized_client": "Приложение не авторизовано для этого действия.",
      "unsupported_response_type": "Тип ответа не поддерживается.",
      "invalid_scope": "Запрошенные разрешения недействительны.",
      "server_error": "Ошибка сервера. Попробуйте позже.",
      "temporarily_unavailable": "Сервис временно недоступен. Попробуйте позже.",
    };
    return errorMessages[error] || "Произошла ошибка при входе. Попробуйте снова.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Link to="/" className="inline-block mb-4">
            <span className="font-black text-2xl tracking-tight">
              SPIN<span className="text-primary">RIDE</span>
            </span>
          </Link>

          {state === "loading" && (
            <>
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <CardTitle className="text-2xl">Входим...</CardTitle>
              <CardDescription>
                Пожалуйста, подождите, идёт авторизация
              </CardDescription>
            </>
          )}

          {state === "success" && (
            <>
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Вход выполнен!</CardTitle>
              <CardDescription>
                Перенаправляем вас...
              </CardDescription>
            </>
          )}

          {state === "error" && (
            <>
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Ошибка входа</CardTitle>
              <CardDescription className="text-destructive">
                {errorMessage}
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-3">
          {state === "error" && (
            <>
              <Button asChild className="w-full">
                <Link to="/auth/login">Попробовать снова</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/">Вернуться в магазин</Link>
              </Button>
            </>
          )}

          {state === "loading" && (
            <p className="text-xs text-muted-foreground">
              Если страница не перенаправляется автоматически,{" "}
              <Link to="/auth/login" className="text-primary hover:underline">
                нажмите здесь
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
