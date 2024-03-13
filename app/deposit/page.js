import { getServerSession } from "next-auth";
import "./deposit.css";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/util/db";

export default function deposit() {
  const depositApplication = async (data) => {
    "use server";

    const session = await getServerSession(authOptions);
    const db = (await connectDB).db("fxtest");
    const user = await db
      .collection("user_cred")
      .findOne({ id: session.user.id });
    await db.collection("deposit_withdrawl").insertOne({
      applicant: user._id,
      amount: +data.get("amount"),
      type: "예치",
      status: "승인대기중",
      date: getDate(false, 0),
    });
  };

  return (
    <div className="deposit-container">
      <form className="deposit-form" action={depositApplication}>
        <h2>예치</h2>
        <div>
          <label>예치 계좌</label>
          <input
            value={"예치 계좌 안내는 고객센터로 문의바랍니다."}
            readOnly
          ></input>
        </div>
        <div>
          <label>신청 금액</label>
          <input id="amount" name="amount"></input>
        </div>
        <button>신청</button>
      </form>
    </div>
  );
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
