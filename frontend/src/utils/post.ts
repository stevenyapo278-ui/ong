export function formatPostType(type: string | undefined): string {
  switch ((type || '').toUpperCase()) {
    case 'VIDEO':
      return "Vidéo d'activité";
    case 'IMAGE':
      return 'Album photo';
    default:
      return 'Article';
  }
}

