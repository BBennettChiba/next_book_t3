type Props = {
  text: string;
  id: number;
};

export default function ParagraphWithoutComment({ text, id }: Props) {
  return (
    <div>
      <p id={id.toString()}>{text}</p>
    </div>
  );
}
