const express = require('express')
const jsonParser = express.json()
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    const head = await LanguageService.getHead(req.app.get('db'), req.language.id)
    res.status(200).send(head)
  })

languageRouter
  .post('/guess', jsonParser, async (req, res, next) => {
    const {guess} = req.body;
    const wordLL = await LanguageService.createLL(req.app.get('db'), req.language.head);
    console.log(wordLL)
    if (guess === wordLL.translation){
      wordLL.head.correct_count++;
      wordLL.head.memory_value *= 2;
    }
    else {
      wordLL.head.incorrect_count--;
      wordLL.head.memory_value = 1;
    }
    wordLL.insertAt(wordLL.memory_value + 1);
    wordLL.head = wordLL.head.next;
    res.send('implement me!')
  })

module.exports = languageRouter
