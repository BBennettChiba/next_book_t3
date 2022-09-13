export default function CommentBox({ comment }: { comment: any }) {
  return (
    <div className='fixed h-48 w-72 border-black bg-gray-400'>
      <div>author: {comment.user.name}</div>
      <div>content: {comment.content}</div>
    </div>
  );
}
