export const generateRoomId = () => {
  return Math.round(Math.random() * (9999 - 1000) + 1000);
};

export const generateDiceSide = () => {
  return Math.round(Math.random() * (6 - 1) + 1);
};
