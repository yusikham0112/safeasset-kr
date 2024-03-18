"use server";
process.env.TZ = "Asia/Seoul";
import { connectDB } from "@/util/db";
import { ObjectId } from "mongodb";

export async function editTicket(ticket, a) {
  const db = (await connectDB).db("fxtest");
  await db
    .collection("ticket")
    .updateOne(
      { _id: new ObjectId(ticket._id) },
      { $set: { status: "답변완료", a: a } }
    );

  return 200;
}

export async function getTicketList() {
  const db = (await connectDB).db("fxtest");
  let tickets = await db
    .collection("ticket")
    .find()
    .sort({ _id: -1 })
    .toArray();
  let users = await db.collection("user_cred").find().toArray();

  users.map((user) => {
    user._id = user._id.toString();
  });

  tickets.map((ticket, i) => {
    ticket._id = ticket._id.toString();
    users.map((user) => {
      if (user._id == ticket.user) {
        ticket.user = user;
      }
    });
  });
  return tickets;
}

export async function getOrderList() {
  const db = (await connectDB).db("fxtest");
  let users = await db.collection("user_cred").find().toArray();
  let orders = await db
    .collection("trade_order")
    .find()
    .sort({ _id: -1 })
    .toArray();

  users.map((user) => {
    user._id = user._id.toString();
  });

  orders.map((order) => {
    order.orderer = order.orderer.toString();
    const user = users.find((u) => u._id == order.orderer);
    order._id = order._id.toString();
    order.id = user.id;
    order.name = user.name;
    order.game =
      "(" +
      Math.floor(
        (+order.date.toString().slice(8, 10) * 60 +
          +order.date.toString().slice(10, 12)) /
          +order.interval.slice(0, 1)
      ).toString() +
      " 회차)" +
      order.date.toString().slice(8, 10) +
      "시" +
      order.date.toString().slice(10, 12) +
      "분";
    if (order.result == "gain") {
      order.game_result = order.type;
    } else if (order.result == "loss") {
      order.game_result = order.type == "long" ? "short" : "long";
    } else {
      ("진행 중");
    }
  });
  return orders;
}

export async function getUserList() {
  const db = (await connectDB).db("fxtest");
  let list = await db.collection("user_cred").find().toArray();
  list.map((e) => {
    e._id = e._id.toString();
  });
  return list;
}

export async function editOrder(orderId, amount) {
  const db = (await connectDB).db("fxtest");
  let list = await db
    .collection("trade_order")
    .updateOne({ _id: new ObjectId(orderId) }, { $set: { amount: +amount } });
}

export async function getDWList() {
  const db = (await connectDB).db("fxtest");
  let DWList = await db
    .collection("deposit_withdrawl")
    .find()
    .sort({ _id: -1 })
    .toArray();
  let users = await db.collection("user_cred").find().toArray();
  users.map((user) => {
    user._id = user._id.toString();
  });

  DWList.map((e) => {
    const user = users.find((u) => u._id == e.applicant.toString());
    e._id = e._id.toString();
    e.applicant = e.applicant.toString();
    e.full_bank = user.bank + user.account + user.holder;
    e.ref = user.ref;
    e.id = user.id;
    e.name = user.name;
    e.nick = user.nick;
  });
  return DWList;
}

export async function manageDWStatus(dw_id, func) {
  const db = (await connectDB).db("fxtest");
  const dw = await db
    .collection("deposit_withdrawl")
    .findOne({ _id: new ObjectId(dw_id) });
  if (dw.status == func) {
    return "이미 처리된 상태입니다.";
  }
  if (dw.status == "거절" || dw.status == "취소") {
    return "유효하지 않은 거래입니다.";
  }

  if (func == "승인") {
    if (dw.type == "예치") {
      await db.collection("user_cred").updateOne(
        { _id: dw.applicant },
        {
          $inc: { balance: dw.amount },
        }
      );
    } else if (dw.type == "환급") {
      await db.collection("user_cred").updateOne(
        { _id: dw.applicant },
        {
          $inc: { balance: -dw.amount },
        }
      );
    }

    await db.collection("deposit_withdrawl").updateOne(
      { _id: dw._id },
      {
        $set: { status: "승인" },
      }
    );
  }

  if (func == "취소") {
    if (dw.type == "예치") {
      await db.collection("user_cred").updateOne(
        { _id: dw.applicant },
        {
          $inc: { balance: -dw.amount },
        }
      );
    } else if (dw.type == "환급") {
      await db.collection("user_cred").updateOne(
        { _id: dw.applicant },
        {
          $inc: { balance: dw.amount },
        }
      );
    }

    await db.collection("deposit_withdrawl").updateOne(
      { _id: dw._id },
      {
        $set: { status: "취소" },
      }
    );
  }

  if (func == "거절" || (func == "취소" && dw.status == "승인대기중")) {
    await db.collection("deposit_withdrawl").updateOne(
      { _id: dw._id },
      {
        $set: { status: "거절" },
      }
    );
  }
}
