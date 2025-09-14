export type Model = {
  id: string;
  name: string;
  avatarImageId: string;
  gifImageIds: string[];
};

export const models: Model[] = [
  { id: 'rebeca-martins', name: 'Rebeca Martins', avatarImageId: 'model-rebeca-martins', gifImageIds: ['model-rebeca-martins-gif-1', 'model-rebeca-martins-gif-2'] },
  { id: 'camila-santos', name: 'Camila Santos', avatarImageId: 'model-camila-santos', gifImageIds: ['model-camila-santos-gif-1'] },
  { id: 'julia-lima', name: 'Júlia Lima', avatarImageId: 'model-julia-lima', gifImageIds: [] },
  { id: 'natalia-reis', name: 'Natália Reis', avatarImageId: 'model-natalia-reis', gifImageIds: [] },
  { id: 'vanessa-silva', name: 'Vanessa Silva', avatarImageId: 'model-vanessa-silva', gifImageIds: [] },
  { id: 'estela-alves', name: 'Estela Alves', avatarImageId: 'model-estela-alves', gifImageIds: [] },
  { id: 'bianka-gazaki', name: 'Bianka Gazaki', avatarImageId: 'model-bianka-gazaki', gifImageIds: [] },
  { id: 'ana-silva', name: 'Ana Silva', avatarImageId: 'model-ana-silva', gifImageIds: [] },
  { id: 'helena-ferreira', name: 'Helena Ferreira', avatarImageId: 'model-helena-ferreira', gifImageIds: [] },
  { id: 'isabella-rossi', name: 'Isabella Rossi', avatarImageId: 'model-isabella-rossi', gifImageIds: [] },
  { id: 'sofia-laurent', name: 'Sofia Laurent', avatarImageId: 'model-sofia-laurent', gifImageIds: ['model-sofia-laurent-gif-1'] },
  { id: 'carol-moraes', name: 'Carol Moraes', avatarImageId: 'model-carol-moraes', gifImageIds: ['model-carol-moraes-gif-1'] },
  { id: 'eliane-figueiredo', name: 'Eliane Figueiredo', avatarImageId: 'model-eliane-figueiredo', gifImageIds: ['model-eliane-figueiredo-gif-1'] }
];
