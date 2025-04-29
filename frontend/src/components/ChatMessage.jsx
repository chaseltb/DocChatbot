const ChatMessage = ({ message, isUser }) => (
    <div
      className={`my-2 px-4 py-2 rounded-2xl max-w-xl w-fit shadow-md text-sm md:text-base ${
        isUser
          ? "bg-[#8b5cf6] text-white ml-auto"
          : "bg-white text-[#1e293b] mr-auto"
      }`}
    >
      {message}
    </div>
  );
  
  export default ChatMessage;
  