import kuromoji from 'kuromoji';

let tokenizer = null;
let initPromise = null;

async function initializeTokenizer() {
  if (tokenizer) return tokenizer;
  
  if (initPromise) {
    return await initPromise;
  }

  initPromise = new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: 'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict' }).build((err, builtTokenizer) => {
      if (err) {
        reject(err);
      } else {
        tokenizer = builtTokenizer;
        resolve(tokenizer);
      }
    });
  });

  return await initPromise;
}

export async function extractNouns(text) {
  if (!text) return [];

  try {
    const tokenizer = await initializeTokenizer();
    const tokens = tokenizer.tokenize(text);
    
    const nouns = [];
    let currentPos = 0;

    for (const token of tokens) {
      const startIndex = text.indexOf(token.surface_form, currentPos);
      if (startIndex === -1) continue;

      currentPos = startIndex + token.surface_form.length;

      // Check if the token is a noun (名詞)
      if (token.pos === '名詞' && 
          token.surface_form && 
          !token.surface_form.match(/^[\[\]]+$/)) { // Exclude already bracketed words
        
        // Check if the noun is not already bracketed
        const beforeChar = startIndex > 0 ? text[startIndex - 1] : '';
        const afterChar = currentPos < text.length ? text[currentPos] : '';
        
        if (beforeChar !== '[' || afterChar !== ']') {
          nouns.push({
            text: token.surface_form,
            startIndex,
            endIndex: currentPos,
          });
        }
      }
    }

    return nouns;
  } catch (error) {
    console.error('Error extracting nouns:', error);
    throw error;
  }
}

export function applyBrackets(text, noun) {
  if (!text || !noun) return text;

  const before = text.slice(0, noun.startIndex);
  const word = text.slice(noun.startIndex, noun.endIndex);
  const after = text.slice(noun.endIndex);

  return `${before}[${word}]${after}`;
}