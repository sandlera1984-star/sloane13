module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { code } = req.body || {};
  const expected = process.env.ADMIN_CODE || "420600";

  if (code === expected) {
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};
