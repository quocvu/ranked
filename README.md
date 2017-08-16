[![Build Status](http://img.shields.io/travis/quocvu/ranked.svg)](https://travis-ci.org/quocvu/ranked)
[![Coverage Status](https://img.shields.io/coveralls/quocvu/ranked.svg)](https://coveralls.io/github/quocvu/ranked)
[![NPM Downloads](https://img.shields.io/npm/dt/ranked.svg)](https://www.npmjs.com/package/ranked)
[![NPM Version](https://img.shields.io/npm/v/ranked.svg)](https://www.npmjs.com/package/ranked)


# Strategies to assign ranks

In most cases, a sorting function is a best tool to make a ranking. But how
about tie scores? You may end up with giving different ranks for tie scores.
And I'm quite sure that will make your users dissatisfied.

Solution? You are on the right page.

This module provides various ranking strategies to assign correct ranks to tie
scores.  It comes with [5 most common strategies](http://en.wikipedia.org/wiki/Ranking#Strategies_for_assigning_rankings):
`competition`, `modified-competition`, `dense`, `ordinal`, and `fractional`.


## Installation

    npm install ranked

## Usage

Suppose we want to rank an array of computer languages by the year they were
introduced.

```
const languages = [
  { name: 'Javascript', year: 1995 },
  { name: 'Java', year: 1995 },
  { name: 'C#', year: 2001 },
  { name: 'Groovy', year: 2003 },
  { name: 'Scala', year: 2003 },
  { name: 'Go', year: 2009 },
];
```

We need to provide a function allowing to access the attribute to rank on
(the year in this case).  The function must accept one item of the array and
return the value of the field to rank on.

```
const scoreFn = language => language.year;
```

Let's run the ranking operation on this list of languages

```
var ranked = require('ranked');
var rankedItems = ranked.ranking(languages, scoreFn);
```

The `rankedItems` is an array that looks like below.  By default, it sorts
by descending order, using the `competition` strategy, and starts ranking at 1

```
[ { rank: 1, item: { name: 'Go', year: 2009 } },
  { rank: 2, item: { name: 'Groovy', year: 2003 } },
  { rank: 2, item: { name: 'Scala', year: 2003 } },
  { rank: 4, item: { name: 'C#', year: 2001 } },
  { rank: 5, item: { name: 'Javascript', year: 1995 } },
  { rank: 5, item: { name: 'Java', year: 1995 } } ]
```

To change the ranking strategy, use the third optional parameter.

```
var rankedItems = ranked.ranking(items, scoreFn, { strategy: 'dense' });
```

To sort in ascending order

```
var rankedItems = ranked.ranking(items, scoreFn, { reverse: true });
```

To start ranking at any number (e.g. 5)

```
var rankedItems = ranked.ranking(items, scoreFn, { start: 5 });
```

## License

[MIT](https://github.com/trentm/node-bunyan/blob/master/LICENSE.txt)
