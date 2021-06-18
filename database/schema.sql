set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

create table "chatRooms" (
  "chatId"    serial,
  "name"      text  not null,
  "members"   json not null,
  "createdAt" timestamptz(6) not null default now(),
  primary key ("chatId")
);

create table "messages" (
  "messageId" serial,
  "message"   text    not null,
  "chatId"    text    not null,
  "sender"    text    not null,
  "createdAt" timestamptz(6) not null default now(),
  primary key ("messageId")
);

create table "users" (
  "userId" serial,
  "userName"  text not null,
  "hashedPassword"  text not null,
  "chatRooms" json not null,
  "createdAt" timestamptz(6) not null default now(),
  primary key ("userId")
);
