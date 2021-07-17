import React, { useEffect, useState, FC } from "react";
import { Box, Text, useApp, useInput, useFocus, useFocusManager } from "ink";
import fetch from "node-fetch";
import { exec } from "child_process";

const Story: FC<{ id: number }> = ({ id }) => {
	const [story, setStory] = useState({
		title: "lorem",
		score: 0,
		url: "",
	});
	const { isFocused } = useFocus();

	useEffect(() => {
		fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
			.then((r) => r.json())
			.then((json) => setStory(json));
	}, [id]);

	const { title, score, url } = story;
	useInput((input, key) => {
		isFocused &&
			(key.return || input === " ") &&
			exec(`open ${url}`);
	});
	return (
		<Box borderStyle="round" borderColor={isFocused ? "blue" : ""}>
			<Text>{title}</Text>
			<Text> ({score})</Text>
		</Box>
	);
};

const App: FC = () => {
	const [stories, setStories] = useState([]);
	useEffect(() => {
		fetch(
			"https://hacker-news.firebaseio.com/v0/topstories.json",
			{}
		)
			.then((r) => r.json())
			.then((json) => setStories(json));
	}, []);
	const { exit } = useApp();
	const { focusNext, focusPrevious } = useFocusManager();
	useInput((input, _key) => {
		input === "q" && exit();
		input === "j" && focusNext();
		input === "k" && focusPrevious();
	});
	return (
		<Box
			flexDirection="column"
			flexGrow={1}
			width="100%"
			height="100%"
		>
			<Box borderStyle="round" padding={1}>
				<Text color="green">Read Hacker News</Text>
			</Box>
			<Box flexDirection="column">
				{stories.slice(0, 10).map((s) => (
					<Story id={s} />
				))}
			</Box>
		</Box>
	);
};

module.exports = App;
export default App;
// ⇢ ⇀ ↦ ⇾
