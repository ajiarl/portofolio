import { Helmet } from "react-helmet-async";

const defaultMeta = {
  title: "Aji Arlando | Fullstack Web Developer Palembang",
  description: "Website resmi Aji Arlando, Fullstack Web Developer Indonesia yang berdomisili di Palembang. Berfokus pada penciptaan pengalaman digital yang menarik dan fungsional.",
  image: "https://portofolio-ajiarlando.vercel.app/Meta.png",
  url: "https://portofolio-ajiarlando.vercel.app",
};

export default function SEO({
  title,
  description,
  image,
  url,
  type = "website",
  schema,
}) {
  const meta = {
    title: title || defaultMeta.title,
    description: description || defaultMeta.description,
    image: image || defaultMeta.image,
    url: url || defaultMeta.url,
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={meta.url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Aji Arlando Portfolio" />
      <meta property="og:locale" content="id_ID" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={meta.url} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />
      <meta name="twitter:creator" content="@ajiarl" />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
