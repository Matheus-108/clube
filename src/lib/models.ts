export type Model = {
  id: string;
  name: string;
  avatarImageId: string;
  gifImageIds: string[];
  isOnline?: boolean;
  lastSeen?: string;
};

export const models: Model[] = [
  { id: 'rebeca-martins', name: 'Rebeca Martins', avatarImageId: 'model-rebeca-martins', gifImageIds: ['model-rebeca-martins-gif-1', 'model-rebeca-martins-gif-2'], isOnline: true },
  { id: 'camila-santos', name: 'Camila Santos', avatarImageId: 'model-camila-santos', gifImageIds: ['model-camila-santos-gif-1'], isOnline: true },
  { id: 'julia-lima', name: 'Júlia Lima', avatarImageId: 'model-julia-lima', gifImageIds: [], isOnline: false, lastSeen: 'ativo há 5 min' },
  { id: 'natalia-reis', name: 'Natália Reis', avatarImageId: 'model-natalia-reis', gifImageIds: [], isOnline: true },
  { id: 'vanessa-silva', name: 'Vanessa Silva', avatarImageId: 'model-vanessa-silva', gifImageIds: [], isOnline: false, lastSeen: 'ativo há 12 min' },
  { id: 'estela-alves', name: 'Estela Alves', avatarImageId: 'model-estela-alves', gifImageIds: [], isOnline: false, lastSeen: 'ativo há 2 min' },
  { id: 'bianka-gazaki', name: 'Bianka Gazaki', avatarImageId: 'model-bianka-gazaki', gifImageIds: [], isOnline: true },
  { id: 'ana-silva', name: 'Ana Silva', avatarImageId: 'model-ana-silva', gifImageIds: [], isOnline: false, lastSeen: 'ativo há 8 min' },
  { id: 'helena-ferreira', name: 'Helena Ferreira', avatarImageId: 'model-helena-ferreira', gifImageIds: [], isOnline: true },
  { id: 'isabella-rossi', name: 'Isabella Rossi', avatarImageId: 'model-isabella-rossi', gifImageIds: [], isOnline: false, lastSeen: 'ativo há 25 min' },
  { id: 'sofia-laurent', name: 'Sofia Laurent', avatarImageId: 'model-sofia-laurent', gifImageIds: ['model-sofia-laurent-gif-1'], isOnline: true },
  { id: 'carol-moraes', name: 'Carol Moraes', avatarImageId: 'model-carol-moraes', gifImageIds: ['model-carol-moraes-gif-1'], isOnline: false, lastSeen: 'ativo há 3 min' },
  { id: 'eliane-figueiredo', name: 'Eliane Figueiredo', avatarImageId: 'model-eliane-figueiredo', gifImageIds: ['model-eliane-figueiredo-gif-1'], isOnline: true }
];
