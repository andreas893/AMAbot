import express from "express";

const server =  express();

const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const messages = [];

app.get("/", (req, res) => {
    res.render("index", { messages });
});

app.post("/ask", (req, res) => {
    const question = req.body.question;
    
    messages.push({ type: "question", text: question });
    messages.push({ type: "answer", text: "Jeg leder efter et svar..." });

    res.render("index", { messages });
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


