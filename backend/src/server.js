// const app = require("./app")
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () =>{
//     console.log(`server running on port on ${PORT}`);
// });



const app = require("./app")
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
