# Citation Fetcher

> A free, open-source web tool to automatically generate BibTeX citations for academic papers using Crossref and ArXiv APIs.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://hhhpraise.github.io/citation-fetcher/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/Hhhpraise/citation-fetcher)](https://github.com/Hhhpraise/citation-fetcher/issues)
[![GitHub Stars](https://img.shields.io/github/stars/Hhhpraise/citation-fetcher)](https://github.com/Hhhpraise/citation-fetcher/stargazers)

![Citation Fetcher Screenshot](screenshot.png)

## ✨ Features

- 🚀 **Fast & Efficient** - Process multiple papers in seconds
- 🎯 **Dual API Support** - Uses both Crossref and ArXiv APIs for maximum coverage
- 📝 **Automatic Formatting** - Generates properly formatted BibTeX citations
- 🔒 **Privacy First** - All processing happens in your browser
- 💾 **Batch Processing** - Handle hundreds of papers at once
- 📥 **Multiple Input Methods** - Paste titles or upload text files
- ⚙️ **Customizable Settings** - Control processing speed and output format
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🌐 **No Registration** - Free to use, no account required

## 🚀 Quick Start

### Online Usage

Simply visit [https://hhhpraise.github.io/citation-fetcher/](https://hhhpraise.github.io/citation-fetcher/) and start generating citations!

### Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hhhpraise/citation-fetcher.git
   cd citation-fetcher
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   open index.html  # macOS
   start index.html # Windows
   xdg-open index.html # Linux
   ```

   Or use a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve
   ```

3. **Access the application**
   - Open your browser and navigate to `http://localhost:8000`

## 📖 How to Use

### Method 1: Paste Paper Titles

1. Navigate to the **Input** tab
2. Paste your paper titles (one per line) in the text area
3. Click **Generate Citations**
4. View results in the **Results** tab
5. Copy to clipboard or download as `.bib` file

### Method 2: Upload a File

1. Prepare a `.txt` file with paper titles (one per line)
2. Click **Upload File** or drag and drop your file
3. Click **Generate Citations**
4. Download or copy your formatted citations

### Example Input

```
Attention Is All You Need
BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding
Deep Residual Learning for Image Recognition
ImageNet Classification with Deep Convolutional Neural Networks
Generative Adversarial Networks
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

## ⚙️ Settings

### Processing Speed
- Control the delay between API requests (0.5s - 3.0s)
- Prevents rate limiting for large batches

### API Priority
- **Crossref** (default) - More accurate for published papers
- **ArXiv** - Faster for preprints and recent papers

### Output Format
- Pretty indentation
- Sort entries alphabetically
- Include helpful comments

### Crossref Email (Optional)
- Provide your email for polite API usage
- Required for high-volume usage
- Increases priority in Crossref's request queue

## 🔧 Technical Details

### APIs Used

#### Crossref API
- **Endpoint**: `https://api.crossref.org/works`
- **Coverage**: 140+ million records from thousands of publishers
- **Best for**: Published journal articles, conference papers
- **Documentation**: [Crossref REST API](https://www.crossref.org/services/metadata-delivery/rest-api/)

#### ArXiv API
- **Endpoint**: `https://export.arxiv.org/api/query`
- **Coverage**: 2+ million preprints
- **Best for**: Physics, Mathematics, Computer Science preprints
- **Documentation**: [ArXiv API User Manual](https://arxiv.org/help/api)

### Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Custom CSS with responsive design
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Poppins, Roboto Mono)
- **APIs**: Crossref REST API, ArXiv API

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

## 📁 Project Structure

```
citation-fetcher/
├── index.html          # Main HTML file
├── style.css           # Styling and responsive design
├── script.js           # Application logic and API integration
├── manifest.json       # PWA manifest
├── icon.png           # Application icon
├── screenshot.png     # Screenshot for README
└── README.md          # This file
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and formatting
- Test thoroughly before submitting PR
- Update documentation for new features
- Add comments for complex logic
- Ensure mobile responsiveness

## 🐛 Known Issues & Limitations

- **API Rate Limits**: Crossref recommends max 50 requests/second
- **Fuzzy Matching**: Title matching isn't always perfect - try simplifying titles
- **Special Characters**: Some non-ASCII characters may not be handled correctly
- **Network Required**: Requires internet connection to access APIs
- **Browser Storage**: Settings are stored in localStorage (cleared when cache is cleared)

## 🛣️ Roadmap

- [ ] Add support for DOI input
- [ ] Support for more citation formats (APA, MLA, Chicago)
- [ ] Bulk DOI lookup
- [ ] Export to RIS format
- [ ] Integration with Zotero/Mendeley
- [ ] Dark mode support
- [ ] Citation preview before download
- [ ] Duplicate detection
- [ ] Advanced search filters
- [ ] Browser extension

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Praise O. Arowolo**

- GitHub: [@Hhhpraise](https://github.com/Hhhpraise)
- Repository: [citation-fetcher](https://github.com/Hhhpraise/citation-fetcher)

## 🙏 Acknowledgments

- [Crossref](https://www.crossref.org/) for providing free access to their API
- [ArXiv](https://arxiv.org/) for their open access preprint repository
- [Font Awesome](https://fontawesome.com/) for the icon library
- [Google Fonts](https://fonts.google.com/) for the typography
- All contributors and users of this tool

## 📊 Statistics

- **Total APIs**: 2 (Crossref + ArXiv)
- **Coverage**: 140+ million academic papers
- **Processing Speed**: ~1-3 seconds per paper
- **Success Rate**: ~85-95% (depends on title accuracy)

## ❓ FAQ

**Q: Why do some papers fail to fetch?**  
A: This usually happens when the title doesn't exactly match what's in the database. Try simplifying the title or removing subtitles.

**Q: Can I use this for commercial purposes?**  
A: Yes! This tool is MIT licensed and free to use for any purpose.

**Q: Do you store my paper titles?**  
A: No! Everything is processed client-side in your browser. We don't have any servers.

**Q: What's the difference between Crossref and ArXiv?**  
A: Crossref covers published journal articles from most publishers. ArXiv specializes in preprints (unpublished papers) especially in physics, math, and computer science.

**Q: Can I process thousands of papers at once?**  
A: While technically possible, we recommend batches of 50-100 to avoid rate limiting and browser performance issues.

## 🔗 Related Projects

- [Crossref Metadata Search](https://search.crossref.org/)
- [Google Scholar](https://scholar.google.com/)
- [Semantic Scholar](https://www.semanticscholar.org/)
- [CiteSeerX](https://citeseerx.ist.psu.edu/)

## 💬 Support

If you encounter any issues or have questions:

1. Check the [FAQ section](#-faq) above
2. Search [existing issues](https://github.com/Hhhpraise/citation-fetcher/issues)
3. Open a [new issue](https://github.com/Hhhpraise/citation-fetcher/issues/new) if needed

## ⭐ Show Your Support

If you find this tool useful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🔀 Contributing code
- 📢 Sharing with colleagues

---

<div align="center">

**Made with ❤️ for researchers worldwide**

[Report Bug](https://github.com/Hhhpraise/citation-fetcher/issues) · [Request Feature](https://github.com/Hhhpraise/citation-fetcher/issues) · [Live Demo](https://hhhpraise.github.io/citation-fetcher/)

</div>
