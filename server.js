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
        answers: 
        "Jeg hedder Andreas. Hvad kunne du ellers tænke dig at vide om mig?"
    },
    {
        keywords: ["bor", "fra"],
        answers: "Jeg bor i Århus (Risskov), men kommer oprindeligt fra, en lille by tæt på Kolding, Jordrup."
    },
    {
        keywords: ["fritid", "hobby", "kan lide"],
        answers: [
        "I min fritid kan jeg godt lide at lave lidt forskellige ting. Jeg kan godt lide at løbe, jeg spiller en del computerspil og jeg kan godt lide at læse.",
        "Jeg kan godt lide at læse manga og ser også en del anime. Jeg kan også godt lide at se film og serier."
        ]
    }
];

function countMatches(keywords, normalizedQuestion) {
    const matches = keywords.filter((keyword) => 
        normalizedQuestion.includes(keyword)
    );

    return matches.length;
};

function findBestAnswer(question) {
    const normalizedQuestion = question.toLowerCase();
    let bestScore = 0;
    let bestAnswer = "Det kender jeg ikke svaret på endnu"

    for (const answerGroup of answers) {
        const score = countMatches(answerGroup.keywords, normalizedQuestion);

        if (score>bestScore) {
            bestScore = score;
            bestAnswer = answerGroup.answers;
        };   
    };
    return bestAnswer;
    
};

console.log(
    findBestAnswer("Hvad hedder du, hvad er dit navn, og hvor bor du?")
);

console.log(
    findBestAnswer("Hvor bor du, og hvor er du fra, og hvad hedder du?")
);

console.log(
    findBestAnswer("Kan du bage en kage?")
);

console.log(
    findBestAnswer("Hvad hedder du, og hvor bor du?")
);



function findAnswer(question) {
    const normalizedQuestion = question.toLowerCase();

    for (const answerGroup of answers) {
        const hasMatch = answerGroup.keywords.some((keyword) => normalizedQuestion.includes(keyword));

        if (hasMatch) {
            const randomIndex = Math.floor(Math.random() * answerGroup.answers.length)
            return answerGroup.answers[randomIndex];
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
    } else if (question.length > 280) {
        error = "Spørgsmålet må højst være 280 tegn langt. Prøv at forkorte det."
    } else {
        messages.push({ type: "question", text: question, createdAt: new Date() });
        const answer = findBestAnswer(question);
        messages.push({ type: "answer", text: answer, createdAt: new Date() });
    }    
    res.render("index", { messages, error });
});

app.post("/clear", (req, res) => {
    messages.length = 0;
    res.redirect("/")
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


