"use server";
process.env.TZ = "Asia/Seoul";
import { connectDB } from "@/util/db";
import { ObjectId } from "mongodb";

export async function getNotice() {
  const db = (await connectDB).db("fxtest");
  let list = await db.collection("notice").find().sort({ _id: -1 }).toArray();
  list.map((e) => {
    e._id = e._id.toString();
  });
  return list;
}

export async function postUserMessage(id, title, content) {
  console.log(title);
  const db = (await connectDB).db("fxtest");
  await db.collection("message").insertOne({
    user: new ObjectId(id),
    title: title,
    content: content,
    date: getDate(false, 0),
  });
  return "메세지가 전송되었습니다.";
}

export async function changeOrderPosition(id, pos) {
  pos = pos == "long" ? "short" : "long";
  const db = (await connectDB).db("fxtest");
  await db.collection("trade_order").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        type: pos,
      },
    }
  );
}

export async function updateUserDetail(
  id,
  pw,
  balance,
  bank,
  account,
  holder,
  ref
) {
  const db = (await connectDB).db("fxtest");
  await db.collection("user_cred").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        pw: pw,
        balance: balance,
        bank: bank,
        account: account,
        holder: holder,
        ref: ref,
      },
    }
  );
}

export async function userStatusChagne(id, status) {
  const db = (await connectDB).db("fxtest");
  await db
    .collection("user_cred")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status == "정상" ? "차단" : "정상" } }
    );
}

export async function deleteNotice(id) {
  const db = (await connectDB).db("fxtest");
  await db.collection("notice").deleteOne({ _id: new ObjectId(id) });
}

export async function insertNotice(title, content) {
  const db = (await connectDB).db("fxtest");
  await db
    .collection("notice")
    .insertOne({ title: title, content: content, date: getDate(false, 0) });
}

function getDate(i, p) {
  let date;
  i ? (date = new Date(i)) : (date = new Date());
  p ? date.setMinutes(date.getMinutes() + p) : "";
  const y = date.getFullYear().toString();
  let m = date.getMonth() + 1;
  m = m > 9 ? m.toString() : "0" + m.toString();
  let d = date.getDate();
  d = d > 9 ? d.toString() : "0" + d.toString();
  let h = date.getHours();
  h = h > 9 ? h.toString() : "0" + h.toString();
  let mm = date.getMinutes();
  mm = mm > 9 ? mm.toString() : "0" + mm.toString();
  return Number(y + m + d + h + mm);
}

export async function editNotice(id, content, date) {
  console.log(id);
  const db = (await connectDB).db("fxtest");
  await db
    .collection("notice")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { content: content, date: date } }
    );
}

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

export async function getUserOne(id) {
  const db = (await connectDB).db("fxtest");
  let user = await db
    .collection("user_cred")
    .findOne({ _id: new ObjectId(id) });

  user._id = user._id.toString();

  return user;
}

export async function editBalance(id, amount) {
  const db = (await connectDB).db("fxtest");

  await db
    .collection("user_cred")
    .updateOne({ _id: new ObjectId(id) }, { $inc: { balance: +amount } });

  return "잔액이 변경되었습니다.";
}

export async function editRemote(id, amount) {
  const db = (await connectDB).db("fxtest");

  await db
    .collection("user_cred")
    .updateOne({ _id: new ObjectId(id) }, { $set: { remote: amount } });

  return "배율이 변경되었습니다.";
}

export async function editOrder(orderId, amount) {
  const db = (await connectDB).db("fxtest");
  let order = await db
    .collection("trade_order")
    .findOne({ _id: new ObjectId(orderId) });
  const diff = order.amount - +amount;
  await db
    .collection("user_cred")
    .updateOne({ _id: order.orderer }, { $inc: { balance: diff } });
  await db
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
    if (dw.type == "환급") {
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
        $set: { status: "거절" },
      }
    );
  }
}
