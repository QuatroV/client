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
