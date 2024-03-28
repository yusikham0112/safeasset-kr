export default function handler(req, res) {
  function processData() {
    console.log("Data processing...");
  }

  setInterval(processData, 10 * 1000);

  res.status(200).json({ message: "Data processing started." });
}
