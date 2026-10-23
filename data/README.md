# Dataset CSV columns

Use one row per dataset/product and keep these headers. Empty optional cells mean not specified, never zero or no.

| Column | Meaning |
| --- | --- |
| id | Required unique stable ID, such as era5-total-precipitation-p. Keep it unchanged to preserve links. |
| topic | Topic, e.g. Hydrosphere, Climate, Vegetation or Ocean. Categories populate automatically. |
| abbreviation | Short name or acronym. |
| name | Required dataset name. |
| variable | Measured variable or supplied product list. Keep multiple variables in the same cell when they describe one product. |
| unit | Unit, where explicitly known. Added to match the draft; not inferred. |
| data_format | File format, such as CSV, NetCDF or GeoTIFF. |
| grid_type | Grid/geometry description or CRS. The draft combines these concepts; retain that distinction in the text. |
| spatial_range | Geographic coverage. |
| spatial_resolution | Spatial resolution with its original units. |
| temporal_range | Coverage dates or years. |
| temporal_resolution | Observation or aggregation frequency. |
| description | Plain-text dataset explanation. Multiline cells are supported. |
| description_references | Description/general references, including original citations and links. |
| caveats | Limitations and suitability considerations. |
| caveat_references | References specifically associated with caveats; initially blank because the original file did not distinguish them. |
| actively_developed | Yes, No, Uncertain or blank. Source statements are not current verification. |
| doi | One or more explicit DOIs, separated by semicolons. |
| source_url | Full HTTP/HTTPS source URLs, separated by newlines or spaces. First valid link is the main Visit data source button. |
| experience | Team experience notes from the source. |
| notes | Additional notes, including preserved narrative development information. |
| cleanup_notes | Explanation of preparation changes or unresolved source issues. Optional for new rows. |
| source_row | Row number in the original full catalogue, including its header. Optional for new rows. |

These headings correspond to the draft structure without its duplicate Reference[s] names. Example values from the draft (such as a sample groundwater depth record) were not added as datasets. The cleaned source retains dates and resolutions as metadata strings; it does not infer coverage from an external provider or convert units.

When a source has only a paper/reference link and no dataset URL, that reference remains available on the detail page; the site does not invent a direct download. The complete cleaning method and source names are in the project README.
