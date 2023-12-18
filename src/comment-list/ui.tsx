import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

import { ICommentList } from "./types";
import style from "./styles.module.css";

export default function CommentList() {
  const [open, setOpen] = React.useState(false);
  const [selectedComment, setSelectedComment] = React.useState("");
  const [options, setOptions] = React.useState<readonly ICommentList[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleInputChange = (event: any) => {
    setSelectedComment(event.target.value);
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!selectedComment) return;
      getCommentList();
      console.log(selectedComment, "use effffffffff");
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [selectedComment, 500]);

  async function getCommentList() {
    if (options.length === 0 || selectedComment) {
      console.log(`selectedComment ${selectedComment}`);
      setLoading(true);
      await sleep(1e3);
      const baseURL = `https://jsonplaceholder.typicode.com/comments?q=${selectedComment}`;
      axios.get(baseURL).then((response) => {
        setOptions(response.data);
        setLoading(false);
        console.log(response.data);
      });
    }
  }

  React.useEffect(() => {
    return () => {
      setOptions([]);
    };
  }, []);
  console.log(` loading ${loading}`);
  return (
    <Autocomplete
      id="sber_test"
      sx={{ width: 350 }}
      open={open}
      onOpen={() => {
        getCommentList();
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
        setSelectedComment("");
      }}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          value={selectedComment}
          onChange={handleInputChange}
          {...params}
          label="Ведите запрос"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(props, option, { index }) => {
        const findWords = option.name.split("");
        return (
          <li {...props}>
            <div
              onClick={() => setSelectedComment(option?.name)}
              className={index % 2 === 0 ? style.evenCard : style.oddCard}
            >
              <div>
                <span style={{ color: "green" }}>name:</span>{" "}
                {findWords.map((word, index) => {
                  return (
                    <span
                      key={index}
                      className={`${
                        selectedComment && selectedComment.includes(word) && style.fontView
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
              <div>
                {" "}
                <span style={{ color: "green" }}>email: </span>
                {option.email}
              </div>
              <div>
                {" "}
                <span style={{ color: "green" }}>body: </span>
                {option.body}
              </div>
            </div>
          </li>
        );
      }}
    />
  );
}

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}
