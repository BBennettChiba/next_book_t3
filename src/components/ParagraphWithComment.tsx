import React, { useState } from "react";
import { InferQueryOutput } from "../utils/trpc";

type Comments = ReturnType<InferQueryOutput<"comment.getBy">["get"]>;
type Comment = NonNullable<Comments>[number];

type Props = {
  comments: Comments;
  text: string;
  id: number;
  fullText: string[];
};

export default function ParagraphWithComment({
  comments,
  text,
  id,
  fullText,
}: Props) {
  const [isHighlighted, setIsHighlighted] = useState(
    comments!.map(() => false)
  );
  /**@TODO fix muleitple paragraph layer problem*/
  const layerdText = comments?.map((com, i) => {
    const spansMultipleParagraphs = com.startIndex !== com.endIndex;
    if (spansMultipleParagraphs) {
      return createMultipleParagraphHighlight(com, i);
    }
    const a = text.slice(0, com.startOffset);
    const b = text.slice(com.startOffset, com.endOffset);
    const c = text.slice(com.endOffset);
    return (
      <p
        key={com.id}
        id={id.toString()}
        className="absolute m-0"
        style={{ zIndex: i * -1, color: "rgba(0, 0, 0, 0.5)" }}
      >
        {a}
        <span className={isHighlighted[i] ? "bg-yellow-200" : ""}>{b}</span>
        {c}
      </p>
    );
  });

  const onMouseEnter = (index: number) => {
    setIsHighlighted((prev) => {
      const newPrev = [...prev];
      newPrev[index] = true;
      return newPrev;
    });
  };
  const onMouseLeave = (index: number) => {
    setIsHighlighted((prev) => {
      const newPrev = [...prev];
      newPrev[index] = false;
      return newPrev;
    });
  };

  return (
    <div className="">
      {comments!.map((comment, i) => (
        <div
          onMouseEnter={() => onMouseEnter(i)}
          onMouseLeave={() => onMouseLeave(i)}
          key={comment.id}
        >
          !
        </div>
      ))}
      <div className="relative">
        {layerdText}
        <p className="opacity-1 m-0" id={id.toString()}>
          {text}
        </p>
      </div>
    </div>
  );

  function createMultipleParagraphHighlight(comment: Comment, index: number) {
    const thisSelection = fullText.slice(
      comment.startIndex,
      comment.endIndex + 1
    );
    const firstParagraph = thisSelection.at(0)!;
    const lastParagraph = thisSelection.at(-1)!;
    const firstParagraphNonHighlighted = firstParagraph.slice(
      0,
      comment.startOffset
    );
    const firstParagraphHighlighted = firstParagraph.slice(comment.startOffset);
    const output = [];
    output.push(
      <>
        <p
          key={comment.id}
          id={id.toString()}
          className="absolute m-0"
          style={{ zIndex: index * -1, color: "rgba(0, 0, 0, 0.5)" }}
        >
          {firstParagraphNonHighlighted}
          <span className={`${isHighlighted[index] ? "bg-yellow-200" : ""}`}>
            {firstParagraphHighlighted}
          </span>
        </p>
        <p className="opacity-0">{firstParagraph}</p>
      </>
    );
    const middleParagraphs = thisSelection.slice(1, -1);
    for (const paragraph of middleParagraphs) {
      output.push(
        <>
          <p className="absolute m-0">
            <span className={`${isHighlighted[index] ? "bg-yellow-200" : ""}`}>
              {paragraph}
            </span>
          </p>
          <p className="opacity-0">{paragraph}</p>
        </>
      );
    }
    const lastParagraphHighlighted = lastParagraph.slice(0, comment.endOffset);
    const lastParagraphNonHighlighted = lastParagraph.slice(comment.endOffset);
    output.push(
      <>
        <p className="absolute m-0">
          <span className={`${isHighlighted[index] ? "bg-yellow-200" : ""}`}>
            {lastParagraphHighlighted}
          </span>
          {lastParagraphNonHighlighted}
        </p>
        <p className="opacity-0">{lastParagraph}</p>
      </>
    );
    return output;
  }
}
//**@TODO fix overlap and key issus */
