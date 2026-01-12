// const express = require("express");

// const router = express.Router();
// const SchoolFee = require("../models/SchoolFee")



// router.post("/", async (req, res) => {
//   try {
//     const { class_id, term_id, amount } = req.body;

//     if (!class_id || !term_id || !amount) {
//       return res.status(400).json({ error: "All fields are required" })
//     }

//     const fee = await SchoolFee.create({ class_id, term_id, amount });

//     res.status(201).json({
//       message: "School fee set successfully", fee
//     });
//   } catch (err) {
//     res.status(400).json({ error: err.message })
//   }
// })
// router.get("/", async (req, res) => {
//   try {
//     const fees = await SchoolFee.getAll();
//     res.json(fees);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// module.exports = router;

const express = require("express");
const router = express.Router();
const SchoolFee = require("../models/SchoolFee");

router.post("/", async (req, res) => {
  try {
    const { class_id, term_id, amount } = req.body;

    if (!class_id || !term_id || !amount) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // RETURNING * to get the inserted row
    const fee = await SchoolFee.create({ class_id, term_id, amount });

    res.status(201).json({
      message: "School fee set successfully",
      fee
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const fees = await SchoolFee.getAll();
    res.json(fees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
