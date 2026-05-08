# Citation Fetcher

> A free, open-source web tool to automatically generate BibTeX citations for academic papers using Crossref, ArXiv, and Semantic Scholar APIs.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://hhhpraise.github.io/citation-fetcher/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/Hhhpraise/citation-fetcher)](https://github.com/Hhhpraise/citation-fetcher/issues)
[![GitHub Stars](https://img.shields.io/github/stars/Hhhpraise/citation-fetcher)](https://github.com/Hhhpraise/citation-fetcher/stargazers)


## ✨ Features

- 🚀 **Fast & Efficient** — Process multiple papers in seconds with automatic rate limiting
- 🎯 **Triple API Support** — Crossref, ArXiv, and Semantic Scholar for maximum coverage
- 🔍 **Smart Input Detection** — Automatically identifies titles, DOIs, and arXiv IDs — no manual switching needed
- 📝 **Multiple Citation Formats** — Export as BibTeX, APA, MLA, Chicago, Harvard, or plain text
- 🔒 **Privacy First** — All processing happens in your browser, nothing sent to our servers
- 💾 **Batch Processing** — Handle hundreds of papers at once
- 📥 **Multiple Input Methods** — Paste directly, upload `.txt` / `.bib` files, or drag and drop
- 💡 **Related Paper Suggestions** — Discover highly-cited papers in the same research area via Semantic Scholar, with hover abstracts
- 📋 **Per-line Validation** — Flags malformed DOIs and arXiv IDs before you hit Generate
- 🕓 **Citation History** — Browse, reuse, and export previously fetched citations
- ⚙️ **Customizable Settings** — API priority, delay, formatting options, retry logic
- 🌙 **Dark Mode** — Full dark theme with persistent preference
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile
- ⌨️ **Keyboard Shortcuts** — Power-user navigation without touching the mouse
- 🌐 **No Registration** — Free to use, no account required
- 📦 **PWA Ready** — Install as an app for offline access


## 🚀 Quick Start

### Online Usage

Visit [https://hhhpraise.github.io/citation-fetcher/](https://hhhpraise.github.io/citation-fetcher/) — no installation needed.

### Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hhhpraise/citation-fetcher.git
   cd citation-fetcher
   ```

2. **Open in browser**
   ```bash
   open index.html      # macOS
   start index.html     # Windows
   xdg-open index.html  # Linux
   ```

   Or use a local server (recommended for service worker support):
   ```bash
   python -m http.server 8000   # Python 3
   npx serve                    # Node.js
   ```

3. Navigate to `http://localhost:8000`


## 📖 How to Use

### Method 1: Paste Input

1. Go to the **Input** tab
2. Paste paper titles, DOIs, or arXiv IDs — one per line, mixed types supported
3. Watch the live input type detector and per-line validation catch any issues
4. Click **Generate Citations**
5. View results in the **Results** tab — copy, download, or share

### Method 2: Upload a File

1. Prepare a `.txt` file (one entry per line) or an existing `.bib` file
2. Drag and drop onto the upload area, or click **Choose File**
3. Click **Generate Citations**

### Example Input

```
Attention Is All You Need
10.48550/arXiv.1706.03762
1706.03762v5
BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding
Deep Residual Learning for Image Recognition
```

Mixed input types work — the tool detects each line independently.

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


## ⚙️ Settings

| Setting | Description |
|---|---|
| **Processing Speed** | Delay between API requests (0.5s–3.0s) to avoid rate limiting |
| **API Priority** | Choose Crossref, ArXiv, or Auto-detect per line |
| **Retry Attempts** | How many times to retry a failed request before giving up |
| **Output Format** | Pretty indentation, alphabetical sort, include comments |
| **Crossref Email** | Optional — increases your priority in Crossref's polite pool |
| **Dark Mode** | Toggle via header button, floating button, or `Ctrl+D` |
| **Keyboard Shortcuts** | Can be disabled if they conflict with browser shortcuts |


## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Enter` | Generate Citations |
| `Ctrl + S` | Open Settings |
| `Ctrl + H` | Open History |
| `Ctrl + D` | Toggle Dark Mode |
| `Escape` | Clear All |
| `?` | Show / Hide shortcut help |


## 🔧 Technical Details

### APIs Used

#### Crossref API
- **Endpoint**: `https://api.crossref.org/works`
- **Coverage**: 140+ million records from thousands of publishers
- **Best for**: Published journal articles, conference papers, direct DOI lookup
- **Docs**: [Crossref REST API](https://www.crossref.org/services/metadata-delivery/rest-api/)

#### ArXiv API
- **Endpoint**: `https://export.arxiv.org/api/query`
- **Coverage**: 2+ million preprints
- **Best for**: Physics, Mathematics, Computer Science preprints; direct arXiv ID lookup
- **Docs**: [ArXiv API User Manual](https://arxiv.org/help/api)

#### Semantic Scholar API
- **Endpoint**: `https://api.semanticscholar.org/graph/v1`
- **Coverage**: 200+ million papers with citation graphs
- **Used for**: Fallback citation fetch + Related Paper Suggestions with abstracts
- **Docs**: [Semantic Scholar API](https://api.semanticscholar.org/)

### Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (no build step, no framework)
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Poppins, Roboto Mono)
- **Storage**: localStorage only — preferences, history, nothing else
- **PWA**: Service Worker + Web App Manifest

### Browser Compatibility

| Browser | Minimum Version |
|---|---|
| Chrome / Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Opera | 76+ |


## 📁 Project Structure

```
citation-fetcher/
├── index.html          # Main application shell
├── style.css           # All styles, dark mode, responsive layout
├── script.js           # Application logic, API calls, UI state
├── manifest.json       # PWA manifest
├── service-worker.js   # Offline caching
├── icon.png            # App icon
└── README.md           # This file
```


## 🐛 Known Issues & Limitations

- **Title Fuzzy Matching**: If a title doesn't match exactly, try removing subtitles or special characters
- **ArXiv-only Papers**: Some very new preprints only exist on ArXiv and won't resolve via Crossref
- **Semantic Scholar Rate Limits**: The Related Papers feature may be slow for large batches — this is an upstream API constraint
- **PDF Extraction**: Uploading `.pdf` files is a placeholder — full text extraction requires pdf.js integration (planned)
- **Network Required**: All API calls go to external services; offline mode only serves the cached app shell


## 🛣️ Roadmap

### ✅ Shipped
- [x] DOI and arXiv ID direct lookup
- [x] Multiple citation formats (BibTeX, APA, MLA, Chicago, Harvard, Plain Text)
- [x] Bulk / batch processing
- [x] Dark mode
- [x] Citation preview per result with inline source badge and year
- [x] Related paper suggestions with abstract hover tooltips (Semantic Scholar)
- [x] Per-line input validation (flags malformed DOIs before generating)
- [x] Citation history with reuse and export
- [x] PWA / offline support
- [x] Keyboard shortcuts

### 🔜 Up Next
- [ ] **Browser Extension** — One-click BibTeX from any journal page or arXiv abstract *(in development)*
- [ ] Export to RIS format (Zotero / Mendeley compatible)
- [ ] Zotero / Mendeley direct integration via their APIs
- [ ] Duplicate detection across a batch
- [ ] Advanced search filters (year range, venue, author)
- [ ] PDF text extraction via pdf.js for `.pdf` uploads


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

Please test on both light and dark modes, and on mobile viewport widths before submitting.


## 📝 License

MIT — see [LICENSE](LICENSE) for details.


## 👤 Author

**Praise O. Arowolo**

- GitHub: [@Hhhpraise](https://github.com/Hhhpraise)
- Portfolio: [hhhpraise.github.io/portfolio](https://hhhpraise.github.io/portfolio/)
- Repository: [citation-fetcher](https://github.com/Hhhpraise/citation-fetcher)


## 🙏 Acknowledgments

- [Crossref](https://www.crossref.org/) — free metadata API
- [ArXiv](https://arxiv.org/) — open access preprint repository
- [Semantic Scholar](https://www.semanticscholar.org/) — AI-powered academic search
- [Font Awesome](https://fontawesome.com/) — icon library
- [Google Fonts](https://fonts.google.com/) — typography


## ❓ FAQ

**Q: Why do some papers fail to fetch?**
Papers fail when the title doesn't closely match the database entry. Try simplifying the title, removing subtitles, or using a DOI directly — DOIs always resolve exactly.

**Q: Why is DOI input more reliable than title input?**
DOIs are unique identifiers — one DOI maps to exactly one paper. Title search is fuzzy and can return the wrong paper if the title is common or slightly different from the indexed version.

**Q: Can I use this commercially?**
Yes. MIT licensed — use it however you want.

**Q: Do you store my paper titles or citation data?**
No. Everything runs in your browser. The only external requests go directly to Crossref, ArXiv, and Semantic Scholar.

**Q: How large can a batch be?**
There's a soft cap of 100 papers per batch. Larger batches work technically but risk hitting API rate limits and slowing down significantly. For bulk work, increase the delay setting to 2–3s.

**Q: What's the Related Papers feature?**
After generating, if you enable "Suggest Similar Papers," the tool queries Semantic Scholar with keywords extracted from your paper titles and returns the most-cited papers in the same area. You can hover each suggestion to read its abstract, check the ones you want, and add them to your input queue for citation generation.


## 💬 Support

1. Check the [FAQ](#-faq) above
2. Search [existing issues](https://github.com/Hhhpraise/citation-fetcher/issues)
3. Open a [new issue](https://github.com/Hhhpraise/citation-fetcher/issues/new)

---

<div align="center">

**Made with ❤️ for researchers worldwide**

[Report Bug](https://github.com/Hhhpraise/citation-fetcher/issues) · [Request Feature](https://github.com/Hhhpraise/citation-fetcher/issues) · [Live Demo](https://hhhpraise.github.io/citation-fetcher/)

</div>
