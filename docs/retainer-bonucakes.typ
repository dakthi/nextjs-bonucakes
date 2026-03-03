#set text(font: "Avenir Next", size: 10pt)
#set par(leading: 0.5em)
#show heading: set block(above: 1.4em, below: 0.4em)
#set page(
  paper: "a4",
  margin: (top: 2.5cm, left: 1.5cm, right: 1.5cm, bottom: 2.5cm),
  header: context {
    set text(size: 9pt, fill: luma(80))
    grid(
      columns: (1fr, auto, auto),
      align: (left + horizon, right + horizon, right + horizon),
      column-gutter: 8pt,
      [*Bonucakes*],
      [Charted Consultants],
      image("logo.png", height: 14pt)
    )
    line(length: 100%, stroke: 0.5pt + luma(80))
  },
  footer: context {
    set text(size: 9pt, fill: luma(80))
    align(center)[Page #counter(page).display() of #counter(page).final().at(0)]
  }
)
#set heading(numbering: none)

// Title
#align(center)[
  #text(size: 22pt, weight: "bold", fill: rgb("#1e3a5f"))[Technology and Digital Partner]
  #v(0.2cm)
  #text(size: 11pt, fill: luma(60))[Retainer Agreement]
]

#v(0.3cm)

#grid(
  columns: (1fr, 1fr),
  column-gutter: 20pt,
  [
    *Partner:* Bonucakes ("Bonucakes") \
    *Effective from:* 1 February 2026
  ],
  align(right)[
    Charted Consultants ("Charted")
  ]
)

#v(0.15cm)
#line(length: 100%, stroke: 0.5pt + gray)
#v(0.15cm)

= Purpose

This agreement establishes an ongoing partnership for technology and digital support. As Bonucakes' dedicated partner, Charted works alongside your team to _optimise your technology stack_ and _strengthen your online presence_.

= Scope

There is no fixed set of deliverables — Charted provides support as needed across two key areas:

#table(
  columns: (1fr, 1fr),
  stroke: 0.5pt + luma(200),
  inset: 10pt,
  [*Automation & Operations*], [*Presence & Growth*],
  text(size: 9pt)[
    _This may include:_
    - Spot automation opportunities
    - Monitor tech stack for risks and opportunities
    - Identify ways to streamline workflows
    - Support and troubleshooting when issues arise
  ],
  text(size: 9pt)[
    _This may include:_
    - Spot opportunities to improve engagement online
    - Coordinate content production and develop formats for the team
    - Review website freshness and relevance
    - Support brand consistency across platforms
  ],
)

#text(size: 9pt, fill: luma(60))[These are examples — support extends to anything reasonable within these areas.]

#grid(
  columns: (1fr, 1fr),
  column-gutter: 28pt,
  [
    = Delivery

    *Communication:* Ongoing check-ins and on-site support as needed.

    *Recommendations:* Proactive suggestions based on what Charted observes.

    *Training:* Guidance for Bonucakes' team when required.
  ],
  [
    = Terms

    *Changes:* Adjustments to this arrangement may be discussed and agreed at any time.

    *Projects:* Larger initiatives will be proposed and scoped together as separate projects.

    The nature of support will adapt to your evolving needs.
  ],
)

#grid(
  columns: (1fr, 1fr),
  column-gutter: 28pt,
  [
    = Commercial

    #table(
      columns: (1fr, auto),
      stroke: none,
      inset: 6pt,
      table.hline(),
      [Monthly retainer], [*£0*],
      table.hline(),
    )

    Invoiced at the end of each month. Payment due within 14 days.
  ],
  [
    = Intellectual Property

    All work produced under this partnership belongs to Bonucakes.
  ],
)

#v(0.3cm)
#line(length: 100%, stroke: 0.5pt + gray)
#v(0.2cm)

= Acceptance

#grid(
  columns: (1fr, 1fr),
  column-gutter: 40pt,
  [
    *Bonucakes*
    #v(0.7cm)
    #line(length: 80%, stroke: 0.5pt)
    #v(0.2cm)
    Date:
  ],
  [
    *Charted Consultants*
    #v(0.7cm)
    #line(length: 80%, stroke: 0.5pt)
    #v(0.2cm)
    Date:
  ]
)
