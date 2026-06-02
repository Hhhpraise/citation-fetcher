# Citation Fetcher

> A free, open-source web tool to automatically generate BibTeX citations for academic papers using Crossref, ArXiv, and Semantic Scholar APIs.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://hhhpraise.github.io/citation-fetcher/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/Hhhpraise/citation-fetcher)](https://github.com/Hhhpraise/citation-fetcher/issues)
[![GitHub Stars](https://img.shields.io/github/stars/Hhhpraise/citation-fetcher)](https://github.com/Hhhpraise/citation-fetcher/stargazers)

---

## Features

- **Split-pane layout** — Input on the left, results on the right. See your citations generate in real time without switching tabs.
- **Triple API support** — Crossref, ArXiv, and Semantic Scholar for maximum coverage and reliability.
- **Smart input detection** — Automatically identifies titles, DOIs, and arXiv IDs per line — no manual switching needed.
- **Multiple citation formats** — Export as BibTeX, RIS, APA, MLA, Chicago, Harvard, or plain text.
- **Bookmarklet** — Drag the "Cite This!" button to your bookmarks bar. Click it on any journal page or arXiv abstract to instantly open Citation Fetcher with the paper pre-filled.
- **Citation history** — Browse, search, filter, and reuse previously fetched citations. Organize into folders and export your history.
- **Per-line validation** — Flags malformed DOIs and arXiv IDs before you generate.
- **Related paper suggestions** — Discover highly-cited papers in the same research area via Semantic Scholar.
- **Duplicate detection** — Automatically identifies and removes duplicate entries in your input.
- **Privacy first** — All processing happens in your browser. No data sent to any server except the academic APIs.
- **Batch processing** — Process hundreds of papers at once with configurable rate limiting and retry logic.
- **Dark mode** — Full dark theme with persistent preference across sessions.
- **PWA ready** — Install as a desktop app for offline access.
- **Keyboard shortcuts** — Navigate without touching the mouse.
- **Free & no registration** — No account required, no data collection.

---

## Quick Start

### Online

Visit **[hhhpraise.github.io/citation-fetcher](https://hhhpraise.github.io/citation-fetcher/)** — no installation needed.

### Local

```bash
git clone https://github.com/Hhhpraise/citation-fetcher.git
cd citation-fetcher
python -m http.server 8000   # or: npx serve
```

Open `http://localhost:8000` in your browser.

---

## How to Use

### Input Methods

1. **Paste** paper titles, DOIs, or arXiv IDs — one per line, mixed types supported
2. **Upload** a `.txt` or `.bib` file via drag-and-drop or file picker
3. **Bookmarklet** — one-click import from any journal page or arXiv abstract

The tool automatically detects the input type for each line and validates DOIs and arXiv IDs before processing.

### Workflow

1. Enter papers in the **left panel**
2. Click **Generate Citations** — watch results appear in the **right panel**
3. Switch between **BibTeX**, **Preview**, and **Raw Data** views
4. **Copy** to clipboard, **download** in your preferred format, or **share** with a link

### Bookmarklet

Drag the **"Cite This!"** button from the [Bookmarklet section](https://hhhpraise.github.io/citation-fetcher/#bookmarklet) to your browser's bookmarks bar. When browsing a journal page or arXiv abstract, click it to instantly open Citation Fetcher with the paper's DOI or title pre-filled.

### Example Input

```
Attention Is All You Need
10.48550/arXiv.1706.03762
1706.03762v5
BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding
Deep Residual Learning for Image Recognition
```

### Example Output

```bibtex
@article{vaswani2017attention,
  author = {Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and ...},
  title = {{Attention Is All You Need}},
  journal = {Advances in Neural Information Processing Systems},
  volume = {30},
  year = {2017}
}

@article{devlin2018bert,
  author = {Devlin, Jacob and Chang, Ming-Wei and Lee, Kenton and ...},
  title = {{BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding}},
  journal = {arXiv preprint},
  year = {2018},
  note = {arXiv:1810.04805}
}
```

---

## Settings

| Setting | Description |
|---|---|
| **Processing Speed** | Delay between API requests (0.5s–3.0s) to avoid rate limiting |
| **API Priority** | Choose Crossref, ArXiv, or Auto-detect per line |
| **Retry Attempts** | How many times to retry a failed request |
| **Output Format** | Pretty indentation, alphabetical sort, include comments |
| **Crossref Email** | Optional — increases your priority in Crossref's polite pool |
| **Dark Mode** | Toggle via header button or `Ctrl+D` |
| **Keyboard Shortcuts** | Can be disabled if they conflict with browser shortcuts |

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Enter` | Generate Citations |
| `Ctrl + S` | Toggle Settings panel |
| `Ctrl + H` | Toggle History panel |
| `Ctrl + D` | Toggle Dark Mode |
| `Escape` | Clear All |
| `?` | Show / Hide shortcut help |

---

## Technical Details

### APIs Used

#### Crossref API
- **Endpoint**: `https://api.crossref.org/works`
- **Coverage**: 140+ million records from thousands of publishers
- **Best for**: Published journal articles, conference papers, direct DOI lookup
- **Docs**: [Crossref REST API](https://www.crossref.org/services/metadata-delivery/rest-api/)

#### ArXiv API
- **Endpoint**: `https://export.arxiv.org/api/query`
- **Coverage**: 2+ million preprints
- **Best for**: Physics, mathematics, and computer science preprints
- **Docs**: [ArXiv API User Manual](https://arxiv.org/help/api)

#### Semantic Scholar API
- **Endpoint**: `https://api.semanticscholar.org/graph/v1`
- **Coverage**: 200+ million papers with citation graphs
- **Used for**: Fallback citation fetch and related paper suggestions with abstracts
- **Docs**: [Semantic Scholar API](https://api.semanticscholar.org/)

### Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript — no framework, no build step
- **Icons**: Font Awesome 6.4.0
- **Fonts**: DM Sans (UI), JetBrains Mono (code/BibTeX)
- **Storage**: localStorage only — preferences, history, folder organization
- **PWA**: Service Worker + Web App Manifest for offline support

### Browser Compatibility

| Browser | Minimum Version |
|---|---|
| Chrome / Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Opera | 76+ |

---

## Project Structure

```
citation-fetcher/
├── index.html          # Application shell — split-pane layout
├── style.css           # Styles — functional/clean design, dark mode, responsive
├── script.js           # Application logic — API calls, UI state, history management
├── manifest.json       # PWA manifest
├── service-worker.js   # Offline caching and service worker
├── images/
│   └── donate/         # QR codes for donations
├── papers.txt          # Example input file
├── my_citations.bib    # Example BibTeX file
└── README.md           # This file
```

---

## Known Issues & Limitations

- **Title fuzzy matching**: If a title doesn't match exactly, try removing subtitles or special characters
- **ArXiv-only papers**: Very new preprints may exist only on ArXiv and won't resolve via Crossref
- **Semantic Scholar rate limits**: Related Papers may be slow for large batches
- **Network required**: All API calls go to external services; offline mode serves only the cached app shell

---

## Roadmap

### Shipped
- [x] DOI and arXiv ID direct lookup
- [x] Multiple citation formats (BibTeX, RIS, APA, MLA, Chicago, Harvard, Plain Text)
- [x] Batch processing with configurable rate limiting
- [x] Dark mode with persistent preference
- [x] Citation preview with inline source badge and year
- [x] Related paper suggestions with hover abstracts (Semantic Scholar)
- [x] Per-line input validation for DOIs and arXiv IDs
- [x] Citation history with search, filter, sort, folders, and export
- [x] Bookmarklet for one-click import from journal pages
- [x] Duplicate detection in input
- [x] PWA / offline support
- [x] Keyboard shortcuts
- [x] Split-pane layout — input and results always visible

### Up Next
- [ ] Browser extension — one-click BibTeX from any journal page or arXiv abstract
- [ ] Zotero / Mendeley direct integration
- [ ] Advanced search filters (year range, venue, author)
- [ ] PDF text extraction for `.pdf` uploads

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

Please test on both light and dark modes and on mobile viewport widths before submitting.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Author

**Praise O. Arowolo**

- GitHub: [@Hhhpraise](https://github.com/Hhhpraise)
- Portfolio: [hhhpraise.github.io/portfolio](https://hhhpraise.github.io/portfolio/)
- Repository: [citation-fetcher](https://github.com/Hhhpraise/citation-fetcher)

---

## Acknowledgments

- [Crossref](https://www.crossref.org/) — free metadata API
- [ArXiv](https://arxiv.org/) — open access preprint repository
- [Semantic Scholar](https://www.semanticscholar.org/) — AI-powered academic search
- [Font Awesome](https://fontawesome.com/) — icon library
- [Google Fonts](https://fonts.google.com/) — typography

---

## FAQ

**Q: Why do some papers fail to fetch?**
Papers fail when the title doesn't closely match the database entry. Try simplifying the title, removing subtitles, or using a DOI directly — DOIs always resolve exactly.

**Q: Why is DOI input more reliable than title input?**
DOIs are unique identifiers — one DOI maps to exactly one paper. Title search is fuzzy and can return the wrong paper if the title is common or slightly different from the indexed version.

**Q: Can I use this commercially?**
Yes. MIT licensed — use it however you want.

**Q: Do you store my paper titles or citation data?**
No. Everything runs in your browser. The only external requests go directly to Crossref, ArXiv, and Semantic Scholar.

**Q: How large can a batch be?**
There's a soft cap of 100 papers per batch. Larger batches work technically but risk hitting API rate limits. For bulk work, increase the delay setting to 2–3s.

**Q: How does the bookmarklet work?**
Drag the "Cite This!" button to your bookmarks bar. When you're on a journal page or arXiv abstract, click it. Citation Fetcher opens in a new tab with the paper's DOI, arXiv ID, or title pre-filled. Click "Generate Citations" to fetch the BibTeX instantly.

---

<div align="center">

**Made for researchers worldwide**

[Report Bug](https://github.com/Hhhpraise/citation-fetcher/issues) · [Request Feature](https://github.com/Hhhpraise/citation-fetcher/issues) · [Live Demo](https://hhhpraise.github.io/citation-fetcher/)

</div>