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

// const express = require("express");
// const router = express.Router();
// const SchoolFee = require("../models/SchoolFee");

// router.post("/", async (req, res) => {
//   try {
//     const { class_id, term_id, amount } = req.body;

//     if (!class_id || !term_id || !amount) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // RETURNING * to get the inserted row
//     const fee = await SchoolFee.create({ class_id, term_id, amount });

//     res.status(201).json({
//       message: "School fee set successfully",
//       fee
//     });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// router.get("/", async (req, res) => {
//   try {
//     const fees = await SchoolFee.getAll();
//     res.json(fees);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const SchoolFee = require("../models/SchoolFee");

// function mapErrorToStatus(err) {
//   const msg = (err && err.message) || "";
//   if (msg.includes("required") || msg.includes("must") || msg.includes("positive")) return 400;
//   if (msg.includes("does not exist")) return 404;
//   if (msg.includes("already set")) return 409;
//   return 500;
// }

// router.post("/", async (req, res) => {
//   try {
//     const { class_id, term_id, amount } = req.body;
//     const fee = await SchoolFee.create({ class_id, term_id, amount });
//     res.status(201).json({ message: "School fee set successfully", fee });
//   } catch (err) {
//     console.error("Error setting school fee:", err);
//     const status = mapErrorToStatus(err);
//     res.status(status).json({ error: err.message });
//   }
// });

// router.get("/", async (req, res) => {
//   try {
//     const fees = await SchoolFee.getAll();
//     res.json(fees);
//   } catch (err) {
//     console.error("Error fetching school fees:", err);
//     res.status(500).json({ error: "Failed to fetch school fees." });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const SchoolFee = require("../models/SchoolFee");

function mapErrorToStatus(err) {
  const msg = (err && err.message) || "";
  if (msg.includes("required") || msg.includes("must") || msg.includes("positive")) return 400;
  if (msg.includes("does not exist")) return 404;
  if (msg.includes("already set")) return 409;
  return 500;
}

router.post("/", async (req, res) => {
  try {
    const { class_id, term_id, amount } = req.body;
    const fee = await SchoolFee.create({ class_id, term_id, amount });
    res.status(201).json({ message: "School fee set successfully", fee });
  } catch (err) {
    console.error("Error setting school fee:", err);
    const status = mapErrorToStatus(err);
    res.status(status).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const fees = await SchoolFee.getAll();
    res.json(fees);
  } catch (err) {
    console.error("Error fetching school fees:", err);
    res.status(500).json({ error: "Failed to fetch school fees." });
  }
});

module.exports = router;
