{%- comment %}
  Build the equal-columns :where() selector.
{% endcomment -%}
{%- assign factors = grid_columns_desktop_factors|split: "," -%}
{%- for factor in factors -%}
  {%- assign ec_selector = ".gs--ec"|append: factor -%}
  {%- assign ec_selectors = ec_selectors|push: ec_selector -%}
{%- endfor -%}
{%- assign ec_selector_list = ec_selectors|join: ", " -%}
{%- assign ec_where_selector = ":where("|append: ec_selector_list|append: ") > *" -%}

{%- comment %}
  Build the column-span selector list.
{% endcomment -%}
{%- assign columns_array = (1..grid_columns_desktop)|map: "dummy" -%}
{%- for columns in columns_array -%}
  {%- assign cs_selector = ".gs__cs"|append: forloop.index -%}
  {%- assign cs_selectors = cs_selectors|push: cs_selector -%}
{% endfor -%}
{%- assign cs_selector_list = cs_selectors|join: ", " -%}

{%- comment %}
  Output the css using our (lists of) selectors.
{%- endcomment -%}
/**
 * BH Grid System
 *
 * This file contains a grid system using {{ grid_columns_desktop }} columns.
 */
.gs {
  --gs-grid-column-gap: {{ grid_column_gap_mobile }};
  --gs-grid-row-gap: {{ grid_row_gap_mobile }};
  --gs-grid-columns: {{ grid_columns_mobile }};
  --gs-grid-columns-actual: calc(2 * var(--gs-grid-columns));
  /* Everything has {{ grid_columns_mobile }} column at mobile sizes. */
  --gs-grid-column-span: calc(var(--gs-grid-columns-actual) / {{ grid_columns_mobile }});

  display: grid;
  grid-auto-rows: auto;
  grid-column-gap: var(--gs-grid-column-gap);
  grid-row-gap: var(--gs-grid-row-gap);
  grid-template-columns: repeat(var(--gs-grid-columns-actual), 1fr);
}

{{ ec_where_selector }},
{{ cs_selector_list }} {
  grid-column: span var(--gs-grid-column-span);
}

@media screen and (width >= {{ grid_breakpoint_tablet }}) {

  .gs {
    --gs-grid-column-gap: {{ grid_column_gap_tablet }};
    --gs-grid-row-gap: {{ grid_row_gap_tablet }};
    --gs-grid-columns: {{ grid_columns_tablet }};
    /* Everything has {{ grid_columns_tablet }} columns at tablet sizes. */
    --gs-grid-column-span: calc(var(--gs-grid-columns-actual) / {{ grid_columns_tablet }});
  }

  /* Align-center cells */
  .gs__ac {
    --gs-grid-column-start: calc(1 + (var(--gs-grid-columns-actual) - var(--gs-grid-column-span)) / 2);
  }

  /* Align-end cells */
  .gs__ae {
    --gs-grid-column-start: calc(1 + var(--gs-grid-columns-actual) - var(--gs-grid-column-span));
  }

  /* Align-center, align-end common */
  .gs__ac,
  .gs__ae {
    grid-column: var(--gs-grid-column-start) / span var(--gs-grid-column-span);
  }

}

@media screen and (width >= {{ grid_breakpoint_desktop }}) {

  .gs {
    --gs-grid-column-gap: {{ grid_column_gap_desktop }};
    --gs-grid-row-gap: {{ grid_row_gap_desktop }};
    --gs-grid-columns: {{ grid_columns_desktop }};
  }

  {%- comment %}
    Create a selector for each column span value:

      - actual columns / divisor for equal column cells
      - actual columns for column spanning cells
  {% endcomment %}

  /* Equal-column cells */
  {%- for factor in factors %}
    .gs--ec{{ factor }} > * { --gs-grid-column-span: {{ grid_columns_desktop|times: 2|divided_by: factor }}; }
  {%- endfor %}

  /* Column-spanning cells */
  {%- for cs_selector in cs_selectors %}
    {{ cs_selector }} {
      --gs-grid-column-span: {{ forloop.index|times: 2 }}
    }
  {% endfor %}
}
