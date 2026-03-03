#set text(font: "Avenir Next", size: 10pt)
#set par(leading: 0.5em)
#show heading: set block(above: 1.4em, below: 0.4em)
#set page(
  paper: "a4",
  flipped: true,
  margin: (top: 1.5cm, left: 2cm, right: 2cm, bottom: 1.5cm),
  header: context {
    set text(size: 9pt, fill: luma(80))
    grid(
      columns: (1fr, auto, auto),
      align: (left + horizon, right + horizon, right + horizon),
      column-gutter: 8pt,
      [*Bonucakes - Saundersfoot Trip*],
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
  #text(size: 22pt, weight: "bold", fill: rgb("#1e3a5f"))[Saundersfoot Business Trip]
  #v(0.2cm)
  #text(size: 11pt, fill: luma(60))[Agenda & Itinerary]
]

#v(0.3cm)

#grid(
  columns: (1fr, 1fr),
  column-gutter: 20pt,
  [
    *Location:* Saundersfoot, Wales \
    *Purpose:* Business & Holiday Combination
  ],
  align(right)[
    *Dates:* 27 Feb - 5 Mar 2026 \
    *Duration:* 6 days / 5 nights
  ]
)

#v(0.15cm)
#line(length: 100%, stroke: 0.5pt + gray)
#v(0.15cm)

= Activity Legend

#grid(
  columns: (auto, auto, auto, auto, auto),
  column-gutter: 15pt,
  [#box(fill: rgb("#e0f2fe"), inset: 8pt, width: 100%)[Website Work]],
  [#box(fill: rgb("#fef3c7"), inset: 8pt, width: 100%)[Filming]],
  [#box(fill: rgb("#ddd6fe"), inset: 8pt, width: 100%)[Workshop/Calls]],
  [#box(fill: rgb("#dcfce7"), inset: 8pt, width: 100%)[Deep Work]],
  [#box(inset: 8pt, width: 100%)[Wind Down]],
)

#v(0.5cm)

= Daily Schedule

#table(
  columns: (auto, 1fr, 2fr),
  stroke: 0.5pt + luma(200),
  inset: 8pt,
  table.header(
    [*Day*], [*Time & Activity*], [*Purpose & What to Prepare*]
  ),

  // Friday 27 Feb
  table.cell(rowspan: 2)[*Fri 27 Feb* \ Arrival],
  [*Evening:* Travel to Saundersfoot (arriving at night)], [Pack car with all equipment: laptop, filming gear, cameras, lights. Plan driving route and check fuel.],
  [*Late evening:* Check-in and settle at accommodation], [Get settled, unpack essentials, test internet connection, set up workspace.],

  table.hline(),

  // Saturday 28 Feb
  table.cell(rowspan: 5)[*Sat 28 Feb* \ Day 1 - Foundation],
  table.cell(fill: rgb("#e0f2fe"))[*12:00-14:00:* Strategic planning & vision session], table.cell(fill: rgb("#e0f2fe"))[Coffee chat style discussion. Review existing Bonucakes website together - what to keep, remove, improve. Define vision for full comms suite. Prioritise features: workshop system, content hub, community. Set realistic roadmap.],
  table.cell(fill: rgb("#ddd6fe"))[*14:00-15:30:* Video call with Vietnam team], table.cell(fill: rgb("#ddd6fe"))[Connect with Vietnam team (9pm their time). Share trip plans, discuss collaboration, align on vision. Get their input early in the week.],
  [*15:30-17:00:* Wind down], [#h(0pt)],
  table.cell(fill: rgb("#dcfce7"))[*17:00-21:00:* Deep work], table.cell(fill: rgb("#dcfce7"))[Set up development environment, initial technical setup work.],
  [*21:00+:* Wind down], [#h(0pt)],

  table.hline(),

  // Sunday 1 Mar
  table.cell(rowspan: 6)[*Sun 1 Mar* \ Day 2 - Workshop Day],
  table.cell(fill: rgb("#e0f2fe"))[*12:00-15:00:* Website structure & content planning], table.cell(fill: rgb("#e0f2fe"))[Plan website structure, navigation, and content types (recipes, videos, workshops, blog). Discuss requirements, desired features, and target audience. Map out information architecture.],
  [*15:00-17:00:* Wind down], [#h(0pt)],
  table.cell(fill: rgb("#e0f2fe"))[*17:00-20:00:* Workshop content planning & prep], table.cell(fill: rgb("#e0f2fe"))[Finalise workshop content and slides with Minh Uyên. Prepare materials and talking points. Organise flow and structure.],
  [*20:00-21:00:* Wind down], [#h(0pt)],
  table.cell(fill: rgb("#ddd6fe"))[*21:00-22:30+:* BONUCAKES LIVESTREAM WORKSHOP], table.cell(fill: rgb("#ddd6fe"))[Minh Uyên delivers live workshop on restaurant business. Recording full session with professional audio and video for future content reuse. Engage with attendees.],
  [*22:30+:* Wind down], [#h(0pt)],

  table.hline(),

  // Monday 2 Mar
  table.cell(rowspan: 5)[*Mon 2 Mar* \ Day 3 - Content & Build],
  table.cell(fill: rgb("#e0f2fe"))[*12:00-15:00:* Content inventory & organisation], table.cell(fill: rgb("#e0f2fe"))[Gather all existing content and media from Minh Uyên (videos, photos from past years). Organise by date/topic. Catalogue assets, identify what needs editing. Create content library structure.],
  table.cell(fill: rgb("#fef3c7"))[*15:00-17:00:* Lunch & personal filming at beach], table.cell(fill: rgb("#fef3c7"))[Light meal, then capture lifestyle content: beach walks, coastal scenery, car shots. Show personal side of Minh Uyên.],
  table.cell(fill: rgb("#dcfce7"))[*17:00-21:00:* Deep work], table.cell(fill: rgb("#dcfce7"))[Set up multi-track recording: separate voice recorder for full audio capture, video recording with professional lighting for reusable content. Create design system aligned with Bonucakes bold/rebellious brand (colour palette, typography, component library).],
  table.cell(fill: rgb("#dcfce7"))[*21:00-23:00:* Deep work], table.cell(fill: rgb("#dcfce7"))[Build core pages: homepage, about, workshop landing. Implement design system. Make pages responsive and accessible.],
  [*23:00+:* Wind down], [#h(0pt)],

  table.hline(),

  // Tuesday 3 Mar
  table.cell(rowspan: 5)[*Tue 3 Mar* \ Day 4 - Filming & Debrief],
  table.cell(fill: rgb("#e0f2fe"))[*12:00-15:00:* Workshop debrief & planning], table.cell(fill: rgb("#e0f2fe"))[Review workshop feedback with Minh Uyên and discuss insights. Plan how to integrate learnings into website (better workshop page, follow-up materials section). Organise workshop recording content.],
  [*15:00-17:00:* Wind down], [#h(0pt)],
  table.cell(fill: rgb("#fef3c7"))[*17:00-21:00:* Kitchen & bar filming during service], table.cell(fill: rgb("#fef3c7"))[Film Minh Uyên during restaurant service. Capture cooking in kitchen, bar setting, behind-the-scenes moments. Minh Uyên works whilst being filmed. Get variety of shots for content library.],
  table.cell(fill: rgb("#dcfce7"))[*21:00-23:00:* Deep work], table.cell(fill: rgb("#dcfce7"))[Implement key features: workshop registration system, video library structure, blog functionality.],
  [*23:00+:* Wind down], [#h(0pt)],

  table.hline(),

  // Wednesday 4 Mar
  table.cell(rowspan: 4)[*Wed 4 Mar* \ Day 5 - Planning & Features],
  table.cell(fill: rgb("#e0f2fe"))[*12:00-15:00:* Post-trip planning & roadmap], table.cell(fill: rgb("#e0f2fe"))[Create content migration plan with Minh Uyên. Set realistic timeline for post-trip work. Prioritise what gets built first. Assign responsibilities. Discuss ongoing collaboration.],
  table.cell(fill: rgb("#e0f2fe"))[*15:00-17:00:* Lunch break & demo], table.cell(fill: rgb("#e0f2fe"))[Afternoon meal. Quick demo of progress to Minh Uyên so far.],
  table.cell(fill: rgb("#dcfce7"))[*17:00-21:00:* Deep work], table.cell(fill: rgb("#dcfce7"))[Continue building features and connect content management. Polish and refine implementations.],
  [*21:00+:* Wind down], [#h(0pt)],

  table.hline(),

  // Thursday 5 Mar
  table.cell(rowspan: 5)[*Thu 5 Mar* \ Day 6 - Carmarthen & Return],
  [*Morning:* Wind down], [#h(0pt)],
  table.cell(fill: rgb("#e0f2fe"))[*10:00-14:00:* Drive to Carmarthen & restaurant visit], table.cell(fill: rgb("#e0f2fe"))[Visit Thai restaurant Minh Uyên is taking over. Explore the space with Minh Uyên, discuss plans, assess location and facilities. Drive time ~40 mins each way.],
  table.cell(fill: rgb("#dcfce7"))[*14:00-15:00:* Final content backup], table.cell(fill: rgb("#dcfce7"))[Review all filmed content, ensure everything is backed up properly before departure.],
  [*15:00-19:00:* Wind down], [#h(0pt)],
  [*Evening:* Wind down], [#h(0pt)],
)
