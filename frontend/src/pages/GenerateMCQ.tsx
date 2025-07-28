import React, { useState } from "react";
import axios from "@/lib/axiosInstance";
import { Upload, Send, Paperclip, X, FileText, MessageSquare, Brain } from "lucide-react";

interface MCQ {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  mcqs?: MCQ[];
}

const GenerateMCQ: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [feedback, setFeedback] = useState<{ [key: number]: string }>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleGenerateQuiz = async () => {
    if (!file && !prompt.trim()) {
      setError("Please upload a file or enter a prompt.");
      return;
    }

    setError(null);
    setLoading(true);
    setSelectedAnswers({});
    setFeedback({});

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("prompt", prompt || "");

      const res = await axios.post("/mcq/generate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const mcqs = res.data.mcqs;
      const displayPrompt = prompt || file?.name || "Uploaded file";

      addMessage({ id: Date.now().toString(), type: "user", content: displayPrompt });
      addMessage({ id: (Date.now() + 1).toString(), type: "bot", content: "", mcqs });

      setPrompt("");
      setFile(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to generate MCQs");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerClick = (questionIndex: number, option: string, correctAnswer: string) => {
    if (selectedAnswers[questionIndex]) return; // Don't allow changing answer after selection

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));

    const isCorrect = option === correctAnswer;
    setFeedback((prev) => ({
      ...prev,
      [questionIndex]: isCorrect ? "correct" : "incorrect",
    }));
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return <FileText className="h-4 w-4 text-blue-600" />;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">MCQ Quiz Generator</h1>
            <p className="text-sm text-gray-500">Generate multiple choice questions from your files or prompts</p>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Ready to Generate MCQs?</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Upload a document or enter a topic to generate multiple choice questions with explanations
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-3xl ${msg.type === "user" ? "ml-12" : "mr-12"}`}>
                    {msg.type === "user" ? (
                      <div className="bg-blue-600 text-white rounded-2xl px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-4 w-4" />
                          <span className="font-medium">You</span>
                        </div>
                        <p className="mt-1">{msg.content}</p>
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-2">
                            <Brain className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-gray-900">MCQ Generator</span>
                          </div>
                        </div>
                        
                        {msg.mcqs ? (
                          <div className="p-4">
                            <div className="space-y-6">
                              {msg.mcqs.map((mcq, index) => {
                                const selected = selectedAnswers[index];
                                const isCorrect = selected === mcq.answer;
                                return (
                                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-start space-x-3 mb-4">
                                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                                      </div>
                                      <p className="font-medium text-gray-900 leading-relaxed">{mcq.question}</p>
                                    </div>
                                    
                                    <div className="ml-9 space-y-2">
                                      {mcq.options.map((option, i) => {
                                        const isSelected = selected === option;
                                        let optionStyle = "bg-white border-gray-200 hover:border-gray-300 text-gray-700";
                                        
                                        if (selected) {
                                          if (option === mcq.answer) {
                                            optionStyle = "bg-green-50 border-green-300 text-green-800";
                                          } else if (isSelected) {
                                            optionStyle = "bg-red-50 border-red-300 text-red-800";
                                          }
                                        }

                                        return (
                                          <button
                                            key={i}
                                            onClick={() => handleAnswerClick(index, option, mcq.answer)}
                                            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 ${optionStyle} ${
                                              !selected ? "hover:shadow-sm" : ""
                                            } ${isSelected ? "font-medium" : ""}`}
                                            disabled={!!selected}
                                          >
                                            <div className="flex items-center space-x-3">
                                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                selected && option === mcq.answer ? "border-green-500 bg-green-500" :
                                                selected && isSelected ? "border-red-500 bg-red-500" :
                                                "border-gray-300"
                                              }`}>
                                                {selected && (option === mcq.answer || isSelected) && (
                                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                                )}
                                              </div>
                                              <span>{option}</span>
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {feedback[index] && (
                                      <div className="ml-9 mt-4 p-4 bg-white rounded-lg border border-gray-200">
                                        <div className="flex items-center space-x-2 mb-2">
                                          <div className={`w-2 h-2 rounded-full ${isCorrect ? "bg-green-500" : "bg-red-500"}`}></div>
                                          <span className={`font-semibold text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                                            {isCorrect ? "Correct!" : "Incorrect"}
                                          </span>
                                        </div>
                                        <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                                          <strong className="text-gray-900">Explanation:</strong> {mcq.explanation}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="p-4">
                            <p className="text-gray-700">{msg.content}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-3xl mr-12">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-gray-900">MCQ Generator</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                          <span className="text-gray-600">Generating MCQs...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          {/* File attachment display */}
          {file && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.name)}
                  <div>
                    <p className="text-sm font-medium text-blue-900">{file.name}</p>
                    <p className="text-xs text-blue-600">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-1 hover:bg-blue-200 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-blue-600" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-end space-x-3">
            {/* File Upload Button */}
            <div className="relative">
              <input
                type="file"
                accept=".doc,.docx,.pdf,.ppt,.pptx,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors flex items-center justify-center"
                title="Upload file"
              >
                <Paperclip className="h-5 w-5 text-gray-500" />
              </label>
            </div>

            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                placeholder="Enter a topic or question prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerateQuiz();
                  }
                }}
                className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleGenerateQuiz}
              disabled={loading || (!file && !prompt.trim())}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center justify-center"
              title="Generate MCQs"
            >
              <Send className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="mt-2 text-xs text-gray-500 text-center">
            Upload a document or enter a prompt to generate MCQs • Press Enter to send
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateMCQ;