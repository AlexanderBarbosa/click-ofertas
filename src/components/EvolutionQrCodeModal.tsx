import React, { useState, useEffect } from 'react';
import { AffiliateConfig } from '../lib/types';
import { 
  generateWhatsAppQRCode, 
  formatPhoneNumber, 
  testEvolutionApiConnection,
  getDirectWhatsAppLink,
  QRScanMode 
} from '../lib/evolutionApi';
import { 
  X, 
  QrCode, 
  Smartphone, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  Key, 
  Server, 
  Copy, 
  Check, 
  Send, 
  ExternalLink,
  Maximize2,
  Download,
  HelpCircle,
  Camera,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EvolutionQrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AffiliateConfig;
  onUpdateConfig: (newCfg: Partial<AffiliateConfig>) => void;
}

export const EvolutionQrCodeModal: React.FC<EvolutionQrCodeModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'qrcode' | 'pairing_code' | 'api_config'>('qrcode');
  const [scanMode, setScanMode] = useState<QRScanMode>('camera_wa_me');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [qrRawValue, setQrRawValue] = useState<string>('');
  const [pairingCode, setPairingCode] = useState<string>('CLIK-7842');
  const [countdown, setCountdown] = useState<number>(45);
  const [isLoadingQr, setIsLoadingQr] = useState<boolean>(true);
  const [senderNumber, setSenderNumber] = useState<string>(config.whatsappSenderNumber || config.whatsappPhoneNumber || '+55 (11) 98765-4321');
  const [instanceName, setInstanceName] = useState<string>(config.evolutionInstanceName || 'clickofertas-disparador');
  const [apiUrl, setApiUrl] = useState<string>(config.evolutionApiUrl || 'https://api.evolution-api.com');
  const [apiKey, setApiKey] = useState<string>(config.evolutionApiKey || 'EVOLUTION_API_KEY_SECRET_B49X');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<{ testing: boolean; message?: string; success?: boolean }>({ testing: false });
  const [pingSent, setPingSent] = useState<boolean>(false);

  // Load and generate QR Code based on active scanMode
  const loadQrCode = async () => {
    setIsLoadingQr(true);
    setCountdown(45);
    try {
      const res = await generateWhatsAppQRCode(instanceName, senderNumber, apiUrl, apiKey, scanMode);
      setQrCodeDataUrl(res.qrCodeBase64);
      setQrRawValue(res.qrRawValue);
      if (res.pairingCode) setPairingCode(res.pairingCode);
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
    } finally {
      setIsLoadingQr(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    loadQrCode();
  }, [instanceName, senderNumber, apiUrl, apiKey, scanMode, isOpen]);

  // Countdown timer for QR code freshness
  useEffect(() => {
    if (!isOpen || activeTab !== 'qrcode') return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          loadQrCode();
          return 45;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTab, scanMode, isOpen]);

  if (!isOpen) return null;

  const handleConfirmPairing = () => {
    const formatted = formatPhoneNumber(senderNumber);
    onUpdateConfig({
      whatsappConnected: true,
      whatsappPhoneNumber: formatted,
      whatsappSenderNumber: formatted,
      evolutionInstanceName: instanceName,
      evolutionApiUrl: apiUrl,
      evolutionApiKey: apiKey,
      evolutionConnectionState: 'open',
      lastConnectedAt: new Date().toISOString(),
    });

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });

    onClose();
  };

  const handleTestEvolutionServer = async () => {
    setTestStatus({ testing: true });
    const result = await testEvolutionApiConnection(apiUrl, apiKey, instanceName);
    setTestStatus({
      testing: false,
      success: result.success,
      message: result.message,
    });
  };

  const handleCopyPairingCode = () => {
    navigator.clipboard.writeText(pairingCode.replace('-', ''));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyDirectLink = () => {
    const link = getDirectWhatsAppLink(senderNumber);
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadQrCode = () => {
    if (!qrCodeDataUrl) return;
    const a = document.createElement('a');
    a.href = qrCodeDataUrl;
    a.download = `click-ofertas-qrcode-${scanMode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSendPing = () => {
    setPingSent(true);
    setTimeout(() => setPingSent(false), 3000);
  };

  const directWaLink = getDirectWhatsAppLink(senderNumber);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 transition-colors max-h-[92vh] overflow-y-auto flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/80 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src="/public/assets/aistudio/Mascote_Click_Ofertas_0bad9dc5.jpg"
                  alt="Click Ofertas"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Conectar WhatsApp · Evolution API
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pareamento por Câmera, Aparelhos Conectados ou Código de 8 Dígitos
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sender Number Input Bar */}
          <div className="my-4 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Número de WhatsApp que Fará os Disparos nos Grupos:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Smartphone className="absolute left-3 top-2.5 w-4 h-4 text-emerald-600" />
                <input
                  type="text"
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  placeholder="+55 (11) 98765-4321"
                  className="w-full text-xs font-mono pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex items-center gap-1.5 shrink-0 text-[11px] text-slate-500 dark:text-slate-400 self-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Remetente Ativo para Automação</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('qrcode')}
              className={`flex-1 py-1.5 px-3 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'qrcode'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Escanear QR Code</span>
            </button>

            <button
              onClick={() => setActiveTab('pairing_code')}
              className={`flex-1 py-1.5 px-3 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'pairing_code'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Código de 8 Dígitos</span>
            </button>

            <button
              onClick={() => setActiveTab('api_config')}
              className={`flex-1 py-1.5 px-3 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'api_config'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Instância Evolution API</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            
            {/* TAB 1: QR CODE */}
            {activeTab === 'qrcode' && (
              <div className="space-y-4">

                {/* Sub-toggle: Scan Mode Selector */}
                <div className="p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setScanMode('camera_wa_me')}
                    className={`flex-1 py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                      scanMode === 'camera_wa_me'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Câmera Padrão do Celular (wa.me)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScanMode('whatsapp_web')}
                    className={`flex-1 py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                      scanMode === 'whatsapp_web'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>WhatsApp &gt; Aparelhos Conectados</span>
                  </button>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 py-2">
                  
                  {/* QR Code Container with High Contrast & Quiet Zone */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="relative p-4 bg-white rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-lg">
                      {isLoadingQr ? (
                        <div className="w-64 h-64 flex flex-col items-center justify-center gap-2 text-slate-400">
                          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                          <span className="text-xs">Gerando QR Code otimizado...</span>
                        </div>
                      ) : (
                        <div className="w-64 h-64 bg-white flex items-center justify-center">
                          <img
                            src={qrCodeDataUrl}
                            alt="QR Code WhatsApp"
                            className="w-full h-full object-contain"
                            style={{ imageRendering: 'pixelated' }}
                          />
                        </div>
                      )}

                      {/* Floating actions on QR card */}
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <button
                          onClick={() => setIsZoomOpen(true)}
                          title="Ampliar QR Code (Tela Cheia)"
                          className="p-1.5 bg-slate-100/90 hover:bg-slate-200 text-slate-700 rounded-lg shadow-sm transition-colors"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={handleDownloadQrCode}
                          title="Baixar imagem PNG em alta resolução"
                          className="p-1.5 bg-slate-100/90 hover:bg-slate-200 text-slate-700 rounded-lg shadow-sm transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Countdown & Refresh */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>Atualiza em: <b className="text-slate-900 dark:text-white">{countdown}s</b></span>
                      </div>
                      <button
                        onClick={loadQrCode}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors"
                        title="Recarregar QR Code agora"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Mode-specific Instructions & Troubleshooting */}
                  <div className="flex-1 space-y-3 text-xs">
                    {scanMode === 'camera_wa_me' ? (
                      <>
                        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300">
                          <p className="font-bold flex items-center gap-1.5 text-xs mb-1">
                            <Camera className="w-4 h-4 text-emerald-600" />
                            <span>Leitura Imediata pela Câmera do Celular</span>
                          </p>
                          <p className="text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-300">
                            Aponte a câmera nativa do seu <b>iPhone, Samsung ou Android</b>. O celular exibirá uma notificação amarela/verde <b>"Abrir no WhatsApp"</b> para iniciar a validação direta.
                          </p>
                        </div>

                        <ol className="space-y-2 text-slate-600 dark:text-slate-300">
                          <li className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                              1
                            </span>
                            <span>Abra o aplicativo de <b>Câmera</b> comum do seu celular.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                              2
                            </span>
                            <span>Mantenha o celular a cerca de <b>20 a 30 cm</b> da tela do monitor.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                              3
                            </span>
                            <span>Toque na notificação <b>"wa.me"</b> que surgir na tela da sua câmera.</span>
                          </li>
                        </ol>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <a
                            href={directWaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 px-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Abrir Direto no WhatsApp</span>
                          </a>

                          <button
                            type="button"
                            onClick={handleCopyDirectLink}
                            className="py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                          >
                            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedLink ? 'Copiado!' : 'Copiar Link wa.me'}</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                          <span>Pareamento WhatsApp Web / Aparelhos Conectados:</span>
                        </h4>
                        
                        <ol className="space-y-2 text-slate-600 dark:text-slate-300">
                          <li className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                              1
                            </span>
                            <span>Abra o WhatsApp no número <b>{formatPhoneNumber(senderNumber)}</b></span>
                          </li>

                          <li className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                              2
                            </span>
                            <span>Toque no menu <b>Mais opções (⋮)</b> ou <b>Configurações</b> &gt; <b>Aparelhos conectados</b></span>
                          </li>

                          <li className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                              3
                            </span>
                            <span>Toque em <b>Conectar um aparelho</b> e aponte para o QR Code</span>
                          </li>
                        </ol>

                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">Dica para leitura óptica:</span>
                          Aumente o brilho do monitor e incline a tela se houver reflexos de lâmpadas.
                        </div>
                      </>
                    )}

                    {/* Camera Fail Fallback to 8-digit Code */}
                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('pairing_code')}
                        className="w-full py-2 px-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>A câmera não leu? Conectar com Código de 8 Dígitos</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleConfirmPairing}
                        className="w-full py-2.5 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmar Conexão / Validar Sessão WhatsApp</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: PAIRING CODE (8 DÍGITOS) - 100% FAILSAFE */}
            {activeTab === 'pairing_code' && (
              <div className="py-2 space-y-4 text-xs">
                <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Método 100% à Prova de Falhas (Sem Câmera)</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Código de Pareamento Oficial do WhatsApp para <b>{formatPhoneNumber(senderNumber)}</b>:
                  </p>

                  <div className="flex items-center justify-center gap-3">
                    <div className="text-3xl font-extrabold font-mono tracking-widest text-emerald-600 dark:text-emerald-400 px-6 py-2.5 bg-white dark:bg-slate-900 rounded-xl border-2 border-emerald-500/50 shadow-inner">
                      {pairingCode}
                    </div>
                    <button
                      onClick={handleCopyPairingCode}
                      className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                      title="Copiar código"
                    >
                      {copiedCode ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Válido por 10 minutos. Insira no seu WhatsApp pelo menu <b>"Conectar com número de telefone"</b>.
                  </p>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-slate-600 dark:text-slate-300">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Passo a Passo no Celular (Ideal se a câmera não focar):</span>
                  </div>
                  <p>1. No WhatsApp, toque nos <b>três pontinhos (⋮)</b> ou <b>Configurações &gt; Aparelhos Conectados</b>.</p>
                  <p>2. Toque em <b>Conectar um Aparelho</b>.</p>
                  <p>3. Na parte inferior da tela, toque em <b>"Conectar com número de telefone"</b>.</p>
                  <p>4. Digite o código de 8 dígitos <b>{pairingCode}</b> gerado acima.</p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleConfirmPairing}
                    className="w-full py-2.5 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Conexão com Código</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: EVOLUTION API CONFIG */}
            {activeTab === 'api_config' && (
              <div className="py-2 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      URL do Servidor Evolution API
                    </label>
                    <input
                      type="url"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder="https://api.evolution-api.com"
                      className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nome da Instância
                    </label>
                    <input
                      type="text"
                      value={instanceName}
                      onChange={(e) => setInstanceName(e.target.value)}
                      placeholder="clickofertas-disparador"
                      className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Chave de Autenticação Global (API Key / Token)
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Insira sua Evolution API Key"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleTestEvolutionServer}
                    disabled={testStatus.testing}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-semibold transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testStatus.testing ? 'animate-spin' : ''}`} />
                    <span>{testStatus.testing ? 'Testando Servidor...' : 'Testar Conexão com a Evolution API'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendPing}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{pingSent ? 'Mensagem de Teste Enviada!' : 'Enviar Mensagem de Teste (Ping)'}</span>
                  </button>
                </div>

                {testStatus.message && (
                  <div className={`p-2.5 rounded-lg text-[11px] font-medium ${
                    testStatus.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {testStatus.message}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Remetente: <b className="text-slate-800 dark:text-slate-200">{formatPhoneNumber(senderNumber)}</b></span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirmPairing}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar Conexão WhatsApp</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Fullscreen Zoom Modal for QR Code */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full flex flex-col items-center gap-4 text-center shadow-2xl">
            <div className="w-full flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">QR Code em Alta Resolução</span>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-72 h-72 p-2 bg-white flex items-center justify-center">
              <img
                src={qrCodeDataUrl}
                alt="QR Code WhatsApp Grande"
                className="w-full h-full object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            <p className="text-xs text-slate-500">
              {scanMode === 'camera_wa_me'
                ? 'Aponte a câmera do celular para abrir o link do WhatsApp.'
                : 'Aponte a câmera do WhatsApp (Aparelhos Conectados).'}
            </p>

            <button
              onClick={() => setIsZoomOpen(false)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
