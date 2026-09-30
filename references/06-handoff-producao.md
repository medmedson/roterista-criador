# Entrega para a sessão de produção e visão do pipeline

## Mensagem-padrão (send_message para a sessão "Canal dark: geração de mídia")
Enviar quando o roteiro estiver auditado. Conteúdo mínimo:
1. Caminho: `~/canaldark/projetos/<tema>/roteiro.md` (+ `apuracao/`).
2. Título, duração, número de blocos e atos.
3. Novidades do vídeo: motivo visual, som-assinatura, elementos [NOVO], trilhas `[NOVA TRILHA]` (gerar antes do render), SFX novos.
4. Regras fixas: cenas só de texto = SEM LEGENDA; comoção sem efeito por cima; política de imagens (proibidos e alternativas).
5. Pendências (perguntas a alinhar, gatilhos a conferir após gravar a voz, cronometragem real).
6. Itens a rechecar no dia da publicação.
7. Pedido: "iniciar a criação imediata do vídeo".
O id da sessão de produção sai de `mcp__ccd_session_mgmt__list_sessions`. Mensagens ficam em fila se a sessão estiver ocupada.

## Pipeline de produção (resumo; a sessão de produção mantém a documentação própria)
1. **Narração**: `ferramentas/normalizar.py <projeto>` transforma cada LOCUÇÃO em `locucao/NN.txt` (números por extenso, siglas faladas, regra de anos) e gera `substituicoes.json` para as legendas. Voz **edge-tts `fr-FR-RemyMultilingualNeural`, `--rate=-5%`** lendo PT-BR (tom de âncora). Escolhida pelo usuário após ouvir amostras. Grafias: "bét/béts", "Butantã", IBGE como "IBGE". Testar amostra antes de nomes estrangeiros.
2. **Áudio**: `gerar-trilhas-<tema>.py` e `gerar-sfx-<tema>.py` (numpy, síntese própria, sem direitos autorais) → trilhas por clima e SFX.
3. **Vídeo**: Remotion em `projetos/<tema>/video/` (React, `remotion` 4.x); componentes reutilizáveis (Quadro, Recorte, Carimbo, Polaroide, Documento, MapaBrasil, MapaMundo, LinhaTempo, Contador, Barras, Placar…) + componentes [NOVO] do tema; um `BlocoNN` por bloco; `Legenda` com opção `ocultar`.
4. **QA**: `node qa-quadros.mjs NN` audita cada bloco (CORTADO / SOB_LEGENDA / SOBREPOSTO / VAZIO / TRANSBORDA) e gera folha de contato; zero erros antes de renderizar.
5. **Render**: `render-final.sh` renderiza bloco a bloco (retomável), concatena com ffmpeg e normaliza o áudio (`loudnorm I=-14 TP=-1.5 LRA=11`, AAC 192k, 48 kHz). Sem prévia 720p (gasta disco).
6. Cuidados: `TMPDIR` próprio nas execuções do Remotion e checar `df -h /`; `caffeinate` (sem `pkill`).

`assets/producao-ferramentas/` guarda cópias de referência dos scripts Python; a versão viva fica em `~/canaldark/ferramentas/` e é mantida pela sessão de produção.
