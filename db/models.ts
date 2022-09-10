import sequelize from ".";
import { DataTypes } from "sequelize";

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  socketId: { type: DataTypes.STRING },
});

const Room = sequelize.define("Room", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roomCode: { type: DataTypes.INTEGER },
});

const Session = sequelize.define("Session", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

User.hasOne(Session, { foreignKey: "firstUserId" });
Session.belongsTo(User, { foreignKey: "firstUserId" });

User.hasOne(Session, { foreignKey: "secondUserId" });
Session.belongsTo(User, { foreignKey: "secondUserId" });

Room.hasOne(Session, { foreignKey: "roomId" });
Session.belongsTo(Room, { foreignKey: "roomId" });

export { User, Session, Room };
