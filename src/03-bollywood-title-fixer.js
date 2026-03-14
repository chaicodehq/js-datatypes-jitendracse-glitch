/**
 * 🎬 Bollywood Movie Title Fixer
 *
 * Pappu ne ek movie database banaya hai lekin usne saare titles galat type
 * kar diye - kuch ALL CAPS mein, kuch all lowercase mein, kuch mein extra
 * spaces hain. Tu fix kar de titles ko proper Title Case mein!
 *
 * Rules:
 *   - Extra spaces hatao: leading, trailing, aur beech ke multiple spaces ko
 *     single space banao
 *   - Har word ka pehla letter uppercase, baaki lowercase (Title Case)
 *   - EXCEPTION: Chhote words jo Title Case mein lowercase rehte hain:
 *     "ka", "ki", "ke", "se", "aur", "ya", "the", "of", "in", "a", "an"
 *     LEKIN agar word title ka PEHLA word hai toh capitalize karo
 *   - Hint: Use trim(), split(), map(), join(), charAt(), toUpperCase(),
 *     toLowerCase(), slice()
 *
 * Validation:
 *   - Agar input string nahi hai, return ""
 *   - Agar string trim karne ke baad empty hai, return ""
 *
 * @param {string} title - Messy Bollywood movie title
 * @returns {string} Cleaned up Title Case title
 *
 * @example
 *   fixBollywoodTitle("  DILWALE   DULHANIA   LE   JAYENGE  ")
 *   // => "Dilwale Dulhania Le Jayenge"
 *
 *   fixBollywoodTitle("dil ka kya kare")
 *   // => "Dil ka Kya Kare"
 */
export function fixBollywoodTitle(title) {
  // Validate input
  if (typeof title !== 'string') return "";
  
  const trimmed = title.trim();
  if (trimmed.length === 0) return "";
  
  // Small words that should stay lowercase (except first word)
  const smallWords = ['ka', 'ki', 'ke', 'se', 'aur', 'ya', 'the', 'of', 'in', 'a', 'an'];
  
  // Normalize spaces and split into words
  const words = trimmed.replace(/\s+/g, ' ').split(' ');
  
  // Process each word
  const titleCased = words.map((word, index) => {
    const lowerWord = word.toLowerCase();
    
    // First word should always be capitalized
    if (index === 0) {
      return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
    }
    
    // Small words stay lowercase
    if (smallWords.includes(lowerWord)) {
      return lowerWord;
    }
    
    // Other words: capitalize first letter
    return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
  });
  
  return titleCased.join(' ');
}
