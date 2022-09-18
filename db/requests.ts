import supabase from ".";
import { Session } from "./types";

export const createSession = async (sessionInfo: Omit<Session, "id">) => {
  try {
    const { error } = await supabase
      .from<Session>("sessions")
      .insert([sessionInfo]);
    if (error) {
      throw new Error(error.message + error.details);
    }
  } catch (e) {
    console.error(e);
  }
};

export const findSessionByRoomId = async (roomId: Session["roomId"]) => {
  try {
    const { data, error } = await supabase
      .from<Session>("sessions")
      .select()
      .eq("roomId", roomId);
    if (error) {
      throw new Error(error.message + error.details);
    }
    return data[0];
  } catch (e) {
    console.error(e);
  }
};

export const addSecondUserToSession = async (
  roomId: Session["roomId"],
  secondUserId: Session["secondUserId"]
) => {
  try {
    const { data, error } = await supabase
      .from<Session>("sessions")
      .update({ secondUserId })
      .match({ roomId });
    if (error) {
      throw new Error(error.message + error.details);
    }
    return data[0];
  } catch (e) {
    console.error(e);
  }
};

export const addActivePlayerAndGameStateToSession = async (
  sessionId: Session["id"]
) => {
  try {
    const { data: oldData, error: oldError } = await supabase
      .from<Session>("sessions")
      .select()
      .eq("id", sessionId);

    if (oldError || !oldData) {
      throw new Error(oldError.message + oldError.details);
    }

    const { data, error } = await supabase
      .from<Session>("sessions")
      .update({
        activePlayer: oldData[0].firstUserId,
        gameState: {
          [oldData[0].firstUserId]: Array(3).fill(Array(3).fill(0)),
          [oldData[0].secondUserId!]: Array(3).fill(Array(3).fill(0)),
        },
      })
      .match({ id: sessionId });

    if (error) {
      throw new Error(error.message + error.details);
    }
    return data[0];
  } catch (e) {
    console.error(e);
  }
};

export const updateGameStateInSession = async (
  sessionId: Session["id"],
  gameState: Session["gameState"]
) => {
  try {
    const { data: oldData, error: oldError } = await supabase
      .from<Session>("sessions")
      .select()
      .eq("id", sessionId);

    if (oldError || !oldData) {
      throw new Error(oldError.message + oldError.details);
    }

    const newActivePlayer =
      oldData[0].activePlayer === oldData[0].firstUserId
        ? oldData[0].secondUserId
        : oldData[0].firstUserId;

    const { data, error } = await supabase
      .from<Session>("sessions")
      .update({ gameState, activePlayer: newActivePlayer })
      .match({ id: sessionId });
    if (error) {
      throw new Error(error.message + error.details);
    }
    return data[0];
  } catch (e) {
    console.error(e);
  }
};
