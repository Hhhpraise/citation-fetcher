import requests
import time
import re
import json
from urllib.parse import quote
import xml.etree.ElementTree as ET


def clean_title(title):
    """Clean paper title for searching while preserving Unicode characters"""
    # Remove problematic characters but keep Unicode letters
    cleaned = re.sub(r'[^\w\s\-:.,;?!\'"()]', '', title, flags=re.UNICODE)
    return cleaned.strip()


def fetch_bibtex_from_crossref(paper_title):
    """Fetch BibTeX citation from Crossref API with proper Unicode handling"""
    base_url = "https://api.crossref.org/works"
    params = {
        'query.bibliographic': clean_title(paper_title),
        'rows': 1,
        'mailto': 'user@example.com'  # Required by Crossref API for polite usage
    }

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json; charset=utf-8',
        'Accept-Charset': 'utf-8'
    }

    try:
        response = requests.get(base_url, params=params, headers=headers, timeout=10)
        response.raise_for_status()

        # Ensure proper UTF-8 decoding
        response.encoding = 'utf-8'
        data = response.json()

        if data['message']['items']:
            work = data['message']['items'][0]
            doi = work.get('DOI')

            if doi:
                # Fetch BibTeX format
                bibtex_url = f"https://api.crossref.org/works/{doi}/transform/application/x-bibtex"
                bib_response = requests.get(bibtex_url, headers=headers, timeout=10)
                bib_response.raise_for_status()
                bib_response.encoding = 'utf-8'
                return bib_response.text

        return None

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data for '{paper_title[:50]}...': {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"JSON decoding error for '{paper_title[:50]}...': {e}")
        return None


def fetch_bibtex_from_arxiv(paper_title):
    """Alternative: Fetch BibTeX from ArXiv if Crossref fails"""
    # Clean title for ArXiv search
    clean_title_search = re.sub(r'[^\w\s\-]', ' ', paper_title, flags=re.UNICODE)
    clean_title_search = re.sub(r'\s+', ' ', clean_title_search).strip()

    base_url = "http://export.arxiv.org/api/query"
    params = {
        'search_query': f'ti:"{clean_title_search}"',
        'max_results': 1,
        'sortBy': 'relevance',
        'sortOrder': 'descending'
    }

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/xml; charset=utf-8'
    }

    try:
        response = requests.get(base_url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        response.encoding = 'utf-8'

        # Parse XML response
        root = ET.fromstring(response.content)

        # Define namespaces for ArXiv Atom feed
        ns = {'atom': 'http://www.w3.org/2005/Atom'}

        entries = root.findall('atom:entry', ns)
        if entries:
            entry = entries[0]

            # Extract title
            title_elem = entry.find('atom:title', ns)
            title = title_elem.text.strip() if title_elem is not None and title_elem.text else ''

            # Extract authors
            authors = []
            author_elems = entry.findall('atom:author/atom:name', ns)
            for author_elem in author_elems:
                if author_elem.text:
                    authors.append(author_elem.text.strip())

            # Extract publication date
            published_elem = entry.find('atom:published', ns)
            year = '2023'  # Default
            if published_elem is not None and published_elem.text:
                date_str = published_elem.text.strip()
                year = date_str[:4]

            # Extract arXiv ID for unique key
            id_elem = entry.find('atom:id', ns)
            arxiv_id = ''
            if id_elem is not None and id_elem.text:
                # Extract arXiv ID from URL
                match = re.search(r'arxiv\.org/abs/(.+)', id_elem.text)
                if match:
                    arxiv_id = match.group(1).replace('/', '')

            if title and authors:
                # Generate BibTeX key
                if arxiv_id:
                    bib_key = f"arxiv:{arxiv_id}"
                else:
                    # Fallback: use first author and year
                    first_author = authors[0].split()[-1].lower() if authors else 'unknown'
                    first_author = re.sub(r'[^\w]', '', first_author)  # Clean author name
                    bib_key = f"{first_author}{year}"

                # Escape special BibTeX characters in title - FIXED: Use raw strings or double backslashes
                title_escaped = title.replace('{', '\\{').replace('}', '\\}')

                bibtex = f"""@article{{{bib_key},
  title = {{{title_escaped}}},
  author = {{{' and '.join(authors)}}},
  year = {{{year}}},
  journal = {{arXiv preprint}},
  note = {{arXiv:{arxiv_id if arxiv_id else 'preprint'}}},
  url = {{https://arxiv.org/abs/{arxiv_id if arxiv_id else ''}}}
}}"""
                return bibtex

        return None

    except requests.exceptions.RequestException as e:
        print(f"Error fetching from ArXiv for '{paper_title[:50]}...': {e}")
        return None
    except ET.ParseError as e:
        print(f"XML parsing error for '{paper_title[:50]}...': {e}")
        return None


def save_bibtex_to_file(paper_titles, output_file="citations.bib", delay=1):
    """
    Main function to fetch and save BibTeX citations with proper Unicode handling

    Args:
        paper_titles (list): List of paper titles to search for
        output_file (str): Output file name
        delay (int): Delay between requests in seconds (to be polite to APIs)
    """

    successful = 0
    failed = []

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("% Auto-generated BibTeX citations\n")
        f.write("% Generated using academic APIs\n")
        f.write("% Encoding: UTF-8\n\n")

        for i, title in enumerate(paper_titles, 1):
            print(f"Processing ({i}/{len(paper_titles)}): {title[:80]}...")

            # Try Crossref first
            bibtex = fetch_bibtex_from_crossref(title)

            # If Crossref fails, try ArXiv
            if not bibtex:
                bibtex = fetch_bibtex_from_arxiv(title)

            if bibtex:
                # Ensure bibtex is properly encoded
                f.write(bibtex)
                f.write("\n\n")
                successful += 1
                print(f"✓ Successfully fetched citation")
            else:
                failed.append(title)
                print(f"✗ Failed to fetch citation")

                # Add placeholder entry for missing citations
                safe_key = re.sub(r'[^\w]', '_', title[:50].lower())
                placeholder = f"""@article{{{safe_key},
  title = {{{title}}},
  author = {{Unknown}},
  year = {{}},
  note = {{Citation not found, please add manually}},
  url = {{}}
}}
"""
                f.write(placeholder)
                f.write("\n\n")

            # Be polite to APIs
            time.sleep(delay)

    # Print summary
    print(f"\n{'=' * 50}")
    print(f"SUMMARY")
    print(f"{'=' * 50}")
    print(f"Successful: {successful}/{len(paper_titles)}")
    print(f"Failed: {len(failed)}")

    if failed:
        print(f"\nFailed papers:")
        for i, paper in enumerate(failed, 1):
            print(f"  {i}. {paper[:100]}...")


def read_titles_from_file(filename):
    """Read paper titles from a text file (one per line) with proper Unicode handling"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            titles = [line.strip() for line in f if line.strip()]
        return titles
    except UnicodeDecodeError:
        # Try different encodings if UTF-8 fails
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
        for encoding in encodings:
            try:
                with open(filename, 'r', encoding=encoding) as f:
                    titles = [line.strip() for line in f if line.strip()]
                print(f"Successfully read file with {encoding} encoding")
                return titles
            except UnicodeDecodeError:
                continue
        print(f"Error: Could not read {filename} with any supported encoding")
        return []


def generate_bibtex_manually(paper_title):
    """Generate a simple BibTeX entry manually when APIs fail"""
    # Create a safe key from the title
    safe_key = re.sub(r'[^\w]', '_', paper_title[:50].lower())

    bibtex = f"""@article{{{safe_key},
  title = {{{paper_title}}},
  author = {{Unknown}},
  year = {{}},
  journal = {{}},
  note = {{Citation not found automatically, please fill in manually}},
  url = {{}}
}}"""
    return bibtex


# Example usage
if __name__ == "__main__":
    # Method 1: Direct list of papers
    # papers = [
    #     "Attention Is All You Need",
    #     "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    #     "Improving Language Understanding by Generative Pre-Training"
    # ]

    # Method 2: Read from file
    papers = read_titles_from_file("papers.txt")

    if not papers:
        print("Error: No papers found. Please check your input file or list.")
        print("Creating example file 'papers.txt' with sample papers...")
        with open("papers.txt", "w", encoding="utf-8") as f:
            f.write("Attention Is All You Need\n")
            f.write("BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding\n")
            f.write("Improving Language Understanding by Generative Pre-Training\n")
        papers = read_titles_from_file("papers.txt")

    # Fetch and save citations
    print(f"Processing {len(papers)} papers...")
    save_bibtex_to_file(papers, "my_citations.bib", delay=1.5)

    print(f"\nCitations saved to 'my_citations.bib'")