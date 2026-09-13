export interface Lesson {
  id: string;
  title: string;
  icon: string;
  content: string;
  analogy: string;
  keyTakeaway: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface LearningModule {
  id: number;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  icon: string;
  lessons: Lesson[];
}

export const learningModules: LearningModule[] = [
  {
    id: 0,
    title: 'Money Basics',
    subtitle: 'What is money & how does it move?',
    color: '#10B981',
    bgColor: '#D5E2DA',
    icon: '💰',
    lessons: [
      {
        id: 'm0-l1',
        title: 'What is Money?',
        icon: '💵',
        content: 'Money is anything that people agree to use as a medium of exchange. It lets you trade your time and skills for things you need — without having to barter chickens for shoes!',
        analogy: 'Think of money like tokens at an arcade. You trade real cash for tokens, and then everyone at the arcade agrees those tokens have value. You can use them to play games, get prizes, or trade them back. Money works the same way — it is a universal "token" that society agrees has value.',
        keyTakeaway: 'Money is a shared agreement — it has value because everyone believes it does.',
        quiz: {
          question: 'Why does a $10 bill have value?',
          options: [
            'Because it is made of special paper',
            'Because the government says so and everyone agrees it can be exchanged for goods',
            'Because it is rare and hard to find',
            'Because it has a picture of a president on it',
          ],
          correctIndex: 1,
          explanation: 'Money has value because of collective trust. The government backs it, and people agree to accept it in exchange for goods and services.',
        },
      },
      {
        id: 'm0-l2',
        title: 'Income vs Expenses',
        icon: '📊',
        content: 'Income is money coming IN (salary, freelance work, investments). Expenses are money going OUT (rent, food, entertainment). The goal is to make your income bigger than your expenses.',
        analogy: 'Imagine your bank account is a bathtub. Income is the faucet filling it up, expenses are the drain letting water out. If the faucet runs faster than the drain, your tub fills up (savings!). If the drain is faster, the tub runs dry.',
        keyTakeaway: 'Spend less than you earn — the foundation of all wealth building.',
        quiz: {
          question: 'If you earn $3,000/month and spend $2,500/month, what do you have?',
          options: [
            'A $5,500 debt',
            'A $500 monthly surplus (savings)',
            'Break even',
            'Nothing meaningful',
          ],
          correctIndex: 1,
          explanation: 'When income exceeds expenses, you have a surplus. $3,000 - $2,500 = $500/month savings. Over a year, that is $6,000 — enough to start investing!',
        },
      },
      {
        id: 'm0-l3',
        title: 'Savings & Emergency Funds',
        icon: '🏦',
        content: 'Before investing anything, you need an emergency fund — 3 to 6 months of living expenses saved up. This is your safety net so you never have to sell investments at a bad time.',
        analogy: 'An emergency fund is like an airbag in your car. You hope you never need it, but when something unexpected happens, it saves you from disaster. Without it, one medical bill or job loss could force you to sell your investments at a loss.',
        keyTakeaway: 'Build your emergency fund FIRST — it protects every other financial decision you make.',
        quiz: {
          question: 'How much should your emergency fund cover?',
          options: [
            '1 week of expenses',
            '1 month of expenses',
            '3 to 6 months of living expenses',
            '1 year of expenses',
          ],
          correctIndex: 2,
          explanation: 'Financial experts recommend 3-6 months of living expenses. This covers most emergencies like job loss, medical bills, or car repairs without forcing you to sell investments.',
        },
      },
    ],
  },
  {
    id: 1,
    title: 'Saving vs Investing',
    subtitle: 'Grow your money over time',
    color: '#3B82F6',
    bgColor: '#DCEEEF',
    icon: '📈',
    lessons: [
      {
        id: 'm1-l1',
        title: 'Why Invest Instead of Save?',
        icon: '🤔',
        content: 'Savings accounts give you ~4% per year. Inflation eats about 3%. Your real growth is only 1%. Investing in the stock market has historically returned ~10% per year on average. Over 30 years, that difference is MASSIVE.',
        analogy: 'Saving is like walking — safe, slow, predictable. Investing is like riding a bicycle — faster, a bit wobbly at first, but you will get where you are going much sooner. Over 30 years, the walker covers 5 miles, the cyclist covers 500.',
        keyTakeaway: 'Inflation is the silent killer of savings. Investing beats inflation over the long run.',
        quiz: {
          question: 'If you invest $10,000 at 10% average annual return, approximately how much will you have in 10 years?',
          options: [
            '$11,000',
            '$15,000',
            '$25,937',
            '$100,000',
          ],
          correctIndex: 2,
          explanation: 'Due to compound growth, $10,000 at 10% annual return becomes ~$25,937 in 10 years. Your money more than doubled! This is the power of compounding.',
        },
      },
      {
        id: 'm1-l2',
        title: 'The Magic of Compound Interest',
        icon: '✨',
        content: 'Compound interest means you earn returns on your returns. If you invest $100 and earn 10%, you now have $110. Next year, you earn 10% on $110 (not just $100). It is like a snowball rolling downhill — it gets bigger and rolls faster.',
        analogy: 'Imagine a tiny snowball at the top of a snowy hill. As it rolls down, it picks up more snow. The bigger it gets, the more snow it picks up with each rotation. That is compounding — your money grows, and then that growth starts growing too.',
        keyTakeaway: 'Start investing early — time is the most powerful ingredient in compound growth.',
        quiz: {
          question: 'Why is compound interest called the "8th wonder of the world"?',
          options: [
            'Because it was discovered in ancient times',
            'Because it makes money grow exponentially — earnings generate their own earnings',
            'Because it only works with very large amounts',
            'Because it was invented by Albert Einstein',
          ],
          correctIndex: 1,
          explanation: 'Compound interest creates exponential growth. Your returns earn returns, which earn more returns. Starting early, even with small amounts, leads to massive growth over decades.',
        },
      },
      {
        id: 'm1-l3',
        title: 'Stocks, Bonds & ETFs',
        icon: '📋',
        content: 'A stock is a tiny piece of ownership in a company. A bond is a loan you give to a company or government. An ETF (Exchange-Traded Fund) is a basket of many stocks bundled together — instant diversification!',
        analogy: 'Stocks are like owning a slice of a pizza shop. If the shop does well, your slice is worth more. Bonds are like lending money to your friend who promises to pay you back with interest. An ETF is like buying a sampler platter — you get a little bit of everything instead of betting on one dish.',
        keyTakeaway: 'ETFs are great for beginners — they spread your risk across many companies at once.',
        quiz: {
          question: 'What is an ETF?',
          options: [
            'A type of savings account',
            'A single company stock',
            'A bundle of many stocks/bonds in one investment',
            'A government bond',
          ],
          correctIndex: 2,
          explanation: 'An ETF is a collection of stocks, bonds, or other assets bundled into one investment. It gives you instant diversification — spreading your risk across many companies instead of betting on just one.',
        },
      },
    ],
  },
  {
    id: 2,
    title: 'Risk & Returns',
    subtitle: 'Higher reward = higher risk',
    color: '#F59E0B',
    bgColor: '#F6E7CF',
    icon: '⚖️',
    lessons: [
      {
        id: 'm2-l1',
        title: 'Risk vs Reward',
        icon: '🎯',
        content: 'The fundamental rule of investing: higher potential returns come with higher risk. A savings account is safe but earns little. Cryptocurrency can double your money — or lose half of it. Smart investing means finding YOUR comfort zone.',
        analogy: 'Risk is like the height of a roller coaster. A kiddie ride (savings account) is safe but boring. A huge roller coaster (crypto) is thrilling but terrifying. A mid-range coaster (index funds) gives you excitement without making you sick. Pick the ride that lets you sleep at night.',
        keyTakeaway: 'Never invest more than you can afford to lose. Your risk tolerance is personal.',
        quiz: {
          question: 'Which investment typically has the HIGHEST risk?',
          options: [
            'Government bonds',
            'A diversified ETF of 500 companies',
            'A single cryptocurrency like Bitcoin',
            'A savings account',
          ],
          correctIndex: 2,
          explanation: 'A single cryptocurrency is extremely volatile — it can swing 20%+ in a day. Government bonds and savings accounts are nearly guaranteed. A diversified ETF spreads risk across hundreds of companies.',
        },
      },
      {
        id: 'm2-l2',
        title: 'Diversification',
        icon: '🧺',
        content: 'Never put all your eggs in one basket. Diversification means spreading your money across different types of investments (stocks, bonds, crypto, real estate) so that if one does poorly, the others can balance it out.',
        analogy: 'Imagine you have 10 eggs. If you carry all 10 in one basket and drop it, you lose everything. But if you put 3 in one basket, 3 in another, and 4 in a third, dropping one basket only costs you a few eggs. Diversification protects your "eggs" (money).',
        keyTakeaway: 'Diversification is your seatbelt — it does not prevent crashes, but it reduces the damage.',
        quiz: {
          question: 'What is the main benefit of diversification?',
          options: [
            'It guarantees you will never lose money',
            'It doubles your returns',
            'It reduces risk by spreading investments across different assets',
            'It eliminates the need to monitor your investments',
          ],
          correctIndex: 2,
          explanation: 'Diversification reduces risk. When some investments go down, others may go up or stay stable. You will not get the highest possible returns, but you avoid catastrophic losses.',
        },
      },
      {
        id: 'm2-l3',
        title: 'Volatility & Drawdown',
        icon: '📉',
        content: 'Volatility measures how much an investment swings up and down. High volatility = big price swings. A drawdown is how much an investment drops from its highest point. Even great investments can drop 30-40% during crashes.',
        analogy: 'Volatility is like weather. Some places have mild, predictable weather (low volatility = bonds). Others have wild storms and heatwaves (high volatility = crypto). A 30% drawdown is like a category 3 hurricane — scary, but the city usually rebuilds.',
        keyTakeaway: 'Expect short-term drops. The stock market has always recovered given enough time.',
        quiz: {
          question: 'An investment drops from $100 to $70. What is the drawdown?',
          options: [
            '$30',
            '30%',
            '3%',
            '70%',
          ],
          correctIndex: 1,
          explanation: 'Drawdown = (Peak - Current) / Peak = ($100 - $70) / $100 = 30%. A 30% drawdown is significant but historically the stock market has recovered from much worse.',
        },
      },
    ],
  },
  {
    id: 3,
    title: 'Reading the Market',
    subtitle: 'Understand stock charts & metrics',
    color: '#8B5CF6',
    bgColor: '#D7CEF0',
    icon: '🔍',
    lessons: [
      {
        id: 'm3-l1',
        title: 'What Moves Stock Prices?',
        icon: '📈',
        content: 'Stock prices move based on supply and demand. If more people want to buy a stock than sell it, the price goes up. Company earnings, news, interest rates, and investor sentiment all influence demand.',
        analogy: 'Stock prices are like a voting machine. Every buy vote pushes the price up, every sell vote pushes it down. But unlike a normal vote, the same people can vote over and over every day!',
        keyTakeaway: 'Prices reflect collective human behavior — not just company performance.',
        quiz: {
          question: 'What primarily causes a stock price to go up?',
          options: [
            'The company is old and established',
            'More people want to buy it than sell it',
            'The stock has a high price per share',
            'It is listed on the New York Stock Exchange',
          ],
          correctIndex: 1,
          explanation: 'Stock prices move on supply and demand. When buying pressure exceeds selling pressure, the price rises. This is driven by company performance, news, sentiment, and market conditions.',
        },
      },
      {
        id: 'm3-l2',
        title: 'P/E Ratio & Market Cap',
        icon: '🧮',
        content: 'P/E Ratio (Price-to-Earnings) tells you how much you pay for each $1 of a company\'s earnings. A P/E of 20 means you pay $20 for every $1 the company earns. Market Cap is the total value of all shares — it tells you the company\'s size.',
        analogy: 'P/E ratio is like the price of a rental house divided by its yearly rent. If a house costs $200,000 and rents for $10,000/year, the P/E is 20. You are paying 20 years of rent upfront. A lower P/E might mean the house is a better deal.',
        keyTakeaway: 'A high P/E means growth expectations. A low P/E might mean a bargain — or trouble.',
        quiz: {
          question: 'Company A has a P/E of 15, Company B has a P/E of 45. What might this suggest?',
          options: [
            'Company A is definitely better',
            'Company B is overpriced',
            'Investors expect faster growth from Company B',
            'Company B has more revenue',
          ],
          correctIndex: 2,
          explanation: 'A higher P/E often means investors expect higher future growth. It does not automatically mean overpriced — high-growth companies like tech firms often have high P/E ratios.',
        },
      },
      {
        id: 'm3-l3',
        title: 'Bull vs Bear Markets',
        icon: '🐂🐻',
        content: 'A bull market is when prices are rising (optimism, growth). A bear market is when prices fall 20%+ from their peak (fear, contraction). Understanding these cycles helps you stay calm and not panic-sell.',
        analogy: 'A bull attacks by thrusting its horns UP — symbolizing rising markets. A bear swipes its claws DOWN — symbolizing falling markets. A bull market is like summer (growth), a bear market is like winter (rest). But spring always follows winter.',
        keyTakeaway: 'Bear markets are temporary. The market has recovered from every single one in history.',
        quiz: {
          question: 'What defines a bear market?',
          options: [
            'Prices go up 10% in a month',
            'Prices drop 20% or more from their recent peak',
            'The economy enters a recession',
            'Interest rates are cut by the central bank',
          ],
          correctIndex: 1,
          explanation: 'A bear market is defined as a decline of 20% or more from recent highs. It reflects widespread pessimism and selling. Historically, bear markets have lasted 9-18 months on average.',
        },
      },
    ],
  },
  {
    id: 4,
    title: 'Investing Mindset',
    subtitle: 'Emotions are your biggest risk',
    color: '#EC4899',
    bgColor: '#F4E1E1',
    icon: '🧠',
    lessons: [
      {
        id: 'm4-l1',
        title: 'Fear & Greed Cycle',
        icon: '🎭',
        content: 'Most investors lose money because of emotions. When prices rise, greed makes you buy at the top. When prices crash, fear makes you sell at the bottom. This is the #1 wealth destroyer.',
        analogy: 'Imagine everyone is selling ice cream in winter (bear market). Nobody wants it, the price drops to nothing. You run away screaming "ice cream is dead!" Then summer comes, and everyone wants ice cream — but you already sold your ice cream stand at a loss. That is panic selling.',
        keyTakeaway: 'The best investors do the opposite of what their emotions tell them to do.',
        quiz: {
          question: 'What is the most common mistake beginner investors make?',
          options: [
            'Investing too little money',
            'Buying when prices are high (greed) and selling when prices drop (fear)',
            'Not checking their portfolio often enough',
            'Diversifying too much',
          ],
          correctIndex: 1,
          explanation: 'Emotional investing — buying high out of FOMO and selling low out of fear — is the #1 wealth destroyer. Having a plan and sticking to it is more important than picking the "right" stock.',
        },
      },
      {
        id: 'm4-l2',
        title: 'Dollar-Cost Averaging',
        icon: '📅',
        content: 'Instead of trying to time the market, invest a fixed amount every month regardless of price. When prices are high, you buy fewer shares. When prices are low, you buy more. Over time, your average cost evens out.',
        analogy: 'DCA is like buying groceries every week. Some weeks apples are $1, some weeks $2. If you buy $10 worth every week, you naturally buy more when they are cheap and less when expensive. You do not need to predict apple prices!',
        keyTakeaway: 'Consistency beats timing. Invest regularly, not reactively.',
        quiz: {
          question: 'How does dollar-cost averaging help investors?',
          options: [
            'It guarantees profits',
            'It eliminates all risk',
            'It removes emotion by investing a fixed amount regularly regardless of price',
            'It only works in bull markets',
          ],
          correctIndex: 2,
          explanation: 'DCA removes the pressure to time the market. By investing consistently, you buy more shares when prices are low and fewer when prices are high, smoothing out your average cost over time.',
        },
      },
      {
        id: 'm4-l3',
        title: 'Patience & Long-Term Thinking',
        icon: '🌳',
        content: 'The stock market rewards patience. If you had invested $1,000 in the S&P 500 30 years ago, it would be worth over $20,000 today — despite crashes, recessions, and wars. Time in the market beats timing the market.',
        analogy: 'Investing is like planting a tree. You do not dig it up every day to check the roots. You water it, give it sunlight, and let it grow. The people who get rich from trees are the ones who planted them 20 years ago and forgot about them.',
        keyTakeaway: 'The best time to start investing was yesterday. The second best time is today.',
        quiz: {
          question: 'What matters more for long-term wealth?',
          options: [
            'Picking the perfect stock at the perfect time',
            'Investing regularly and holding for many years',
            'Watching the market every day',
            'Following financial news on social media',
          ],
          correctIndex: 1,
          explanation: 'Time in the market beats timing the market. Consistent investing over decades, even in simple index funds, has outperformed most "expert" stock-picking strategies.',
        },
      },
    ],
  },
];
