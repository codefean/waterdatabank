# SERES water data explorer

A standalone static website for its own GitHub repository. It uses blue tones derived from the SERES styling and generic Arial/Helvetica, Georgia and monospace fonts. No framework, package installation, external fonts, API key or build step is required. The general SERES website is independent and has not been changed.

## Upload to GitHub

Upload **the contents of this folder** to the root of your new repository. In GitHub Pages, choose deployment from your branch and the root folder. Keep `data/` beside the HTML, JavaScript and CSS files. All paths are relative, so the site works under a GitHub Pages repository path.

When the SERES homepage is published, enter its full HTTPS URL in `config.js` to show the return link. Until then, that link stays hidden. Add the explorer's public URL to the general SERES site's external-links.html when ready. No repository creation or publication has been performed.

## Local preview

From this folder:

```sh
python3 -m http.server 8082
```

Open http://localhost:8082 . Use an HTTP server; opening HTML files directly from disk cannot fetch the CSV.

## Edit content

Edit **`data/datasets.csv`** and save as UTF-8 CSV with the same unique headers. One row represents one dataset or product. Add new rows without changing JavaScript. Keep `id` stable: detail page links use `dataset.html?id=THE-ID`. An entry with several products can have separate rows and distinct IDs, as with the supplied ERA5 records. Blank optional cells display as Not specified or omit the corresponding text section. Do not use HTML in cells. Quote cells containing commas, quotes or line breaks; export CSV from your spreadsheet editor to handle this automatically.

The website provides text search across metadata, topic and broad variable-group filters, alphabetical ordering, 25-result batches, downloadable matching results and a detail page for every entry. Filters are saved in the browser URL, and Back to results preserves them. The sort selector and dataset counts are omitted. Click anywhere on a dataset row, its title or Learn more to open its detail page. Native title and Learn more links remain available for keyboard navigation. The Contact navigation link opens contact.html, which displays Romi.Lotcheris@su.se and guidance for feedback or dataset suggestions. Its email link opens the visitor’s mail application; the address can also be copied. Contact details remain visible without JavaScript or an email application. Detail pages show coverage, variables, units, format, grid type, description, caveats, references, source links and team experience when supplied. Download catalogue entry exports metadata, not the provider's underlying research data. No access or reuse license is assumed for the underlying datasets.

Variable groups are a convenience derived from keywords in the `variable` field; they are not a replacement for the original variable text. Edit the small `groups` list in `explorer.js` to change that grouping. Unmatched variables appear under Other variables; blank ones under Not specified. Search can find any source wording, resolution or date without a prescribed category.

## Edit the header and footer

Edit **`header.html`** to change the SERES name, subtitle, navigation labels or links across all three pages. Edit **`footer.html`** to change the footer text and links. These files are reusable HTML fragments, not standalone pages, so do not add another header/footer wrapper or a full HTML document inside them.

`header.js` and `footer.js` load the fragments into each page. The header script also highlights the current navigation page and reads the optional SERES homepage URL from config.js. You normally only need to edit the HTML fragments. Appearance and spacing remain in style.css. Keep all four files beside index.html when uploading to GitHub. Preview through an HTTP server; direct file opening cannot load the shared fragments. If a fragment fails to load, the page retains a simple fallback navigation link.

## Files

| File | Purpose |
| --- | --- |
| `index.html`, `explorer.js` | Search and dataset table |
| `dataset.html`, `dataset.js` | Shared detail-page template |
| `shared.js` | CSV loading, validation, safe text/links, exports |
| `style.css` | SERES appearance and mobile layout |
| `header.html`, `header.js` | Shared header content and loader |
| `footer.html`, `footer.js` | Shared footer content and loader |
| `config.js` | Optional SERES homepage URL |
| `contact.html` | Contact details and dataset suggestion guidance |
| `topic-colors.js` | Topic label colors from the SERES regime palette |
| `data/datasets.csv` | The cleaned catalogue and editable website content |
| `data/README.md` | Column definitions and cleaning rules |

## Source and cleaning

Topic labels on the results table and dataset pages use exact colors from the SERES regime palette. The ten topic assignments live in `topic-colors.js`; new or unspecified topics use the palette's default `#4a5878`. Black or white label text is selected for contrast. Colors do not require extra CSV columns or a dependency on the main SERES repository.

The records come from **Data bank - Sheet1.csv**. **[Draft] Data Bank - Sheet1.csv** supplies the target schema and example categories, not additional records. The original input files are unchanged. The cleaned CSV retains 107 nonempty records; one entirely blank row is omitted. All supplied topics remain, including the environmental and social context records. Nothing is excluded because it is outside the hydrosphere topic.

The schema follows the draft using consistent snake_case headers. Product becomes variable; Unit and Grid type are added and remain blank unless explicitly present. The draft's repeated Reference[s] headings become `description_references` and `caveat_references`. The original Reference column goes into description_references; we do not guess which references support caveats. Source and team experience are preserved in their own columns. Stable IDs, source row numbers and cleanup notes support later edits.

Whitespace, escaped newlines and Land Cover/Land cover labels are normalized. Yearly becomes Annual, simple frequency labels use consistent capitalization, date-range separators are standardized, and spacing before m/km units is cleaned. Swath based is moved from Data format into Grid type. Explicit year ranges misplaced in Temporal resolution are separated into Temporal range only when that field is empty; ambiguous or conflicting source values remain and are noted. Numeric resolutions and dates are not corrected from outside knowledge. Names missing in the source use the supplied abbreviation or variable. The variable typo Evapotranpsiration is corrected. Yes/No development flags are standardized; uncertain or narrative flags retain their wording in Notes. Source URLs are separated and stray trailing citation punctuation is removed. DOIs are extracted only where explicitly present in source/reference links.

Coverage and development information have not been refreshed from provider websites. For example, the source has a temporal range beginning `014`; it is retained with a preparation note for review, not guessed to mean a different year. Duplicate-looking entries remain separate. `cleanup_notes` and `source_row` make the transformations traceable, and appear in a collapsed section on detail pages.
