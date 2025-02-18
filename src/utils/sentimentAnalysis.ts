import { Emotion } from '../types';

export interface EmotionScore {
  emotion: Emotion;
  percentage: number;
}

// Natural language context patterns
const contextPatterns = {
  naturalActions: [
    'sun is down',
    'moon is up',
    'stars are out',
    'wind is blowing',
    'rain is falling',
    'snow is falling',
    'leaves are falling',
    'tide is low',
    'tide is high',
    'clouds are moving',
    'birds are flying'
  ],
  timeIndicators: [
    'before',
    'after',
    'during',
    'while',
    'when',
    'as',
    'until',
    'since'
  ]
};

export function analyzeEmotion(text: string): Emotion {
  const scores = analyzeEmotions(text);
  return scores[0]?.emotion || 'neutral';
}

export function analyzeEmotions(text: string): EmotionScore[] {
  let analysisText = text.toLowerCase();
  
  // First, check if the text contains natural action patterns
  const containsNaturalAction = contextPatterns.naturalActions.some(pattern => 
    analysisText.includes(pattern)
  );

  // If it's a natural action description, skip emotion analysis for that part
  if (containsNaturalAction) {
    // Remove natural action descriptions from analysis
    contextPatterns.naturalActions.forEach(pattern => {
      analysisText = analysisText.replace(pattern, '');
    });
    analysisText = analysisText.trim();
  }

  const emotionKeywords = {
    happy: [
      'happy', 'joy', 'excited', 'great', 'wonderful', 'love', 'smile', '😊', '😃', '🙂',
      'wow', 'amazing', 'fantastic', 'awesome', 'excellent', 'delighted', 'thrilled',
      'overjoyed', 'ecstatic', 'grateful', 'blessed', 'cheerful', 'pleased', 'content',
      'satisfied', 'jubilant', 'elated', 'blissful', 'radiant', 'beaming', '🤗', '😄',
      'woohoo', 'yay', 'celebrating', 'celebration', 'proud', 'accomplished', 'fun',
      'laughing', 'laughter', 'giggle', 'haha', 'perfect', 'success', 'win', 'winning',
      'achieved', 'completed', 'finished', 'succeeded', 'accomplished', 'nailed it',
      'made it', 'did it', 'got it', 'mastered', 'conquered', 'triumph', 'victory',
      'lets go', 'lesgo', 'lfg', 'pog', 'poggers', 'goated', 'w', 'dub', 'sheesh',
      'fire', '🔥', 'lit', 'based', 'bussin', 'fr fr', 'no cap', 'slay', 'slayed',
      'vibing', 'vibe', 'mood', 'hits different', 'chef kiss', '💯', 'goat', ':\\)', ':D',
      'feeling inspired', 'holiday', 'like a holiday', 'enjoying', 'enjoy', 'loved',
      'blessed', 'grateful', 'thankful', 'appreciate', 'appreciated', 'feeling good',
      'feeling great', 'feeling amazing', 'feeling blessed', 'feeling thankful'
    ],
    sad: [
      'sad', 'unhappy', 'depressed', 'down', 'cry', 'tears', '😢', '😭', '☹️',
      'heartbroken', 'miserable', 'grief', 'grieving', 'mourning', 'devastated',
      'lonely', 'alone', 'hopeless', 'gloomy', 'blue', 'melancholy', 'sorrowful',
      'hurt', 'pain', 'suffering', 'despair', 'lost', 'empty', 'broken', '💔',
      'miss', 'missing', 'regret', 'sorry', 'failed', 'gave up', 'quit',
      'abandoned', 'stopped', 'dropped', 'left', 'ended', 'terminated',
      'pain', 'sadge', 'drop an f', 'f in chat', 'feels bad', 'feelsbadman',
      'down bad', 'rip', 'crying rn', 'crying fr', 'im done', 'done with this',
      'over it', 'cant anymore', 'this aint it', 'not it', 'ded', '💀', ':\\(',
      'feeling down', 'feeling sad', 'feeling empty', 'feeling lost', 'feeling alone',
      'missing someone', 'missing home', 'homesick', 'heartache', 'heartbreak'
    ],
    inspired: [
      'inspired', 'motivated', 'creative', 'energized', 'excited', '💡', '✨',
      'learned', 'learning', 'discovered', 'figured out', 'understand', 'understood',
      'knowledge', 'insight', 'enlightened', 'breakthrough', 'eureka',
      'creating', 'made', 'built', 'designed', 'crafted', 'drew', 'painted',
      'wrote', 'composed', 'innovative', 'imagination', 'ideas', 'brainstorm',
      'accomplished', 'achieved', 'mastered', 'solved', 'solution',
      'fascinating', 'interesting', 'curious', 'wonder', 'amazed',
      'study', 'studied', 'research', 'explored', 'experiment', 'discovery',
      'wisdom', 'understanding', 'comprehension', 'realization', 'epiphany',
      'progress', 'improving', 'better', 'growth', 'developing', 'skill',
      'read', 'reading', 'practiced', 'training', 'exercised', 'worked out',
      'meditated', 'reflected', 'planned', 'organized', 'prepared', 'started',
      'galaxy brain', 'big brain', '🧠', 'grinding', 'grind', 'level up',
      'leveling up', 'main character', 'protagonist', 'era', 'season',
      'coding', 'running', 'productive', 'determination', 'determined',
      'focused', 'focus', 'concentration', 'concentrated', 'mindful'
    ],
    disappointed: [
      'disappointed', 'let down', 'dissatisfied', 'unfulfilled', 'regretful',
      'disheartened', 'discouraged', 'dismayed', 'unsatisfied', 'expectations',
      'hoped for better', 'not good enough', 'could be better', 'mediocre',
      'underwhelming', 'mistake', 'my fault', 'blame myself', 'should have',
      'could have', 'wish i had', 'regrettable', 'missed opportunity',
      'wasted chance', 'fell short', 'not what i expected', 'disappointing',
      'letdown', 'not up to par', 'subpar', 'below expectations'
    ],
    anxious: [
      'anxious', 'worried', 'nervous', 'stress', 'stressed', 'panic', 'overthinking',
      'uneasy', 'restless', 'tense', 'apprehensive', 'concerned', 'dread',
      'butterflies', 'jitters', 'overwhelmed', 'pressured', 'racing thoughts',
      'cant sleep', 'insomnia', 'on edge', 'anxiety', '😰', '😥', '😨',
      'uncertain', 'unsure', 'doubt', 'doubting', 'hesitant', 'running late',
      'might be late', 'going to be late', 'cant be late', 'hurry', 'rush',
      'waiting', 'anticipating', 'preparing', 'rehearsing', 'practicing',
      'checking', 'double-checking', 'triple-checking', 'monkas', 'sweating',
      'sweating bullets', 'speedrun', 'speedrunning', 'clutch', 'clutching',
      'heart racing', 'stomach in knots', 'cant focus', 'distracted',
      'feeling nervous', 'feeling anxious', 'feeling stressed'
    ],
    fear: [
      'fear', 'scared', 'afraid', 'terrified', 'frightened', 'horror', 'terror',
      'panic', 'paranoid', 'phobia', 'threatening', 'danger', 'dangerous',
      'scary', 'spooked', 'haunted', 'petrified', 'paralyzed', 'trembling',
      'shaking', 'horrified', 'dreading', '😱', '🫢', '😖', 'avoided',
      'escaped', 'ran away', 'hid', 'concealed', 'ducked', 'dodged',
      'monkaS', 'monkaW', 'pepeMeltdown', 'panik', 'code red', 'defcon 1',
      'feeling scared', 'feeling afraid', 'feeling terrified', 'fear of',
      'scared of', 'afraid of', 'terrified of', 'frightened of'
    ],
    shocked: [
      'shocked', 'surprise', 'surprised', 'unexpected', 'stunned', 'astonished',
      'speechless', 'mindblown', 'unbelievable', 'cant believe', 'shocking',
      'startled', 'amazed', 'dumbfounded', 'flabbergasted', 'jaw dropped',
      'bewildered', 'taken aback', '😱', '😲', '😮', '🤯', 'what', 'omg',
      'oh my god', 'no way', 'holy', 'wtf', 'wth', 'discovered',
      'found out', 'realized', 'learned', 'heard', 'saw', 'witnessed',
      'no shot', 'fr?', 'frfr?', 'cap?', 'sus', 'sussy', '👀',
      'real?', 'actually?', 'deadass?', 'fr fr?', 'nah', 'ain no way',
      'mind blown', 'blown away', 'cant process', 'cant comprehend'
    ],
    bored: [
      'bored', 'boring', 'dull', 'uninteresting', 'monotonous', 'tedious',
      'tired', 'sleepy', 'yawn', 'mundane', 'repetitive', 'same old',
      'nothing to do', 'unexciting', 'lifeless', 'stale', 'dry', 'bland',
      'routine', 'uneventful', 'nothing new', 'meh', '😴', '🥱',
      'waited', 'sat', 'stood', 'watched', 'stared', 'lingered',
      'idle', 'inactive', 'doing nothing', 'wasted time', 'mid',
      'sleep time', 'resident sleeper', 'sleeper', 'npc behavior',
      'npc moment', 'afk', 'dead chat', 'zzz', 'sleep stream',
      'feeling bored', 'feeling tired', 'feeling sleepy', 'nothing exciting',
      'nothing interesting', 'waste of time', 'killing time'
    ],
    embarrassed: [
      'embarrassed', 'ashamed', 'awkward', 'uncomfortable', '😳', '🫣',
      'humiliated', 'mortified', 'self-conscious', 'foolish', 'silly',
      'red-faced', 'flustered', 'cringe', 'cringy', 'exposed', 'shame',
      'embarrassing', 'blunder', 'mistake', 'slip up', 'made a fool',
      'everyone saw', 'people noticed', 'want to hide', 'stumbled',
      'fell', 'dropped', 'spilled', 'messed up', 'fumbled',
      'caught in 4k', '📸', 'yikes', 'oof', 'bruh', 'certified bruh moment',
      'feeling embarrassed', 'feeling ashamed', 'feeling awkward',
      'feeling uncomfortable', 'feeling exposed', 'feeling humiliated'
    ]
  };

  // Sentence patterns for complex emotional expressions
  const sentencePatterns = [
    // Activity completion patterns
    {
      pattern: /(finished|completed|done) ([\w\s]+) (and|then) ([\w\s]+)/i,
      contextAnalysis: (match: RegExpMatchArray) => {
        const activity = match[2];
        const followUp = match[4];
        
        // Check if the follow-up indicates positive emotion
        if (followUp.includes('feeling good') || followUp.includes('happy')) {
          return { emotion: 'happy' as Emotion, weight: 3 };
        }
        
        // Default to inspired for completing activities
        return { emotion: 'inspired' as Emotion, weight: 2 };
      }
    },
    
    // Multiple exclamation analysis
    {
      pattern: /(!{2,})/,
      contextAnalysis: (match: RegExpMatchArray) => {
        // Get the full text from the match input
        const fullText = match.input || '';
        
        // Check surrounding words for context
        const words = fullText.toLowerCase().split(/\s+/);
        const exclamationIndex = words.findIndex(w => w.includes('!!'));
        
        if (exclamationIndex > 0) {
          const prevWord = words[exclamationIndex - 1];
          
          // Positive indicators
          if (['yes', 'awesome', 'great', 'love', 'amazing', 'inspired'].includes(prevWord)) {
            return { emotion: 'happy' as Emotion, weight: 3 };
          }
          
          // Achievement indicators
          if (['finally', 'done', 'completed', 'achieved'].includes(prevWord)) {
            return { emotion: 'inspired' as Emotion, weight: 3 };
          }
        }
        
        // Default to happy if context is unclear but preceded by positive words
        if (fullText.includes('feeling inspired') || fullText.includes('holiday')) {
          return { emotion: 'happy' as Emotion, weight: 3 };
        }
        
        return { emotion: 'happy' as Emotion, weight: 1 };
      }
    }
  ];

  const scores: { [key in Emotion]?: number } = {};
  let totalScore = 0;

  // Check sentence patterns first (they have higher weight)
  sentencePatterns.forEach(pattern => {
    if (pattern.pattern.test(analysisText)) {
      if ('contextAnalysis' in pattern) {
        const matches = analysisText.match(pattern.pattern);
        if (matches) {
          const result = pattern.contextAnalysis(matches);
          scores[result.emotion] = (scores[result.emotion] || 0) + result.weight;
          totalScore += result.weight;
        }
      }
    }
  });

  // Then check for keyword matches
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    const score = keywords.reduce((count, keyword) => {
      const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = analysisText.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);

    if (score > 0) {
      scores[emotion as Emotion] = (scores[emotion as Emotion] || 0) + score;
      totalScore += score;
    }
  });

  if (totalScore === 0) {
    return [{ emotion: 'neutral', percentage: 100 }];
  }

  // Calculate percentages and sort by score
  const emotionScores: EmotionScore[] = Object.entries(scores)
    .map(([emotion, score]) => ({
      emotion: emotion as Emotion,
      percentage: Math.round((score / totalScore) * 100)
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // Remove neutral if other emotions are present
  const nonNeutralEmotions = emotionScores.filter(score => score.emotion !== 'neutral');
  
  if (nonNeutralEmotions.length > 0) {
    // Recalculate percentages without neutral
    const totalNonNeutralScore = nonNeutralEmotions.reduce((sum, score) => sum + score.percentage, 0);
    return nonNeutralEmotions.map(score => ({
      emotion: score.emotion,
      percentage: Math.round((score.percentage / totalNonNeutralScore) * 100)
    }));
  }

  return emotionScores;
}