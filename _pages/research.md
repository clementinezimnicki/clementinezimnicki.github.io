---
layout: page
title: research
permalink: /research
nav: true
nav_order: 2

---
<p style="font-size:40px;"> how do people interpret data visualizations? </p>
<p style="font-size:30px;"> and how can we make it easier? </p>

the more intuitive a visualization is, the easier it is to understand what information is being communicated. but what does "intuitive" mean? what aspects of a visualization make it more or less intuitive? my research focuses on understanding these questions. research shows people have expectations about what colors should mean in visualizations (even without looking at legends). knowing what these expectations are, and designing visualizations that match them, can make visualizations easier to interpret and therefore more accessible to wider audiences.

below are some projects I've been working on during my time at UW-Madison. 

all of these projects concern themselves with two biases people have about the meanings of colors in visualizations. the first bias is called the dark-is-more bias, and leads people to infer that darker regions on maps mean larger quantities. the second is the opaque-is-more bias, which leads people to infer that more opaque (that is, less translucent) regions mean larger quantities. In my work, I have explored how these biases work, including how far they extend and in which situations they may not apply.

<!-- pages/projects.md -->
<div class="projects">
{%- if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {%- for category in page.display_categories %}
  <h2 class="category">{{ category }}</h2>
  {%- assign categorized_projects = site.projects | where: "category", category -%}
  {%- assign sorted_projects = categorized_projects | sort: "importance" %}
  <!-- Generate cards for each project -->
  {% if page.horizontal -%}
  <div class="container">
    <div class="row row-cols-2">
    {%- for project in sorted_projects -%}
      {% include projects_horizontal.html %}
    {%- endfor %}
    </div>
  </div>
  {%- else -%}
  <div class="grid">
    {%- for project in sorted_projects -%}
      {% include projects.html %}
    {%- endfor %}
  </div>
  {%- endif -%}
  {% endfor %}

{%- else -%}
<!-- Display projects without categories -->
  {%- assign sorted_projects = site.projects | sort: "importance" -%}
  <!-- Generate cards for each project -->
  {% if page.horizontal -%}
  <div class="container">
    <div class="row row-cols-2">
    {%- for project in sorted_projects -%}
      {% include projects_horizontal.html %}
    {%- endfor %}
    </div>
  </div>
  {%- else -%}
  <div class="grid">
    {%- for project in sorted_projects -%}
      {% include projects.html %}
    {%- endfor %}
  </div>
  {%- endif -%}
{%- endif -%}
</div>

---