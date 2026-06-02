// ===========================
// STATE MANAGEMENT
// ===========================
let state = {
    paperInputs: [],
    results: [],          // [{bibtex, raw, source, input}] — replaces parallel bibtexResults/rawData arrays
    isProcessing: false,
    settings: {
        delay: 1.0,
        email: '',
        apiPriority: 'auto',
        formatIndent: true,
        sortAlphabetically: false,
        includeComments: true,
        autoSaveHistory: true,
        retryAttempts: 1,
        enableDarkMode: false,
        enableShortcuts: true,
        enableAnalytics: false,
        enableOffline: true,
        citationStyle: 'bibtex'
    },
    stats: {
        success: 0,
        failed: 0,
        startTime: 0,
        apiSource: {
            crossref: 0,
            arxiv: 0,
            semantic: 0
        }
    },
    history: [],
    inputHistory: [],
    currentInputIndex: -1,
    detectedInputType: 'titles'
};

// ===========================
// DOM ELEMENTS
// ===========================
const elements = {
    // Core elements
    paperInput: document.getElementById('paperInput'),
    fileInput: document.getElementById('fileInput'),
    fileUploadArea: document.getElementById('fileUploadArea'),
    fileInfo: document.getElementById('fileInfo'),
    fileName: document.getElementById('fileName'),
    fileCount: document.getElementById('fileCount'),
    clearFile: document.getElementById('clearFile'),
    generateBtn: document.getElementById('generateBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    exampleBtn: document.getElementById('exampleBtn'),
    clearBtn: document.getElementById('clearBtn'),
    undoBtn: document.getElementById('undoBtn'),

    // Results elements
    bibtexOutput: document.getElementById('bibtexOutput'),
    citationPreview: document.getElementById('citationPreview'),
    rawDataOutput: document.getElementById('rawDataOutput'),
    copyBtn: document.getElementById('copyBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    shareBtn: document.getElementById('shareBtn'),
    exportFormat: document.getElementById('exportFormat'),

    // Progress elements
    progressContainer: document.getElementById('progressContainer'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    currentPaper: document.getElementById('currentPaper'),
    retryQueue: document.getElementById('retryQueue'),
    retryCount: document.getElementById('retryCount'),

    // Stats elements
    successCount: document.getElementById('successCount'),
    failCount: document.getElementById('failCount'),
    timeElapsed: document.getElementById('timeElapsed'),
    sourceStats: document.getElementById('sourceStats'),
    paperCount: document.getElementById('paperCount'),

    // Settings elements
    delaySlider: document.getElementById('delaySlider'),
    delayValue: document.getElementById('delayValue'),
    userEmail: document.getElementById('userEmail'),
    formatIndent: document.getElementById('formatIndent'),
    sortAlphabetically: document.getElementById('sortAlphabetically'),
    includeComments: document.getElementById('includeComments'),
    autoSaveHistory: document.getElementById('autoSaveHistory'),
    retrySlider: document.getElementById('retrySlider'),
    retryValue: document.getElementById('retryValue'),
    enableDarkMode: document.getElementById('enableDarkMode'),
    enableShortcuts: document.getElementById('enableShortcuts'),
    enableAnalytics: document.getElementById('enableAnalytics'),
    enableOffline: document.getElementById('enableOffline'),
    resetSettings: document.getElementById('resetSettings'),
    saveSettings: document.getElementById('saveSettings'),

    // History elements
    historyCount: document.getElementById('historyCount'),
    lastHistoryDate: document.getElementById('lastHistoryDate'),
    historySuccessRate: document.getElementById('historySuccessRate'),
    historyList: document.getElementById('historyList'),
    clearHistory: document.getElementById('clearHistory'),
    exportHistory: document.getElementById('exportHistory'),
    historySearch: document.getElementById('historySearch'),
    historySourceFilter: document.getElementById('historySourceFilter'),
    historySortOrder: document.getElementById('historySortOrder'),
    folderChips: document.getElementById('folderChips'),
    newFolderBtn: document.getElementById('newFolderBtn'),

    // UI elements
    inputTypeIndicator: document.getElementById('inputTypeIndicator'),
    inputCount: document.getElementById('inputCount'),
    inputTypeSelector: document.querySelectorAll('.input-type-btn'),
    keyboardHelp: document.getElementById('keyboardHelp'),
    showKeyboardHelp: document.getElementById('showKeyboardHelp'),
    closeKeyboardHelp: document.getElementById('closeKeyboardHelp'),
    keyboardShortcutsLink: document.getElementById('keyboardShortcutsLink'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    darkModeToggleFloating: document.getElementById('darkModeToggleFloating'),
    installPrompt: document.getElementById('installPrompt'),
    installLater: document.getElementById('installLater'),
    installNow: document.getElementById('installNow'),
    privacyLink: document.getElementById('privacyLink'),
    privacyModal: document.getElementById('privacyModal'),
    closePrivacy: document.getElementById('closePrivacy'),
    menuToggle: document.getElementById('menuToggle'),
    toastContainer: document.getElementById('toastContainer'),
    liveRegion: document.getElementById('liveRegion'),
    navHistoryBtn: document.getElementById('navHistoryBtn'),
    navSettingsBtn: document.getElementById('navSettingsBtn'),
    historyPanel: document.getElementById('historyPanel'),
    settingsPanel: document.getElementById('settingsPanel'),
    closeHistory: document.getElementById('closeHistory'),
    closeSettings: document.getElementById('closeSettings'),
    donateBtn: document.getElementById('donateBtn'),
    newsletterForm: document.getElementById('newsletterForm'),
    offlineStatus: document.getElementById('offlineStatus'),
    appVersion: document.getElementById('appVersion'),

    // Share
    sharePanel: document.getElementById('sharePanel'),
    shareLinkInput: document.getElementById('shareLinkInput'),
    copyShareLink: document.getElementById('copyShareLink'),
    closeSharePanel: document.getElementById('closeSharePanel'),

    // Dedup
    dedupPanel: document.getElementById('dedupPanel'),
    dedupSummary: document.getElementById('dedupSummary'),
    dedupRemoveBtn: document.getElementById('dedupRemoveBtn'),
    dedupDismissBtn: document.getElementById('dedupDismissBtn'),

    // Editor
    editorModal: document.getElementById('editorModal'),
    closeEditor: document.getElementById('closeEditor'),
    closeEditorBottom: document.getElementById('closeEditorBottom'),
    saveEditor: document.getElementById('saveEditor'),

    // Folder modal
    folderModal: document.getElementById('folderModal'),
    folderNameInput: document.getElementById('folderNameInput'),
    closeFolder: document.getElementById('closeFolder'),
    closeFolderBottom: document.getElementById('closeFolderBottom'),
    createFolderBtn: document.getElementById('createFolderBtn')
};

// ===========================
// UTILITY FUNCTIONS
// ===========================

function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `
        <i class="fas ${iconMap[type]}"></i>
        <span>${message}</span>
    `;

    elements.toastContainer.appendChild(toast);
    announceToScreenReader(message);

    const displayDuration = type !== 'info' ? Math.max(duration, 5000) : duration;
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, displayDuration);
}

function announceToScreenReader(message, priority = 'polite') {
    elements.liveRegion.setAttribute('aria-live', priority);
    elements.liveRegion.textContent = message;

    // Clear after announcement
    setTimeout(() => {
        elements.liveRegion.textContent = '';
    }, 1000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Escape a value for safe use in an HTML attribute
function escapeAttr(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Build a BibTeX entry from a field map — single source of truth for formatting
function buildBibtex(type, key, fields) {
    const indent = state.settings.formatIndent ? '  ' : '';
    const lines = Object.entries(fields)
        .filter(([, v]) => v != null && v !== '')
        .map(([k, v]) => `${indent}${k} = {${v}}`);
    return `@${type}{${key},\n${lines.join(',\n')}\n}`;
}



function detectInputType(text) {
    const lines = text.trim().split('\n').filter(line => line.trim());

    if (lines.length === 0) return 'titles';

    // Check for DOIs
    const doiPattern = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
    const doiLines = lines.filter(line => doiPattern.test(line.trim()));
    if (doiLines.length === lines.length) return 'doi';
    if (doiLines.length > lines.length / 2) return 'mixed-doi';

    // Check for arXiv IDs
    const arxivPattern = /^\d{4}\.\d{4,5}(v\d+)?$/;
    const arxivLines = lines.filter(line => arxivPattern.test(line.trim()));
    if (arxivLines.length === lines.length) return 'arxiv';
    if (arxivLines.length > lines.length / 2) return 'mixed-arxiv';

    // Default to titles
    return 'titles';
}

function updateInputTypeUI(type) {
    state.detectedInputType = type;

    const typeMap = {
        'titles': { text: 'Paper Titles', icon: 'fa-font', color: 'var(--primary)' },
        'doi': { text: 'DOIs', icon: 'fa-link', color: 'var(--secondary)' },
        'arxiv': { text: 'arXiv IDs', icon: 'fa-atom', color: '#b31b1b' },
        'mixed-doi': { text: 'Mixed (Mostly DOIs)', icon: 'fa-random', color: 'var(--warning)' },
        'mixed-arxiv': { text: 'Mixed (Mostly arXiv)', icon: 'fa-random', color: '#185adb' }
    };

    const info = typeMap[type] || typeMap.titles;
    elements.inputTypeIndicator.innerHTML = `
        <i class="fas ${info.icon}" style="color: ${info.color}"></i>
        ${info.text}
    `;

    // Update input type buttons
    elements.inputTypeSelector.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.type === type.split('-')[0]) {
            btn.classList.add('active');
        }
    });
}

function updatePaperCount() {
    const text = elements.paperInput.value.trim();
    const lines = text.split('\n').filter(line => line.trim());
    const count = lines.length;

    elements.paperCount.textContent = `${count} paper${count !== 1 ? 's' : ''} ready`;
    elements.inputCount.textContent = `${count} item${count !== 1 ? 's' : ''}`;

    // Update input type detection
    if (count > 0) {
        const type = detectInputType(text);
        updateInputTypeUI(type);
        validateInputLines(lines);
        showDedupWarning(lines);
    } else {
        elements.inputTypeIndicator.textContent = 'Waiting for input...';
        const panel = document.getElementById('lineValidation');
        if (panel) panel.classList.add('hidden');
    }

    // Enable/disable generate button
    elements.generateBtn.disabled = count === 0;

    // Store in input history for undo
    if (text !== '' && state.inputHistory[state.currentInputIndex] !== text) {
        state.inputHistory.push(text);
        state.currentInputIndex = state.inputHistory.length - 1;
        elements.undoBtn.disabled = false;
    }
}

// Per-line validation: flag malformed DOIs so users know before hitting Generate
function validateInputLines(lines) {
    const panel = document.getElementById('lineValidation');
    const summary = document.getElementById('lineValidationSummary');
    const issuesList = document.getElementById('lineValidationIssues');
    if (!panel || !summary || !issuesList) return;

    const doiLike = /10\./;       // starts with 10. but might still be malformed
    const validDoi = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
    const validArxiv = /^\d{4}\.\d{4,5}(v\d+)?$/;

    const issues = [];
    lines.forEach((line, i) => {
        const trimmed = line.trim();
        // Looks like a DOI attempt but fails validation
        if (doiLike.test(trimmed) && !validDoi.test(trimmed)) {
            issues.push({ lineNum: i + 1, text: trimmed, reason: 'Malformed DOI' });
        }
        // Looks like an arXiv attempt (4 digits dot ...) but fails
        else if (/^\d{4}\.\d+/.test(trimmed) && !validArxiv.test(trimmed)) {
            issues.push({ lineNum: i + 1, text: trimmed, reason: 'Malformed arXiv ID' });
        }
    });

    panel.classList.remove('hidden');

    if (issues.length === 0) {
        summary.innerHTML = `<i class="fas fa-check-circle" style="color:var(--success)"></i> All lines look valid`;
        issuesList.classList.add('hidden');
        issuesList.innerHTML = '';
    } else {
        summary.innerHTML = `<i class="fas fa-exclamation-triangle" style="color:var(--warning)"></i> <strong>${issues.length}</strong> line${issues.length > 1 ? 's' : ''} may cause API failures — fix before generating`;
        issuesList.classList.remove('hidden');
        issuesList.innerHTML = issues.map(issue =>
            `<div class="validation-issue">
                <span class="validation-linenum">Line ${issue.lineNum}</span>
                <span class="validation-reason">${issue.reason}</span>
                <span class="validation-text">${escapeAttr(issue.text.substring(0, 60))}${issue.text.length > 60 ? '…' : ''}</span>
            </div>`
        ).join('');
    }
}

// ===========================
// API FUNCTIONS (ENHANCED)
// ===========================

async function fetchFromCrossref(title, type = 'title') {
    const email = state.settings.email || 'citation-fetcher@github.io';
    let url;

    if (type === 'doi') {
        const cleanDOI = title.replace(/^(https?:\/\/)?(doi\.org\/)?/, '');
        url = `https://api.crossref.org/works/${cleanDOI}?mailto=${email}`;
    } else {
        const encodedQuery = encodeURIComponent(title);
        url = `https://api.crossref.org/works?query.title=${encodedQuery}&rows=1&mailto=${email}`;
    }

    try {
        const response = await fetchWithRetry(url);
        if (!response.ok) throw new Error(`Crossref API error: ${response.status}`);

        const data = await response.json();

        if (type === 'doi') {
            return {
                bibtex: convertCrossrefToBibtex(data.message),
                raw: data.message,
                source: 'crossref'
            };
        } else if (data.message && data.message.items && data.message.items.length > 0) {
            return {
                bibtex: convertCrossrefToBibtex(data.message.items[0]),
                raw: data.message.items[0],
                source: 'crossref'
            };
        }
        return null;
    } catch (error) {
        return null;
    }
}

async function fetchFromArxiv(id, type = 'title') {
    let url;

    if (type === 'arxiv') {
        url = `https://export.arxiv.org/api/query?id_list=${id}`;
    } else {
        const encodedTitle = encodeURIComponent(id);
        url = `https://export.arxiv.org/api/query?search_query=ti:"${encodedTitle}"&max_results=1`;
    }

    try {
        const response = await fetchWithRetry(url);
        if (!response.ok) throw new Error(`ArXiv API error: ${response.status}`);

        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        const entry = xml.querySelector('entry');

        if (entry) {
            return {
                bibtex: convertArxivToBibtex(entry),
                raw: entry,
                source: 'arxiv'
            };
        }
        return null;
    } catch (error) {
        return null;
    }
}

async function fetchFromSemanticScholar(title, type = 'title') {
    let url;

    if (type === 'doi') {
        const cleanDOI = title.replace(/^(https?:\/\/)?(doi\.org\/)?/, '');
        url = `https://api.semanticscholar.org/graph/v1/paper/DOI:${cleanDOI}?fields=title,authors,year,venue,abstract,citationCount,referenceCount`;
    } else {
        const encodedTitle = encodeURIComponent(title);
        url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodedTitle}&limit=1&fields=title,authors,year,venue,abstract,citationCount,referenceCount`;
    }

    try {
        const response = await fetchWithRetry(url);
        if (!response.ok) throw new Error(`Semantic Scholar API error: ${response.status}`);

        const data = await response.json();

        if (type === 'doi' || (data.data && data.data.length > 0)) {
            const paper = type === 'doi' ? data : data.data[0];
            return {
                bibtex: convertSemanticToBibtex(paper),
                raw: paper,
                source: 'semantic',
                citationCount: paper.citationCount || null
            };
        }
        return null;
    } catch (error) {
        return null;
    }
}

async function fetchWithRetry(url, retries = state.settings.retryAttempts) {
    for (let i = 0; i <= retries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;

            if (response.status === 429) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                continue;
            }

            throw new Error(`HTTP ${response.status}`);
        } catch (error) {
            if (i === retries) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
    throw new Error(`Max retries exceeded for ${url}`);
}

// ===========================
// BIBTEX CONVERSION FUNCTIONS
// ===========================

function convertCrossrefToBibtex(item) {
    const authors = item.author?.map(a => {
        const family = a.family || '';
        const given = a.given || '';
        return `${family}, ${given}`.trim();
    }).join(' and ') || 'Unknown Author';

    const title = item.title?.[0] || 'Unknown Title';
    const year = item.published?.['date-parts']?.[0]?.[0] ||
                 item.created?.['date-parts']?.[0]?.[0] ||
                 new Date().getFullYear();
    const journal = item['container-title']?.[0] || '';
    const volume = item.volume || '';
    const number = item.issue || '';
    const pages = item.page || '';
    const doi = item.DOI || '';
    const publisher = item.publisher || '';

    const firstAuthor = item.author?.[0]?.family?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'unknown';
    const firstWord = title.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const key = `${firstAuthor}${year}${firstWord}`.substring(0, 50);
    const type = journal ? 'article' : 'misc';

    return buildBibtex(type, key, {
        author: authors,
        title: `{${title}}`,
        journal: journal || undefined,
        year,
        volume: volume || undefined,
        number: number || undefined,
        pages: pages || undefined,
        doi: doi || undefined,
        publisher: (!journal && publisher) ? publisher : undefined
    });
}

function convertArxivToBibtex(entry) {
    const title = entry.querySelector('title')?.textContent?.replace(/\n/g, ' ').trim() || 'Unknown Title';
    const authors = Array.from(entry.querySelectorAll('author name'))
        .map(a => a.textContent.trim())
        .join(' and ') || 'Unknown Author';
    const published = entry.querySelector('published')?.textContent?.substring(0, 4) || new Date().getFullYear();
    const arxivId = entry.querySelector('id')?.textContent?.split('/').pop()?.replace('abs/', '') || '';

    const firstAuthor = authors.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || 'unknown';
    const key = `${firstAuthor}${published}arxiv`;

    return buildBibtex('article', key, {
        author: authors,
        title: `{${title}}`,
        journal: 'arXiv preprint',
        year: published,
        note: arxivId ? `arXiv:${arxivId}` : undefined
    });
}

function convertSemanticToBibtex(paper) {
    const authors = paper.authors?.map(a => a.name).join(' and ') || 'Unknown Author';
    const title = paper.title || 'Unknown Title';
    const year = paper.year || new Date().getFullYear();
    const venue = paper.venue || '';
    const doi = paper.externalIds?.DOI || '';

    const firstAuthor = paper.authors?.[0]?.name?.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || 'unknown';
    const key = `${firstAuthor}${year}semantic`;
    const type = venue ? 'article' : 'misc';

    return buildBibtex(type, key, {
        author: authors,
        title: `{${title}}`,
        journal: venue || undefined,
        year,
        doi: doi || undefined
    });
}

// ===========================
// PROCESSING FUNCTIONS
// ===========================

async function processPapers() {
    const input = elements.paperInput.value.trim();
    if (!input) {
        showToast('Please enter some paper titles, DOIs, or arXiv IDs', 'error');
        return;
    }

    const lines = input.split('\n').filter(line => line.trim()).map(line => line.trim());
    const inputType = state.detectedInputType;

    if (lines.length > 100) {
        showToast(`Processing ${lines.length} papers (max 100 shown)`, 'warning');
        lines.splice(100);
    }

    // Switch to results tab
    switchTab('results');

    // Reset state
    state.isProcessing = true;
    state.results = [];
    state.stats = {
        success: 0,
        failed: 0,
        startTime: Date.now(),
        apiSource: { crossref: 0, arxiv: 0, semantic: 0 }
    };
    state.paperInputs = lines;

    // Update UI
    elements.generateBtn.classList.add('hidden');
    elements.cancelBtn.classList.remove('hidden');
    elements.progressContainer.classList.remove('hidden');
    elements.bibtexOutput.classList.add('hidden');
    updateStats();

    // Process each paper
    for (let i = 0; i < lines.length; i++) {
        if (!state.isProcessing) break;

        const input = lines[i];
        const progress = ((i + 1) / lines.length) * 100;

        // Update progress
        elements.progressFill.style.width = `${progress}%`;
        elements.progressText.textContent = `${i + 1}/${lines.length}`;
        elements.currentPaper.textContent = `Processing: ${input.substring(0, 100)}${input.length > 100 ? '...' : ''}`;

        // Detect type PER LINE so a DOI mixed in with titles is still
        // fetched correctly as a DOI, not searched as a title string.
        const lineType = detectInputType(input);
        const isLineDOI   = lineType.includes('doi');
        const isLineArxiv = lineType.includes('arxiv');

        let apiPriority = state.settings.apiPriority;
        if (apiPriority === 'auto') {
            if (isLineDOI)   apiPriority = 'crossref';
            else if (isLineArxiv) apiPriority = 'arxiv';
            else apiPriority = 'crossref';
        }

        // Fetch citation
        let result = null;
        let attempts = [];

        if (apiPriority === 'crossref') {
            attempts = [
                () => fetchFromCrossref(input, isLineDOI ? 'doi' : 'title'),
                () => fetchFromArxiv(input, isLineArxiv ? 'arxiv' : 'title'),
                () => fetchFromSemanticScholar(input, isLineDOI ? 'doi' : 'title')
            ];
        } else if (apiPriority === 'arxiv') {
            attempts = [
                () => fetchFromArxiv(input, isLineArxiv ? 'arxiv' : 'title'),
                () => fetchFromCrossref(input, isLineDOI ? 'doi' : 'title'),
                () => fetchFromSemanticScholar(input, isLineDOI ? 'doi' : 'title')
            ];
        }

        for (const attempt of attempts) {
            if (result) break;
            try {
                result = await attempt();
            } catch (error) {
                // Fetch attempt failed, try next
            }
        }

        // Store result
        if (result) {
            state.results.push({ bibtex: result.bibtex, raw: result.raw, source: result.source, input, citationCount: result.citationCount || null });
            state.stats.success++;
            state.stats.apiSource[result.source]++;

            if (state.settings.autoSaveHistory) {
                saveToHistory(input, result.bibtex, result.raw, result.source);
            }
        } else {
            state.results.push({ bibtex: `% Failed to fetch citation for: ${input}`, raw: { error: 'Not found', input }, source: 'none', input });
            state.stats.failed++;
        }

        updateStats();
        updatePreview();

        // Delay between requests
        if (i < lines.length - 1) {
            await new Promise(resolve => setTimeout(resolve, state.settings.delay * 1000));
        }
    }

    // Finish processing
    state.isProcessing = false;
    displayResults();

    // Always fetch similar papers when there are successful results.
    // Switch to results tab first so the user sees everything in one place.
    elements.cancelBtn.classList.add('hidden');
    elements.generateBtn.classList.remove('hidden');
    elements.progressContainer.classList.add('hidden');
    elements.bibtexOutput.classList.remove('hidden');

    if (state.stats.success > 0) {
        switchTab('results');
        fetchAndShowSimilarPapers();
    } else {
        document.getElementById('similarPapersSection')?.classList.add('hidden');
    }

    const successRate = Math.round((state.stats.success / lines.length) * 100);
    showToast(`Completed! ${state.stats.success} successful, ${state.stats.failed} failed (${successRate}% success rate)`,
              state.stats.failed > lines.length / 2 ? 'warning' : 'success');

    // Update history display
    if (state.settings.autoSaveHistory) {
        loadHistory();
    }
}

// ── Detect issues across all results (duplicates + unknowns) ────────
function detectResultIssues(results) {
    // Returns Map: index → string[]
    const issues = new Map();
    const add = (i, msg) => {
        if (!issues.has(i)) issues.set(i, []);
        issues.get(i).push(msg);
    };

    const normDOI   = doi  => (doi  || '').toLowerCase().trim().replace(/^https?:\/\/(dx\.)?doi\.org\//, '');
    const normTitle = t    => (t    || '').toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 60);

    const doiSeen   = new Map();
    const titleSeen = new Map();

    results.forEach((r, i) => {
        if (r.bibtex.startsWith('%')) return;

        const titleM  = r.bibtex.match(/title\s*=\s*\{+([^}]+)\}+/);
        const authorM = r.bibtex.match(/author\s*=\s*\{([^}]+)\}/);
        const doiM    = r.bibtex.match(/doi\s*=\s*\{([^}]+)\}/i);

        const rawTitle  = titleM  ? titleM[1].replace(/[{}]/g,'').trim() : '';
        const rawAuthor = authorM ? authorM[1].replace(/[{}]/g,'').trim() : '';

        // Unknown title or author
        const badTitle  = !rawTitle  || rawTitle.toLowerCase().includes('unknown')  || rawTitle.length < 4 || rawTitle === '1051';
        const badAuthor = !rawAuthor || rawAuthor.toLowerCase().includes('unknown') || rawAuthor === ','  || rawAuthor === ', ';
        if (badTitle)  add(i, 'unknown-title');
        if (badAuthor) add(i, 'unknown-author');

        // Duplicate DOI
        if (doiM) {
            const nd = normDOI(doiM[1]);
            if (nd) {
                if (doiSeen.has(nd)) { add(i, `dup-doi:${doiSeen.get(nd)}`); add(doiSeen.get(nd), `dup-doi:${i}`); }
                else doiSeen.set(nd, i);
            }
        }

        // Duplicate title
        if (rawTitle && !badTitle) {
            const nt = normTitle(rawTitle);
            if (titleSeen.has(nt)) { add(i, `dup-title:${titleSeen.get(nt)}`); add(titleSeen.get(nt), `dup-title:${i}`); }
            else titleSeen.set(nt, i);
        }
    });

    return issues;
}

function displayResults() {
    let output = '';

    if (state.settings.includeComments) {
        const elapsed = ((Date.now() - state.stats.startTime) / 1000).toFixed(1);
        output += `% Generated by Citation Fetcher v2.0\n`;
        output += `% Date: ${new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })}\n`;
        output += `% Total items: ${state.paperInputs.length}\n`;
        output += `% Successful: ${state.stats.success}, Failed: ${state.stats.failed}\n`;
        output += `% Processing time: ${elapsed}s\n`;
        output += `% Sources: Crossref (${state.stats.apiSource.crossref}), ArXiv (${state.stats.apiSource.arxiv}), Semantic Scholar (${state.stats.apiSource.semantic})\n`;
        output += `\n`;
    }

    // Detect issues and annotate BibTeX with inline comments
    const issues = detectResultIssues(state.results);
    let citations = state.results.map((r, i) => {
        if (r.bibtex.startsWith('%')) return r.bibtex;
        const flags = issues.get(i) || [];
        if (flags.length === 0) return r.bibtex;

        const comments = [];
        if (flags.some(f => f === 'unknown-title'))  comments.push('% WARNING: title could not be resolved — please verify manually');
        if (flags.some(f => f === 'unknown-author')) comments.push('% WARNING: author could not be resolved — please verify manually');
        if (flags.some(f => f.startsWith('dup-doi'))) {
            const other = parseInt(flags.find(f => f.startsWith('dup-doi')).split(':')[1]) + 1;
            comments.push(`% DUPLICATE: same DOI as citation #${other} — remove one`);
        }
        if (flags.some(f => f.startsWith('dup-title'))) {
            const other = parseInt(flags.find(f => f.startsWith('dup-title')).split(':')[1]) + 1;
            comments.push(`% DUPLICATE: same title as citation #${other} — remove one`);
        }
        return comments.join('\n') + '\n' + r.bibtex;
    });

    if (state.settings.sortAlphabetically) citations = [...citations].sort();
    output += citations.join('\n\n');

    elements.bibtexOutput.textContent = output;
    elements.rawDataOutput.textContent = JSON.stringify(state.results.map(r => r.raw), null, 2);

    // Store issues on state so updatePreview can use them
    state._issues = issues;

    // Show issue summary toast if any
    const unknownCount   = [...issues.values()].flat().filter(f => f.startsWith('unknown')).length;
    const duplicateCount = [...new Set([...issues.values()].flat().filter(f => f.startsWith('dup')))].length;
    if (unknownCount > 0 || duplicateCount > 0) {
        const parts = [];
        if (unknownCount   > 0) parts.push(`${unknownCount} unknown field${unknownCount > 1 ? 's' : ''}`);
        if (duplicateCount > 0) parts.push(`${Math.ceil(duplicateCount/2)} duplicate${duplicateCount > 2 ? 's' : ''}`);
        showToast(`Issues found: ${parts.join(', ')} — check Preview tab`, 'warning', 6000);
    }
}

function updateStats() {
    const elapsed = ((Date.now() - state.stats.startTime) / 1000).toFixed(1);
    elements.successCount.textContent = state.stats.success;
    elements.failCount.textContent = state.stats.failed;
    elements.timeElapsed.textContent = `${elapsed}s`;

    const sourceText = [
        state.stats.apiSource.crossref > 0 ? `Crossref: ${state.stats.apiSource.crossref}` : '',
        state.stats.apiSource.arxiv > 0 ? `ArXiv: ${state.stats.apiSource.arxiv}` : '',
        state.stats.apiSource.semantic > 0 ? `Semantic: ${state.stats.apiSource.semantic}` : ''
    ].filter(Boolean).join(', ');

    elements.sourceStats.textContent = sourceText || '-';
}

function updatePreview() {
    const previewContainer = elements.citationPreview;
    previewContainer.innerHTML = '';

    const issues = state._issues || new Map();

    state.results.forEach((result, index) => {
        const { bibtex, source } = result;
        const failed = bibtex.startsWith('%');
        const flags  = issues.get(index) || [];

        const hasDuplicate = flags.some(f => f.startsWith('dup'));
        const hasUnknown   = flags.some(f => f.startsWith('unknown'));

        const item = document.createElement('div');
        let itemClass = `citation-item ${failed ? 'citation-failed' : 'citation-ok'}`;
        if (hasUnknown)   itemClass += ' has-error';
        else if (hasDuplicate) itemClass += ' has-warning';
        item.className = itemClass;

        if (failed) {
            const inputText = result.input || bibtex.replace(/^% Failed to fetch citation for:\s*/, '');
            item.innerHTML = `
                <div class="citation-status-bar">
                    <span class="ci-status-badge ci-failed"><i class="fas fa-times-circle"></i> Not found</span>
                    <span class="ci-input-label">${escapeAttr(inputText.substring(0, 80))}${inputText.length > 80 ? '…' : ''}</span>
                </div>
                <div class="ci-unknown-actions">
                    <span><i class="fas fa-exclamation-circle"></i> Could not fetch this citation</span>
                    <button class="btn-fix btn-fix-search" onclick="prefillAndSearch(${JSON.stringify(inputText)})">
                        <i class="fas fa-search"></i> Search manually
                    </button>
                    <button class="btn-fix" onclick="copyToInput(${JSON.stringify(inputText)})">
                        <i class="fas fa-pen"></i> Edit &amp; retry
                    </button>
                </div>`;
        } else {
            const titleMatch  = bibtex.match(/title\s*=\s*\{+([^}]+)\}+/);
            const authorMatch = bibtex.match(/author\s*=\s*\{([^}]+)\}/);
            const journalMatch= bibtex.match(/journal\s*=\s*\{([^}]+)\}/);
            const yearMatch   = bibtex.match(/year\s*=\s*\{([^}]+)\}/);

            const title   = titleMatch  ? titleMatch[1].replace(/[{}]/g, '')  : 'Unknown Title';
            const authors = authorMatch ? authorMatch[1].replace(/[{}]/g, '') : 'Unknown Authors';
            const journal = journalMatch? journalMatch[1].replace(/[{}]/g,'') : '';
            const year    = yearMatch   ? yearMatch[1] : '';

            const sourceLabel = { crossref: 'Crossref', arxiv: 'ArXiv', semantic: 'Semantic Scholar' }[source] || source;
            const sourceClass = source || 'unknown';

            // Build inline flag badges
            let flagBadges = '';
            if (hasDuplicate) flagBadges += `<span class="ci-flag ci-flag-duplicate" title="Duplicate citation detected"><i class="fas fa-clone"></i> Duplicate</span>`;
            if (hasUnknown)   flagBadges += `<span class="ci-flag ci-flag-unknown"   title="One or more fields could not be resolved"><i class="fas fa-question-circle"></i> Unresolved</span>`;

            // Citation count
            const citeCount = result.citationCount;
            const citeBadge = citeCount != null
                ? `<span class="ci-cite-badge" title="${citeCount.toLocaleString()} citations on Semantic Scholar"><i class="fas fa-quote-right"></i> ${citeCount.toLocaleString()}</span>`
                : '';

            // Make authors clickable
            const authorSpans = authors.split(' and ').map(a => {
                const name = a.trim();
                if (!name || name === 'Unknown Authors') return escapeAttr(name);
                return `<span class="ci-author-link" onclick="lookupAuthor('${escapeAttr(name.replace(/'/g, "\\'"))}')" title="Look up author on Semantic Scholar">${escapeAttr(name)}</span>`;
            }).join('<span class="ci-author-sep">, </span>');

            item.innerHTML = `
                <div class="citation-status-bar">
                    <span class="ci-status-badge ci-ok"><i class="fas fa-check-circle"></i> OK</span>
                    <span class="ci-source-badge ci-source-${sourceClass}">${sourceLabel}</span>
                    ${year ? `<span class="ci-year-badge">${year}</span>` : ''}
                    ${citeBadge}
                    ${flagBadges}
                    <button class="btn-small copy-preview ci-copy-btn" data-index="${index}">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                    <button class="btn-small ci-edit-btn" onclick="openEditor(${index})" title="Edit citation fields">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
                <h4 class="ci-title">${escapeAttr(title)}</h4>
                <div class="ci-authors">${authorSpans}</div>
                ${journal ? `<div class="ci-journal">${escapeAttr(journal)}</div>` : ''}
            `;

            // Unknown: add action prompt below the card body
            if (hasUnknown) {
                const unknownFields = [];
                if (flags.includes('unknown-title'))  unknownFields.push('title');
                if (flags.includes('unknown-author')) unknownFields.push('author');
                const fieldStr = unknownFields.join(' and ');
                const inputQuery = result.input || title;
                item.innerHTML += `
                    <div class="ci-unknown-actions">
                        <span><i class="fas fa-exclamation-triangle"></i> ${fieldStr} could not be resolved — verify or search manually</span>
                        <button class="btn-fix btn-fix-search" onclick="prefillAndSearch(${JSON.stringify(inputQuery)})">
                            <i class="fas fa-search"></i> Search Semantic Scholar
                        </button>
                        <button class="btn-fix" onclick="copyToInput(${JSON.stringify(inputQuery)})">
                            <i class="fas fa-pen"></i> Correct &amp; retry
                        </button>
                    </div>`;
            }

            // Duplicate: add banner below
            if (hasDuplicate) {
                const dupFlag = flags.find(f => f.startsWith('dup'));
                const otherIdx = parseInt(dupFlag.split(':')[1]) + 1;
                const isDOIDup = dupFlag.startsWith('dup-doi');
                item.innerHTML += `
                    <div class="ci-duplicate-banner">
                        <i class="fas fa-clone"></i>
                        <span>${isDOIDup ? 'Same DOI' : 'Same title'} as citation #${otherIdx} — remove one before exporting</span>
                    </div>`;
            }
        }

        previewContainer.appendChild(item);
    });

    // Event delegation for copy buttons
    previewContainer.onclick = (e) => {
        const btn = e.target.closest('.copy-preview');
        if (!btn) return;
        const index = parseInt(btn.dataset.index);
        const bibtex = state.results[index]?.bibtex;
        if (!bibtex) return;
        navigator.clipboard.writeText(bibtex).then(() => showToast('Copied citation to clipboard', 'success'));
    };
}

// Helper: prefill input with query and open Semantic Scholar in new tab
function prefillAndSearch(query) {
    const url = `https://www.semanticscholar.org/search?q=${encodeURIComponent(query)}&sort=Relevance`;
    window.open(url, '_blank', 'noopener');
    showToast('Opened Semantic Scholar — copy the DOI and add it to your queue', 'info', 5000);
}

// Helper: copy original input back into textarea so user can correct it
function copyToInput(query) {
    switchTab('input');
    const current = elements.paperInput.value.trim();
    // Add to box only if not already present
    if (!current.includes(query)) {
        elements.paperInput.value = current ? current + '\n' + query : query;
        updatePaperCount();
    }
    elements.paperInput.focus();
    showToast('Input copied to queue — correct it and regenerate', 'info', 4000);
}

// ===========================
// HISTORY FUNCTIONS
// ===========================

function saveToHistory(input, bibtex, raw, source) {
    const history = JSON.parse(localStorage.getItem('citationHistory') || '[]');

    history.unshift({
        id: Date.now(),
        input: input,
        bibtex: bibtex,
        raw: raw,
        source: source,
        date: new Date().toISOString(),
        success: !bibtex.startsWith('%')
    });

    // Keep only last 100 entries
    if (history.length > 100) {
        history.splice(100);
    }

    localStorage.setItem('citationHistory', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('citationHistory') || '[]');
    state.history = history;

    elements.historyCount.textContent = history.length;

    if (history.length > 0) {
        const lastDate = new Date(history[0].date);
        elements.lastHistoryDate.textContent = lastDate.toLocaleDateString();

        const successCount = history.filter(item => item.success).length;
        const successRate = Math.round((successCount / history.length) * 100);
        elements.historySuccessRate.textContent = `${successRate}%`;
    } else {
        elements.lastHistoryDate.textContent = 'Never';
        elements.historySuccessRate.textContent = '0%';
    }

    renderHistoryList();
}

function renderHistoryList() {
    const historyList = elements.historyList;

    // Read filter values directly from DOM for reliability
    const searchInput  = document.getElementById('historySearch');
    const sourceFilter = document.getElementById('historySourceFilter');
    const sortOrder    = document.getElementById('historySortOrder');

    const searchTerm = (searchInput?.value || '').toLowerCase().trim();
    const sourceVal  = sourceFilter?.value || 'all';
    const sortVal    = sortOrder?.value || 'newest';

    // Get active folder
    const activeChip = document.querySelector('.folder-chip.active');
    const activeFolder = activeChip ? activeChip.dataset.folder : 'all';

    let filtered = [...state.history];

    // Folder filter
    if (activeFolder && activeFolder !== 'all') {
        const folders = getFolders();
        const folder = folders.find(f => f.name === activeFolder);
        if (folder) {
            const folderItemIds = new Set(folder.items.map(i => i.id));
            filtered = filtered.filter(item => folderItemIds.has(item.id));
        }
    }

    // Text search
    if (searchTerm) {
        filtered = filtered.filter(item => {
            const title = (item.bibtex.match(/title\s*=\s*\{([^}]+)\}/)?.[1] || '').toLowerCase();
            const input = (item.input || '').toLowerCase();
            const source = (item.source || '').toLowerCase();
            return title.includes(searchTerm) || input.includes(searchTerm) || source.includes(searchTerm);
        });
    }

    // Source filter
    if (sourceVal && sourceVal !== 'all') {
        filtered = filtered.filter(item => item.source === sourceVal);
    }

    // Sort
    if (sortVal === 'oldest') filtered.reverse();
    else if (sortVal === 'az') {
        filtered.sort((a, b) => {
            const ta = (a.bibtex.match(/title\s*=\s*\{([^}]+)\}/)?.[1] || a.input || '').toLowerCase();
            const tb = (b.bibtex.match(/title\s*=\s*\{([^}]+)\}/)?.[1] || b.input || '').toLowerCase();
            return ta.localeCompare(tb);
        });
    }

    if (filtered.length === 0) {
        const hasFilters = searchTerm || sourceVal !== 'all' || (activeFolder && activeFolder !== 'all');
        historyList.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-${state.history.length === 0 ? 'history' : 'search'} fa-3x"></i>
                <h4>${state.history.length === 0 ? 'No History Yet' : 'No Matching Citations'}</h4>
                <p>${state.history.length === 0
                    ? 'Your fetched citations will appear here for quick access'
                    : hasFilters
                        ? 'No citations match your search or filter. Try different terms.'
                        : 'No citations in this folder yet.'}</p>
                ${state.history.length === 0 ? `<button class="btn-primary" onclick="switchTab('input')">
                    <i class="fas fa-plus"></i> Start Generating
                </button>` : ''}
            </div>
        `;
        return;
    }

    // Show result count when filtering
    let resultInfo = '';
    if (searchTerm || sourceVal !== 'all' || (activeFolder && activeFolder !== 'all')) {
        resultInfo = `<div class="history-result-info">Showing ${filtered.length} of ${state.history.length} citation${state.history.length !== 1 ? 's' : ''}</div>`;
    }

    historyList.innerHTML = resultInfo;

    filtered.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';

        const date = new Date(item.date);
        const title = item.bibtex.match(/title\s*=\s*\{([^}]+)\}/)?.[1]?.replace(/[{}]/g, '') || item.input.substring(0, 100);

        historyItem.innerHTML = `
            <div class="history-item-header">
                <div class="history-item-title">${title}</div>
                <div class="history-item-date">${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
            <div class="history-item-source">
                <span class="badge ${item.source}">${item.source.toUpperCase()}</span>
                <span class="status ${item.success ? 'success' : 'failed'}">
                    <i class="fas fa-${item.success ? 'check' : 'times'}"></i>
                </span>
            </div>
            <div class="history-item-preview">${item.bibtex.substring(0, 200)}${item.bibtex.length > 200 ? '...' : ''}</div>
            <div class="history-item-actions">
                <button class="btn-small copy-history" data-id="${item.id}">
                    <i class="fas fa-copy"></i> Copy
                </button>
                <button class="btn-small load-history" data-id="${item.id}">
                    <i class="fas fa-redo"></i> Reuse
                </button>
                <button class="btn-small delete-history" data-id="${item.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
                <div class="folder-add-wrapper">
                    <button class="btn-small add-to-folder" data-id="${item.id}" title="Add to folder">
                        <i class="fas fa-folder-plus"></i>
                    </button>
                    <select class="folder-select hidden" data-id="${item.id}">
                        <option value="">Add to folder...</option>
                    </select>
                </div>
            </div>
        `;

        historyList.appendChild(historyItem);
    });

    // Add event listeners
    document.querySelectorAll('.copy-history').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('button').dataset.id);
            const item = state.history.find(h => h.id === id);
            if (item) {
                navigator.clipboard.writeText(item.bibtex).then(() => {
                    showToast('Copied citation to clipboard', 'success');
                });
            }
        });
    });

    document.querySelectorAll('.load-history').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('button').dataset.id);
            const item = state.history.find(h => h.id === id);
            if (item) {
                switchTab('input');
                elements.paperInput.value = item.input;
                updatePaperCount();
                showToast('Input loaded from history', 'info');
            }
        });
    });

    document.querySelectorAll('.delete-history').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('button').dataset.id);
            deleteHistoryItem(id);
        });
    });
}

function deleteHistoryItem(id) {
    const history = JSON.parse(localStorage.getItem('citationHistory') || '[]');
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem('citationHistory', JSON.stringify(filtered));
    loadHistory();
    showToast('Item removed from history', 'info');
}

function clearAllHistory() {
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
        localStorage.removeItem('citationHistory');
        loadHistory();
        showToast('History cleared', 'success');
    }
}

function exportHistory() {
    const history = JSON.parse(localStorage.getItem('citationHistory') || '[]');
    const exportData = {
        version: '2.0',
        exportedAt: new Date().toISOString(),
        itemCount: history.length,
        items: history
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citation-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('History exported successfully', 'success');
}

// ===========================
// UI FUNCTIONS
// ===========================

function switchTab(tabName) {
    // Input/results are always visible; just focus or scroll
    if (tabName === 'input') {
        elements.paperInput.focus();
        return;
    }
    if (tabName === 'results') {
        document.getElementById('bibtexView')?.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    // History and Settings toggle slide panels
    if (tabName === 'history') {
        toggleSlidePanel('history');
        return;
    }
    if (tabName === 'settings') {
        toggleSlidePanel('settings');
        return;
    }
}

function bindHistorySearch() {
    const searchInput = document.getElementById('historySearch');
    const sourceSel   = document.getElementById('historySourceFilter');
    const sortSel     = document.getElementById('historySortOrder');

    if (searchInput) {
        const newInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newInput, searchInput);
        newInput.addEventListener('input', debounce(renderHistoryList, 250));
        newInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); renderHistoryList(); } });
    }
    if (sourceSel) {
        const newSel = sourceSel.cloneNode(true);
        sourceSel.parentNode.replaceChild(newSel, sourceSel);
        newSel.addEventListener('change', () => renderHistoryList());
    }
    if (sortSel) {
        const newSel = sortSel.cloneNode(true);
        sortSel.parentNode.replaceChild(newSel, sortSel);
        newSel.addEventListener('change', () => renderHistoryList());
    }
}

function toggleSlidePanel(panelName) {
    const panel = panelName === 'history' ? elements.historyPanel : elements.settingsPanel;
    const otherPanel = panelName === 'history' ? elements.settingsPanel : elements.historyPanel;

    if (otherPanel && otherPanel.classList.contains('open')) {
        otherPanel.classList.remove('open');
        removeSlideOverlay();
    }

    const isOpening = !panel.classList.contains('open');
    if (isOpening) {
        panel.classList.add('open');
        addSlideOverlay(panel);
        if (panelName === 'history') {
            loadHistory();
            bindHistorySearch();
        }
    } else {
        panel.classList.remove('open');
        removeSlideOverlay();
    }
}

function addSlideOverlay(panel) {
    removeSlideOverlay();
    const overlay = document.createElement('div');
    overlay.className = 'slide-overlay';
    overlay.id = 'slideOverlay';
    overlay.addEventListener('click', () => {
        panel.classList.remove('open');
        removeSlideOverlay();
    });
    document.body.appendChild(overlay);
}

function removeSlideOverlay() {
    const overlay = document.getElementById('slideOverlay');
    if (overlay) overlay.remove();
}

function switchView(viewName) {
    document.querySelectorAll('.results-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === viewName) {
            btn.classList.add('active');
        }
    });

    document.querySelectorAll('.result-view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(`${viewName}View`).classList.add('active');
}

function loadExample() {
    const example = `Attention Is All You Need
10.48550/arXiv.1706.03762
1706.03762v5
BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding
Deep Residual Learning for Image Recognition
10.1145/3065386
ImageNet Classification with Deep Convolutional Neural Networks
Generative Adversarial Networks`;

    elements.paperInput.value = example;
    updatePaperCount();
    showToast('Example papers loaded', 'success');
}

function clearAll() {
    if (elements.paperInput.value.trim() || state.inputHistory.length > 0) {
        if (confirm('Clear all input?')) {
            state.inputHistory.push(elements.paperInput.value);
            state.currentInputIndex = state.inputHistory.length - 1;
            elements.paperInput.value = '';
            updatePaperCount();
            clearFile();
            showToast('Cleared all inputs', 'info');
        }
    } else {
        showToast('Nothing to clear', 'warning');
    }
}

function undoInput() {
    if (state.currentInputIndex > 0) {
        state.currentInputIndex--;
        elements.paperInput.value = state.inputHistory[state.currentInputIndex];
        updatePaperCount();
        showToast('Undo successful', 'success');
    } else {
        showToast('Nothing to undo', 'warning');
        elements.undoBtn.disabled = true;
    }
}

function copyToClipboard() {
    const format = elements.exportFormat.value;
    let text;

    if (format === 'bibtex') {
        text = elements.bibtexOutput.textContent;
    } else if (format === 'ris') {
        text = convertToRIS(state.results);
    } else if (format === 'plain') {
        text = convertToPlainText(state.results);
    } else {
        text = convertToCitationStyle(state.results.map(r => r.raw), format);
    }

    navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied as ${format.toUpperCase()} to clipboard!`, 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

function downloadBib() {
    const format = elements.exportFormat.value;
    let text, filename;

    if (format === 'bibtex') {
        text = elements.bibtexOutput.textContent;
        filename = 'citations.bib';
    } else if (format === 'ris') {
        text = convertToRIS(state.results);
        filename = 'citations.ris';
    } else if (format === 'plain') {
        text = convertToPlainText(state.results);
        filename = 'citations.txt';
    } else {
        text = convertToCitationStyle(state.results.map(r => r.raw), format);
        filename = `citations.${format}.txt`;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`, 'success');
}

function shareResults() {
    if (navigator.share) {
        const text = elements.bibtexOutput.textContent.substring(0, 100) + '...';
        navigator.share({
            title: 'Citations from Citation Fetcher',
            text: `I found ${state.stats.success} citations using Citation Fetcher!`,
            url: window.location.href
        }).then(() => {
            showToast('Shared successfully!', 'success');
        }).catch(() => {
            copyToClipboard();
        });
    } else {
        copyToClipboard();
    }
}

function convertToPlainText(results) {
    return results.map((result, index) => {
        const bibtex = result.bibtex || result; // accept both result objects and raw strings
        if (bibtex.startsWith('%')) return bibtex;

        const titleMatch = bibtex.match(/title\s*=\s*\{([^}]+)\}/);
        const authorMatch = bibtex.match(/author\s*=\s*\{([^}]+)\}/);
        const journalMatch = bibtex.match(/journal\s*=\s*\{([^}]+)\}/);
        const yearMatch = bibtex.match(/year\s*=\s*\{([^}]+)\}/);

        const title = titleMatch ? titleMatch[1].replace(/[{}]/g, '') : 'Unknown Title';
        const authors = authorMatch ? authorMatch[1].replace(/[{}]/g, '').replace(/ and /g, ', ') : 'Unknown Authors';
        const journal = journalMatch ? journalMatch[1].replace(/[{}]/g, '') : '';
        const year = yearMatch ? yearMatch[1] : '';

        return `${index + 1}. ${authors} (${year}). ${title}. ${journal}`.trim();
    }).join('\n\n');
}

function convertToCitationStyle(data, style) {
    const styles = {
        apa: (item) => {
            const authors = item.author || item.authors || [];
            const authorStr = authors.map(a => {
                if (typeof a === 'string') return a;
                const family = a.family || a.name?.split(' ').pop() || '';
                const given = a.given || a.name?.split(' ')[0] || '';
                return `${family}, ${given.charAt(0)}.`;
            }).join(', ');

            const year = item.year || item.published?.['date-parts']?.[0]?.[0] || '';
            const title = item.title?.[0] || item.title || '';
            const journal = item['container-title']?.[0] || item.venue || '';
            const volume = item.volume || '';
            const issue = item.issue || '';
            const pages = item.page || '';
            const doi = item.DOI || item.externalIds?.DOI || '';

            let citation = `${authorStr} (${year}). ${title}. `;
            if (journal) citation += `${journal}`;
            if (volume) citation += `, ${volume}`;
            if (issue) citation += `(${issue})`;
            if (pages) citation += `, ${pages}`;
            if (doi) citation += `. https://doi.org/${doi}`;

            return citation;
        },

        mla: (item) => {
            const authors = item.author || item.authors || [];
            const authorStr = authors.map(a => {
                if (typeof a === 'string') return a;
                const family = a.family || a.name?.split(' ').pop() || '';
                const given = a.given || a.name?.split(' ')[0] || '';
                return `${family}, ${given}`;
            }).join(', ');

            const title = item.title?.[0] || item.title || '';
            const journal = item['container-title']?.[0] || item.venue || '';
            const volume = item.volume || '';
            const issue = item.issue || '';
            const year = item.year || item.published?.['date-parts']?.[0]?.[0] || '';
            const pages = item.page || '';

            let citation = `${authorStr}. "${title}." `;
            if (journal) citation += `<em>${journal}</em>`;
            if (volume) citation += `, vol. ${volume}`;
            if (issue) citation += `, no. ${issue}`;
            if (year) citation += `, ${year}`;
            if (pages) citation += `, pp. ${pages}`;
            citation += '.';

            return citation;
        },

        chicago: (item) => {
            const authors = item.author || item.authors || [];
            const authorStr = authors.map((a, i) => {
                if (typeof a === 'string') return a;
                const family = a.family || a.name?.split(' ').pop() || '';
                const given = a.given || a.name?.split(' ')[0] || '';
                return `${given} ${family}`;
            }).join(', ');

            const title = item.title?.[0] || item.title || '';
            const journal = item['container-title']?.[0] || item.venue || '';
            const volume = item.volume || '';
            const issue = item.issue || '';
            const year = item.year || item.published?.['date-parts']?.[0]?.[0] || '';
            const pages = item.page || '';
            const doi = item.DOI || item.externalIds?.DOI || '';

            let citation = `${authorStr}. "${title}." `;
            if (journal) citation += `<em>${journal}</em>`;
            if (volume) citation += ` ${volume}`;
            if (issue) citation += `, no. ${issue}`;
            if (year) citation += ` (${year})`;
            if (pages) citation += `: ${pages}`;
            if (doi) citation += `. https://doi.org/${doi}`;

            return citation;
        },

        harvard: (item) => {
            const authors = item.author || item.authors || [];
            const authorStr = authors.map((a, i) => {
                if (typeof a === 'string') return a;
                const family = a.family || a.name?.split(' ').pop() || '';
                return family;
            }).join(', ');

            const year = item.year || item.published?.['date-parts']?.[0]?.[0] || '';
            const title = item.title?.[0] || item.title || '';
            const journal = item['container-title']?.[0] || item.venue || '';
            const volume = item.volume || '';
            const issue = item.issue || '';
            const pages = item.page || '';

            return `${authorStr} (${year}) '${title}', <em>${journal}</em>, ${volume}(${issue}), pp. ${pages}.`;
        }
    };

    return data.filter(item => !item.error).map((item, index) => {        try {
            return styles[style] ? styles[style](item) : `[${style} format not available]`;
        } catch (error) {
            return `Error formatting citation ${index + 1}`;
        }
    }).join('\n\n');
}

function convertToRIS(results) {
    const lines = [];
    results.forEach((result) => {
        const bibtex = result.bibtex || result;
        if (bibtex.startsWith('%')) return;

        const titleM  = bibtex.match(/title\s*=\s*\{+([^}]+)\}+/);
        const authorM = bibtex.match(/author\s*=\s*\{([^}]+)\}/);
        const journalM= bibtex.match(/journal\s*=\s*\{([^}]+)\}/);
        const yearM   = bibtex.match(/year\s*=\s*\{([^}]+)\}/);
        const doiM    = bibtex.match(/doi\s*=\s*\{([^}]+)\}/i);
        const volumeM = bibtex.match(/volume\s*=\s*\{([^}]+)\}/);
        const numberM = bibtex.match(/number\s*=\s*\{([^}]+)\}/);
        const pagesM  = bibtex.match(/pages\s*=\s*\{([^}]+)\}/);

        const title   = titleM   ? titleM[1].replace(/[{}]/g,'')  : '';
        const authors = authorM  ? authorM[1].replace(/[{}]/g,'') : '';
        const journal = journalM ? journalM[1].replace(/[{}]/g,'') : '';
        const year    = yearM    ? yearM[1] : '';
        const doi     = doiM     ? doiM[1] : '';
        const volume  = volumeM  ? volumeM[1] : '';
        const number  = numberM  ? numberM[1] : '';
        const pages   = pagesM   ? pagesM[1] : '';

        const type = journal ? 'JOUR' : 'GEN';
        lines.push('TY  - ' + type);
        lines.push('TI  - ' + title);
        authors.split(' and ').forEach(a => {
            const trimmed = a.trim();
            if (trimmed) lines.push('AU  - ' + trimmed);
        });
        if (journal) lines.push('JO  - ' + journal);
        if (year)    lines.push('PY  - ' + year);
        if (volume)  lines.push('VL  - ' + volume);
        if (number)  lines.push('IS  - ' + number);
        if (pages)   lines.push('SP  - ' + pages);
        if (doi)     lines.push('DO  - ' + doi);
        lines.push('ER  - ');
        lines.push('');
    });
    return lines.join('\n');
}

// ===========================
// FILE HANDLING (ENHANCED)
// ===========================

function handleFileUpload(event) {
    let file;

    if (event.type === 'drop') {
        file = event.dataTransfer.files[0];
        elements.fileInput.files = event.dataTransfer.files;
    } else {
        file = event.target.files[0];
    }

    if (!file) return;

    // Validate file type
    const validTypes = ['text/plain', 'application/pdf', 'application/x-bibtex'];
    const validExtensions = ['.txt', '.pdf', '.bib'];
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (!validExtensions.includes(extension) && !validTypes.includes(file.type)) {
        showToast('Please upload a .txt, .pdf, or .bib file', 'error');
        resetFileInput();
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showToast('File too large. Maximum size is 5MB.', 'error');
        resetFileInput();
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            let content;

            if (extension === '.pdf') {
                // PDF handling would require pdf.js library
                showToast('PDF text extraction requires additional setup', 'warning');
                content = extractTextFromPDF(e.target.result) || '';
            } else if (extension === '.bib') {
                content = parseBibFile(e.target.result);
            } else {
                content = e.target.result;
            }

            if (!content || content.trim().length === 0) {
                showToast('File is empty or could not be read', 'error');
                resetFileInput();
                return;
            }

            const lines = content.trim().split('\n')
                .filter(line => line.trim())
                .map(line => line.trim());

            if (lines.length === 0) {
                showToast('No valid content found in file', 'error');
                resetFileInput();
                return;
            }

            // Update UI
            elements.paperInput.value = content;
            elements.fileName.textContent = file.name;
            elements.fileCount.textContent = `${lines.length} item${lines.length !== 1 ? 's' : ''}`;
            elements.fileInfo.classList.remove('hidden');

            // Update paper count and input type
            updatePaperCount();

            showToast(`Loaded ${lines.length} items from ${file.name}`, 'success');

        } catch (error) {
            showToast('Error reading file', 'error');
            resetFileInput();
        }
    };

    reader.onerror = () => {
        showToast('Failed to read file', 'error');
        resetFileInput();
    };

    if (extension === '.pdf') {
        reader.readAsArrayBuffer(file);
    } else {
        reader.readAsText(file);
    }
}

function extractTextFromPDF(arrayBuffer) {
    // This is a placeholder for PDF text extraction
    // In production, you would use pdf.js or similar library
    showToast('PDF text extraction is not fully implemented in this version', 'info');
    return '';
}

function parseBibFile(content) {
    // Extract titles from BibTeX file
    const titleMatches = content.match(/title\s*=\s*\{([^}]+)\}/gi) || [];
    return titleMatches.map(match => {
        const title = match.match(/title\s*=\s*\{([^}]+)\}/i)[1];
        return title.replace(/[{}]/g, '');
    }).join('\n');
}

function resetFileInput() {
    elements.fileInput.value = '';
    elements.fileInfo.classList.add('hidden');
}

// ===========================
// SETTINGS MANAGEMENT
// ===========================

function updateSettings() {
    state.settings.delay = parseFloat(elements.delaySlider.value);
    state.settings.email = elements.userEmail.value;

    const apiPriority = document.querySelector('input[name="apiPriority"]:checked');
    if (apiPriority) {
        state.settings.apiPriority = apiPriority.value;
    }

    state.settings.formatIndent = elements.formatIndent.checked;
    state.settings.sortAlphabetically = elements.sortAlphabetically.checked;
    state.settings.includeComments = elements.includeComments.checked;
    state.settings.autoSaveHistory = elements.autoSaveHistory.checked;
    state.settings.retryAttempts = parseInt(elements.retrySlider.value);
    state.settings.enableDarkMode = elements.enableDarkMode.checked;
    state.settings.enableShortcuts = elements.enableShortcuts.checked;
    state.settings.enableAnalytics = elements.enableAnalytics.checked;
    state.settings.enableOffline = elements.enableOffline.checked;

    // Apply dark mode if changed
    if (state.settings.enableDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    // Save to localStorage
    localStorage.setItem('citationFetcherSettings', JSON.stringify(state.settings));
    showToast('Settings saved', 'success');
}

function loadSettings() {
    const saved = localStorage.getItem('citationFetcherSettings');
    if (saved) {
        try {
            state.settings = { ...state.settings, ...JSON.parse(saved) };

            // Update UI
            elements.delaySlider.value = state.settings.delay;
            elements.delayValue.textContent = `${state.settings.delay.toFixed(1)}s`;
            elements.userEmail.value = state.settings.email;

            const apiRadio = document.querySelector(`input[name="apiPriority"][value="${state.settings.apiPriority}"]`);
            if (apiRadio) apiRadio.checked = true;

            elements.formatIndent.checked = state.settings.formatIndent;
            elements.sortAlphabetically.checked = state.settings.sortAlphabetically;
            elements.includeComments.checked = state.settings.includeComments;
            elements.autoSaveHistory.checked = state.settings.autoSaveHistory;
            elements.retrySlider.value = state.settings.retryAttempts;
            elements.retryValue.textContent = `${state.settings.retryAttempts} retr${state.settings.retryAttempts === 1 ? 'y' : 'ies'}`;
            elements.enableDarkMode.checked = state.settings.enableDarkMode;
            elements.enableShortcuts.checked = state.settings.enableShortcuts;
            elements.enableAnalytics.checked = state.settings.enableAnalytics;
            elements.enableOffline.checked = state.settings.enableOffline;

            // Apply dark mode
            if (state.settings.enableDarkMode) {
                document.documentElement.setAttribute('data-theme', 'dark');
            }

        } catch (e) {
            // Failed to load settings
        }
    }
}

function resetSettings() {
    if (confirm('Reset all settings to default values?')) {
        state.settings = {
            delay: 1.0,
            email: '',
            apiPriority: 'auto',
            formatIndent: true,
            sortAlphabetically: false,
            includeComments: true,
            autoSaveHistory: true,
            retryAttempts: 1,
            enableDarkMode: false,
            enableShortcuts: true,
            enableAnalytics: false,
            enableOffline: true,
            citationStyle: 'bibtex'
        };

        localStorage.removeItem('citationFetcherSettings');
        loadSettings();
        showToast('Settings reset to defaults', 'success');
    }
}

// ===========================
// DARK MODE
// ===========================

function toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'light');
        state.settings.enableDarkMode = false;
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        state.settings.enableDarkMode = true;
    }

    elements.enableDarkMode.checked = state.settings.enableDarkMode;
    updateSettings();

    showToast(`Dark mode ${isDark ? 'disabled' : 'enabled'}`, 'info');
}

// ===========================
// KEYBOARD SHORTCUTS
// ===========================

function initKeyboardShortcuts() {
    if (!state.settings.enableShortcuts) return;

    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts if user is typing in an input
        if (e.target.matches('input, textarea, select')) return;

        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

        // Show/hide keyboard help
        if (e.key === '?') {
            e.preventDefault();
            elements.keyboardHelp.classList.toggle('hidden');
            return;
        }

        // Only process shortcuts when Ctrl/Cmd is pressed
        if (!ctrlKey && e.key !== 'Escape') return;

        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                if (!state.isProcessing) processPapers();
                break;

            case 's':
                e.preventDefault();
                switchTab('settings');
                break;

            case 'h':
                e.preventDefault();
                switchTab('history');
                break;

            case 'd':
                e.preventDefault();
                toggleDarkMode();
                break;

            case 'Escape':
                e.preventDefault();
                clearAll();
                break;

            case 'u':
                if (e.altKey) {
                    e.preventDefault();
                    undoInput();
                }
                break;
        }
    });
}

// ===========================
// PWA & OFFLINE FUNCTIONALITY
// ===========================

function initServiceWorker() {
    if (!('serviceWorker' in navigator) || !state.settings.enableOffline) return;

    // Check the SW file actually exists before registering to avoid
    // noisy 404 errors during local development.
    fetch('service-worker.js', { method: 'HEAD' })
        .then(res => {
            if (!res.ok) return; // file missing – skip silently
            navigator.serviceWorker.register('service-worker.js')
                .then(registration => {
                    updateOnlineStatus();
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showToast('New version available! Refresh to update.', 'info', 5000);
                            }
                        });
                    });
                })
                .catch(() => {}); // registration errors are non-fatal
        })
        .catch(() => {}); // network errors (offline) – skip silently
}

function updateOnlineStatus() {
    const isOnline = navigator.onLine;
    elements.offlineStatus.innerHTML = `
        <i class="fas fa-${isOnline ? 'wifi' : 'exclamation-triangle'}"></i>
        ${isOnline ? 'Online' : 'Offline'}
    `;
    elements.offlineStatus.className = `offline-status ${isOnline ? 'online' : 'offline'}`;

    if (!isOnline) {
        showToast('You are offline. Some features may be limited.', 'warning');
    }
}

function initInstallPrompt() {
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        // Show install prompt after delay
        setTimeout(() => {
            if (!localStorage.getItem('installPromptDismissed')) {
                elements.installPrompt.classList.remove('hidden');
            }
        }, 10000);
    });

    elements.installNow.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                showToast('App installed successfully!', 'success');
            }
            deferredPrompt = null;
        }
        elements.installPrompt.classList.add('hidden');
    });

    elements.installLater.addEventListener('click', () => {
        elements.installPrompt.classList.add('hidden');
        localStorage.setItem('installPromptDismissed', 'true');
    });
}


// ===========================
// QR CODE PAYMENT FUNCTIONALITY - OPTIMIZED FOR MOBILE
// ===========================

function initQRPayment() {
    const qrModal = document.getElementById('qrModal');
    const donateBtn = document.getElementById('donateBtn');
    const closeQRBtn = document.getElementById('closeQR');
    const enlargeModal = document.getElementById('enlargeModal');

    // Mobile detection and optimization
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    function isWeChat() {
        return /MicroMessenger/i.test(navigator.userAgent);
    }

    function isAlipay() {
        return /AlipayClient/i.test(navigator.userAgent);
    }

    // Enhanced deep links for mobile apps
    function getAlipayDeepLink() {
      const qrCodeUrl = 'https://qr.alipay.com/fkx16106w3omw7w12ftgk9d';
      return `alipayqr://platformapi/startapp?saId=10000007&qrcode=${encodeURIComponent(qrCodeUrl)}`;
  }

  function getWeChatDeepLink() {
      return 'https://u.wechat.com/MKQtNLWjzU-yLfCjSA-xfFc?s=2';
  }

    // Open Alipay for payment
    function openAlipayPayment() {
        if (isMobileDevice()) {
            if (isAlipay()) {
                // Already in Alipay app
                showToast('You are in Alipay! Use scan feature', 'info');
                return;
            }

            // Try to open Alipay app
            const alipayLink = getAlipayDeepLink();
            const timeout = setTimeout(() => {
                showToast('Opening Alipay app...', 'info');
            }, 100);

            window.location.href = alipayLink;

            // Fallback to QR code if app doesn't open
            setTimeout(() => {
                clearTimeout(timeout);
                if (document.hasFocus()) {
                    showToast('Please scan the QR code in Alipay app', 'info');
                    // Switch to Alipay QR tab
                    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
                    document.querySelector('.payment-option[data-payment="alipay"]').classList.add('active');
                    document.querySelectorAll('.qr-section').forEach(section => section.classList.remove('active'));
                    document.getElementById('alipaySection').classList.add('active');
                }
            }, 2000);
        } else {
            showToast('Please use mobile device to pay', 'warning');
        }
    }

    // Open WeChat for adding contact
    function openWeChatAdd() {
        if (isMobileDevice()) {
            if (isWeChat()) {
                // Already in WeChat app
                showToast('You are in WeChat! Use scan feature', 'info');
                return;
            }

            // Try to open WeChat app
            const wechatLink = getWeChatDeepLink();
            const timeout = setTimeout(() => {
                showToast('Opening WeChat app...', 'info');
            }, 100);

            window.location.href = wechatLink;

            // Fallback to QR code if app doesn't open
            setTimeout(() => {
                clearTimeout(timeout);
                if (document.hasFocus()) {
                    showToast('Please scan the QR code in WeChat app', 'info');
                    // Switch to WeChat QR tab
                    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
                    document.querySelector('.payment-option[data-payment="wechat"]').classList.add('active');
                    document.querySelectorAll('.qr-section').forEach(section => section.classList.remove('active'));
                    document.getElementById('wechatSection').classList.add('active');
                }
            }, 2000);
        } else {
            showToast('Please use mobile device', 'warning');
        }
    }

    // Optimized modal display for mobile
    function showQRModal() {
        qrModal.classList.remove('hidden');

        // Auto-detect and show appropriate payment method
        if (isWeChat()) {
            // User is in WeChat browser
            switchToWeChat();
            showToast('WeChat detected!', 'info');
        } else if (isAlipay()) {
            // User is in Alipay browser
            switchToAlipay();
            showToast('Alipay detected!', 'info');
        } else if (isMobileDevice()) {
            // On mobile but not in WeChat/Alipay
            // Check user language preference for Chinese users
            const isChineseUser = navigator.language.startsWith('zh') ||
                                 navigator.language.includes('CN');
            if (isChineseUser) {
                switchToWeChat();
            } else {
                switchToAlipay();
            }
        } else {
            // Desktop user - default to Alipay
            switchToAlipay();
        }

        // Announce for screen readers
        announceToScreenReader('Payment options modal opened');
    }

    function switchToAlipay() {
        document.querySelectorAll('.payment-option').forEach(opt => {
            opt.classList.remove('active');
        });
        document.querySelector('.payment-option[data-payment="alipay"]').classList.add('active');

        document.querySelectorAll('.qr-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById('alipaySection').classList.add('active');
    }

    function switchToWeChat() {
        document.querySelectorAll('.payment-option').forEach(opt => {
            opt.classList.remove('active');
        });
        document.querySelector('.payment-option[data-payment="wechat"]').classList.add('active');

        document.querySelectorAll('.qr-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById('wechatSection').classList.add('active');
    }

    // Event Listeners
    if (donateBtn) {
        donateBtn.addEventListener('click', showQRModal);
    }

    if (closeQRBtn) {
        closeQRBtn.addEventListener('click', () => {
            qrModal.classList.add('hidden');
        });
    }

    qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) {
            qrModal.classList.add('hidden');
        }
    });

    // Open app buttons
    document.getElementById('openAlipay')?.addEventListener('click', openAlipayPayment);
    document.getElementById('openWeChat')?.addEventListener('click', openWeChatAdd);

    // Payment option switching
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', () => {
            const paymentType = option.dataset.payment;

            // Update active states
            document.querySelectorAll('.payment-option').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');

            // Show corresponding QR section
            document.querySelectorAll('.qr-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(`${paymentType}Section`).classList.add('active');
        });
    });

    // QR code enlargement
    document.querySelectorAll('.qr-image-container').forEach(container => {
        container.addEventListener('click', (e) => {
            const parentSection = container.closest('.qr-section');
            const paymentType = parentSection.id === 'alipaySection' ? 'alipay' : 'wechat';

            const enlargeModal = document.getElementById('enlargeModal');
            const enlargedQR = document.getElementById('enlargedQR');
            const enlargeTitle = document.getElementById('enlargeTitle');

            if (paymentType === 'alipay') {
                enlargedQR.src = 'images/donate/alipay-qr.png';
                enlargeTitle.innerHTML = '<i class="fab fa-alipay"></i> Alipay QR Code';
            } else {
                enlargedQR.src = 'images/donate/wechat-qr.png';
                enlargeTitle.innerHTML = '<i class="fab fa-weixin"></i> WeChat QR Code';
            }

            enlargeModal.classList.remove('hidden');
        });
    });

    // Close enlargement modal
    document.getElementById('closeEnlarge')?.addEventListener('click', () => {
        enlargeModal.classList.add('hidden');
    });

    document.getElementById('closeEnlargeBottom')?.addEventListener('click', () => {
        enlargeModal.classList.add('hidden');
    });

    enlargeModal.addEventListener('click', (e) => {
        if (e.target === enlargeModal) {
            enlargeModal.classList.add('hidden');
        }
    });

    // Save QR code
    document.getElementById('saveQR')?.addEventListener('click', () => {
        const activePayment = document.querySelector('.payment-option.active').dataset.payment;
        const qrImage = activePayment === 'alipay'
            ? document.querySelector('#alipaySection .qr-image')
            : document.querySelector('#wechatSection .qr-image');

        if (qrImage && qrImage.src) {
            const link = document.createElement('a');
            link.href = qrImage.src;
            link.download = `citation-fetcher-${activePayment}-qr.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('QR code saved!', 'success');
        }
    });

    // Keyboard shortcuts for modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!qrModal.classList.contains('hidden')) {
                qrModal.classList.add('hidden');
            }
            if (!enlargeModal.classList.contains('hidden')) {
                enlargeModal.classList.add('hidden');
            }
        }
    });
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const qrPayment = initQRPayment();

    // Make available globally if needed
    window.qrPayment = qrPayment;
});

// ===========================
// ANALYTICS (PRIVACY-FOCUSED)
// ===========================

function trackEvent(eventName, data = {}) {
    if (!state.settings.enableAnalytics) return;

    const analyticsData = {
        event: eventName,
        timestamp: Date.now(),
        version: '2.0',
        ...data
    };

    // Store locally (could be sent to analytics server in production)
    const analytics = JSON.parse(localStorage.getItem('citationAnalytics') || '[]');
    analytics.push(analyticsData);

    if (analytics.length > 1000) {
        analytics.splice(0, 100);
    }

    localStorage.setItem('citationAnalytics', JSON.stringify(analytics));
}

// ===========================
// TESTIMONIAL ROTATION
// ===========================

const TESTIMONIALS = [
    { quote: "Saved me hours of manual citation work! The smart detection features are amazing.", name: "Dr. A. Rahman", role: "Researcher, MIT" },
    { quote: "Finally a tool that handles arXiv IDs and DOIs together. Absolutely essential.", name: "Prof. L. Chen", role: "Computer Science, NUS" },
    { quote: "The batch processing saves our whole lab hours every week. Highly recommended.", name: "Dr. F. Okafor", role: "Postdoc, ETH Zürich" },
    { quote: "Clean output, zero errors. I use this for every paper I write now.", name: "Dr. M. Sato", role: "Physics, Kyoto University" },
    { quote: "The auto-detection of input type is clever. Works perfectly every time.", name: "Dr. S. Patel", role: "Engineering, IIT Bombay" },
    { quote: "Replaced my entire manual citation workflow in one afternoon.", name: "Dr. Y. Novak", role: "Bioinformatics, Oxford" }
];

function rotateTestimonial() {
    const card = document.querySelector('.floating-card');
    if (!card) return;
    const t = TESTIMONIALS[Math.floor(Math.random() * TESTIMONIALS.length)];
    const quoteEl = card.querySelector('p');
    const nameEl = card.querySelector('.user h4');
    const roleEl = card.querySelector('.user p');
    if (quoteEl) quoteEl.textContent = t.quote;
    if (nameEl) nameEl.textContent = t.name;
    if (roleEl) roleEl.textContent = t.role;
}

// ===========================
// SIMILAR PAPERS FEATURE
// ===========================

// ===========================
// SIMILAR PAPERS — KEYWORD SEARCH + CITATION COUNT
// ===========================

const STOP_WORDS = new Set([
    'a','an','the','and','or','of','in','on','for','to','with','is','are',
    'was','were','be','been','being','have','has','had','do','does','did',
    'at','by','from','as','into','through','during','before','after','above',
    'below','between','out','off','over','under','via','its','it','this',
    'that','these','those','using','based','new','novel','towards','toward',
    'upon','about','we','our','their','can','more','some','such','secure',
    'analysis','method','approach','study','scheme','system','paper','work'
]);

function extractKeywords(results) {
    const words = {};
    results.forEach(r => {
        if (r.bibtex.startsWith('%')) return;
        const titleMatch = r.bibtex.match(/title\s*=\s*\{+([^}]+)\}+/);
        if (!titleMatch) return;
        const title = titleMatch[1].replace(/[{}]/g, '').toLowerCase();
        title.split(/[\s\-_:,;().]+/).forEach(word => {
            const clean = word.replace(/[^a-z0-9]/g, '');
            if (clean.length < 4) return;
            if (STOP_WORDS.has(clean)) return;
            words[clean] = (words[clean] || 0) + 1;
        });
    });
    return Object.entries(words)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([word]) => word);
}

async function searchS2ByKeywords(keywords) {
    const queries = [...new Set([
        keywords.join(' '),
        keywords.slice(0, 3).join(' ')
    ])];
    const seen = new Map();
    for (const query of queries) {
        try {
            const url = 'https://api.semanticscholar.org/graph/v1/paper/search' +
                '?query=' + encodeURIComponent(query) +
                '&fields=title,authors,year,venue,citationCount,externalIds,abstract' +
                '&limit=25';
            const res = await fetch(url);
            if (!res.ok) continue;
            const data = await res.json();
            (data.data || []).forEach(p => {
                if (p.paperId && !seen.has(p.paperId)) seen.set(p.paperId, p);
            });
        } catch { /* skip */ }
        await new Promise(r => setTimeout(r, 300));
    }
    return [...seen.values()]
        .filter(p => p.citationCount != null)
        .sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0))
        .slice(0, 15);
}

function getAlreadyFetchedDOIs() {
    const dois = new Set();
    state.results.forEach(r => {
        if (r.raw && r.raw.DOI) dois.add(r.raw.DOI.toLowerCase());
        const doiMatch = r.bibtex.match(/doi\s*=\s*\{([^}]+)\}/i);
        if (doiMatch) dois.add(doiMatch[1].toLowerCase());
    });
    return dois;
}

async function fetchAndShowSimilarPapers() {
    const section = document.getElementById('similarPapersSection');
    const list = document.getElementById('similarPapersList');
    if (!section || !list) return;

    section.classList.remove('hidden');
    list.innerHTML = `
        <div class="similar-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Finding highly-cited related papers...</span>
        </div>
    `;
    document.getElementById('addSelectedSuggestions').disabled = true;

    const keywords = extractKeywords(state.results);
    if (keywords.length === 0) { renderSimilarPapers([]); return; }

    const allPapers = await searchS2ByKeywords(keywords);
    const alreadyHave = getAlreadyFetchedDOIs();
    const filtered = allPapers.filter(p => {
        const doi = (p.externalIds && p.externalIds.DOI) ? p.externalIds.DOI.toLowerCase() : '';
        return !doi || !alreadyHave.has(doi);
    });
    renderSimilarPapers(filtered);
}

// ---- Abstract tooltip singleton ----
(function initAbstractTooltip() {
    const tip = document.createElement('div');
    tip.id = 'abstractTooltip';
    tip.className = 'abstract-tooltip hidden';
    document.body.appendChild(tip);

    let hideTimer = null;

    window._showAbstractTooltip = function(card, abstract, title) {
        clearTimeout(hideTimer);
        const text = abstract
            ? abstract.length > 480 ? abstract.substring(0, 480) + '…' : abstract
            : 'No abstract available for this paper.';

        tip.innerHTML = `
            <div class="abt-title">${title}</div>
            <div class="abt-label"><i class="fas fa-align-left"></i> Abstract</div>
            <div class="abt-body">${text}</div>
        `;
        tip.classList.remove('hidden');

        // Position using viewport coords (tooltip is position:fixed, no scrollY needed)
        const rect = card.getBoundingClientRect();
        const tipW = 340;
        const tipH = tip.offsetHeight || 260;
        const gap = 12;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Horizontal: prefer right of card, fall back to left
        let left = rect.right + gap;
        if (left + tipW > vw - 16) left = rect.left - tipW - gap;
        if (left < 8) left = 8;

        // Vertical: align to card top, shift up if it would clip the bottom
        let top = rect.top;
        if (top + tipH > vh - 16) top = vh - tipH - 16;
        if (top < 8) top = 8;

        tip.style.left = `${left}px`;
        tip.style.top = `${top}px`;
    };

    window._hideAbstractTooltip = function(delay = 120) {
        hideTimer = setTimeout(() => tip.classList.add('hidden'), delay);
    };

    tip.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    tip.addEventListener('mouseleave', () => window._hideAbstractTooltip(80));
})();

function renderSimilarPapers(papers) {
    const list = document.getElementById('similarPapersList');
    const countBadge = document.getElementById('similarCount');
    const addBtn = document.getElementById('addSelectedSuggestions');

    if (papers.length === 0) {
        list.innerHTML = `
            <div class="similar-empty">
                <i class="fas fa-search fa-2x"></i>
                <p>No related papers found. Try searching with more specific paper titles or DOIs.</p>
            </div>
        `;
        countBadge.textContent = '0 found';
        return;
    }

    countBadge.textContent = `${papers.length} found`;
    list.innerHTML = '';
    window._suggestionPapers = papers;

    papers.forEach((paper, i) => {
        const authorList = paper.authors || [];
        const shown = authorList.slice(0, 3).map(a => a.name).join(', ');
        const overflow = authorList.length > 3 ? ` +${authorList.length - 3} more` : '';
        const doi = (paper.externalIds && paper.externalIds.DOI) ? paper.externalIds.DOI : '';
        const arxivId = (paper.externalIds && paper.externalIds.ArXiv) ? paper.externalIds.ArXiv : '';
        const venue = paper.venue || '';
        const citations = paper.citationCount != null ? paper.citationCount.toLocaleString() : null;
        const abstract = paper.abstract || '';
        const abstractPreview = abstract && abstract.length > 60
            ? abstract.substring(0, 140) + '…'
            : abstract;

        const card = document.createElement('div');
        card.className = 'suggestion-card';
        card.innerHTML = '<label class="suggestion-label">' +
            '<div class="suggestion-checkbox-wrap">' +
                '<input type="checkbox" class="suggestion-checkbox" data-index="' + i + '" ' +
                    'data-title="' + escapeAttr(paper.title) + '" ' +
                    'data-doi="' + escapeAttr(doi) + '" ' +
                    'data-arxiv="' + escapeAttr(arxivId) + '">' +
            '</div>' +
            '<div class="suggestion-info">' +
                '<div class="suggestion-title">' + (paper.title || 'Unknown Title') + '</div>' +
                '<div class="suggestion-meta">' +
                    (shown ? '<span class="suggestion-authors"><i class="fas fa-user-friends"></i> ' + shown + overflow + '</span>' : '') +
                    (paper.year ? '<span class="suggestion-year">' + paper.year + '</span>' : '') +
                    (venue ? '<span class="suggestion-venue">' + venue + '</span>' : '') +
                    (citations !== null ? '<span class="suggestion-citations"><i class="fas fa-quote-right"></i> ' + citations + '</span>' : '') +
                '</div>' +
                (abstractPreview ? '<div class="suggestion-abstract">' + abstractPreview + '</div>' : '') +
                (doi ? '<a href="https://doi.org/' + doi + '" target="_blank" rel="noopener" class="suggestion-doi" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt"></i> ' + doi + '</a>' : '') +
            '</div>' +
        '</label>';

        // Click card to toggle checkbox
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') return;
            const cb = card.querySelector('.suggestion-checkbox');
            if (cb) {
                cb.checked = !cb.checked;
                cb.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        // Hover to show full abstract tooltip
        card.addEventListener('mouseenter', () => {
            window._showAbstractTooltip(card, abstract, paper.title || 'Unknown Title');
        });
        card.addEventListener('mouseleave', () => window._hideAbstractTooltip());

        list.appendChild(card);
    });

    // Re-attach change listener (list was cleared so old listener is gone)
    list.addEventListener('change', () => {
        const checkedCount = list.querySelectorAll('.suggestion-checkbox:checked').length;
        addBtn.disabled = checkedCount === 0;
        addBtn.innerHTML = checkedCount > 0
            ? `<i class="fas fa-plus"></i> Add ${checkedCount} paper${checkedCount > 1 ? 's' : ''} to queue`
            : `<i class="fas fa-plus"></i> Add selected to queue`;
    });
}

function selectAllSuggestions() {
    document.querySelectorAll('.suggestion-checkbox').forEach(cb => { cb.checked = true; });
    const count = document.querySelectorAll('.suggestion-checkbox').length;
    const addBtn = document.getElementById('addSelectedSuggestions');
    if (addBtn && count > 0) {
        addBtn.disabled = false;
        addBtn.innerHTML = `<i class="fas fa-plus"></i> Add ${count} paper${count > 1 ? 's' : ''} to queue`;
    }
}

function deselectAllSuggestions() {
    document.querySelectorAll('.suggestion-checkbox').forEach(cb => { cb.checked = false; });
    const addBtn = document.getElementById('addSelectedSuggestions');
    if (addBtn) {
        addBtn.disabled = true;
        addBtn.innerHTML = `<i class="fas fa-plus"></i> Add selected to queue`;
    }
}

function addSelectedSuggestions() {
    const checkboxes = document.querySelectorAll('.suggestion-checkbox:checked');
    if (checkboxes.length === 0) return;

    const inputs = [];
    checkboxes.forEach(cb => {
        const doi = cb.dataset.doi;
        const arxiv = cb.dataset.arxiv;
        const title = cb.dataset.title;
        // Prefer DOI or arXiv ID over title — they give exact matches
        if (doi) inputs.push(doi);
        else if (arxiv) inputs.push(arxiv);
        else if (title) inputs.push(title);
    });

    const current = elements.paperInput.value.trim();
    elements.paperInput.value = current ? current + '\n' + inputs.join('\n') : inputs.join('\n');
    updatePaperCount();

    // Visual confirmation: briefly transform the button so the user knows it worked
    const addBtn = document.getElementById('addSelectedSuggestions');
    if (addBtn) {
        addBtn.innerHTML = `<i class="fas fa-check"></i> ${inputs.length} paper${inputs.length > 1 ? 's' : ''} added to queue!`;
        addBtn.classList.add('btn-confirmed');
        addBtn.disabled = true;
        setTimeout(() => {
            addBtn.innerHTML = `<i class="fas fa-plus"></i> Add selected to queue`;
            addBtn.classList.remove('btn-confirmed');
        }, 2500);
    }

    switchTab('input');
    showToast(`Added ${inputs.length} paper${inputs.length > 1 ? 's' : ''} to input queue`, 'success');
    document.getElementById('main-content').scrollIntoView({ behavior: 'smooth' });
}

// ===========================
// DEDUPLICATION
// ===========================

function detectDuplicatesInInput(lines) {
    const seen = { doi: new Map(), arxiv: new Map(), title: new Map() };
    const dupIndices = new Set();

    lines.forEach((line, i) => {
        const trimmed = line.trim();
        const doiMatch = trimmed.match(/^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i);
        const arxivMatch = trimmed.match(/^\d{4}\.\d{4,5}(v\d+)?$/);
        const isDOI = doiMatch !== null;
        const isArxiv = arxivMatch !== null;

        if (isDOI) {
            const key = trimmed.toLowerCase();
            if (seen.doi.has(key)) dupIndices.add(i);
            else seen.doi.set(key, i);
        } else if (isArxiv) {
            const key = trimmed.toLowerCase();
            if (seen.arxiv.has(key)) dupIndices.add(i);
            else seen.arxiv.set(key, i);
        } else {
            const key = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 60);
            if (seen.title.has(key)) dupIndices.add(i);
            else seen.title.set(key, i);
        }
    });

    return { dupIndices, duplicateCount: dupIndices.size };
}

function showDedupWarning(lines) {
    const { dupIndices, duplicateCount } = detectDuplicatesInInput(lines);
    if (duplicateCount === 0) {
        elements.dedupPanel.classList.add('hidden');
        return;
    }
    elements.dedupPanel.classList.remove('hidden');
    elements.dedupSummary.textContent = `Found ${duplicateCount} duplicate${duplicateCount > 1 ? 's' : ''} in your input. Removing them saves API calls and avoids duplicate citations.`;
    elements.dedupRemoveBtn.onclick = () => {
        const filtered = lines.filter((_, i) => !dupIndices.has(i));
        elements.paperInput.value = filtered.join('\n');
        elements.dedupPanel.classList.add('hidden');
        updatePaperCount();
        showToast(`Removed ${duplicateCount} duplicate${duplicateCount > 1 ? 's' : ''}`, 'success');
    };
    elements.dedupDismissBtn.onclick = () => elements.dedupPanel.classList.add('hidden');
}

// ===========================
// SHAREABLE LINK
// ===========================

function encodeShareLink(text) {
    try {
        const bytes = new TextEncoder().encode(text);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        const compressed = btoa(binary);
        const url = new URL(window.location);
        url.hash = 'share=' + compressed;
        return url.toString();
    } catch { return ''; }
}

function decodeShareLink() {
    try {
        const hash = window.location.hash;
        if (!hash || !hash.startsWith('#share=')) return null;
        const compressed = hash.replace('#share=', '');
        const binary = atob(compressed);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return new TextDecoder().decode(bytes);
    } catch { return null; }
}

function showSharePanel() {
    if (state.results.length === 0) {
        showToast('Generate citations first before sharing', 'warning');
        return;
    }
    const inputText = state.paperInputs.join('\n');
    const link = encodeShareLink(inputText);
    if (!link) { showToast('Could not generate share link', 'error'); return; }
    elements.shareLinkInput.value = link;
    elements.sharePanel.classList.remove('hidden');
}

// ===========================
// INLINE BIBTEX EDITOR
// ===========================

let _editingIndex = -1;

function openEditor(index) {
    _editingIndex = index;
    const result = state.results[index];
    if (!result || result.bibtex.startsWith('%')) return;

    const bibtex = result.bibtex;
    const typeM   = bibtex.match(/@(\w+)\{/);
    const keyM    = bibtex.match(/@\w+\{([^,]+)/);
    const titleM  = bibtex.match(/title\s*=\s*\{+([^}]+)\}+/);
    const authorM = bibtex.match(/author\s*=\s*\{([^}]+)\}/);
    const journalM= bibtex.match(/journal\s*=\s*\{([^}]+)\}/);
    const yearM   = bibtex.match(/year\s*=\s*\{([^}]+)\}/);
    const volumeM = bibtex.match(/volume\s*=\s*\{([^}]+)\}/);
    const numberM = bibtex.match(/number\s*=\s*\{([^}]+)\}/);
    const pagesM  = bibtex.match(/pages\s*=\s*\{([^}]+)\}/);
    const doiM    = bibtex.match(/doi\s*=\s*\{([^}]+)\}/i);
    const publisherM = bibtex.match(/publisher\s*=\s*\{([^}]+)\}/);

    document.getElementById('editType').value = typeM ? typeM[1] : 'article';
    document.getElementById('editKey').value = keyM ? keyM[1] : '';
    document.getElementById('editAuthor').value = authorM ? authorM[1].replace(/[{}]/g,'') : '';
    document.getElementById('editTitle').value = titleM ? titleM[1].replace(/[{}]/g,'') : '';
    document.getElementById('editJournal').value = journalM ? journalM[1].replace(/[{}]/g,'') : '';
    document.getElementById('editYear').value = yearM ? yearM[1] : '';
    document.getElementById('editVolume').value = volumeM ? volumeM[1] : '';
    document.getElementById('editNumber').value = numberM ? numberM[1] : '';
    document.getElementById('editPages').value = pagesM ? pagesM[1] : '';
    document.getElementById('editDOI').value = doiM ? doiM[1] : '';
    document.getElementById('editPublisher').value = publisherM ? publisherM[1] : '';

    updateEditorPreview();
    elements.editorModal.classList.remove('hidden');
}

function updateEditorPreview() {
    const fields = {};
    const type = document.getElementById('editType').value;
    const key = document.getElementById('editKey').value || 'key';
    const author = document.getElementById('editAuthor').value;
    const title = document.getElementById('editTitle').value;
    const journal = document.getElementById('editJournal').value;
    const year = document.getElementById('editYear').value;
    const volume = document.getElementById('editVolume').value;
    const number = document.getElementById('editNumber').value;
    const pages = document.getElementById('editPages').value;
    const doi = document.getElementById('editDOI').value;
    const publisher = document.getElementById('editPublisher').value;

    const indent = state.settings.formatIndent ? '  ' : '';
    const lines = [];
    if (author)    lines.push(`${indent}author = {${author}}`);
    if (title)     lines.push(`${indent}title = {{${title}}}`);
    if (journal)   lines.push(`${indent}journal = {${journal}}`);
    if (year)      lines.push(`${indent}year = {${year}}`);
    if (volume)    lines.push(`${indent}volume = {${volume}}`);
    if (number)    lines.push(`${indent}number = {${number}}`);
    if (pages)     lines.push(`${indent}pages = {${pages}}`);
    if (doi)       lines.push(`${indent}doi = {${doi}}`);
    if (publisher) lines.push(`${indent}publisher = {${publisher}}`);

    document.getElementById('editBibtexPreview').textContent = `@${type}{${key},\n${lines.join(',\n')}\n}`;
}

function saveEditor() {
    if (_editingIndex < 0) return;
    const bibtex = document.getElementById('editBibtexPreview').textContent;
    state.results[_editingIndex].bibtex = bibtex;
    elements.editorModal.classList.add('hidden');
    displayResults();
    updatePreview();
    showToast('Citation updated', 'success');
}

// ===========================
// CITATION FOLDERS
// ===========================

function getFolders() {
    try { return JSON.parse(localStorage.getItem('citationFolders') || '[]'); }
    catch { return []; }
}

function saveFolders(folders) {
    localStorage.setItem('citationFolders', JSON.stringify(folders));
}

function createFolder(name) {
    const folders = getFolders();
    if (folders.find(f => f.name.toLowerCase() === name.toLowerCase())) {
        showToast('A folder with this name already exists', 'warning');
        return;
    }
    folders.push({ name, items: [], createdAt: Date.now() });
    saveFolders(folders);
    renderFolderChips();
    showToast(`Folder "${name}" created`, 'success');
}

function addToFolder(folderName, historyItem) {
    const folders = getFolders();
    const folder = folders.find(f => f.name === folderName);
    if (!folder) return;
    if (folder.items.find(i => i.id === historyItem.id)) {
        showToast('Already in this folder', 'info');
        return;
    }
    folder.items.push(historyItem);
    saveFolders(folders);
    showToast(`Added to "${folderName}"`, 'success');
}

function removeFromFolder(folderName, itemId) {
    let folders = getFolders();
    const folder = folders.find(f => f.name === folderName);
    if (!folder) return;
    folder.items = folder.items.filter(i => i.id !== itemId);
    saveFolders(folders);
    loadHistory();
    showToast('Removed from folder', 'info');
}

function deleteFolder(name) {
    let folders = getFolders();
    folders = folders.filter(f => f.name !== name);
    saveFolders(folders);
    renderFolderChips();
    loadHistory();
    showToast(`Folder "${name}" deleted`, 'info');
}

function renderFolderChips() {
    const folders = getFolders();
    elements.folderChips.innerHTML = '<button class="folder-chip active" data-folder="all">All</button>';
    folders.forEach(f => {
        const chip = document.createElement('button');
        chip.className = 'folder-chip';
        chip.dataset.folder = f.name;
        chip.textContent = f.name + ' (' + f.items.length + ')';
        chip.title = 'Right-click to delete folder';
        chip.addEventListener('click', () => {
            document.querySelectorAll('.folder-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            renderHistoryList();
        });
        chip.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (confirm(`Delete folder "${f.name}"? Items will return to main history.`)) {
                deleteFolder(f.name);
            }
        });
        elements.folderChips.appendChild(chip);
    });
}

// ===========================
// AUTHOR LOOKUP
// ===========================

function lookupAuthor(authorName) {
    const url = `https://api.semanticscholar.org/graph/v1/author/search?query=${encodeURIComponent(authorName)}`;
    fetch(url).then(r => r.json()).then(data => {
        if (data.data && data.data.length > 0) {
            const author = data.data[0];
            window.open(`https://www.semanticscholar.org/author/${author.authorId}`, '_blank', 'noopener');
        } else {
            window.open(`https://www.semanticscholar.org/search?q=${encodeURIComponent(authorName)}&sort=relevance`, '_blank', 'noopener');
        }
    }).catch(() => {
        window.open(`https://www.semanticscholar.org/search?q=${encodeURIComponent(authorName)}&sort=relevance`, '_blank', 'noopener');
    });
}

// ===========================
// EVENT LISTENERS SETUP
// ===========================

function setupEventListeners() {
    // Input handling
    elements.paperInput.addEventListener('input', debounce(updatePaperCount, 300));

    // File upload
    elements.fileInput.addEventListener('change', handleFileUpload);
    elements.fileUploadArea.addEventListener('click', () => elements.fileInput.click());
    elements.clearFile.addEventListener('click', resetFileInput);

    // Drag and drop
    elements.fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        elements.fileUploadArea.classList.add('dragover');
    });

    elements.fileUploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        elements.fileUploadArea.classList.remove('dragover');
    });

    elements.fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        elements.fileUploadArea.classList.remove('dragover');
        handleFileUpload(e);
    });

    // Main buttons
    elements.generateBtn.addEventListener('click', () => {
        trackEvent('generate_citations', { count: state.paperInputs.length });
        processPapers();
    });
    elements.exampleBtn.addEventListener('click', loadExample);
    elements.clearBtn.addEventListener('click', clearAll);
    elements.undoBtn.addEventListener('click', undoInput);

    // Results actions
    elements.copyBtn.addEventListener('click', copyToClipboard);
    elements.downloadBtn.addEventListener('click', downloadBib);
    elements.shareBtn.addEventListener('click', shareResults);

    // Similar papers panel controls
    document.getElementById('selectAllSuggestions')?.addEventListener('click', selectAllSuggestions);
    document.getElementById('deselectAllSuggestions')?.addEventListener('click', deselectAllSuggestions);
    document.getElementById('addSelectedSuggestions')?.addEventListener('click', addSelectedSuggestions);
    document.getElementById('refreshSuggestions')?.addEventListener('click', () => {
        if (state.stats.success > 0) {
            fetchAndShowSimilarPapers();
        } else {
            showToast('Generate citations first before refreshing suggestions', 'warning');
        }
    });

    // Export format change
    elements.exportFormat.addEventListener('change', () => {
        const format = elements.exportFormat.value;
        elements.copyBtn.innerHTML = `<i class="fas fa-copy"></i> Copy as ${format.toUpperCase()}`;
        elements.downloadBtn.innerHTML = `<i class="fas fa-download"></i> Download ${format}`;
    });

    // Results view tabs
    document.querySelectorAll('.results-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    // Input type selector
    elements.inputTypeSelector.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            elements.inputTypeSelector.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.detectedInputType = type;
            updateInputTypeUI(type);
        });
    });

    // History actions
    elements.clearHistory.addEventListener('click', clearAllHistory);
    elements.exportHistory.addEventListener('click', exportHistory);
    elements.navHistoryBtn.addEventListener('click', () => toggleSlidePanel('history'));
    elements.navSettingsBtn.addEventListener('click', () => toggleSlidePanel('settings'));
    elements.closeHistory.addEventListener('click', () => { elements.historyPanel.classList.remove('open'); removeSlideOverlay(); });
    elements.closeSettings.addEventListener('click', () => { elements.settingsPanel.classList.remove('open'); removeSlideOverlay(); });

    // Settings
    elements.delaySlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        elements.delayValue.textContent = `${value.toFixed(1)}s`;
        state.settings.delay = value;
    });

    elements.retrySlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        elements.retryValue.textContent = `${value} retr${value === 1 ? 'y' : 'ies'}`;
        state.settings.retryAttempts = value;
    });

    elements.userEmail.addEventListener('change', updateSettings);
    elements.formatIndent.addEventListener('change', updateSettings);
    elements.sortAlphabetically.addEventListener('change', updateSettings);
    elements.includeComments.addEventListener('change', updateSettings);
    elements.autoSaveHistory.addEventListener('change', updateSettings);
    elements.enableDarkMode.addEventListener('change', updateSettings);
    elements.enableShortcuts.addEventListener('change', updateSettings);
    elements.enableAnalytics.addEventListener('change', updateSettings);
    elements.enableOffline.addEventListener('change', updateSettings);

    document.querySelectorAll('input[name="apiPriority"]').forEach(radio => {
        radio.addEventListener('change', updateSettings);
    });

    elements.resetSettings.addEventListener('click', resetSettings);
    elements.saveSettings.addEventListener('click', updateSettings);

    // Dark mode toggles
    elements.darkModeToggle.addEventListener('click', toggleDarkMode);
    elements.darkModeToggleFloating.addEventListener('click', toggleDarkMode);

    // Keyboard help
    elements.showKeyboardHelp.addEventListener('click', () => {
        elements.keyboardHelp.classList.toggle('hidden');
    });

    elements.closeKeyboardHelp.addEventListener('click', () => {
        elements.keyboardHelp.classList.add('hidden');
    });

    elements.keyboardShortcutsLink.addEventListener('click', (e) => {
        e.preventDefault();
        elements.keyboardHelp.classList.remove('hidden');
    });

    // Privacy modal
    elements.privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        elements.privacyModal.classList.remove('hidden');
    });

    elements.closePrivacy.addEventListener('click', () => {
        elements.privacyModal.classList.add('hidden');
    });

    elements.privacyModal.addEventListener('click', (e) => {
        if (e.target === elements.privacyModal) {
            elements.privacyModal.classList.add('hidden');
        }
    });

    // Mobile menu
    elements.menuToggle.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('show');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = elements.menuToggle;

        if (navLinks.classList.contains('show') &&
            !navLinks.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            navLinks.classList.remove('show');
            document.body.classList.remove('menu-open');
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.remove('show');
            document.body.classList.remove('menu-open');
        });
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Donate button
    elements.donateBtn.addEventListener('click', () => {
        showToast('Thank you for considering a donation!', 'info');
        // In production, you would link to your donation page
        // window.open('https://buymeacoffee.com/yourusername', '_blank');
    });

    // Newsletter form
    elements.newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        showToast('Thank you for subscribing!', 'success');
        e.target.reset();
    });

    // Online/offline status
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Cancel button
    elements.cancelBtn.addEventListener('click', () => {
        state.isProcessing = false;
        elements.cancelBtn.classList.add('hidden');
        elements.generateBtn.classList.remove('hidden');
        elements.progressContainer.classList.add('hidden');
        showToast('Processing cancelled', 'warning');
    });

    // Share panel
    elements.shareBtn.addEventListener('click', showSharePanel);
    elements.closeSharePanel.addEventListener('click', () => elements.sharePanel.classList.add('hidden'));
    elements.copyShareLink.addEventListener('click', () => {
        elements.shareLinkInput.select();
        navigator.clipboard.writeText(elements.shareLinkInput.value).then(() => showToast('Share link copied!', 'success'));
    });

    // Inline editor
    elements.closeEditor.addEventListener('click', () => elements.editorModal.classList.add('hidden'));
    elements.closeEditorBottom.addEventListener('click', () => elements.editorModal.classList.add('hidden'));
    elements.saveEditor.addEventListener('click', saveEditor);
    ['editType','editKey','editAuthor','editTitle','editJournal','editYear','editVolume','editNumber','editPages','editDOI','editPublisher'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateEditorPreview);
    });
    elements.editorModal.addEventListener('click', (e) => {
        if (e.target === elements.editorModal) elements.editorModal.classList.add('hidden');
    });

    // Folder management
    elements.newFolderBtn.addEventListener('click', () => elements.folderModal.classList.remove('hidden'));
    elements.closeFolder.addEventListener('click', () => elements.folderModal.classList.add('hidden'));
    elements.closeFolderBottom.addEventListener('click', () => elements.folderModal.classList.add('hidden'));
    elements.createFolderBtn.addEventListener('click', () => {
        const name = elements.folderNameInput.value.trim();
        if (!name) { showToast('Enter a folder name', 'warning'); return; }
        createFolder(name);
        elements.folderNameInput.value = '';
        elements.folderModal.classList.add('hidden');
    });
    elements.folderModal.addEventListener('click', (e) => {
        if (e.target === elements.folderModal) elements.folderModal.classList.add('hidden');
    });

    // Folder add buttons in history list
    elements.historyList.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.add-to-folder');
        if (!addBtn) return;
        const select = addBtn.nextElementSibling;
        if (!select || !select.classList.contains('folder-select')) return;
        // Populate folder options
        const folders = getFolders();
        select.innerHTML = '<option value="">Add to folder...</option>' +
            folders.map(f => `<option value="${escapeAttr(f.name)}">${escapeAttr(f.name)}</option>`).join('');
        select.classList.toggle('hidden');
        select.focus();
    });
    elements.historyList.addEventListener('change', (e) => {
        if (!e.target.classList.contains('folder-select')) return;
        const folderName = e.target.value;
        const itemId = parseInt(e.target.dataset.id);
        if (!folderName || !itemId) return;
        const item = state.history.find(h => h.id === itemId);
        if (item) addToFolder(folderName, item);
        e.target.classList.add('hidden');
        e.target.value = '';
        renderFolderChips();
    });


}

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // Set app version
    elements.appVersion.textContent = 'v2.1';

    // Load saved state
    loadSettings();
    loadHistory();
    renderFolderChips();

    // Initialize features
    initKeyboardShortcuts();
    initServiceWorker();
    initInstallPrompt();

    // Set up event listeners
    setupEventListeners();

    // Check for shared link in URL hash
    const sharedInput = decodeShareLink();
    if (sharedInput) {
        elements.paperInput.value = sharedInput;
        updatePaperCount();
        showToast('Shared citation list loaded! Generate to fetch the citations.', 'info', 6000);
    }

    // Check for bookmarklet pre-fill (plain hash, not a share link)
    const hash = window.location.hash;
    if (hash && !hash.startsWith('#share=')) {
        const bookmarkletInput = decodeURIComponent(hash.substring(1));
        if (bookmarkletInput) {
            elements.paperInput.value = bookmarkletInput;
            updatePaperCount();
            detectInputType(elements.paperInput.value);
            showToast('Paper pre-filled from bookmarklet! Click Generate to fetch the citation.', 'info', 5000);
            elements.paperInput.focus();
        }
    }

    // Rotate testimonial to a random entry
    rotateTestimonial();

    // Initial UI update
    updatePaperCount();
    updateOnlineStatus();

    // Track app launch
    trackEvent('app_launch');

    // Announce app is ready for screen readers
    setTimeout(() => {
        announceToScreenReader('Citation Fetcher is ready. Enter paper titles, DOIs, or arXiv IDs to generate citations.');
    }, 1000);
});

// Make functions available globally
window.switchTab = switchTab;
window.loadExample = loadExample;
window.toggleDarkMode = toggleDarkMode;
window.openEditor = openEditor;
window.lookupAuthor = lookupAuthor;
window.showSharePanel = showSharePanel;