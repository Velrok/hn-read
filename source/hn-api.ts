import assert from "assert/strict";
import fetch from "node-fetch";

type Url = string;
type Id = number;
type Type = "job" | "story" | "comment" | "poll" | "pollopt";
type TimeStamp = number;

interface Item {
  id: Id;
  deleted: boolean;
  type: Type;
  text: string;
  parent: Item;
  kids: number[];
  url: Url;
  score: number;
  title: string;
  by: string;
  time: TimeStamp;
}

export interface Story extends Item {
  type: "story";
}

export interface Comment extends Item {
  type: "comment";
}

export const fetchItem: (id: Id) => Promise<Item[]> = (id) =>
  fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((r) =>
    r.json()
  );

export const topStories: (count: number) => Promise<Story[]> = (count) => {
  assert.ok(count > 0, "You need to fetch at least 1 story.");
  return fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {})
    .then((r) => r.json())
    .then((ids) => {
      return Promise.all(ids.slice(0, count).map(fetchItem));
    });
};
