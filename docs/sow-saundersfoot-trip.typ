#set text(font: "Avenir Next", size: 10pt)
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
    align(center)[Page #counter(page).display()]
  }
)
#set heading(numbering: "1.")

// Title
#align(center)[
  #text(size: 20pt, weight: "bold", fill: rgb("#1e3a5f"))[Statement of Work]
  #v(0.2cm)
  #text(size: 12pt)[Saundersfoot Strategic Engagement]
]

#v(0.5cm)

#grid(
  columns: (1fr, 1fr),
  column-gutter: 20pt,
  [
    *Client:* Bonucakes ("Bonucakes") \
    *Provider:* Charted Consultants ("Charted")
  ],
  [
    *Date:* 26 February 2026 \
    *Version:* 1.0
  ]
)

#v(0.3cm)
#line(length: 100%, stroke: 0.5pt + gray)

#columns(2, gutter: 20pt)[

= Project Overview

This agreement covers a focused strategic engagement in Saundersfoot, Wales from 27 February to 5 March 2026.

The engagement comprises:

- *Strategic Planning & Vision*
- *Content Planning & Organisation*
- *Workshop Support & Production*
- *Technical Foundation Work*
- *Collaboration Facilitation*

= Scope of Work

== Strategic Planning & Vision
Coffee chat style discussions to review existing digital presence, define vision for full communications suite, prioritise features (workshop system, content hub, community), and set realistic roadmap.

== Content Planning & Organisation
Gather all existing content and media assets. Organise by date/topic. Catalogue assets, identify what needs editing. Create content library structure. Plan website structure, navigation, and content types (recipes, videos, workshops, blog).

== Workshop Support & Production
Support for livestream workshop on 2 March 2026 including content planning, technical setup (multi-track recording, video, audio, lighting), equipment testing, and production coordination.

== Technical Foundation Work
Set up development environment. Create design system aligned with Bonucakes brand (colour palette, typography, component library). Initial technical architecture and setup work.

== Collaboration Facilitation
Facilitate video calls with Vietnam team. Coordinate stakeholder collaboration. Create post-trip planning and roadmap documentation.

== Site Visit
Visit to Thai restaurant in Carmarthen (5 March) to explore the space, discuss plans, and assess location and facilities for future business venture.

= Working Schedule

#text(size: 9pt)[
#table(
  columns: (auto, 1fr),
  stroke: none,
  inset: 5pt,
  table.hline(),
  table.header([*Day*], [*Activities*]),
  table.hline(),
  [Sat 28 Feb], [Strategic planning, Vietnam team call, technical setup],
  [Sun 1 Mar], [Website planning, workshop delivery and production],
  [Mon 2 Mar], [Content inventory, filming, development work],
  [Tue 3 Mar], [Workshop debrief, filming during service],
  [Wed 4 Mar], [Post-trip planning, roadmap creation (final working day)],
  table.hline(),
)
]

*Note:* Schedule accommodates restaurant service hours (17:00-21:00). Deep work sessions scheduled for evenings when appropriate. Working engagement concludes Wednesday evening. Thursday is travel day with Carmarthen restaurant visit en route.

= Commercial Terms

This is a fixed-price engagement based on a day rate structure.

#table(
  columns: (1fr, auto),
  stroke: none,
  inset: 6pt,
  table.hline(),
  [Engagement period], [27 Feb - 5 Mar 2026],
  [Working days], [5 days (Sat-Wed, including evenings)],
  [Day rate], [£375],
  [*Total fee*], [*£2,500*],
  table.hline(),
)

This covers:
- Strategic consulting and planning
- Content organisation and cataloguing
- Workshop technical support and production
- Development environment setup
- Design system foundation work
- Collaboration facilitation
- Post-trip documentation

#colbreak()

= What's Not Included

The following are outside this engagement scope:

- Full website development and build (separate project)
- Ongoing maintenance and support
- Hosting and third-party service costs
- Travel and accommodation expenses
- Additional consulting beyond 6 March 2026

These may be addressed in separate agreements as needed.

= Deliverables

By the end of this engagement, Bonucakes will receive:

- Strategic roadmap document
- Content inventory and organisation structure
- Workshop recording (audio and video)
- Design system foundation (colour palette, typography guidelines)
- Development environment setup
- Post-trip action plan with prioritised next steps

= Payment Terms

- Single invoice issued at completion of engagement
- Payment due within 14 days of invoice date
- Payment to be made by bank transfer

= Intellectual Property

All work produced during this engagement belongs to Bonucakes. This includes:
- Strategic documentation
- Workshop recordings
- Design system materials
- Planning documents
- Technical setup configurations

Charted retains the right to reuse general techniques, knowledge, and methodologies developed during the engagement.

]

= Working Arrangements

== Location
Work will take place in Saundersfoot, Wales at accommodation and restaurant locations as appropriate.

== Restaurant Hours
Schedule accommodates Minh Uyên's restaurant service hours (17:00-21:00). During these periods, solo deep work sessions may be conducted, or filming may occur at the restaurant with prior agreement.

== Vietnam Team Collaboration
Video calls with Vietnam team will be scheduled at mutually convenient times (typically afternoon UK time / evening Vietnam time).

== Flexibility
Both parties acknowledge the collaborative nature of this engagement and agree to maintain flexibility in daily scheduling whilst respecting the overall scope and objectives.

#columns(2, gutter: 20pt)[

= Cancellation & Changes

== Client Cancellation
If Bonucakes cancels the engagement:
- More than 14 days before: No charge
- 7-14 days before: 50% of total fee
- Less than 7 days before: 100% of total fee

== Provider Cancellation
If Charted cancels the engagement, no fees are due and any advance payments will be refunded in full.

== Changes to Scope
Minor adjustments to daily activities may be made by mutual agreement without formal amendment. Material changes to scope or duration require written agreement from both parties.

#colbreak()

= Relationship

This engagement is structured as an independent consulting arrangement. Charted is not an employee of Bonucakes.

This engagement may serve as a foundation for future collaboration on website development and ongoing support, to be agreed separately.

= Agreement

This document represents the understanding between both parties for the Saundersfoot strategic engagement from 27 February to 5 March 2026.

]

#v(0.8cm)

#grid(
  columns: (1fr, 1fr),
  column-gutter: 40pt,
  [
    *Bonucakes*
    #v(1.2cm)
    #line(length: 80%, stroke: 0.5pt)
    Name: \
    Date:
  ],
  [
    *Charted Consultants*
    #v(1.2cm)
    #line(length: 80%, stroke: 0.5pt)
    Name: \
    Date:
  ]
)
