export default function parseChatRooms(user) {
  user.chatRooms = JSON.parse(user.chatRooms);
  return user;
}
