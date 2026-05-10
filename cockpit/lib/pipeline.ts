export type EventoStage = "ideia" | "confirmando" | "confirmado" | "divulgacao" | "execucao" | "fechado";
export type PropostaStage = "brief" | "orcamento" | "enviado" | "fechado" | "perdido";

export type EventoCard = {
  id: string;
  title: string;
  date: string;
  stage: EventoStage;
  atracao: string;
  cover: number;
  lead: string;
  detail?: string;
};

export type PropostaCard = {
  id: string;
  cliente: string;
  tipo: "casamento" | "aniversario" | "empresarial" | "outro";
  stage: PropostaStage;
  valor: number | null;
  contato: string;
  ultimo_update: string;
};

export type Financeiro = {
  caixa: { valor: number; trend: string };
  a_receber: { valor: number; venc_semana: number };
  a_pagar: { valor: number; venc_semana: number };
  atualizado: string;
};

export type PipelineSnapshot = {
  financeiro: Financeiro;
  eventos: EventoCard[];
  propostas: PropostaCard[];
};

export const EVENTO_STAGES: { id: EventoStage; label: string }[] = [
  { id: "ideia",       label: "Ideia" },
  { id: "confirmando", label: "Confirmando" },
  { id: "confirmado",  label: "Confirmado" },
  { id: "divulgacao",  label: "Divulgação" },
  { id: "execucao",    label: "Execução" },
  { id: "fechado",     label: "Fechado" },
];

export const PROPOSTA_STAGES: { id: PropostaStage; label: string }[] = [
  { id: "brief",     label: "Brief" },
  { id: "orcamento", label: "Orçamento" },
  { id: "enviado",   label: "Enviado" },
  { id: "fechado",   label: "Fechado" },
  { id: "perdido",   label: "Perdido" },
];

export function fmtBRL(n: number): string {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}
