import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import CommentBox from "./CommentInput";
import { trpc } from "../utils/trpc";
import ParagraphWithoutComment from "./ParagraphWithoutComment";
import ParagraphWithComment from "./ParagraphWithComment";

const rangy =
  typeof window !== "undefined" &&
  typeof document !== "undefined" &&
  require("rangy");
typeof window !== undefined &&
  typeof document !== "undefined" &&
  require("rangy/lib/rangy-classapplier");
typeof window !== undefined &&
  typeof document !== "undefined" &&
  require("rangy/lib/rangy-highlighter");

const START_DATA = { startIndex: 0, endIndex: 0, startOffset: 0, endOffset: 0 };

const Chapter = ({ title, chapter }: { title: string; chapter: string }) => {
  const commentQuery = trpc.useQuery(["comment.getBy", { title, chapter }]);
  const commentMutation = trpc.useMutation("comment.create");
  const textQuery = trpc.useQuery(["text.getText", { title, chapter }]);
  const text = textQuery.data;

  const [isCommentBoxOpen, setIsCommonBoxOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const highlighter = useRef<Highlighter | null>(null);
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [selectionData, setSelectionData] = useState<Selection>(START_DATA);

  function checkHighlight(event: React.MouseEvent<HTMLDivElement>) {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      highlighter.current?.removeAllHighlights();
      setSelectionData(START_DATA);
      return setIsCommonBoxOpen(false);
    }
    if (isCommentBoxOpen || window.getSelection()?.toString() === "") {
      return;
    }
    createSelection();
    insert();
    setPosition({ x: event.clientX, y: event.clientY });
    setIsCommonBoxOpen(true);
  }

  function createSelection() {
    const range = window.getSelection();
    if (!range) return;
    const parent = range.anchorNode?.parentElement;
    const startIndex = Number(parent?.getAttribute("id"));
    if (!startIndex) return;
    const endIndex = Number(range.focusNode?.parentElement?.getAttribute("id"));
    if (!endIndex) return;
    const startOffset = range.anchorOffset;
    const endOffset = range.focusOffset;
    setSelectionData({
      startIndex,
      endIndex,
      startOffset,
      endOffset,
    });
  }

  useEffect(() => {
    highlighter.current = rangy.createHighlighter();
    highlighter.current!.addClassApplier(rangy.createClassApplier("highlight"));
  }, []);

  function insert() {
    highlighter.current?.highlightSelection("highlight");
  }

  async function submit(content: string) {
    commentMutation.mutate({ ...selectionData, content, title, chapter });
    setIsCommonBoxOpen(false);
  }

  /**
   * @TODO on hover change color entire comment
   * @todo on click of highlighted area see comment and metadata
   * @todo allow for multiple comments on one paragraph
   */

  function addText(textToParse: typeof text) {
    // const hasComment = (paragraph: Text): paragraph is Required<Text> =>
    //   "comment" in paragraph;
    if (!textToParse) return;
    const output: JSX.Element[] = [];
    for (let i = 0; i < textToParse.length; i++) {
      const paragraph = textToParse[i]!;
      const comments = commentQuery.data?.get(i);
      if (comments) {
        const lengthOfLongestMultipleParagraphComments = Math.max(
          ...comments
            .filter((c) => c.startIndex !== c.endIndex)
            .map((c) => c.endIndex - c.startIndex)
        );
        output.push(
          <ParagraphWithComment
            key={i}
            comments={comments}
            text={paragraph}
            fullText={textToParse}
            id={i}
          />
        );
        if (lengthOfLongestMultipleParagraphComments > 0) {
          i += lengthOfLongestMultipleParagraphComments;
        }
        continue;
      } else {
        output.push(
          <ParagraphWithoutComment key={i} text={paragraph} id={i} />
        );
      }
    }
    return output;
  }

  return (
    <>
      <Head>
        <title>My page title</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <article className="container mt-0 mx-auto" onMouseUp={checkHighlight}>
        {addText(text)}
        {isCommentBoxOpen && (
          <CommentBox submit={submit} innerRef={ref} position={position} />
        )}
      </article>
    </>
  );
};

declare global {
  interface Node {
    data: string;
  }
  interface RangyStatic {
    createHighlighter(): Highlighter;
    createClassApplier(className: string): ClassApplier;
  }
  interface Highlighter {
    highlightSelection(className: string): void;
    removeAllHighlights(): void;
    addClassApplier(applier: ClassApplier): void;
  }
  interface ClassApplier {
    addClass(element: Element, className: string): void;
  }
}
type Selection = {
  startIndex: number;
  endIndex: number;
  startOffset: number;
  endOffset: number;
};
export default Chapter;
