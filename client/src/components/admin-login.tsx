import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Credenciais fixas para o admin
    const adminEmail = "contato@rotacaicara.com.br";
    const adminPassword = "6yh7uj";

    // Adicionar logs para debug
    console.log("Email digitado:", email);
    console.log("Email esperado:", adminEmail);
    console.log("Senha digitada:", password);
    console.log("Senha esperada:", adminPassword);
    console.log("Email match:", email.trim().toLowerCase() === adminEmail.toLowerCase());
    console.log("Password match:", password === adminPassword);

    if (email.trim().toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
      // Salva o estado de login no localStorage
      localStorage.setItem("adminLoggedIn", "true");
      onLogin();
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo!",
      });
    } else {
      toast({
        title: "Erro de autenticação",
        description: "Email ou senha incorretos. Tente novamente.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Lock className="w-6 h-6 text-petroleo" />
            Acesso Admin
          </CardTitle>
          <p className="text-gray-600">Entre com suas credenciais para acessar o painel</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-petroleo hover:bg-petroleo-dark"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}