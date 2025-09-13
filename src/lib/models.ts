export type Model = {
  id: string;
  name: string;
  avatarImageId: string;
  gifImageIds: string[];
};

export const models: Model[] = [
  {
    id: 'isabella',
    name: 'Isabella',
    avatarImageId: 'model-isabella',
    gifImageIds: ['hero-1', 'hero-2'],
  },
  {
    id: 'sophia',
    name: 'Sophia',
    avatarImageId: 'model-sophia',
    gifImageIds: ['hero-3', 'hero-4'],
  },
  {
    id: 'valentina',
    name: 'Valentina',
    avatarImageId: 'model-valentina',
    gifImageIds: ['hero-5', 'hero-6'],
  },
];
