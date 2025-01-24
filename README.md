# Extension:Kroki

The Kroki extension leverages the unified API offered by Kroki.io to create diagrams directly from textual descriptions.

More information about Kroki can be found at https://kroki.io.

The diagrams, stored in the text form, can be version-controlled and saved directly in your wiki pages.
Moreover, they can be quickly updated or replaced when needed. The images will not be managed in the MediaWiki database.

This extension provide a dialog for wikiEditor and also for the visualEditor.

## Available Diagram Types

The following diagram types are supported:

```php
$diagramTypes = [
    'blockdiag',
    'bpmn',
    'bytefield',
    'seqdiag',
    'actdiag',
    'nwdiag',
    'packetdiag',
    'rackdiag',
    'c4plantuml',
    'd2',
    'dbml',
    'ditaa',
    'erd',
    'excalidraw',
    'graphviz',
    'mermaid',
    'nomnoml',
    'pikchr',
    'plantuml',
    'structurizr',
    'svgbob',
    'symbolator',
    'tikz',
    'vega',
    'vegalite',
    'wavedrom',
    'wireviz'
];
```

## Installation

- [Download](https://github.com/CptLausebaer/mediawiki-kroki-extension) and place the file(s) in a directory
  called `Kroki` in your extensions/ folder.
- Add the following code to the bottom of your `LocalSettings.php` file:

```php
wfLoadExtension( 'Kroki' );
```

To integrate the Kroki insert dialog into the WikiEditor, you also need to load the `WikiEditor` Extension by
using `wfLoadExtension( 'WikiEditor' );`.

Similarly, for integrating the Kroki insert dialog into the VisualEditor, the `VisualEditor` Extension must be loaded.
This can be done with `wfLoadExtension( 'VisualEditor' );`.

The dialog boxes include a multiline text input field. If you load the `CodeEditor` Extension
using `wfLoadExtension( 'CodeEditor' );`, you will achieve an enhanced editing experience.

## Configuration

```
$wgKrokiServerEndpoint = "https://kroki.io";
```

In order to address privacy issues and optimize performance, you can modify the server endpoint URL for the Kroki
Service.
This can be done by adjusting the `$wgKrokiServerEndpoint` in the `LocalSettings.php` file.

For setting up the service on your own, official Docker images are available at 'https://github.com/yuzutech/kroki'.
Refer to the Kroki Documentation for more details on setup
process: [Kroki Documentation](https://docs.kroki.io/kroki/setup/install/).

## Usage

This extension adds the `<kroki>`  tag.

The `lang` attribute defines the diagram type to be used for rendering the content provided.

An example in wikitext looks like this:

```
<kroki lang="blockdiag">
blockdiag {
  Kroki -> generates -> "Block diagrams";
  Kroki -> is -> "very easy!";

  Kroki [color = "greenyellow"];
  "Block diagrams" [color = "pink"];
  "very easy!" [color = "orange"];
}
</kroki>
```

The code above will render an image with SVG content formatted as a data URL.

```
<img src="data:image/svg+xml;base64,PHN2ZyB2aW...">
```

<img src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNjQwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczppbmtzcGFjZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxkZWZzIGlkPSJkZWZzX2Jsb2NrIj4KICAgIDxmaWx0ZXIgaGVpZ2h0PSIxLjUwNCIgaWQ9ImZpbHRlcl9ibHVyIiBpbmtzcGFjZTpjb2xsZWN0PSJhbHdheXMiIHdpZHRoPSIxLjE1NzUiIHg9Ii0wLjA3ODc1IiB5PSItMC4yNTIiPgogICAgICA8ZmVHYXVzc2lhbkJsdXIgaWQ9ImZlR2F1c3NpYW5CbHVyMzc4MCIgaW5rc3BhY2U6Y29sbGVjdD0iYWx3YXlzIiBzdGREZXZpYXRpb249IjQuMiIgLz4KICAgIDwvZmlsdGVyPgogIDwvZGVmcz4KICA8dGl0bGU+YmxvY2tkaWFnPC90aXRsZT4KICA8ZGVzYz4KYmxvY2tkaWFnIHsKICBLcm9raSAtJmd0OyBnZW5lcmF0ZXMgLSZndDsgIkJsb2NrIGRpYWdyYW1zIjsKICBLcm9raSAtJmd0OyBpcyAtJmd0OyAidmVyeSBlYXN5ISI7CgogIEtyb2tpIFtjb2xvciA9ICJncmVlbnllbGxvdyJdOwogICJCbG9jayBkaWFncmFtcyIgW2NvbG9yID0gInBpbmsiXTsKICAidmVyeSBlYXN5ISIgW2NvbG9yID0gIm9yYW5nZSJdOwp9CjwvZGVzYz4KICA8cmVjdCBmaWxsPSJyZ2IoMCwwLDApIiBoZWlnaHQ9IjQwIiBzdHJva2U9InJnYigwLDAsMCkiIHN0eWxlPSJmaWx0ZXI6dXJsKCNmaWx0ZXJfYmx1cik7b3BhY2l0eTowLjc7ZmlsbC1vcGFjaXR5OjEiIHdpZHRoPSIxMjgiIHg9IjY3IiB5PSI0NiIgLz4KICA8cmVjdCBmaWxsPSJyZ2IoMCwwLDApIiBoZWlnaHQ9IjQwIiBzdHJva2U9InJnYigwLDAsMCkiIHN0eWxlPSJmaWx0ZXI6dXJsKCNmaWx0ZXJfYmx1cik7b3BhY2l0eTowLjc7ZmlsbC1vcGFjaXR5OjEiIHdpZHRoPSIxMjgiIHg9IjI1OSIgeT0iNDYiIC8+CiAgPHJlY3QgZmlsbD0icmdiKDAsMCwwKSIgaGVpZ2h0PSI0MCIgc3Ryb2tlPSJyZ2IoMCwwLDApIiBzdHlsZT0iZmlsdGVyOnVybCgjZmlsdGVyX2JsdXIpO29wYWNpdHk6MC43O2ZpbGwtb3BhY2l0eToxIiB3aWR0aD0iMTI4IiB4PSIyNTkiIHk9IjEyNiIgLz4KICA8cmVjdCBmaWxsPSJyZ2IoMCwwLDApIiBoZWlnaHQ9IjQwIiBzdHJva2U9InJnYigwLDAsMCkiIHN0eWxlPSJmaWx0ZXI6dXJsKCNmaWx0ZXJfYmx1cik7b3BhY2l0eTowLjc7ZmlsbC1vcGFjaXR5OjEiIHdpZHRoPSIxMjgiIHg9IjQ1MSIgeT0iNDYiIC8+CiAgPHJlY3QgZmlsbD0icmdiKDAsMCwwKSIgaGVpZ2h0PSI0MCIgc3Ryb2tlPSJyZ2IoMCwwLDApIiBzdHlsZT0iZmlsdGVyOnVybCgjZmlsdGVyX2JsdXIpO29wYWNpdHk6MC43O2ZpbGwtb3BhY2l0eToxIiB3aWR0aD0iMTI4IiB4PSI0NTEiIHk9IjEyNiIgLz4KICA8cmVjdCBmaWxsPSJyZ2IoMTczLDI1NSw0NykiIGhlaWdodD0iNDAiIHN0cm9rZT0icmdiKDAsMCwwKSIgd2lkdGg9IjEyOCIgeD0iNjQiIHk9IjQwIiAvPgogIDx0ZXh0IGZpbGw9InJnYigwLDAsMCkiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjExIiBmb250LXN0eWxlPSJub3JtYWwiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiIHRleHRMZW5ndGg9IjMxIiB4PSIxMjguNSIgeT0iNjYiPktyb2tpPC90ZXh0PgogIDxyZWN0IGZpbGw9InJnYigyNTUsMjU1LDI1NSkiIGhlaWdodD0iNDAiIHN0cm9rZT0icmdiKDAsMCwwKSIgd2lkdGg9IjEyOCIgeD0iMjU2IiB5PSI0MCIgLz4KICA8dGV4dCBmaWxsPSJyZ2IoMCwwLDApIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMSIgZm9udC1zdHlsZT0ibm9ybWFsIiBmb250LXdlaWdodD0ibm9ybWFsIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiB0ZXh0TGVuZ3RoPSI1NiIgeD0iMzIwLjAiIHk9IjY3Ij5nZW5lcmF0ZXM8L3RleHQ+CiAgPHJlY3QgZmlsbD0icmdiKDI1NSwyNTUsMjU1KSIgaGVpZ2h0PSI0MCIgc3Ryb2tlPSJyZ2IoMCwwLDApIiB3aWR0aD0iMTI4IiB4PSIyNTYiIHk9IjEyMCIgLz4KICA8dGV4dCBmaWxsPSJyZ2IoMCwwLDApIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMSIgZm9udC1zdHlsZT0ibm9ybWFsIiBmb250LXdlaWdodD0ibm9ybWFsIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiB0ZXh0TGVuZ3RoPSIxMCIgeD0iMzIwLjAiIHk9IjE0NiI+aXM8L3RleHQ+CiAgPHJlY3QgZmlsbD0icmdiKDI1NSwxOTIsMjAzKSIgaGVpZ2h0PSI0MCIgc3Ryb2tlPSJyZ2IoMCwwLDApIiB3aWR0aD0iMTI4IiB4PSI0NDgiIHk9IjQwIiAvPgogIDx0ZXh0IGZpbGw9InJnYigwLDAsMCkiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjExIiBmb250LXN0eWxlPSJub3JtYWwiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiIHRleHRMZW5ndGg9Ijg3IiB4PSI1MTIuNSIgeT0iNjciPkJsb2NrIGRpYWdyYW1zPC90ZXh0PgogIDxyZWN0IGZpbGw9InJnYigyNTUsMTY1LDApIiBoZWlnaHQ9IjQwIiBzdHJva2U9InJnYigwLDAsMCkiIHdpZHRoPSIxMjgiIHg9IjQ0OCIgeT0iMTIwIiAvPgogIDx0ZXh0IGZpbGw9InJnYigwLDAsMCkiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjExIiBmb250LXN0eWxlPSJub3JtYWwiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiIHRleHRMZW5ndGg9IjU4IiB4PSI1MTIuMCIgeT0iMTQ3Ij52ZXJ5IGVhc3khPC90ZXh0PgogIDxwYXRoIGQ9Ik0gMTkyIDYwIEwgMjQ4IDYwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYigwLDAsMCkiIC8+CiAgPHBvbHlnb24gZmlsbD0icmdiKDAsMCwwKSIgcG9pbnRzPSIyNTUsNjAgMjQ4LDU2IDI0OCw2NCAyNTUsNjAiIHN0cm9rZT0icmdiKDAsMCwwKSIgLz4KICA8cGF0aCBkPSJNIDE5MiA2MCBMIDIyNCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2IoMCwwLDApIiAvPgogIDxwYXRoIGQ9Ik0gMjI0IDYwIEwgMjI0IDE0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2IoMCwwLDApIiAvPgogIDxwYXRoIGQ9Ik0gMjI0IDE0MCBMIDI0OCAxNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiKDAsMCwwKSIgLz4KICA8cG9seWdvbiBmaWxsPSJyZ2IoMCwwLDApIiBwb2ludHM9IjI1NSwxNDAgMjQ4LDEzNiAyNDgsMTQ0IDI1NSwxNDAiIHN0cm9rZT0icmdiKDAsMCwwKSIgLz4KICA8cGF0aCBkPSJNIDM4NCA2MCBMIDQ0MCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2IoMCwwLDApIiAvPgogIDxwb2x5Z29uIGZpbGw9InJnYigwLDAsMCkiIHBvaW50cz0iNDQ3LDYwIDQ0MCw1NiA0NDAsNjQgNDQ3LDYwIiBzdHJva2U9InJnYigwLDAsMCkiIC8+CiAgPHBhdGggZD0iTSAzODQgMTQwIEwgNDQwIDE0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2IoMCwwLDApIiAvPgogIDxwb2x5Z29uIGZpbGw9InJnYigwLDAsMCkiIHBvaW50cz0iNDQ3LDE0MCA0NDAsMTM2IDQ0MCwxNDQgNDQ3LDE0MCIgc3Ryb2tlPSJyZ2IoMCwwLDApIiAvPgo8L3N2Zz4K">

For additional information, refer to the Kroki documentation at https://docs.kroki.io/kroki/.
