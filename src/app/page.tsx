'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Brain, 
  LayoutDashboard, 
  CheckCircle, 
  Server, 
  Clock, 
  ArrowRight, 
  Lock, 
  Database, 
  Activity, 
  FileCheck, 
  Eye, 
  Globe, 
  Calendar,
  Building,
  Mail,
  User,
  Check,
  Shield,
  HelpCircle,
  Cpu,
  X,
  ChevronDown,
  Sliders
} from 'lucide-react';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import InteractiveDashboard from '../components/InteractiveDashboard';

export default function LandingPage() {
  // Modal de Agendamento
  const [modalOpen, setModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });

  // Contador regressivo simulado para auto-refresh (Features Card)
  const [refreshSeconds, setRefreshSeconds] = useState(30);

  // Estados do Simulador CVSS (Laboratório Interativo)
  const [av, setAv] = useState<'network' | 'adjacent' | 'local' | 'physical'>('network');
  const [ac, setAc] = useState<'low' | 'high'>('low');
  const [pr, setPr] = useState<'none' | 'low' | 'high'>('none');
  const [ui, setUi] = useState<'none' | 'required'>('none');
  const [isMitigating, setIsMitigating] = useState(false);
  const [mitigationDone, setMitigationDone] = useState(false);

  // Estados do FAQ Accordion
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Efeito de contagem regressiva para auto-refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshSeconds((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.company) {
      setFormSubmitted(true);
      setTimeout(() => {
        setModalOpen(false);
        setFormSubmitted(false);
        setFormData({ name: '', email: '', company: '' });
        alert('Demonstração agendada com sucesso! Nossa equipe entrará em contato em até 2 horas.');
      }, 1500);
    }
  };

  // Cálculo da pontuação CVSS v3.1 simplificada
  const calculateCVSS = () => {
    if (mitigationDone) return 0.0;

    // Valores padrão do CVSS v3.1
    const avVals = { network: 0.85, adjacent: 0.62, local: 0.55, physical: 0.20 };
    const acVals = { low: 0.77, high: 0.44 };
    const prVals = { none: 0.85, low: 0.62, high: 0.27 };
    const uiVals = { none: 0.85, required: 0.62 };

    const exploitability = 8.22 * avVals[av] * acVals[ac] * prVals[pr] * uiVals[ui];
    // Assumimos impacto fixo "Alto" para Confidencialidade, Integridade e Disponibilidade (Impacto = 5.8)
    const score = exploitability + 5.8;
    
    return parseFloat(Math.min(10.0, score).toFixed(1));
  };

  const cvssScore = calculateCVSS();

  const getCvssSeverity = (score: number) => {
    if (score === 0) return { label: 'SEGURO (Mitigado)', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/25', barColor: 'bg-emerald-500' };
    if (score >= 9.0) return { label: 'CRÍTICO', color: 'text-red-500 bg-red-500/10 border-red-500/25', barColor: 'bg-red-500' };
    if (score >= 5.0) return { label: 'ALERTA / MÉDIO', color: 'text-amber-500 bg-amber-500/10 border-amber-500/25', barColor: 'bg-amber-500' };
    return { label: 'SEGURO / BAIXO', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/25', barColor: 'bg-emerald-500' };
  };

  const severity = getCvssSeverity(cvssScore);

  const simulateMitigation = () => {
    if (isMitigating || mitigationDone) return;
    setIsMitigating(true);
    setTimeout(() => {
      setIsMitigating(false);
      setMitigationDone(true);
    }, 2000);
  };

  const resetSimulator = () => {
    setMitigationDone(false);
    setAv('network');
    setAc('low');
    setPr('none');
    setUi('none');
  };

  // Perguntas e respostas do FAQ
  const faqData = [
    {
      q: "Como o NetSentinel protege meus dados locais em conformidade com a LGPD?",
      a: "O NetSentinel coleta apenas metadados técnicos dos computadores da rede (nomes de processos, versões de executáveis, sistemas operacionais e logs de portas). Não coletamos, lemos ou transferimos dados pessoais de usuários, arquivos de documentos ou qualquer dado sensível. A comunicação com o servidor é criptografada de ponta a ponta e os dados de inventário são guardados localmente na rede da empresa."
    },
    {
      q: "Qual é o consumo médio de recursos do agente nas estações finais?",
      a: "Nossos agentes foram desenvolvidos em linguagem de baixo nível (Rust/C++) e se comunicam via gRPC streaming leve. O consumo médio de memória RAM fica abaixo de 15MB e a utilização da CPU é inferior a 0.5% mesmo durante a varredura ativa. Não há impacto perceptível na performance da máquina do colaborador."
    },
    {
      q: "Como funciona a integração com SIEMs e ferramentas de monitoramento legadas?",
      a: "O NetSentinel possui uma API REST integrada (API-first) e suporte nativo para webhooks. Você pode exportar alertas e logs de vulnerabilidade em formato JSON estruturado direto para ferramentas como Splunk, Grafana, Zabbix, ElasticSearch ou Microsoft Sentinel sem a necessidade de scripts adicionais."
    },
    {
      q: "Como o NetSentinel cruza dados de vulnerabilidade se a internet da empresa cair?",
      a: "Nossa plataforma mantém um banco de dados local cacheado com a base de CVEs/NIST. Em caso de perda de conexão com a rede pública NVD, a verificação de criticidade do sistema continua ativa localmente utilizando a última sincronização armazenada de forma segura no servidor central corporativo."
    },
    {
      q: "Existe suporte para sistemas operacionais Linux e macOS além do Windows?",
      a: "Sim. O NetSentinel é multiplataforma. Oferecemos pacotes de instalação otimizados nativos para Windows (via instalador MSI ou política AD GPO), distribuições Linux baseadas em Debian e RedHat (RPM/DEB) e macOS (PKG assinado eletronicamente)."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      
      {/* 1. HEADER / NAVEGAÇÃO */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo showSubText={false} />

          {/* Links e Alternador de Tema */}
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-zinc-400">
              <a href="#problema-solucao" className="hover:text-brand-navy dark:hover:text-blue-400 transition-colors">O Gargalo</a>
              <a href="#features" className="hover:text-brand-navy dark:hover:text-blue-400 transition-colors">Funcionalidades</a>
              <a href="#laboratorio" className="hover:text-brand-navy dark:hover:text-blue-400 transition-colors">Simulador</a>
              <a href="#seguranca" className="hover:text-brand-navy dark:hover:text-blue-400 transition-colors">Arquitetura</a>
              <a href="#faq" className="hover:text-brand-navy dark:hover:text-blue-400 transition-colors">FAQ</a>
            </nav>
            
            <ThemeToggle />
            
            <button
              onClick={() => setModalOpen(true)}
              className="bg-brand-navy dark:bg-blue-600 hover:bg-brand-navy/90 dark:hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-md transition-all active:scale-[0.98]"
            >
              Agendar Demo
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 dark:opacity-20">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-brand-navy/10 dark:bg-zinc-800/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-6 font-mono tracking-tight">
            <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            ALINHADO AO ODS 16 DA ONU • SEGURANÇA E TRANSPARÊNCIA
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] max-w-4xl mx-auto">
            Governança Visual de Vulnerabilidades sem <span className="bg-gradient-to-r from-brand-navy to-teal-500 dark:from-blue-500 dark:to-teal-400 bg-clip-text text-transparent">Sobrecarga Cognitiva</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            O <strong>NetSentinel (SGI-PM)</strong> reduz a fadiga mental das equipes de SOC e TI. Cruzamos seus ativos de rede com a base NVD/NIST em tempo real através de uma interface desenhada sob princípios rígidos de Interação Humano-Computador.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-navy dark:bg-blue-600 hover:bg-brand-navy/95 dark:hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-lg text-sm shadow-lg hover:shadow-brand-navy/20 dark:hover:shadow-blue-500/10 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Agendar Demonstração</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-zinc-950 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-700 dark:text-zinc-300 font-semibold px-8 py-3.5 rounded-lg text-sm border border-slate-200 dark:border-zinc-800 transition-all"
            >
              Conhecer Recursos
            </a>
          </div>

          {/* MOCKUP INTERATIVO (O painel real recriado) */}
          <div className="mt-16 lg:mt-24 border border-slate-200 dark:border-zinc-900 rounded-2xl p-1 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-sm shadow-2xl relative">
            <div className="absolute -top-3 left-6 bg-brand-navy dark:bg-blue-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
              Demonstração ao Vivo Interativa
            </div>
            
            <InteractiveDashboard />
          </div>
        </div>
      </section>

      {/* 3. PROBLEM & SOLUTION (O GARGALO) */}
      <section id="problema-solucao" className="py-20 lg:py-28 bg-white dark:bg-zinc-950 border-y border-slate-200 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <h2 className="text-xs font-bold tracking-widest text-brand-navy dark:text-blue-500 uppercase font-mono">
              O Desafio do Administrador de TI
            </h2>
            <p className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Por que a maioria das ferramentas de Patch Management falha?
            </p>
            <p className="mt-4 text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
              O volume excessivo de relatórios brutos e logs sem priorização causa a chamada "fadiga de alertas", deixando brechas abertas para Ransomwares e cavalos de troia corporativos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* O Gargalo */}
            <div className="bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-900 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 text-red-500 rounded-xl flex items-center justify-center mb-6">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">O Gargalo dos Dados Brutos</h3>
                <p className="text-xs text-red-600 dark:text-red-400 font-mono mt-1 font-bold">FADIGA COGNITIVA & SEGURANÇA REATIVA</p>
                
                <ul className="mt-8 space-y-4 text-sm text-slate-600 dark:text-zinc-400">
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold mt-0.5">•</span>
                    <span><strong>Excesso de ruído:</strong> Milhares de linhas de logs de vulnerabilidade não correlacionadas que paralisam o time de análise.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold mt-0.5">•</span>
                    <span><strong>Shadow IT desprotegido:</strong> Falta de visibilidade em tempo real sobre softwares instalados localmente.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold mt-0.5">•</span>
                    <span><strong>Falta de Contexto CVSS:</strong> Dificuldade em diferenciar qual vulnerabilidade é realmente explorável na sua infraestrutura.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-zinc-900 text-xs font-mono text-slate-400 dark:text-zinc-600">
                Resultado: Janela de exposição média de 45 dias para novas ameaças críticas.
              </div>
            </div>

            {/* A Solução NetSentinel */}
            <div className="bg-slate-50 dark:bg-black border border-brand-navy/30 dark:border-blue-900/30 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-lg">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-500/10 dark:from-teal-500/5 to-transparent pointer-events-none"></div>
              
              <div>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>A Resposta NetSentinel</span>
                  <span className="text-[10px] bg-teal-500/15 text-teal-600 dark:text-teal-400 font-mono font-bold px-2 py-0.5 rounded-full">SGI-PM</span>
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mt-1 font-bold">INTERAÇÃO HUMANO-COMPUTADOR (IHC)</p>

                <ul className="mt-8 space-y-4 text-sm text-slate-600 dark:text-zinc-400">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Inteligência Visual Semafórica:</strong> Dashboard limpo que reduz em até 68% o tempo de varredura mental para triagem crítica (CVSS &ge; 9.0).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Sincronização NVD/NIST Direta:</strong> Varreduras automáticas em nível de agente mapeiam instantaneamente novas CVEs publicadas.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Patching Automatizado Intel:</strong> Distribuição de correções centralizada com apenas 2 cliques na interface.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-zinc-900 text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                <span>Eficiência de mitigação: &lt; 15 minutos</span>
                <span className="font-bold">ODS 16 ALINHADO</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES PRINCIPAIS */}
      <section id="features" className="py-20 lg:py-28 bg-slate-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <h2 className="text-xs font-bold tracking-widest text-brand-navy dark:text-blue-500 uppercase font-mono">
              Recursos Avançados
            </h2>
            <p className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Arquitetura voltada à tomada de decisão ágil
            </p>
            <p className="mt-4 text-base text-slate-600 dark:text-zinc-400">
              Cada pixel do NetSentinel foi projetado para evitar o estresse de informação técnica.
            </p>
          </div>

          {/* Cards das Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 - Real-time */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                    <Clock className="w-3 h-3 animate-spin" />
                    <span>REFRESH: {refreshSeconds}s</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Monitoramento em Tempo Real</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Os agentes instalados nos hosts de rede notificam o painel de forma instantânea. Nenhuma ação do usuário é necessária para ver novos computadores adicionados ou saídas de rede.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 text-[11px] font-mono text-slate-400 dark:text-zinc-500">
                Protocolo: gRPC Lightweight
              </div>
            </div>

            {/* Feature 2 - NVD/NIST integration */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 rounded-xl flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                    WORKER: 5 min
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inteligência NVD/NIST Integrada</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Conexão direta aos feeds oficiais de vulnerabilidades conhecidas (CVEs). Nossa plataforma cruza os hashes de softwares instalados localmente com a base pública continuamente.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 text-[11px] font-mono text-slate-400 dark:text-zinc-500">
                Sinc: API REST + Banco Local Offline
              </div>
            </div>

            {/* Feature 3 - Traffic Light System (Criticidade CVSS) */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-950/40 text-red-500 rounded-xl flex items-center justify-center">
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">Código Semafórico</span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Classificação Visual de Criticidade</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Redução instantânea do esforço de análise através do mapeamento intuitivo de cores:
                </p>
                
                {/* Visual Traffic Light Colors Legend */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-mono font-bold">
                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-red-500/10 text-red-500 border border-red-500/25">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span>CRÍTICO (&ge; 9.0)</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>ALERTA (5.0 - 8.9)</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>SEGURO (&lt; 5.0)</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-slate-500/10 text-slate-500 border border-slate-500/25">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span>OFFLINE</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 text-[11px] font-mono text-slate-400 dark:text-zinc-500">
                Padrão: CVSS v3.1 / v4.0
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. LABORATÓRIO INTERATIVO: SIMULADOR DE RISCO CVSS */}
      <section id="laboratorio" className="py-20 lg:py-28 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Lado Esquerdo - Controles de Simulação */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-xs font-bold tracking-widest text-brand-navy dark:text-blue-500 uppercase font-mono flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5" />
                  Laboratório NetSentinel
                </h2>
                <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Simulador de Priorização CVSS v3.1
                </h3>
                <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Interaja com os vetores oficiais do CVSS abaixo e veja o nível de urgência mudar. O NetSentinel foca na redução de carga cognitiva apresentando o risco instantaneamente.
                </p>
              </div>

              {/* Botões seletores */}
              <div className="space-y-5 mt-8">
                {/* 1. Vetor de Ataque */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold font-mono tracking-wider text-slate-500 dark:text-zinc-400 uppercase block">Vetor de Ataque (AV)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'network', label: 'Rede (Remoto)', desc: 'Explorável pela internet' },
                      { key: 'adjacent', label: 'Adjacente', desc: 'Rede Wi-Fi/local física' },
                      { key: 'local', label: 'Local', desc: 'Precisa de acesso à máquina' },
                      { key: 'physical', label: 'Físico', desc: 'Conexão física (ex: USB)' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => { setAv(item.key as any); setMitigationDone(false); }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          av === item.key 
                            ? 'bg-brand-navy/10 dark:bg-blue-600/10 border-brand-navy dark:border-blue-500 text-brand-navy dark:text-blue-400' 
                            : 'bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                        }`}
                      >
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[9px] opacity-80 leading-tight mt-0.5 font-mono">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Complexidade de Ataque */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold font-mono tracking-wider text-slate-500 dark:text-zinc-400 uppercase block">Complexidade do Ataque (AC)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'low', label: 'Baixa (AC: Low)', desc: 'Nenhuma condição especial exigida' },
                      { key: 'high', label: 'Alta (AC: High)', desc: 'Requer técnicas avançadas/timing perfeito' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => { setAc(item.key as any); setMitigationDone(false); }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          ac === item.key 
                            ? 'bg-brand-navy/10 dark:bg-blue-600/10 border-brand-navy dark:border-blue-500 text-brand-navy dark:text-blue-400' 
                            : 'bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                        }`}
                      >
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[9px] opacity-80 leading-tight mt-0.5 font-mono">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Privilégios Necessários */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold font-mono tracking-wider text-slate-500 dark:text-zinc-400 uppercase block">Privilégios Necessários (PR)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'none', label: 'Nenhum', desc: 'Atacante comum' },
                      { key: 'low', label: 'Baixo (Usuário)', desc: 'Conta não admin' },
                      { key: 'high', label: 'Alto (Admin)', desc: 'Acesso total de admin' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => { setPr(item.key as any); setMitigationDone(false); }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          pr === item.key 
                            ? 'bg-brand-navy/10 dark:bg-blue-600/10 border-brand-navy dark:border-blue-500 text-brand-navy dark:text-blue-400' 
                            : 'bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                        }`}
                      >
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[9px] opacity-80 leading-tight mt-0.5 font-mono">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Interação do Usuário */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold font-mono tracking-wider text-slate-500 dark:text-zinc-400 uppercase block">Interação do Usuário (UI)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'none', label: 'Nenhuma (UI: None)', desc: 'Ataque silencioso automático' },
                      { key: 'required', label: 'Requerida (UI: Req)', desc: 'Vítima precisa clicar/abrir' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => { setUi(item.key as any); setMitigationDone(false); }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          ui === item.key 
                            ? 'bg-brand-navy/10 dark:bg-blue-600/10 border-brand-navy dark:border-blue-500 text-brand-navy dark:text-blue-400' 
                            : 'bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                        }`}
                      >
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[9px] opacity-80 leading-tight mt-0.5 font-mono">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Lado Direito - Scorecard de Gravidade Dinâmico */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-[450px] relative overflow-hidden group shadow-lg text-center">
              
              {/* Reset simulator floating button */}
              {mitigationDone && (
                <button
                  onClick={resetSimulator}
                  className="absolute top-4 right-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded text-[9px] font-mono font-bold transition-all border border-zinc-700"
                >
                  Resetar Simulador
                </button>
              )}

              <div className="space-y-4 my-auto">
                <span className="text-[10px] font-bold font-mono tracking-widest text-slate-400 dark:text-zinc-500 uppercase block">
                  Pontuação Calculada
                </span>
                
                {/* Dial Gigante */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-4 border-slate-200 dark:border-zinc-800 shadow-inner">
                    {/* Ring bar indicating color */}
                    <div className={`absolute inset-0 rounded-full border-4 ${severity.barColor} opacity-20 animate-pulse-slow`}></div>
                    
                    <div className="flex flex-col items-center">
                      <span className="text-5xl font-extrabold font-mono tracking-tighter leading-none select-all">
                        {cvssScore.toFixed(1)}
                      </span>
                      <span className="text-[9px] font-bold font-mono text-slate-400 dark:text-zinc-500 uppercase mt-1">CVSS Base</span>
                    </div>
                  </div>

                  {/* Severity Pill */}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border mt-6 ${severity.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${severity.barColor} ${cvssScore >= 9.0 ? 'animate-ping' : ''}`}></span>
                    {severity.label}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed mt-2">
                  {cvssScore >= 9.0 
                    ? 'Esta ameaça requer atenção imediata do SOC. Pode ser explorada livremente sem privilégios.'
                    : cvssScore >= 5.0
                    ? 'Risco moderado. Agende a correção na próxima janela de manutenção remota.'
                    : cvssScore > 0.0
                    ? 'Risco baixo. O sistema de proteção está ativo e monitorando tentativas locais.'
                    : 'Nenhuma vulnerabilidade ativa identificada após a correção do agente.'}
                </p>
              </div>

              {/* Botão Simular Mitigação do NetSentinel */}
              <div className="pt-4 border-t border-slate-200 dark:border-zinc-800/80">
                {mitigationDone ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-xl flex items-center justify-center gap-2 text-emerald-500 text-xs font-semibold animate-fade-in">
                    <Check className="w-4 h-4" />
                    <span>Mitigação executada com sucesso!</span>
                  </div>
                ) : (
                  <button
                    onClick={simulateMitigation}
                    disabled={isMitigating}
                    className={`w-full font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                      isMitigating 
                        ? 'bg-slate-200 dark:bg-zinc-800 text-slate-400 cursor-not-allowed border border-slate-300 dark:border-zinc-700'
                        : 'bg-brand-navy dark:bg-blue-600 hover:bg-brand-navy/90 dark:hover:bg-blue-700 text-white active:scale-[0.98]'
                    }`}
                  >
                    {isMitigating ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                        <span>Distribuindo Patch Remoto...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        <span>Mitigar Risco com NetSentinel</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. TECH STACK & SEGURANÇA (Trust Section) */}
      <section id="seguranca" className="py-20 lg:py-28 bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Texto de Confiança */}
            <div className="lg:col-span-5">
              <h2 className="text-xs font-bold tracking-widest text-brand-navy dark:text-blue-500 uppercase font-mono">
                Homologado para TI Corporativa
              </h2>
              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Infraestrutura moderna projetada para alta segurança
              </p>
              <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Desenvolvemos o NetSentinel alinhado com as melhores práticas de governança de dados. A segurança não é uma camada extra; é a base da nossa arquitetura de microsserviços.
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-mono text-slate-800 dark:text-zinc-200">Autenticação JWT & MFA</h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-500">Controle estrito de acessos de analistas com expiração de token automática.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-mono text-slate-800 dark:text-zinc-200">Arquitetura Baseada em API</h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-500">Comunicação criptografada TLS 1.3 ponta a ponta entre agentes e painel central.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Stack Tecnológico */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl flex flex-col justify-between">
                <Lock className="w-8 h-8 text-brand-navy dark:text-blue-500 mb-4" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Criptografia Local</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">Dados de inventário de rede armazenados com criptografia AES-256 em repouso nos servidores locais.</p>
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl flex flex-col justify-between">
                <Server className="w-8 h-8 text-emerald-500 mb-4" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">API-First</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">Fácil integração com ferramentas de monitoramento e SIEM corporativos (Splunk, Zabbix).</p>
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl flex flex-col justify-between">
                <FileCheck className="w-8 h-8 text-amber-500 mb-4" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Conformidade Legal</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">Mapeamento de riscos e relatórios prontos para LGPD, GDPR e auditorias ISO 27001.</p>
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl flex flex-col justify-between">
                <Cpu className="w-8 h-8 text-purple-500 mb-4" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Agente Ultraleve</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">Consumo de menos de 15MB de memória e &lt; 0.5% de CPU nos hosts finais monitorados.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. ONU ODS 16 SPOTLIGHT SECTION */}
      <section id="ods16" className="py-20 lg:py-24 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-zinc-950 border-t border-slate-200 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-emerald-950/10 dark:bg-emerald-950/5 border border-emerald-500/20 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-8 justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="max-w-2xl flex-1">
              <div className="inline-flex items-center gap-1 bg-emerald-500 text-white font-mono font-bold text-[9px] px-2 py-0.5 rounded mb-4">
                ONU ODS 16
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Compromisso com a Transparência Institucional e Proteção de Dados
              </h3>
              <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Ao mapear vulnerabilidades e garantir o Patch Management ágil, o NetSentinel contribui ativamente para o **Objetivo de Desenvolvimento Sustentável 16 da ONU (Paz, Justiça e Instituições Eficazes)**. Proteger a integridade da infraestrutura cibernética pública e privada combate a espionagem comercial, sequestros de dados (Ransomwares) e fortalece a confiança nas instituições.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Proteção Contra Trojans</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Transparência Cibernética</span>
                </div>
              </div>
            </div>
            
            <div className="w-36 h-36 bg-emerald-500/10 dark:bg-emerald-500/5 border-2 border-emerald-500/30 rounded-2xl flex flex-col items-center justify-center text-center p-4 relative group shadow-sm flex-shrink-0">
              <Globe className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mb-2 animate-pulse" />
              <span className="font-mono text-[9px] font-bold text-slate-800 dark:text-zinc-300 leading-tight">ODS 16 da ONU</span>
              <span className="font-sans text-[7px] text-slate-500 dark:text-zinc-500 mt-1 uppercase font-semibold">Paz e Instituições Fortes</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SEÇÃO FAQ ACCORDION (NOVA MELHORIA) */}
      <section id="faq" className="py-20 lg:py-28 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-widest text-brand-navy dark:text-blue-500 uppercase font-mono flex items-center justify-center gap-2">
              <HelpCircle className="w-4 h-4 animate-bounce" />
              FAQ Corporativo
            </h2>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Perguntas Frequentes de TI e Segurança
            </p>
            <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400">
              Respostas diretas sobre conformidade, desempenho e infraestrutura de patch management.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((item, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 dark:border-zinc-800 rounded-2xl bg-slate-50 dark:bg-zinc-900/20 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="text-sm font-bold text-slate-800 dark:text-zinc-200 hover:text-brand-navy dark:hover:text-blue-400 transition-colors">
                      {item.q}
                    </span>
                    <ChevronDown 
                      className={`w-4 h-4 text-slate-400 transition-transform duration-300 flex-shrink-0 ml-4 ${
                        isOpen ? 'rotate-180 text-brand-navy dark:text-blue-400' : ''
                      }`} 
                    />
                  </button>

                  {/* FAQ Answer (Smooth Accordion Slide animation) */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-56 border-t border-slate-200 dark:border-zinc-800' : 'max-h-0'
                    }`}
                  >
                    <p className="px-6 py-5 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed bg-white dark:bg-black/40">
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-white dark:bg-black border-t border-slate-200 dark:border-zinc-900 py-12 text-xs text-slate-500 dark:text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-slate-200 dark:border-zinc-900">
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
              <Logo showSubText={true} subText="SEcurity Operations Center - Patch Managemente & Vulnerability Intelligence" />
              <p className="mt-1 text-[11px] max-w-sm">
                Plataforma de Patch Management e Governança de Vulnerabilidades baseada em IHC para redução de fadiga de SOC.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 font-semibold">
              <a href="#problema-solucao" className="hover:text-slate-700 dark:hover:text-zinc-300 transition-colors">O Gargalo</a>
              <a href="#features" className="hover:text-slate-700 dark:hover:text-zinc-300 transition-colors">Recursos</a>
              <a href="#laboratorio" className="hover:text-slate-700 dark:hover:text-zinc-300 transition-colors">Simulador</a>
              <a href="#seguranca" className="hover:text-slate-700 dark:hover:text-zinc-300 transition-colors">Segurança</a>
              <a href="#ods16" className="hover:text-slate-700 dark:hover:text-zinc-300 transition-colors">ONU ODS 16</a>
              <a href="mailto:contato@netsentinel.com" className="hover:text-slate-700 dark:hover:text-zinc-300 transition-colors">Contato</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8">
            <div className="font-mono text-[10px]">
              &copy; {new Date().getFullYear()} NetSentinel. Todos os direitos reservados.
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-800 text-[10px] font-mono">LGPD / GDPR Compliant</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 text-[10px] font-mono font-bold">ODS 16</span>
            </div>
          </div>

        </div>
      </footer>

      {/* 10. MODAL DE AGENDAMENTO (DEMO) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          ></div>
          
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-brand-navy dark:text-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Agendar Demonstração Gratuita
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1 max-w-xs mx-auto">
                Conheça como o NetSentinel (SGI-PM) pode reduzir o estresse operacional do seu time de TI.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 font-mono mb-1.5 uppercase">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-zinc-600" />
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Seu nome"
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy dark:focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 font-mono mb-1.5 uppercase">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-zinc-600" />
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="nome@empresa.com"
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy dark:focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 font-mono mb-1.5 uppercase">Nome da Empresa</label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-zinc-600" />
                  <input
                    type="text"
                    required
                    name="company"
                    value={formData.company}
                    onChange={handleFormChange}
                    placeholder="Empresa S/A"
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy dark:focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formSubmitted}
                className="w-full bg-brand-navy dark:bg-blue-600 hover:bg-brand-navy/90 dark:hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm transition-all shadow-md mt-4 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {formSubmitted ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Confirmar Agendamento</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
