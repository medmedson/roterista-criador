# 03/10/2026 — Motion design e edição cinematográfica (vídeos longos e reels)

Pedido do usuário: usar outras skills de apoio e aplicar motion e edição cinematográfica também nos vídeos longos.

- Novo `references/18-producao-motion-regras.md`: durações em frames, curvas, stagger, pausas, transições e dados, destilados da LottieFiles motion-design-skill e do HyperFrames (HeyGen).
- Novo `references/19-producao-edicao-cinematografica.md`: ritmo de cortes, costuras, camadas, cor por capítulo, revelação, reels.
- Novo `assets/producao-template-video/src/componentes/Movimento.ts`: `EASE`, `DUR`, `escalonar`, `entrar`, `sair`, `cortarCurva`.
- Skill `motion-design` (LottieFiles, MIT) empacotada em `assets/skills-apoio/` e instalada pelo `setup.sh`.
- HyperFrames não instalado (outro renderizador, telemetria, atualização automática); só os princípios.
- SKILL.md: seção 7b "Skills de apoio"; decupagem e referências sem zoom de tela (zoom-through e Ken Burns proibidos).
- `renderizar-reels.py`: concorrência 2, timeout 240 s e cache de vídeo de 512 MB (corrige timeouts do OffthreadVideo).
