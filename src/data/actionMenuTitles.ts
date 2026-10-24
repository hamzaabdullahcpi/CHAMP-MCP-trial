// Short action titles shared by the sidebar menu and the homepage action cards.
export const ACTION_MENU_TITLES: Record<number, string> = {
  1: "Multilevel commitments & platforms",
  2: "Enabling environments",
  3: "Portfolios and pipelines",
  4: "Finance",
  5: "Capacities & networks",
};

// "Mobilize Finance and Shape Markets" -> "Mobilize finance and shape markets".
// All-caps words (acronyms such as NDC) are left untouched.
export const toSentenceCase = (text: string): string =>
  text
    .split(" ")
    .map((word, i) => {
      if (i === 0) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      if (word.length > 1 && word === word.toUpperCase()) return word;
      return word.toLowerCase();
    })
    .join(" ");
