const LinkedList = require("./LinkedList");

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from("language")
      .select(
        "language.id",
        "language.name",
        "language.user_id",
        "language.head",
        "language.total_score"
      )
      .where("language.user_id", user_id)
      .first();
  },
  patchLanguage(db, id, newLanguage){
    return db
    .from("language")
    .where({id})
    .update({...newLanguage})
    .returning('*')
    .first()
  },
  patchWord(db, id, newWord){
    return db
    .from("word")
    .where({id})
    .update({...newWord})
    .returning('*')
    .first()
  },
  getLanguageWords(db, language_id) {
    return db
      .from("word")
      .select(
        "id",
        "language_id",
        "original",
        "translation",
        "next",
        "memory_value",
        "correct_count",
        "incorrect_count"
      )
      .where({ language_id });
  },
  getHead(db, language_id) {
    return db
      .from("word")
      .innerJoin('language', 'word.id', '=', 'language.head')
      .select({
        "nextWord": 'original',
        "wordCorrectCount": 'correct_count',
        "wordIncorrectCount": 'incorrect_count',
        "totalScore": 'total_score'
      })
      .where({language_id})
      .first();
  },

  async createLL(db, head) {
    const wordLL = new LinkedList();
    const headWord = await db.from("word").select('*').where({id: head}).first();
    let current = headWord;
    while (current !== undefined) {
      wordLL.insertLast(current);
      current = await db.from("word").select('*').where({id: current.next}).first();
    }
    return wordLL;
  } //FINISH IMPLEMENTING THIS ALGORITHM
};

module.exports = LanguageService;
