import express from "express";

const server =  express();

const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const messages = [];

const answers = [
    {
        keywords: ["navn", "hedder", "hvem er du"],
        answer: "Jeg hedder Andreas. Hvad kunne du ellers tænke dig at vide om mig?"
    },
    {
        keywords: ["bor", "fra"],
        answer: "Jeg bor i Århus (Risskov), men kommer oprindeligt fra, en lille by tæt på Kolding, Jordrup."
    },
    {
        keywords: ["fritid", "hobby", "kan lide"],
        answer: "I min fritid kan jeg godt lide at lave lidt forskellige ting. Jeg kan godt lide at løbe, jeg spiller en del computerspil og jeg kan godt lide at læse."
    }
];


function findAnswer(question) {
    const normalizedQuestion = question.toLowerCase();

    for (const answerGroup of answers) {
        const hasMatch = answerGroup.keywords.some((keyword) => normalizedQuestion.includes(keyword));

        if (hasMatch) {
            return answerGroup.answer;
        }
    }

    return "Det kender jeg ikke svaret på endnu.";
}

function sanitizeQuestion(input) {
    return input.replace(/[\u0000-\u001F\u007F]/g, "");
};


app.get("/", (req, res) => {
    res.render("index", { messages, error: ""});
});

app.post("/ask", (req, res) => {
    const rawQuestion = req.body.question;
    const question = sanitizeQuestion(rawQuestion).trim();
    let error = "";

    if (!question) {
        error = "Skriv et spørgsmål, før du sender"
    } else {
        messages.push({ type: "question", text: question });
        const answer = findAnswer(question);
        messages.push({ type: "answer", text: answer });
    }    
    res.render("index", { messages, error });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


