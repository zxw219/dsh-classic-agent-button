window.__ModuleLoader__.load({
  id: 'dsh-classic-agent-button',
  factory() {
    const SLOT = 'sidebar.footer.action';
    const LABEL = '经典 Agent 模式';

    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.effect(() => {
          // DS Bot 0.3.2 shares its existing action through bot-return.
          // This is only a compatibility adapter; mode changes remain DS Bot's job.
          let bridge;
          let source;
          let unsubscribeSurface = () => {};
          let menu;
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'dsh-classic-agent-button';
          button.title = LABEL;
          button.setAttribute('aria-label', LABEL);
          button.textContent = LABEL;
          button.hidden = true;
          const style = document.createElement('style');
          style.dataset.plugin = 'dsh-classic-agent-button';
          style.textContent = `
.dsh-classic-agent-button{position:fixed;z-index:1100;display:inline-flex;align-items:center;justify-content:center;height:28px;padding:0 10px;margin:0;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary,#65676b);font-family:var(--dsw-font-family,system-ui);font-size:14px;line-height:20px;cursor:pointer;pointer-events:auto;-webkit-app-region:no-drag}
.dsh-classic-agent-button[hidden]{display:none}
.dsh-classic-agent-button:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.14));color:var(--dsw-alias-label-primary,#333)}
.dsh-classic-agent-button:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary,#4d6bfe);outline-offset:-2px}
.dsh-classic-agent-button:disabled{opacity:.55;cursor:default}
`;
          document.head.append(style);
          document.body.append(button);

          const position = () => {
            const next = document.querySelector('[data-windows-menu]');
            if (menu !== next) {
              if (menu) resize.unobserve(menu);
              menu = next;
              if (menu) resize.observe(menu);
            }
            const rect = menu?.getBoundingClientRect();
            button.hidden = !bridge || !rect || rect.width <= 0 || rect.height <= 0;
            if (!button.hidden) {
              button.style.left = `${rect.right + 4}px`;
              button.style.top = `${rect.top + (rect.height - 28) / 2}px`;
            }
          };
          const resize = new ResizeObserver(position);
          const refresh = () => {
            const entry = ctx.slots.entriesOfSlot(SLOT).find(item =>
              item.options.id === 'bot-return' && typeof item.inject === 'function'
            );
            const candidate = entry?.inject?.();
            bridge = typeof candidate?.actions?.setSurface === 'function' &&
              typeof candidate.hooks?.surface?.subscribe === 'function'
              ? candidate : undefined;
            if (source !== bridge?.hooks.surface) {
              unsubscribeSurface();
              source = bridge?.hooks.surface;
              unsubscribeSurface = source ? source.subscribe(refresh) : () => {};
            }
            const active = source?.getSnapshot().mode === 'agent';
            button.disabled = active;
            button.setAttribute('aria-pressed', String(active));
            position();
          };
          button.addEventListener('click', () => bridge?.actions.setSurface('agent'));
          const unsubscribeSlot = ctx.slots.subscribe(SLOT, refresh);
          // The desktop menu is a body-level shadow host, outside DS Bot's sidebar.
          const mountObserver = new MutationObserver(position);
          mountObserver.observe(document.body, { childList: true });
          const layoutObserver = new MutationObserver(position);
          layoutObserver.observe(document.documentElement, { attributes: true });
          window.addEventListener('resize', position);
          refresh();
          return () => {
            unsubscribeSlot();
            unsubscribeSurface();
            resize.disconnect();
            mountObserver.disconnect();
            layoutObserver.disconnect();
            window.removeEventListener('resize', position);
            button.remove();
            style.remove();
          };
        });
      }
    };
  }
});
