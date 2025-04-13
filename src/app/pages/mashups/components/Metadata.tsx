export const Metadata = ({
  id,
  title,
  tagline,
}: {
  id: string;
  title: string;
  tagline: string;
}) => {
  return (
    <head>
      {/* Basic Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={tagline} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={`https://movie-mashup.dthyresson.workers.dev/mashups/${id}`}
      />
      <meta
        property="og:image"
        content={`https://movie-mashup.dthyresson.workers.dev/api/mashups/${id}/poster`}
      />

      {/* Additional recommended tags */}
      <meta property="og:site_name" content="Movie Mashup" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={tagline} />
      <meta
        name="twitter:image"
        content={`https://movie-mashup.dthyresson.workers.dev/api/mashups/${id}/poster`}
      />
    </head>
  );
};
