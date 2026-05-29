'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Play, 
  Download, 
  Menu, 
  X, 
  Monitor, 
  Bell, 
  Terminal, 
  FileText, 
  Users, 
  Settings, 
  RefreshCw, 
  ChevronRight,
  Sparkles,
  BarChart4,
  List,
  Flame,
  Check
} from 'lucide-react';
import Logo from './Logo';

// Interfaces para os dados
interface Machine {
  id: string;
  ip: string;
  os: string;
  osVersion: string;
  status: 'critico' | 'alerta' | 'seguro' | 'offline';
  cves: string[];
}

interface AlertItem {
  id: string;
  type: 'cve' | 'software' | 'version' | 'patch';
  title: string;
  target: string;
  detail: string;
  severity: 'critico' | 'alerta' | 'seguro' | 'info';
  time: string;
  isNew?: boolean;
}

export const InteractiveDashboard: React.FC = () => {
  // Estados do Dashboard
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'todos' | 'critico' | 'alerta' | 'seguro' | 'offline'>('todos');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [syncTime, setSyncTime] = useState('há 4 min');
  const [syncCounter, setSyncCounter] = useState(240); // 4 minutos em segundos
  const [notification, setNotification] = useState<string | null>(null);

  // Novas melhorias de estados: Alternar para Gráfico e Console do Terminal
  const [showChart, setShowChart] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Dados das Máquinas (reproduzindo os do print + extras para robustez)
  const [machines, setMachines] = useState<Machine[]>([
    { id: 'WKS-FIN-001', ip: '192.168.1.10', os: 'Windows 10 21H2', osVersion: '10.0.19044', status: 'critico', cves: ['CVE-2024-21412'] },
    { id: 'WKS-TI-003', ip: '192.168.1.23', os: 'Windows 11 22H2', osVersion: '10.0.22621', status: 'alerta', cves: ['CVE-2024-1234'] },
    { id: 'SRV-AD-01', ip: '192.168.1.1', os: 'Windows Server 2019', osVersion: '10.0.17763', status: 'critico', cves: ['CVE-2024-21338'] },
    { id: 'WKS-MKT-007', ip: '192.168.1.44', os: 'Windows 10 22H2', osVersion: '10.0.19045', status: 'seguro', cves: [] },
    { id: 'SRV-DB-01', ip: '192.168.1.5', os: 'Windows Server 2016', osVersion: '10.0.14393', status: 'alerta', cves: ['CVE-2019-11043'] },
    { id: 'WKS-HR-002', ip: '192.168.1.18', os: 'Windows 10 22H2', osVersion: '10.0.19045', status: 'critico', cves: ['CVE-2024-3094'] },
    { id: 'WKS-DEV-010', ip: '192.168.1.72', os: 'Ubuntu 22.04 LTS', osVersion: '5.15.0-88-generic', status: 'seguro', cves: [] },
    { id: 'SRV-WEB-02', ip: '192.168.1.2', os: 'CentOS Stream 9', osVersion: '5.14.0-362.el9', status: 'offline', cves: [] },
    { id: 'WKS-SALES-04', ip: '192.168.1.102', os: 'Windows 11 22H2', osVersion: '10.0.22621', status: 'offline', cves: [] }
  ]);

  // Alertas Recentes
  const [alerts, setAlerts] = useState<AlertItem[]>([
    { id: 'a1', type: 'cve', title: 'CVE-2024-21338 — Crítico', target: 'SRV-AD-01', detail: 'Kernel privilege escalation vulnerability detected', severity: 'critico', time: '2 min', isNew: true },
    { id: 'a2', type: 'software', title: 'Novo software detectado', target: 'WKS-FIN-001', detail: 'Adobe Reader 11.0 instalado fora da política', severity: 'alerta', time: '8 min' },
    { id: 'a3', type: 'version', title: 'Versão desatualizada (EOL)', target: 'SRV-DB-01', detail: 'SQL Server 2014 chegou ao Fim de Vida Útil', severity: 'alerta', time: '15 min' },
    { id: 'a4', type: 'cve', title: 'CVE-2024-3094 — CRÍTICO 10.0', target: 'WKS-HR-002', detail: 'Backdoor detectado na biblioteca liblzma (XZ Utils)', severity: 'critico', time: '22 min' },
    { id: 'a5', type: 'patch', title: 'Patch pendente', target: 'WKS-TI-003', detail: 'Windows Update cumulativo disponível para instalação', severity: 'info', time: '1h' }
  ]);

  // Efeito para simular o tempo de sincronização correndo
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncCounter((prev) => {
        const next = prev + 1;
        if (next < 60) {
          setSyncTime(`há ${next} s`);
        } else {
          setSyncTime(`há ${Math.floor(next / 60)} min`);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulação de Logs do Terminal gRPC com base no progresso do Scan
  useEffect(() => {
    if (isScanning) {
      const logs = [
        `[${new Date().toLocaleTimeString()}] [INFO] Inicializando gRPC Client no agente NetSentinel v1.4.2...`,
        `[${new Date().toLocaleTimeString()}] [INFO] Mapeando ativos locais (OS: Windows/Linux, Interfaces: 2)...`,
        `[${new Date().toLocaleTimeString()}] [SCAN] Varrendo softwares instalados (142 pacotes identificados)...`,
        `[${new Date().toLocaleTimeString()}] [SYNC] Estabelecendo tunel seguro TLS 1.3 com a API NetSentinel...`,
        `[${new Date().toLocaleTimeString()}] [INTEL] Cruzando hashes locais com feed NVD/NIST (CVE-2024-1234)...`,
        `[${new Date().toLocaleTimeString()}] [ALERT] Vulnerabilidade Crítica encontrada no host WKS-TI-003!`,
        `[${new Date().toLocaleTimeString()}] [MITIG] Distribuição silenciosa de patch KB5034124 para mitigação...`,
        `[${new Date().toLocaleTimeString()}] [SUCCESS] Mitigação de risco executada. Varredura concluída.`
      ];

      // Divide logs de forma proporcional ao progresso (0% a 100%)
      const index = Math.min(Math.floor(scanProgress / 13), logs.length - 1);
      setTerminalLogs(logs.slice(0, index + 1));
    }
  }, [scanProgress, isScanning]);

  // Simulação de Varredura
  const triggerScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setShowTerminal(true);
    setNotification(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            // Simula mitigação de ativos na tabela após scan (Alerta -> Seguro)
            setMachines((prevMachines) => 
              prevMachines.map((m) => {
                if (m.id === 'WKS-TI-003') {
                  return { ...m, status: 'seguro', cves: [] };
                }
                return m;
              })
            );
            setAlerts((prevAlerts) => [
              {
                id: 'new-scan-' + Date.now(),
                type: 'patch',
                title: 'Varredura Concluída (Auto)',
                target: 'Rede Local',
                detail: 'Máquina WKS-TI-003 mitigada com sucesso via patch remoto gRPC.',
                severity: 'seguro',
                time: 'Agora',
                isNew: true
              },
              ...prevAlerts
            ]);
            setSyncCounter(0);
            setSyncTime('há poucos segundos');
            setNotification('Varredura concluída! WKS-TI-003 corrigida.');
          }, 800);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  // Filtragem e busca
  const filteredMachines = machines.filter((m) => {
    const matchesSearch = 
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.ip.includes(searchQuery) ||
      m.os.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.cves.some((cve) => cve.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeTab === 'todos') return matchesSearch;
    return m.status === activeTab && matchesSearch;
  });

  // Métricas dinâmicas
  const totalCount = machines.length;
  const criticalCount = machines.filter(m => m.status === 'critico').length;
  const alertCount = machines.filter(m => m.status === 'alerta').length;
  const secureCount = machines.filter(m => m.status === 'seguro').length;
  const offlineCount = machines.filter(m => m.status === 'offline').length;

  // Dados históricos para o gráfico SVG de tendência (Semana 1, Semana 2, Semana 3, Semana 4, Hoje)
  const chartData = [
    { label: 'Sem 1', criticos: 18, alertas: 15, seguros: 28 },
    { label: 'Sem 2', criticos: 12, alertas: 16, seguros: 30 },
    { label: 'Sem 3', criticos: 8,  alertas: 11, seguros: 35 },
    { label: 'Sem 4', criticos: 5,  alertas: 9,  seguros: 36 },
    { label: 'Hoje',  criticos: criticalCount, alertas: alertCount, seguros: secureCount }
  ];

  return (
    <div className="w-full bg-slate-100 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 font-sans text-slate-800 dark:text-zinc-100 flex flex-col lg:flex-row h-[820px] relative">
      
      {/* 1. OVERLAY DE TERMINAL SIMULADO DE SCAN (gRPC Logs) */}
      {showTerminal && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
            {/* Terminal Header */}
            <div className="bg-zinc-900 px-4 py-3 flex items-center justify-between border-b border-zinc-850">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-400" />
                <span className="font-mono text-xs font-bold text-zinc-300">NetSentinel gRPC Agent Logger v1.4.2</span>
              </div>
              <button 
                onClick={() => setShowTerminal(false)}
                disabled={isScanning}
                className={`p-1 rounded transition-all ${
                  isScanning 
                    ? 'text-zinc-700 cursor-not-allowed' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Terminal Console */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] text-teal-400 space-y-2 select-text bg-black scrollbar-thin">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed whitespace-pre-wrap animate-fade-in">
                  {log}
                </div>
              ))}
              {isScanning && (
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-1.5 h-3.5 bg-zinc-400 animate-pulse"></span>
                  <span>Escaneando rede e compilando dados... ({scanProgress}%)</span>
                </div>
              )}
            </div>

            {/* Terminal Footer */}
            <div className="bg-zinc-900/50 px-4 py-3 border-t border-zinc-850 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span>Status: {isScanning ? 'TRANSMITINDO LIVE' : 'CONCLUÍDO (LOGS LOCALIZADOS)'}</span>
              {!isScanning && (
                <button
                  onClick={() => setShowTerminal(false)}
                  className="bg-teal-500 hover:bg-teal-600 text-black font-bold px-3 py-1.5 rounded transition-all shadow-md"
                >
                  Fechar Console
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Notificação */}
      {notification && (
        <div className="absolute top-4 right-4 z-40 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce font-medium text-sm">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-85">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sidebar Mobile Toggle Header */}
      <div className="lg:hidden w-full bg-slate-200 dark:bg-zinc-950 px-4 py-3 flex items-center justify-between border-b border-slate-300 dark:border-zinc-800">
        <Logo showSubText={true} subText="SEcurity Operations Center - Patch Managemente & Vulnerability Intelligence" />
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded bg-slate-300 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* SIDEBAR */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        absolute lg:static top-[57px] lg:top-0 left-0 w-64 h-[calc(100%-57px)] lg:h-full 
        bg-slate-200/90 dark:bg-zinc-950/80 backdrop-blur-md lg:backdrop-blur-none
        border-r border-slate-300 dark:border-zinc-900 z-40 transition-transform duration-300 flex flex-col justify-between p-4 flex-shrink-0
      `}>
        <div className="flex flex-col gap-6">
          {/* Logo corporativo */}
          <div className="hidden lg:block px-2">
            <Logo showSubText={true} subText="SEcurity Operations Center - Patch Managemente & Vulnerability Intelligence" />
          </div>

          {/* Seção MONITORAMENTO */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-zinc-600 px-2.5 uppercase font-mono">
              Monitoramento
            </span>
            <button className="flex items-center justify-between px-3 py-2 rounded-lg bg-teal-500/10 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400 font-medium text-sm transition-all border border-teal-500/20 dark:border-teal-900/30">
              <div className="flex items-center gap-2.5">
                <Monitor className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400 animate-pulse"></span>
            </button>
            <button className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400 text-sm font-medium transition-all group">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 group-hover:text-brand-navy dark:group-hover:text-blue-500" />
                <span>Máquinas</span>
              </div>
              <span className="text-[10px] bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-full font-mono">
                {criticalCount}
              </span>
            </button>
            <button className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400 text-sm font-medium transition-all group">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 group-hover:text-brand-navy dark:group-hover:text-blue-500" />
                <span>Alertas</span>
              </div>
              <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full font-mono">
                {alertCount}
              </span>
            </button>
            <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400 text-sm font-medium transition-all">
              <FileText className="w-4 h-4" />
              <span>Softwares</span>
            </button>
          </div>

          {/* Seção SEGURANÇA */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-zinc-600 px-2.5 uppercase font-mono">
              Segurança
            </span>
            <button className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400 text-sm font-medium transition-all group">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 group-hover:text-brand-navy dark:group-hover:text-blue-500" />
                <span>CVEs</span>
              </div>
              <span className="text-[10px] bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-full font-mono">
                12
              </span>
            </button>
            <button 
              onClick={triggerScan}
              disabled={isScanning}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400 text-sm font-medium transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin text-teal-500' : ''}`} />
                <span>Varredura rápida</span>
              </div>
            </button>
            <button className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400 text-sm font-medium transition-all group">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>Relatórios</span>
              </div>
              <span className="text-[10px] bg-slate-300 dark:bg-zinc-800 text-slate-700 dark:text-zinc-400 font-bold px-2 py-0.5 rounded-full font-mono">
                2
              </span>
            </button>
          </div>

          {/* Seção SISTEMA */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-zinc-600 px-2.5 uppercase font-mono">
              Sistema
            </span>
            <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400 text-sm font-medium transition-all">
              <Users className="w-4 h-4" />
              <span>Agentes</span>
            </button>
            <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400 text-sm font-medium transition-all">
              <Settings className="w-4 h-4" />
              <span>Configurações</span>
            </button>
          </div>
        </div>

        {/* Administrador Info */}
        <div className="flex items-center gap-3 p-2 bg-slate-300/50 dark:bg-zinc-900/60 rounded-xl border border-slate-300 dark:border-zinc-800/80">
          <div className="w-9 h-9 rounded-full bg-brand-navy dark:bg-blue-600 text-white font-bold flex items-center justify-center font-mono text-sm shadow-md">
            A
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold truncate">Administrador</span>
            <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono truncate">sys.admin</span>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-y-auto lg:overflow-hidden h-full p-4 lg:p-6 bg-slate-50 dark:bg-zinc-950">
        
        {/* Top Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-900 pb-5">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-zinc-500">
            <span>Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 dark:text-zinc-300 font-medium">Visão Geral</span>
          </div>

          {/* Actions & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-zinc-600" />
              <input
                type="text"
                placeholder="Máquina, IP, CVE, software..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs font-mono placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand-navy dark:focus:ring-blue-500 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Varredura Trigger */}
            <button
              onClick={triggerScan}
              disabled={isScanning}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                isScanning 
                  ? 'bg-slate-200 dark:bg-zinc-900 text-slate-400 border-slate-300 dark:border-zinc-800 cursor-not-allowed'
                  : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Play className={`w-3.5 h-3.5 ${isScanning ? 'animate-pulse text-teal-500' : 'text-slate-500'}`} fill="currentColor" />
              <span>{isScanning ? `Escaneando (${scanProgress}%)` : 'Varredura'}</span>
            </button>

            {/* Terminal Log Trigger */}
            <button
              onClick={() => setShowTerminal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs border border-zinc-700"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Console Logs</span>
            </button>

            {/* Exportar */}
            <button 
              onClick={() => alert('Relatório gerado com sucesso! Iniciando download.')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>

            {/* Live Indicator */}
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 px-2.5 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse"></span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">ao vivo</span>
            </div>
          </div>
        </div>

        {/* Dashboard Title & Meta */}
        <div className="mt-4 flex flex-col md:flex-row md:items-baseline justify-between gap-1.5">
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Painel de Segurança
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-500 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Última sincronização CVE: <strong className="text-slate-800 dark:text-zinc-300 font-semibold">{syncTime}</strong>
            </span>
            <span>•</span>
            <span>{totalCount} hosts monitorados</span>
          </div>
        </div>

        {/* PROGRESO DA VARREDURA (QUANDO ATIVA) */}
        {isScanning && (
          <div className="mt-4 bg-teal-500/10 border border-teal-500/20 rounded-lg p-3 flex flex-col gap-2 animate-pulse-slow">
            <div className="flex justify-between items-center text-xs text-teal-700 dark:text-teal-400 font-mono font-bold">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Cruzando dados ativos com a base NVD/NIST via gRPC...
              </span>
              <span>{scanProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-teal-500 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* METRIC CARDS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          
          {/* Card 1 - Total Máquinas */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-blue-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <Monitor className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-blue-600 bg-blue-100 dark:bg-blue-950/60 px-1.5 py-0.5 rounded-full font-mono">
                +2 esta semana
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold font-mono tracking-tight">{totalCount}</span>
              <h3 className="text-xs text-slate-500 dark:text-zinc-500 font-medium mt-1">Total de Máquinas</h3>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
          </div>

          {/* Card 2 - Críticos */}
          <div className={`bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-red-500/30 transition-all ${criticalCount > 0 ? 'glow-critical' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-red-500 bg-red-100 dark:bg-red-950/60 px-1.5 py-0.5 rounded-full font-mono">
                CVSS &ge; 9.0
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold font-mono tracking-tight text-red-500">{criticalCount}</span>
              <h3 className="text-xs text-slate-500 dark:text-zinc-500 font-medium mt-1">Crítico — Ação Urgente</h3>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500"></div>
          </div>

          {/* Card 3 - Alertas */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-amber-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-full font-mono">
                4 aguardando patch
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold font-mono tracking-tight text-amber-500">{alertCount}</span>
              <h3 className="text-xs text-slate-500 dark:text-zinc-500 font-medium mt-1">Alertas Ativos</h3>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500"></div>
          </div>

          {/* Card 4 - Seguro */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full font-mono">
                {Math.round((secureCount / totalCount) * 100)}% do parque
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold font-mono tracking-tight text-emerald-500">{secureCount}</span>
              <h3 className="text-xs text-slate-500 dark:text-zinc-500 font-medium mt-1">Sistemas Seguros</h3>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
          </div>

        </div>

        {/* WORKSPACE AREA (Table + Recent Alerts) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 flex-1 min-h-0">
          
          {/* Tabela ou Gráfico de Inventário (2/3 da largura) */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900/50 rounded-xl border border-slate-200 dark:border-zinc-800/80 shadow-sm p-4 lg:p-5 flex flex-col h-full min-h-[380px]">
            
            {/* Header com Toggle IHC de Visualização */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold tracking-tight">Vulnerabilidades da Rede</h2>
                
                {/* IHC View Toggle Group */}
                <div className="flex items-center bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-0.5">
                  <button
                    onClick={() => setShowChart(false)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                      !showChart 
                        ? 'bg-white dark:bg-zinc-800 text-brand-navy dark:text-blue-400 shadow-sm' 
                        : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'
                    }`}
                  >
                    <List className="w-3 h-3" />
                    <span>Lista</span>
                  </button>
                  <button
                    onClick={() => setShowChart(true)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                      showChart 
                        ? 'bg-white dark:bg-zinc-800 text-brand-navy dark:text-blue-400 shadow-sm' 
                        : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'
                    }`}
                  >
                    <BarChart4 className="w-3 h-3" />
                    <span>Tendência</span>
                  </button>
                </div>
              </div>

              {/* Se a tabela estiver visível, mostra as abas semafóricas */}
              {!showChart && (
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-zinc-900 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('todos')}
                    className={`px-2.5 py-1 rounded text-xs font-medium font-mono transition-all ${
                      activeTab === 'todos'
                        ? 'bg-white dark:bg-zinc-850 shadow-sm text-slate-800 dark:text-white'
                        : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'
                    }`}
                  >
                    Todos ({totalCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('critico')}
                    className={`px-2.5 py-1 rounded text-xs font-medium font-mono transition-all ${
                      activeTab === 'critico'
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20'
                    }`}
                  >
                    Crítico ({criticalCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('alerta')}
                    className={`px-2.5 py-1 rounded text-xs font-medium font-mono transition-all ${
                      activeTab === 'alerta'
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                    }`}
                  >
                    Alerta ({alertCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('seguro')}
                    className={`px-2.5 py-1 rounded text-xs font-medium font-mono transition-all ${
                      activeTab === 'seguro'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                    }`}
                  >
                    Seguro ({secureCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('offline')}
                    className={`px-2.5 py-1 rounded text-xs font-medium font-mono transition-all ${
                      activeTab === 'offline'
                        ? 'bg-slate-500 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-950/20'
                    }`}
                  >
                    Offline ({offlineCount})
                  </button>
                </div>
              )}
            </div>

            {/* RENDERIZAR TABELA OU GRÁFICO TENDÊNCIA */}
            {!showChart ? (
              /* TABELA DO INVENTÁRIO */
              <div className="flex-1 overflow-x-auto overflow-y-auto mt-4 pr-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-zinc-800 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase font-mono tracking-wider">
                      <th className="py-2.5 px-3">Máquina / IP</th>
                      <th className="py-2.5 px-3">Sistema Operacional</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">CVEs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-xs">
                    {filteredMachines.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400 dark:text-zinc-600 font-mono">
                          Nenhum ativo encontrado para os filtros atuais.
                        </td>
                      </tr>
                    ) : (
                      filteredMachines.map((m) => (
                        <tr 
                          key={m.id} 
                          className="hover:bg-slate-50 dark:hover:bg-zinc-900/30 transition-colors group"
                        >
                          <td className="py-3 px-3">
                            <div className="flex flex-col">
                              <span className="font-bold font-mono text-slate-900 dark:text-zinc-200 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                                {m.id}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-0.5">
                                {m.ip}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex flex-col">
                              <span className="font-medium">{m.os}</span>
                              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-0.5">
                                {m.osVersion}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            {m.status === 'critico' && (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-red-100 dark:bg-red-950/40 text-red-500 border border-red-200 dark:border-red-900/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                Crítico
                              </span>
                            )}
                            {m.status === 'alerta' && (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Alerta
                              </span>
                            )}
                            {m.status === 'seguro' && (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-200 dark:border-emerald-900/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Seguro
                              </span>
                            )}
                            {m.status === 'offline' && (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700/50">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                Offline
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            {m.cves.length > 0 ? (
                              <div className="flex justify-end gap-1">
                                {m.cves.map((cve) => (
                                  <span 
                                    key={cve}
                                    className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-red-100 dark:bg-red-950/30 text-red-500 border border-red-200/40 dark:border-red-900/20"
                                  >
                                    {cve}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-400 dark:text-zinc-600 font-mono">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* GRÁFICO SVG INTERATIVO DE TENDÊNCIA */
              <div className="flex-1 flex flex-col justify-between mt-4 pr-1 select-none">
                <div className="text-xs font-semibold text-slate-500 dark:text-zinc-500 mb-2">
                  Histórico de mitigação de vulnerabilidades (Últimas 4 semanas):
                </div>
                
                {/* SVG Canvas */}
                <div className="w-full flex-1 relative min-h-[220px]">
                  <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25"/>
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0"/>
                      </linearGradient>
                      <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0"/>
                      </linearGradient>
                    </defs>

                    {/* Linhas de Grade de Fundo */}
                    <line x1="50" y1="30" x2="470" y2="30" className="stroke-slate-200 dark:stroke-zinc-800" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="50" y1="70" x2="470" y2="70" className="stroke-slate-200 dark:stroke-zinc-800" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="50" y1="110" x2="470" y2="110" className="stroke-slate-200 dark:stroke-zinc-800" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="50" y1="150" x2="470" y2="150" className="stroke-slate-200 dark:stroke-zinc-800" strokeWidth="1" strokeDasharray="4 4" />
                    
                    {/* Eixo X Base */}
                    <line x1="50" y1="170" x2="470" y2="170" className="stroke-slate-300 dark:stroke-zinc-700" strokeWidth="1.5" />

                    {/* RÓTULOS EIXO Y */}
                    <text x="35" y="34" className="fill-slate-400 dark:fill-zinc-500 font-mono text-[9px]" textAnchor="end">20</text>
                    <text x="35" y="74" className="fill-slate-400 dark:fill-zinc-500 font-mono text-[9px]" textAnchor="end">15</text>
                    <text x="35" y="114" className="fill-slate-400 dark:fill-zinc-500 font-mono text-[9px]" textAnchor="end">10</text>
                    <text x="35" y="154" className="fill-slate-400 dark:fill-zinc-500 font-mono text-[9px]" textAnchor="end">5</text>
                    <text x="35" y="174" className="fill-slate-400 dark:fill-zinc-500 font-mono text-[9px]" textAnchor="end">0</text>

                    {/* ÁREAS PREENCHIDAS */}
                    {/* Alertas (Amber Area) */}
                    <path
                      d={`M 50,170 
                          L 50,${170 - 15 * 7} 
                          L 152.5,${170 - 16 * 7} 
                          L 255,${170 - 11 * 7} 
                          L 357.5,${170 - 9 * 7} 
                          L 460,${170 - alertCount * 7} 
                          L 460,170 Z`}
                      fill="url(#amberGrad)"
                    />
                    
                    {/* Críticos (Red Area) */}
                    <path
                      d={`M 50,170 
                          L 50,${170 - 18 * 7} 
                          L 152.5,${170 - 12 * 7} 
                          L 255,${170 - 8 * 7} 
                          L 357.5,${170 - 5 * 7} 
                          L 460,${170 - criticalCount * 7} 
                          L 460,170 Z`}
                      fill="url(#redGrad)"
                    />

                    {/* LINHAS DE TENDÊNCIA */}
                    {/* Alertas Line (Amber) */}
                    <path
                      d={`M 50,${170 - 15 * 7} 
                          L 152.5,${170 - 16 * 7} 
                          L 255,${170 - 11 * 7} 
                          L 357.5,${170 - 9 * 7} 
                          L 460,${170 - alertCount * 7}`}
                      className="stroke-amber-500"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />

                    {/* Críticos Line (Red) */}
                    <path
                      d={`M 50,${170 - 18 * 7} 
                          L 152.5,${170 - 12 * 7} 
                          L 255,${170 - 8 * 7} 
                          L 357.5,${170 - 5 * 7} 
                          L 460,${170 - criticalCount * 7}`}
                      className="stroke-red-500"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />

                    {/* PONTOS DE DADOS INTERATIVOS (HOVER TRIGGER) */}
                    {chartData.map((d, idx) => {
                      const cx = 50 + idx * 102.5;
                      const cyCrit = 170 - d.criticos * 7;
                      const cyAlert = 170 - d.alertas * 7;
                      const isHovered = hoveredPoint === idx;

                      return (
                        <g key={idx} className="cursor-pointer">
                          {/* Linha Vertical de Foco (quando hovered) */}
                          {isHovered && (
                            <line x1={cx} y1="20" x2={cx} y2="170" className="stroke-slate-300 dark:stroke-zinc-800" strokeWidth="1.5" />
                          )}

                          {/* Rótulo Eixo X */}
                          <text x={cx} y="190" className="fill-slate-400 dark:fill-zinc-500 font-mono text-[9px] text-center" textAnchor="middle">
                            {d.label}
                          </text>

                          {/* Ponto Alerta */}
                          <circle
                            cx={cx}
                            cy={cyAlert}
                            r={isHovered ? 5 : 3.5}
                            className="fill-white dark:fill-black stroke-amber-500"
                            strokeWidth="2.5"
                          />

                          {/* Ponto Crítico */}
                          <circle
                            cx={cx}
                            cy={cyCrit}
                            r={isHovered ? 5 : 3.5}
                            className="fill-white dark:fill-black stroke-red-500"
                            strokeWidth="2.5"
                            onMouseEnter={() => setHoveredPoint(idx)}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />

                          {/* Área invisível grande para facilitar o hover do mouse */}
                          <rect
                            x={cx - 15}
                            y="10"
                            width="30"
                            height="170"
                            fill="transparent"
                            onMouseEnter={() => setHoveredPoint(idx)}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                        </g>
                      );
                    })}

                    {/* TOOLTIP POPUP DENTRO DO SVG */}
                    {hoveredPoint !== null && (
                      <g transform={`translate(${Math.min(Math.max(50 + hoveredPoint * 102.5 - 65, 10), 360)}, ${Math.min(170 - chartData[hoveredPoint].criticos * 7 - 65, 100)})`} className="shadow-lg select-none">
                        <rect width="130" height="52" rx="6" className="fill-slate-900/95 dark:fill-zinc-900/95 stroke-slate-800 dark:stroke-zinc-800" strokeWidth="1" />
                        <text x="8" y="16" className="fill-white font-sans text-[10px] font-bold">{chartData[hoveredPoint].label === 'Hoje' ? 'Hoje (Pós-Scan)' : `Semana ${hoveredPoint + 1}`}</text>
                        <text x="8" y="32" className="fill-red-400 font-mono text-[9px] font-bold">Críticos: {chartData[hoveredPoint].criticos} (CVSS &ge; 9)</text>
                        <text x="8" y="44" className="fill-amber-400 font-mono text-[9px] font-bold">Alertas: {chartData[hoveredPoint].alertas}</text>
                      </g>
                    )}

                  </svg>
                </div>
                
                {/* Legendas e Info */}
                <div className="flex items-center gap-6 text-[10px] font-mono border-t border-slate-200 dark:border-zinc-900 pt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-1 bg-red-500 rounded-full"></span>
                    <span className="text-slate-500">CVEs Críticos (Mitigados em 83%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-1 bg-amber-500 rounded-full"></span>
                    <span className="text-slate-500">Alertas Operacionais (Mitigados em 53%)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Alertas Recentes (1/3 da largura) */}
          <div className="bg-white dark:bg-zinc-900/50 rounded-xl border border-slate-200 dark:border-zinc-800/80 shadow-sm p-4 lg:p-5 flex flex-col h-full min-h-[380px]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight">Alertas Recentes</h2>
              </div>
              <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 px-2 py-0.5 rounded-full font-mono">
                {alerts.filter(a => a.severity === 'critico').length} novos
              </span>
            </div>

            {/* Lista Scrollable */}
            <div className="flex-1 overflow-y-auto mt-4 space-y-3.5 pr-1">
              {alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-3 rounded-lg border text-xs transition-all relative overflow-hidden ${
                    alert.isNew 
                      ? 'bg-blue-50/50 dark:bg-blue-950/10 border-blue-200 dark:border-blue-900/30' 
                      : 'bg-slate-50/30 dark:bg-zinc-900/20 border-slate-100 dark:border-zinc-900'
                  } hover:scale-[1.01]`}
                >
                  {/* Badge de Novo */}
                  {alert.isNew && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white font-mono font-bold text-[8px] px-1.5 py-0.5 rounded-bl uppercase">
                      novo
                    </div>
                  )}

                  <div className="flex items-start gap-2.5">
                    {/* Indicador de Severidade */}
                    <div className="mt-0.5 flex-shrink-0">
                      {alert.severity === 'critico' && <span className="flex w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>}
                      {alert.severity === 'alerta' && <span className="flex w-2.5 h-2.5 rounded-full bg-amber-500"></span>}
                      {alert.severity === 'seguro' && <span className="flex w-2.5 h-2.5 rounded-full bg-emerald-500"></span>}
                      {alert.severity === 'info' && <span className="flex w-2.5 h-2.5 rounded-full bg-blue-500"></span>}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Título e Tempo */}
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="font-bold truncate text-slate-800 dark:text-zinc-200">
                          {alert.title}
                        </h4>
                        <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono flex-shrink-0">
                          {alert.time}
                        </span>
                      </div>
                      
                      {/* Host Target */}
                      <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono mt-1">
                        {alert.target}
                      </div>

                      {/* Detalhes */}
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1.5 leading-relaxed font-sans">
                        {alert.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
export default InteractiveDashboard;
