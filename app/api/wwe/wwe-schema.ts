export interface WweTalent {
  value: string;
  url: string;
}

export interface WweProfile {
  name: string;
  image: string | null;
  tagline: string | null;
  height: string | null;
  weight: string | null;
  hometown: string | null;
  signatureMove: string | null;
  careerHighlights: string[];
}
