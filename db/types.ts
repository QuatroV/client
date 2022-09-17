export type Session = {
  id: number;
  roomId: number;
  firstUserId: string;
  secondUserId?: string;
  gameState?: Record<string, number[][]>;
  activePlayer?: string;
};
