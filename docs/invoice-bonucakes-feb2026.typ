#set text(font: "Avenir Next", size: 11pt)
#set page(
  paper: "a4",
  margin: (top: 0cm, left: 0cm, right: 0cm, bottom: 0cm),
)

// Header
#block(
  fill: rgb("#334155"),
  width: 100%,
  inset: (x: 1.5cm, y: 0.6cm),
)[
  #grid(
    columns: (1fr, auto),
    [
      #text(size: 26pt, weight: "bold", fill: white)[INVOICE]
      #v(0.1cm)
      #text(size: 10pt, fill: rgb("#cbd5e1"))[\#BC-2026-001]
    ],
    align(right)[
      #image("logo-white.png", height: 1.5cm)
    ]
  )
]

// Main Content
#block(
  inset: (x: 1.5cm, top: 1.5cm, bottom: 0.5cm)
)[
  // From and To
  #grid(
    columns: (1fr, 1fr),
    column-gutter: 2cm,
    [
      #text(size: 10pt, weight: "bold", fill: rgb("#64748b"))[FROM] \
      #v(0.3cm)
      #text(weight: "bold")[Thi Nguyen t/a Charted Consultants] \
      Unit 3, Maskell Industrial Estate \
      29 Bidder Street \
      London, E16 4ST \
      #v(0.1cm)
      #text(fill: rgb("#334155"))[info\@chartedconsultants.com]
    ],
    [
      #text(size: 10pt, weight: "bold", fill: rgb("#64748b"))[BILL TO] \
      #v(0.3cm)
      #text(weight: "bold")[Bonucakes] \
      [Client Address Line 1] \
      [Client Address Line 2] \
      [Postcode] \
      #v(0.1cm)
      #text(fill: rgb("#334155"))[contact\@bonucakes.com]
    ]
  )

  #v(1cm)

  // Invoice Date
  #text(size: 10pt)[
    #text(fill: rgb("#64748b"))[Invoice Date:] #h(0.5cm) #text(weight: "bold")[28 February 2026]
  ]

  #v(1cm)

  // Items Table
  #table(
    columns: (auto, 1fr, auto),
    stroke: none,
    inset: 8pt,
    table.hline(stroke: 2pt + rgb("#334155")),
    table.header(
      [#text(size: 10pt, weight: "bold", fill: rgb("#334155"))[\#]],
      [#text(size: 10pt, weight: "bold", fill: rgb("#334155"))[DESCRIPTION]],
      [#text(size: 10pt, weight: "bold", fill: rgb("#334155"))[AMOUNT]]
    ),
    table.hline(stroke: 2pt + rgb("#334155")),

    [1], [Development services for February 2026], align(right)[£0.00],
    table.hline(stroke: 0.5pt + rgb("#cbd5e1")),
  )

  #v(1cm)

  // Totals
  #align(right)[
    #box(width: 9cm)[
      #grid(
        columns: (1fr, auto),
        row-gutter: 0.4cm,
        column-gutter: 1.5cm,
        [#text(fill: rgb("#64748b"))[Subtotal]], [#text(weight: "bold")[£0.00]],
        [#text(fill: rgb("#64748b"))[Paid]], [#text(weight: "bold")[£0.00]],
      )

      #v(0.3cm)

      #block(
        fill: rgb("#334155"),
        inset: (x: 12pt, y: 10pt),
        radius: 0pt,
        width: 100%
      )[
        #grid(
          columns: (1fr, auto),
          column-gutter: 1.5cm,
          [#text(size: 15pt, weight: "bold", fill: white)[Total Due]],
          [#text(size: 15pt, weight: "bold", fill: white)[£0.00]]
        )
      ]
    ]
  ]
]

#v(1fr)

// Footer
#block(
  fill: rgb("#f8fafc"),
  width: 100%,
  inset: (x: 1.5cm, y: 1.5cm),
)[
  #grid(
    columns: (1fr, 1fr),
    column-gutter: 2cm,
    [
      #text(size: 12pt, weight: "bold", fill: rgb("#334155"))[Payment Details] \
      #v(0.5cm)
      #text(size: 10pt, fill: rgb("#475569"))[
        #text(fill: rgb("#64748b"))[Account Name:] Thi Dac Nguyen \
        #text(fill: rgb("#64748b"))[Sort Code:] 20-26-86 \
        #text(fill: rgb("#64748b"))[Account No:] 43364127 \
        #text(fill: rgb("#64748b"))[Reference:] BC-2026-001
      ]
    ],
    align(right)[
      #text(size: 13pt, fill: rgb("#334155"), weight: "medium")[Thank you for trusting us!] \
      #v(0.3cm)
      #text(size: 10pt, fill: rgb("#64748b"))[Please do reach out if we can be of any assistance:] \
      #v(0.2cm)
      #text(size: 10pt, fill: rgb("#475569"))[
        info\@chartedconsultants.com \
        +44 7704 996246
      ]
    ]
  )
]
