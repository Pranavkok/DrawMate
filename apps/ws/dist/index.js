"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// @ts-ignore
const config_1 = require("@repo/backend-common/config");
const client_1 = require("@repo/db/client");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const Users = [];
function checkUser(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        if (typeof (decoded) == "string") {
            return null;
        }
        if (!decoded || !decoded.userId) {
            return null;
        }
        return decoded.userId;
    }
    catch (error) {
        return null;
    }
    return null;
}
wss.on("connection", (ws, req) => {
    const url = req.url;
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userAuth = checkUser(token);
    if (userAuth == null) {
        ws.close();
        return null;
    }
    Users.push({
        ws: ws,
        rooms: [],
        userId: userAuth
    });
    ws.on('message', async (data) => {
        let parsedData;
        if (typeof (data) !== "string") {
            parsedData = JSON.parse(data.toString());
        }
        else {
            parsedData = JSON.parse(data);
        }
        if (parsedData.type === "join_room") {
            try {
                const user = Users.find(x => x.ws === ws);
                user?.rooms.push(parsedData.roomId);
            }
            catch (error) {
                console.log(error);
            }
        }
        if (parsedData.type === "leave_room") {
            try {
                const user = Users.find(x => x.ws === ws);
                if (!user) {
                    return;
                }
                user.rooms = user?.rooms.filter(x => x !== parsedData.roomId);
            }
            catch (error) {
                console.log(error);
            }
        }
        if (parsedData.type === "chat") {
            try {
                const message = parsedData.message;
                const roomId = parsedData.roomId;
                const room = await client_1.prismaClient.room.findUnique({
                    where: { id: Number(roomId) }
                });
                if (!room) {
                    // Optionally, you could send an error message back to the client
                    console.log(`Room not found: ${roomId}`);
                    return;
                }
                await client_1.prismaClient.chat.create({
                    data: {
                        roomId: Number(roomId),
                        message: message,
                        userId: userAuth,
                    }
                });
                Users.forEach(user => {
                    if (user.rooms.includes(roomId)) {
                        user.ws.send(JSON.stringify({
                            type: "chat",
                            message: message,
                            roomId: roomId
                        }));
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        }
    });
});
