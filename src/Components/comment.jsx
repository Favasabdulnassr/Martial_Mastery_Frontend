import React, { useEffect, useState } from 'react';
import { MessageCircle, Send, Reply, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import axiosInstance from '@/services/interceptor';
import { toast } from 'react-toastify';
import Modal from './Modal/ModalPortal';
import DeleteCommentModal from './Modal/CommentDelete';
import { useSelector } from 'react-redux';

const Comment = ({ comment, onReply, onDelete, onUpdate, currentUser, replyTo, onSubmitReply, onCancelReply }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isRepliesHidden, setIsRepliesHidden] = useState(true);




  const hasReplies = comment.replies && comment.replies.length > 0;

  const isAuthor = currentUser?.email === comment.user.email;

  const toggleRepliesVisibility = () => {
    setIsRepliesHidden(!isRepliesHidden);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };



  const handleUpdate = async () => {
    await onUpdate(comment.id, editContent);
    setIsEditing(false);
  };

  const handleDeleteConfirm = () => {
    onDelete(comment.id);
    setIsModalOpen(false);
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    onSubmitReply(replyContent);
    setReplyContent('');
  };


  // const isAuthor = currentUser?.id === comment.user.id;
  const isReplying = replyTo === comment.id;


  return (
    <div className="flex space-x-4" style={{ marginLeft: `${comment.parent ? '2rem' : '0'}` }}>
      <div
        className={'w-10 h-10 rounded-full flex items-center justify-center bg-gray-500 text-white font-semibold'}
      >
        
          {comment.user.name[0].toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-white">{comment.user.name}</span>
          <span className={`px-2 py-0.5 rounded text-xs ${comment.user.role === 'tutor' ? 'bg-cyan-500' : 'bg-violet-500'
            }`}>
            {comment.user.role}
          </span>
          <span className="text-gray-400 text-sm">{comment.time_ago}</span>



          {isAuthor && (
            <>
              <button
                className="flex items-center space-x-1 p-4 text-gray-400 hover:text-white"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                className="flex items-center space-x-1 text-gray-400 hover:text-red-400"
                onClick={handleDeleteClick}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-cyan-400"
              rows="3"
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-gray-200">{comment.content}</p>
        )}

        <div className="flex items-center space-x-4 mt-2">

          <button
            className="flex items-center space-x-1 text-gray-400 hover:text-white"
            onClick={() => onReply(comment.id)}
          >
            <Reply className="w-4 h-4" />
            <span>Reply</span>
          </button>



          {hasReplies && (
            <button
              className="flex items-center space-x-1 text-gray-400 hover:text-white"
              onClick={toggleRepliesVisibility}
            >
              {isRepliesHidden ? (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Show Replies ({comment.replies.length})</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Hide Replies</span>
                </>
              )}
            </button>
          )}
        </div>


        {isReplying && (
          <form onSubmit={handleSubmitReply} className="mt-4">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-cyan-400"
              rows="3"
            />
            <div className="flex space-x-2 mt-2">
              <button
                type="submit"
                className="px-3 py-1 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400"
              >
                Post Reply
              </button>
              <button
                type="button"
                onClick={() => onCancelReply()}
                className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {comment.replies && !isRepliesHidden && comment.replies.map(reply => (
          <Comment
            key={reply.id}
            comment={reply}
            onReply={onReply}
            onDelete={onDelete}
            onUpdate={onUpdate}
            currentUser={currentUser}
            replyTo={replyTo}
            onSubmitReply={onSubmitReply}
            onCancelReply={onCancelReply}
          />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <DeleteCommentModal
          onClose={handleCloseModal}
          onConfirm={handleDeleteConfirm}
        />

      </Modal>



    </div>
  );
};


const CommentsSection = ({ lessonId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pointer, setPointer] = useState(false)
  const { user } = useSelector((state) => state.login);


  useEffect(() => {

    fetchComments();
  }, [lessonId, pointer]);

  const handlePointer = () => {
    setPointer((prev) => !prev)
  }



  const fetchComments = async () => {
    try {
      setIsLoading(true);
       // Add a short delay only when the component mounts
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await axiosInstance.get(`comments/lessons/${lessonId}/`);


      setComments(response.data);
      // Assuming user info is available in the response or through another API
    } catch (error) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      const response = await axiosInstance.post(`comments/lessons/${lessonId}/create/`, {
        content: newComment,
        parent_id: replyTo
      });


      handlePointer()
      setNewComment('');
      setReplyTo(null);
      toast.success('comment Added successfully')


    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`comments/${commentId}/`);
      setComments(prevComments =>
        prevComments.filter(comment => comment.id !== commentId)
      );

      handlePointer()
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment');
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      const response = await axiosInstance.put(`comments/${commentId}/`, {
        content
      });
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId ? { ...comment, ...response.data } : comment
        )

      );
      setError('');
      handlePointer()

    } catch (error) {
      console.error('Error updating comment:', error);
      setError('Failed to update comment');
    }
  };




  const handleSubmitReply = async (content) => {
    if (!content.trim()) return;

    try {
      await axiosInstance.post(`comments/lessons/${lessonId}/create/`, {
        content: content,
        parent_id: replyTo
      });

      handlePointer();
      setReplyTo(null);
      toast.success('Reply added successfully');
    } catch (error) {
      console.error('Error posting reply:', error);
      setError('Failed to post reply');
    }
  };




  if (isLoading) {
    return <div className="text-white text-center py-8">Loading comments...</div>;
  }


  return (
    <div className="mt-6 p-6 bg-[#0a0a0a] rounded-xl">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="w-6 h-6 text-cyan-400" />
        <h2 className="text-xl font-semibold text-white">Discussion</h2>
        <span className="bg-gray-700 px-2 py-1 rounded text-sm text-gray-300">
          {comments.length} comments
        </span>
      </div>

      <form onSubmit={handleSubmitComment} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={"Ask a question or share your thoughts..."}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          rows="3"
        />

        <div className="flex justify-between mt-2">

          <button
            type="submit"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black rounded-lg hover:from-cyan-400 hover:to-cyan-300 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Post Comment</span>
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={setReplyTo}
            onDelete={handleDeleteComment}
            onUpdate={handleUpdateComment}
            currentUser={user}
            replyTo={replyTo}
            onSubmitReply={handleSubmitReply}
            onCancelReply={() => setReplyTo(null)}
          />
        ))}
      </div>




    </div>

  );
};

export default CommentsSection;