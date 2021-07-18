import React, { useEffect, useState, FC } from "react";
import { Box, Text, useApp, useInput, useFocus, useFocusManager } from "ink";
import { exec } from "child_process";
import { topStories, Story } from "./hn-api";

const Story: FC<{ story: Story }> = ({ story }) => {
  const { isFocused } = useFocus();
  const { title, score, url } = story;

  useInput((input, key) => {
    isFocused && (key.return || input === " ") && exec(`open ${url}`);
  });

  return (
    <Box
      paddingLeft={1}
      borderStyle="round"
      borderColor={isFocused ? "blue" : ""}
    >
      <Text>{title}</Text>
      <Box marginLeft={1}>
        <Text>({score})</Text>
      </Box>
    </Box>
  );
};

const Title: FC = () => (
  <Box borderStyle="round" padding={1}>
    <Text color="green">Read Hacker News</Text>
  </Box>
);

const App: FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  // const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    topStories(10).then((json) => setStories(json));
  }, []);

  const { exit } = useApp();
  const { focusNext, focusPrevious } = useFocusManager();

  useInput((input, _key) => {
    input === "q" && exit();
    input === "j" && focusNext();
    input === "k" && focusPrevious();
  });

  return (
    <Box flexDirection="column" flexGrow={1} width="100%" height="100%">
      <Title />
      <Box flexDirection="column">
        {stories.slice(0, 10).map((s) => (
          <Story story={s} />
        ))}
      </Box>
    </Box>
  );
};

module.exports = App;
export default App;
