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
    if (guess === wordLL.translation){
      wordLL.head.val.correct_count++;
      wordLL.head.val.memory_value *= 2;
    }
    else {
      wordLL.head.val.incorrect_count++;
      wordLL.head.val.memory_value = 1;
    }
    let currentHead = wordLL.head;
    wordLL.head = wordLL.head.next;
    wordLL.insertAt(currentHead.val.memory_value, currentHead);
    console.log("line 67", wordLL.head.next)
    req.language.head = wordLL.head.val.id
    await LanguageService.updateTable(req.app.get('db'), req.language, wordLL.head)
    let testing = await LanguageService.createLL(req.app.get('db'), req.language.head)
    while (testing !== undefined) {
      console.log(testing.val)
      testing = testing.next;
    }
    res.send('implement me!')
  })

module.exports = languageRouter
