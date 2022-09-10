export const generateRoomId = () => {
  return Math.round(Math.random() * (9999 - 1000) + 1000);
};
