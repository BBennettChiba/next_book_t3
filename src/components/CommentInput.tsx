import { useState } from "react";

type Props = {
  position: { x: number; y: number };
  innerRef: React.MutableRefObject<HTMLDivElement>;
  submit: (comment: string) => void;
};

export default function CommentBox({ position, innerRef, submit }: Props) {
  const [text, setText] = useState("");

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    setText(e.currentTarget.value);
  }

  return (
    <div ref={innerRef}>
      <div
        className='flex flex-col fixed m-2 p-2 rounded-md bg-slate-300 border-slate-300 border-1'
        style={{ top: position.y, left: position.x }}
      >
        <div>Please input your comment</div>
        <textarea
          className='relative h-40 w-96 m-3'
          value={text}
          onChange={handleInput}
        ></textarea>
        <button onClick={() => submit(text)}>
          Submit
        </button>
      </div>
    </div>
  );
}
