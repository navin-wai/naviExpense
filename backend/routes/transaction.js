const { Router } = require("express");

const router = Router();

const Transaction = require("../models/transaction");
const { validateToken } = require("../services/authentication");

//get all transactions
router.get("/", async (req, res) => {
  try {
    const user = validateToken(req.cookies.token);

    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const transactions = await Transaction.find({ user: user.id }).sort({
      date: -1,
    });

    return res.json({ transactions });
  } catch (error) {
    console.error("GET TRANSACTIONS ERROR:", error);
    return res.status(401).json({ message: "Authentication required" });
  }
});

//post a transaction
router.post("/", async (req, res) => {
  try {
    const user = validateToken(req.cookies.token);

    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const transaction = await Transaction.create({
      ...req.body,
      user: user.id,
    });

    return res.status(201).json({ transaction });
  } catch (error) {
    console.error("CREATE TRANSACTION ERROR:", error);
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
