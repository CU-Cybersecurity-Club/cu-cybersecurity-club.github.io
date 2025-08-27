const terminal = document.getElementById('terminal');
let currentInput;
let commandHistory = [];
let historyIndex = -1;

// Apologies for the spaghetti code

// Create and append the input line
function createInputLine() {
    const inputLine = document.createElement('div');
    inputLine.className = 'input-line';

    const prompt = document.createElement('span');
    prompt.className = 'prompt';
    prompt.textContent = 'guest@cucyberclub:~$';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'input';
    input.autofocus = true;

    inputLine.appendChild(prompt);
    inputLine.appendChild(input);
    terminal.appendChild(inputLine);

    currentInput = input;
    currentInput.focus();

    handleInput(currentInput);

    return input;
}

// Command outputs
const help = [
    "Here are the available commands:",
    '<span class="command">cat      [FILE]</span>',
    '<span class="command">cd       [DIR]</span>',
    '<span class="command">clear</span>',
    '<span class="command">ls       [OPTION] | options: -l -a</span>',
    "<br>"
];

const ls = [
    "homework.txt",
    "<br>"
];

const lsa = [
    "homework.txt   .secret_file.txt",
    "<br>"
];

const lsl = [
    "-rw-r-----   2 bingus bingus    146 Jan 17 20:32 homework.txt",
    "<br>"
]

const lsla = [
    "-rw-r-----   2 bingus bingus    146 Jan 17 20:32 homework.txt",
    "-rw-r-----   1 bingus bingus     24 Jan 15 00:01 .secret_file.txt",
    "<br>"
];

const cat = [
    "usage: cat <filename>",
    "<br>"
];

const cathw = [
    "<a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ' target='_blank'>https://www.youtube.com/watch?v=dQw4w9WgXcQ</a>",
    "<br>"
];

const catsec = [
    "You found the secret!",
    "Here's a joke:",
    "There are 10 types of people that understand binary. Those that do, and those that don't.",
    "<br>",
    "Meet us every Thursday at 6:30pm @ KOBL 317.",
    "<br>"
];

const cd = [
    "Hmm...seems like this is the only directory",
    "<br>"
];

function addOutput(text, className = 'output-line') {
    const line = document.createElement('div');
    line.className = className;
    line.innerHTML = text;
    terminal.appendChild(line);
    currentInput.scrollIntoView({ behavior: 'smooth' });
}

function outputLines(lines) {
    lines.forEach(line => addOutput(line));
}

function processCommand(cmd) {
    // Disable the current input
    currentInput.disabled = true;

    const commandParts = cmd.toLowerCase().trim().split(' ');
    const mainCommand = commandParts[0];
    const args = commandParts.slice(1);

    switch (mainCommand) {
        case 'help':
            outputLines(help);
            break;

        // Probably could handle it better. Does not work for "-l -a" or "-a -l" due to split
        case 'ls':
            const flags = args.join('');
            if (flags === '') {
                outputLines(ls);
            } else if (flags === '-l') {
                outputLines(lsl);
            } else if (flags === '-a') {
                outputLines(lsa);
            } else if (flags === '-la' || flags === '-al') {
                outputLines(lsla);
            } else {
                addOutput("ls: invalid option", "error");
            }
            break;

        case 'cat':
            if (args.length === 0) {
                outputLines(cat);
            } else {
                const filename = args[0].toLowerCase();
                if (filename === 'homework.txt') {
                    outputLines(cathw);
                } else if (filename === '.secret_file.txt') {
                    outputLines(catsec);
                } else {
                    addOutput("cat: No such file or directory", "error");
                }
            }
            break;

        case 'cd':
            outputLines(cd);
            break;

        case 'clear':
            terminal.innerHTML = '';
            break;

        default:
            addOutput(`Command not found: ${mainCommand}. Type 'help' for available commands.`, "error");
    }

    // Create new input line
    createInputLine();
}

// Handle command input
function handleInput(input) {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value;
            if (command) {
                commandHistory.push(command);
                historyIndex = commandHistory.length;
                processCommand(command);
            }
        } else if (e.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
            }
            e.preventDefault();
        }
    });
}

document.addEventListener('click', (e) => {
    if (currentInput && !e.target.matches('a')) {
        currentInput.focus();
    }
});

document.addEventListener('touchstart', (e) => {
    if (currentInput && !e.target.matches('a')) {
        setTimeout(() => {
            currentInput.focus();
        }, 100);
    }
});

// Initial setup
const initialInput = createInputLine();

// Initial banner
// outputLines([`
// ══════════════════════════════════
//       Terminal v1.0 - Type 'help'
// ══════════════════════════════════
// <br>
// `]);
