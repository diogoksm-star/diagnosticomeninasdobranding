import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LogOut, Search, Users, RefreshCw, Download } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  answers: number[];
  total_score: number;
  result_id: string;
  result_title: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  created_at: string;
}

const resultBadgeStyles: Record<string, string> = {
  invisivel: "bg-destructive/10 text-destructive border-destructive/30",
  notado: "bg-accent/10 text-accent border-accent/30",
  diferenciado: "bg-primary/10 text-primary border-primary/30",
};

const resultEmojis: Record<string, string> = {
  invisivel: "🔴",
  notado: "🟠",
  diferenciado: "🟢",
};

const CRM = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterResult, setFilterResult] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      // Check admin role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      const hasAdmin = roles?.some((r: { role: string }) => r.role === "admin");
      if (!hasAdmin) {
        await supabase.auth.signOut();
        navigate("/login");
        return;
      }

      setIsAdmin(true);
      setCheckingAuth(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLeads(data as Lead[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchLeads();
  }, [isAdmin]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const exportToCSV = () => {
    const escapeCSV = (val: string) => {
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const headers = ["Nome", "Email", "WhatsApp", "Resultado", "Pontuação", "Respostas", "UTM Source", "UTM Medium", "UTM Campaign", "Data"];
    const rows = filteredLeads.map((lead) => [
      escapeCSV(lead.name),
      escapeCSV(lead.email),
      escapeCSV(lead.whatsapp),
      escapeCSV(lead.result_title),
      String(lead.total_score),
      `"${(lead.answers || []).join(", ")}"`,
      escapeCSV(lead.utm_source || ""),
      escapeCSV(lead.utm_medium || ""),
      escapeCSV(lead.utm_campaign || ""),
      new Date(lead.created_at).toLocaleDateString("pt-BR"),
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      !search ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.whatsapp.includes(search);

    const matchesFilter = !filterResult || lead.result_id === filterResult;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: leads.length,
    invisivel: leads.filter((l) => l.result_id === "invisivel").length,
    notado: leads.filter((l) => l.result_id === "notado").length,
    diferenciado: leads.filter((l) => l.result_id === "diferenciado").length,
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-secondary">CRM - Leads do Quiz</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-secondary">{stats.total}</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-sm text-muted-foreground">🔴 Invisível</p>
            <p className="text-2xl font-bold text-destructive">{stats.invisivel}</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-sm text-muted-foreground">🟠 Notado</p>
            <p className="text-2xl font-bold text-accent">{stats.notado}</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-sm text-muted-foreground">🟢 Diferenciado</p>
            <p className="text-2xl font-bold text-primary">{stats.diferenciado}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou WhatsApp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-xl pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterResult === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterResult("")}
              className="rounded-full"
            >
              Todos
            </Button>
            <Button
              variant={filterResult === "invisivel" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterResult("invisivel")}
              className="rounded-full"
            >
              🔴
            </Button>
            <Button
              variant={filterResult === "notado" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterResult("notado")}
              className="rounded-full"
            >
              🟠
            </Button>
            <Button
              variant={filterResult === "diferenciado" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterResult("diferenciado")}
              className="rounded-full"
            >
              🟢
            </Button>
            <Button variant="outline" size="sm" onClick={fetchLeads} className="rounded-full">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV} className="rounded-full">
              <Download className="mr-1 h-4 w-4" />
              CSV
            </Button>
          </div>
        </div>

        {/* Leads Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Nenhum lead encontrado
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Nome</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">E-mail</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">WhatsApp</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Resultado</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Pontuação</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Respostas</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">UTM</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Data</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-secondary">{lead.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{lead.email}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {lead.whatsapp}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={resultBadgeStyles[lead.result_id] || ""}
                      >
                        {resultEmojis[lead.result_id]} {lead.result_title}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      {lead.total_score}/65
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {lead.answers?.join(", ")}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {[lead.utm_source, lead.utm_medium, lead.utm_campaign]
                        .filter(Boolean)
                        .join(" / ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default CRM;
