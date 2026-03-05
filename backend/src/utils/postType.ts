type PostType = 'ARTICLE' | 'IMAGE' | 'VIDEO';

export function inferPostTypeFromHtml(content?: string | null): PostType {
  const html = (content || '').toLowerCase();

  // Heuristiques simples, suffisantes pour une UX "non-tech":
  // - si on détecte un iframe (YouTube/Vimeo) -> VIDEO
  // - sinon si on détecte des images -> IMAGE
  // - sinon -> ARTICLE
  const hasVideo =
    html.includes('<iframe') ||
    html.includes('youtube.com') ||
    html.includes('youtu.be') ||
    html.includes('vimeo.com');

  if (hasVideo) return 'VIDEO';

  const hasImage = html.includes('<img');
  if (hasImage) return 'IMAGE';

  return 'ARTICLE';
}

