import express from "express";
import fs from "node:fs/promises";

const server =  express();

const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

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

// Normaliser spørgsmål
function normalizeQuestion(question) {
    return question
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

function findBestAnswer(question) {
    const normalizedQuestion = normalizeQuestion(question);
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


function sanitizeQuestion(input) {
    return input.replace(/[\u0000-\u001F\u007F]/g, "");
};


// Hjælpefunktioner til save og load af messages

async function loadMessages() {
    const data = await fs.readFile("./data/messages.json", "utf8");
    return JSON.parse(data);
};

async function saveMessages(messages) {
    const json = JSON.stringify(messages, null, 2);
    await fs.writeFile("./data/messages.json", json);
};

// hjælpefuntkioner til save og load af topicstats
async function loadTopicStats() {
    const data = await fs.readFile("./data/topicStats.json", "utf8");
    return JSON.parse(data);
}

async function saveTopicStats(topicStats) {
    const json = JSON.stringify(topicStats, null, 2)
    await fs.writeFile("./data/topicStats.json", json);
}

// routes

// get route
app.get("/", async (req, res) => {
    const messages = await loadMessages();
    const topicStats = await loadTopicStats();
    res.render("index", { messages, error: "", topicStats});
});

// post route
app.post("/ask", async (req, res) => {
    const messages = await loadMessages();
    const topicStats = await loadTopicStats();
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

    await saveMessages(messages);
    await saveTopicStats(topicStats);
    
    res.render("index", { messages, error, topicStats });
});

// clear messages route
app.post("/clear", async (req, res) => {
    await saveMessages([]);
    await saveTopicStats({ name: 0, city: 0, hobby: 0, ukendt: 0})
    res.redirect("/")
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


