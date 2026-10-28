// Server-rendered structured data. "<" is escaped so catalogue text can never close the script tag.
export function JsonLd({ data }) {
  const items = Array.isArray(data) ? data : [data];
  return items.map((d, i) => (
    <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }} />
  ));
}
