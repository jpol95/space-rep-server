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
  getHead(db, head) {
    return db
      .from("word")
      .innerJoin('language', 'word.id', '=', 'language.head')
      .select({
        "nextWord": 'original',
        "wordCorrectCount": 'correct_count',
        "wordIncorrectCount": 'incorrect_count',
        "totalScore": 'total_score'
      })
      .first();
  },
};

module.exports = LanguageService;
