{%- assign factors_array = grid_columns_desktop_factors|split: "," -%}
{%- assign columns_array = (1..grid_columns_desktop)|map: "dummy" -%}

<div class="gs-fragment">
  <h3>Equal-width cells</h3>

  {% for factor in factors_array -%}
    {%- assign columns = forloop.index -%}
    <div class="gs gs--ec{{ factor }}">
      {%- assign divisions_array = (1..factor)|map: "dummy" -%}
      {% for i in divisions_array %}
        {%- assign cells = forloop.index %}
        <div><sup>{{ cells }}</sup> / <sup>{{ factor }}</sup></div>
      {%- endfor %}
    </div>
  {% endfor %}
  </div>

  <h3>Column-spanning cells</h3>

  <div class="gs">
    {% for i in columns_array %}
      {% assign span1 = forloop.index %}
      {% assign span2 = grid_columns_desktop|minus: span1 %}
      {% assign unit = "col" if span1 == 1 else "cols" %}
      <div class="gs__cs{{ span1 }}">{{ span1 }} {{ unit }}</div>
      {% if span2 != 0 %}
        <div class="gs__cs{{ span2 }}">{{ span2 }} {{ unit }}</div>
      {% endif %}
    {% endfor %}

    <div class="gs__cs3">3 cols</div>
    <div class="gs__cs5 gs__ae">5 cols, align-end</div>
    <div class="gs__cs7 gs__ac">7 cols, align-center</div>
  </div>
</div>
