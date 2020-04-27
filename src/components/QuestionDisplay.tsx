import React, { useState, useContext } from "react";
import {
  Paper,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Snackbar
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useParams, useHistory } from "react-router";
import { useQuestionStyles } from "../classes";
import { Question } from "../types";
import hash from "hash.js";
import copy from "clipboard-copy";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooksOutlined";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Context from "../AppContext";

const QuestionDisplay = () => {
  const { managedQuestions } = useContext(Context);
  const [copied, setCopied] = useState(false);
  const params: { questionTitle?: string } = useParams();
  const history = useHistory();
  const classes = useQuestionStyles();
  const title: string =
    params.questionTitle !== undefined ? params.questionTitle : "";

  const question: Question = managedQuestions.questions.filter(
    (question: Question) => {
      return (
        hash
          .sha1()
          .update(question.title)
          .digest("hex") === title
      );
    }
  )[0];

  return (
    <>
      <Button
        color="secondary"
        className={classes.button}
        variant="contained"
        onClick={() => {
          history.goBack();
        }}
      >
        {" "}
        <ArrowBackIosIcon /> Back
      </Button>
      <Paper elevation={0} className={classes.root}>
        {question ? (
          <div>
            <Box>
              {question.integration ? (
                <div>
                  <img
                    style={{ margin: "auto", width: "2em" }}
                    src={`https://raw.githubusercontent.com/JupiterOne/docs/master/assets/icons/${
                      managedQuestions.integrations[question.integration].type
                    }.svg`}
                  />
                  <Typography
                    style={{ position: "relative", top: "-7px" }}
                    variant="subtitle1"
                    component="span"
                  >
                    {" "}
                    {managedQuestions.integrations[question.integration].title}
                  </Typography>
                </div>
              ) : null}
            </Box>
            <Box className={classes.title}>
              <Typography variant="h6" className={classes.titleText}>
                {question.title}
              </Typography>
              {question.tags === undefined ||
                question.tags.map((tag: string) => (
                  <Chip
                    key={tag}
                    className={classes.tag}
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      window.location.replace(
                        `/filter?tags=${tag}&tagFilter=all`
                      );
                    }}
                    label={tag}
                  />
                ))}
            </Box>
            <Box className={classes.description}>{question.description}</Box>
            <br />
            <Typography>Queries</Typography>
            <Box>
              {(question.queries || []).map((query: any) => (
                <Box key={query.query} style={{ display: "flex" }} mt={2} m={0}>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      copy(query.query);
                      setCopied(true);
                    }}
                    children={<LibraryBooksIcon />}
                  />
                  <code
                    style={{ marginTop: "1em" }}
                    className={classes.queryBox}
                  >
                    {query.query}
                  </code>
                </Box>
              ))}
            </Box>
            <Snackbar
              open={copied}
              autoHideDuration={3000}
              onClose={() => setCopied(false)}
            >
              <Alert severity="success">Query copied to clipboard.</Alert>
            </Snackbar>
          </div>
        ) : (
          <div>Nothing to display.</div>
        )}
      </Paper>
    </>
  );
};

export default QuestionDisplay;
