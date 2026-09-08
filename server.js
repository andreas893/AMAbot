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
        category: "name",
        keywords: ["navn", "hedder", "hvem er du"],
        answers: 
        "Jeg hedder Andreas. Hvad kunne du ellers tænke dig at vide om mig?"
    },
    {
        category: "city",
        keywords: ["bor", "fra"],
        answers: "Jeg bor i Århus (Risskov), men kommer oprindeligt fra, en lille by tæt på Kolding, Jordrup."
    },
    {
        category: "hobby",
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
    let bestCategory = "";

    for (const answerGroup of answers) {
        const score = countMatches(answerGroup.keywords, normalizedQuestion);

        if (score>bestScore) {
            bestScore = score;
            bestAnswer = answerGroup.answers;
            bestCategory = answerGroup.category;
        };   
    };

    return {
        answer: bestAnswer,
        category: bestCategory
    };
    
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

const topicStats = {
    name: 0,
    city: 0,
    hobby: 0
};

app.get("/", (req, res) => {
    res.render("index", { messages, error: "", topicStats});
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
        
        const result = findBestAnswer(question);
        messages.push({ type: "answer", text: result.answer, createdAt: new Date() });
        
        if (result.category) {
        topicStats[result.category] = topicStats[result.category] + 1;
        }
        console.log(topicStats)
    }    
    
    res.render("index", { messages, error, topicStats });
});

app.post("/clear", (req, res) => {
    messages.length = 0;
    res.redirect("/")
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


