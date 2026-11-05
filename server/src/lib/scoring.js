'use strict';

// Server-side copy of the client's isCorrectAnswer (client/src/components/AssessmentQuestion.jsx).
// Attempts are always scored here from the stored answers — never trusted from the client.
function isCorrectAnswer(q, value) {
  switch (q.type) {
    case 'true_false':
    case 'mcq':
      return value === q.answer;
    case 'fill_in':
    case 'image':
      return typeof value === 'string'
        && value.trim().toLowerCase() === String(q.answer ?? '').trim().toLowerCase();
    case 'match': {
      const pairs = q.options?.pairs || [];
      if (!pairs.length || !value) return false;
      return pairs.every((p, i) => value[i] === p.right);
    }
    default:
      return false;
  }
}

function scoreAttempt(questions, answers = {}) {
  let score = 0;
  let totalPoints = 0;
  for (const q of questions) {
    const points = q.points || 1;
    totalPoints += points;
    if (isCorrectAnswer(q, answers?.[q.id])) score += points;
  }
  return { score, totalPoints };
}

module.exports = { isCorrectAnswer, scoreAttempt };
