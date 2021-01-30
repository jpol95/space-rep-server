const express = require("express");
const jsonParser = express.json();
const LanguageService = require("./language-service");
const { requireAuth } = require("../middleware/jwt-auth");

const languageRouter = express.Router();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get("db"),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`,
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get("/", async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get("db"),
      req.language.id
    );

    res.json({
      language: req.language,
      words,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get("/head", async (req, res, next) => {
  const head = await LanguageService.getHead(
    req.app.get("db"),
    req.language.id
  );
  res.status(200).send(head);
});

languageRouter.post("/guess", jsonParser, async (req, res, next) => {
  const { guess } = req.body;
  if (!guess) return res.status(400).send({
    error: `Missing 'guess' in request body`,
  })
  const wordLL = await LanguageService.createLL(
    req.app.get("db"),
    req.language.head
  );
  console.log(guess)
  if (guess === wordLL.head.val.translation) {
    wordLL.head.val.correct_count++;
    wordLL.head.val.memory_value *= 2;
    req.language.total_score++;
  } else {
    wordLL.head.val.incorrect_count++;
    wordLL.head.val.memory_value = 1;
  }
  let currentHead = wordLL.head;
  wordLL.head = wordLL.head.next;
  wordLL.insertAt(currentHead.val.memory_value, currentHead);
  req.language.head = wordLL.head.val.id;
  await LanguageService.updateTable(
    req.app.get("db"),
    req.language,
    wordLL.head
  );
  let result = {
    nextWord:  wordLL.head.val.original,
    wordCorrectCount:  wordLL.head.val.correct_count,
    wordIncorrectCount:  wordLL.head.val.incorrect_count, 
    totalScore: req.language.total_score, 
    answer: currentHead.val.translation, 
    isCorrect: guess === currentHead.val.translation
  };
  res.send(result);
});

//FIGURE OUT TOMORROW

module.exports = languageRouter;
