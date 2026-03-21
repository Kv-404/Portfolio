import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const BOOT_LINES = [
    { text: '[BOOT] Initializing KV_404 system kernel...', delay: 0 },
    { text: '[BOOT] Loading encrypted modules ██████████ OK', delay: 400 },
    { text: '[BOOT] Mounting /dev/portfolio ... OK', delay: 750 },
    { text: '[BOOT] Establishing secure channel ... CONNECTED', delay: 1100 },
    { text: '[SYS]  All systems nominal. Type "help" for commands.\n', delay: 1500 },
];

const SECTIONS = [
    { name: 'projects', path: '/projects', desc: 'deployed systems & case studies' },
    { name: 'career', path: '/career', desc: 'mission history & operations' },
    { name: 'about', path: '/about', desc: 'identity & clearance' },
    { name: 'socials', path: '/socials', desc: 'network uplinks' },
    { name: 'contact', path: '/contact', desc: 'secure channel' },
];

const SKILLS = [
    'React', 'Node.js', 'Three.js', 'Framer Motion',
    'TypeScript', 'UI/UX', 'PostgreSQL', 'Docker'
];

const NEOFETCH_ART = `
        ██╗  ██╗██╗   ██╗
        ██║ ██╔╝██║   ██║
        █████╔╝ ██║   ██║
        ██╔═██╗ ╚██╗ ██╔╝
        ██║  ██╗ ╚████╔╝
        ╚═╝  ╚═╝  ╚═══╝`;

const buildNeofetch = () => {
    const artLines = NEOFETCH_ART.split('\n').filter(l => l.length > 0);
    const info = [
        'kv@404',
        '──────────────────',
        `OS: KV_OS v2.1 (dystopian)`,
        `Shell: zsh 5.9`,
        `Terminal: FaultyTerminal`,
        `Resolution: ${window.innerWidth}x${window.innerHeight}`,
        `Stack: React / Vite / Three.js`,
        `Theme: Matrix Green [■■■■■]`,
    ];

    const lines = [];
    const maxLen = Math.max(artLines.length, info.length);
    for (let i = 0; i < maxLen; i++) {
        const art = (artLines[i] || '').padEnd(30);
        const inf = info[i] || '';
        lines.push(art + '  ' + inf);
    }
    return lines.join('\n');
};

const HELP_TEXT = `
Available commands:

  help            Show this help message
  ls / dir        List available sections
  cd <section>    Navigate to a section
  whoami          Display identity info
  skills          List tech stack
  neofetch        System information
  uptime          Site uptime
  date            Current date & time
  echo <text>     Echo text back
  clear           Clear terminal
  history         Show command history
  sudo <cmd>      Try it and see ;)
`;

export default function InteractiveTerminal() {
    const [lines, setLines] = useState([]);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [historyIdx, setHistoryIdx] = useState(-1);
    const [booted, setBooted] = useState(false);
    const [bootIdx, setBbootIdx] = useState(0);
    const inputRef = useRef(null);
    const bodyRef = useRef(null);
    const startTimeRef = useRef(Date.now());
    const navigate = useNavigate();

    // Boot sequence
    useEffect(() => {
        if (bootIdx >= BOOT_LINES.length) {
            setBooted(true);
            return;
        }
        const timer = setTimeout(() => {
            setLines(prev => [...prev, { type: 'system', text: BOOT_LINES[bootIdx].text }]);
            setBbootIdx(prev => prev + 1);
        }, BOOT_LINES[bootIdx].delay);
        return () => clearTimeout(timer);
    }, [bootIdx]);

    // Auto-scroll
    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [lines]);

    // Focus input on click anywhere in terminal
    const focusInput = useCallback(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    const addOutput = useCallback((text, type = 'output') => {
        setLines(prev => [...prev, { type, text }]);
    }, []);

    const processCommand = useCallback((rawCmd) => {
        const cmd = rawCmd.trim();
        if (!cmd) return;

        // Add the command line to output
        setLines(prev => [...prev, { type: 'command', text: cmd }]);
        setHistory(prev => [...prev, cmd]);
        setHistoryIdx(-1);

        const parts = cmd.split(/\s+/);
        const base = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (base) {
            case 'help':
            case '?':
                addOutput(HELP_TEXT);
                break;

            case 'ls':
            case 'dir':
                addOutput('\n  Available sections:\n');
                SECTIONS.forEach(s => {
                    addOutput(`    📂  ${s.name.padEnd(12)} — ${s.desc}`);
                });
                addOutput('');
                break;

            case 'cd':
            case 'goto':
            case 'open': {
                const target = args[0]?.toLowerCase();
                if (!target) {
                    addOutput('Usage: cd <section>');
                    addOutput('Type "ls" to see available sections.');
                    break;
                }
                const section = SECTIONS.find(s => s.name === target);
                if (section) {
                    addOutput(`Navigating to /${section.name}...`);
                    setTimeout(() => navigate(section.path), 600);
                } else {
                    addOutput(`Error: section "${target}" not found.`);
                    addOutput('Type "ls" to see available sections.');
                }
                break;
            }

            case 'whoami':
                addOutput('\n  KV_404');
                addOutput('  Full-Stack Operative');
                addOutput('  Status: ONLINE');
                addOutput('  Clearance: [REDACTED]');
                addOutput('  Location: [REDACTED]\n');
                break;

            case 'skills':
                addOutput('\n  Equipped modules:\n');
                SKILLS.forEach(s => {
                    addOutput(`    ▸ ${s}`);
                });
                addOutput('');
                break;

            case 'neofetch':
                addOutput(buildNeofetch());
                break;

            case 'uptime': {
                const elapsed = Date.now() - startTimeRef.current;
                const secs = Math.floor(elapsed / 1000);
                const mins = Math.floor(secs / 60);
                const hrs = Math.floor(mins / 60);
                addOutput(`  up ${hrs}h ${mins % 60}m ${secs % 60}s`);
                break;
            }

            case 'date':
                addOutput(`  ${new Date().toString()}`);
                break;

            case 'echo':
                addOutput(args.join(' ') || '');
                break;

            case 'clear':
                setLines([]);
                break;

            case 'history':
                if (history.length === 0) {
                    addOutput('  No command history.');
                } else {
                    history.forEach((h, i) => {
                        addOutput(`  ${String(i + 1).padStart(4)}  ${h}`);
                    });
                }
                break;

            case 'sudo':
                addOutput('  ⛔ ACCESS DENIED // nice try, operative.');
                break;

            case 'rm':
                addOutput('  ⚠️  Permission denied. This is a read-only filesystem.');
                break;

            case 'exit':
            case 'quit':
                addOutput('  There is no escape from this terminal.');
                break;

            default:
                addOutput(`  command not found: ${base}`);
                addOutput('  Type "help" for a list of available commands.');
                break;
        }
    }, [addOutput, history, navigate]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            processCommand(input);
            setInput('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length === 0) return;
            const newIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
            setHistoryIdx(newIdx);
            setInput(history[newIdx]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIdx === -1) return;
            const newIdx = historyIdx + 1;
            if (newIdx >= history.length) {
                setHistoryIdx(-1);
                setInput('');
            } else {
                setHistoryIdx(newIdx);
                setInput(history[newIdx]);
            }
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            setLines([]);
        }
    }, [input, history, historyIdx, processCommand]);

    return (
        <div className="terminal-window" onClick={focusInput}>
            {/* Title bar */}
            <div className="terminal-titlebar">
                <div className="terminal-dots">
                    <span className="terminal-dot terminal-dot--red" />
                    <span className="terminal-dot terminal-dot--yellow" />
                    <span className="terminal-dot terminal-dot--green" />
                </div>
                <span className="terminal-title">kv@404 — zsh</span>
                <div style={{ width: 52 }} />
            </div>

            {/* Body */}
            <div className="terminal-body" ref={bodyRef}>
                {lines.map((line, i) => (
                    <div key={i} className={`terminal-line terminal-line--${line.type}`}>
                        {line.type === 'command' && (
                            <span className="terminal-prompt">kv@404:~$ </span>
                        )}
                        <span style={{ whiteSpace: 'pre-wrap' }}>{line.text}</span>
                    </div>
                ))}

                {/* Input line */}
                {booted && (
                    <div className="terminal-input-line">
                        <span className="terminal-prompt">kv@404:~$ </span>
                        <input
                            ref={inputRef}
                            type="text"
                            className="terminal-input"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            spellCheck={false}
                            autoComplete="off"
                            autoCapitalize="off"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
