import React from 'react';
import { MdArrowForwardIos } from "react-icons/md";
import { CgDetailsMore } from "react-icons/cg";
const QuestionItem = ({ selectedQuestion, toggleSidebar }) => {
  return (
    <div className="bg-blue-950 rounded-lg px-4 sm:h-[87vh] py-2 flex flex-col">
            <h2 className="text-lg font-semibold mb-2 overflow-auto cursor-pointer flex items-center justify-between" onClick={toggleSidebar}>Questions <CgDetailsMore className='size-6' />            </h2>
            <div
              id="questions"
              className="flex-1 p-4 text-sm bg-gray-300 text-blue-950 rounded-lg overflow-y-auto border border-gray-700"
            >
              
              {selectedQuestion ? (
                <>
                  <p className="font-semibold">{selectedQuestion.question.id}. {selectedQuestion.question.name}</p>
                  <p>Topic: {selectedQuestion.question.topic}</p>
                  <p className='font-semibold text-xs text-justify'>Companies: {selectedQuestion.question.companies}</p>

                  <code className="block p-2 bg-slate-600 text-justify text-white rounded mt-2">
                    {selectedQuestion.question.description}
                  </code>
                  <br/>
                  <p className="font-semibold">Answer:</p>
                  <code className="block p-2 bg-slate-600 text-white rounded mt-2">
                    {selectedQuestion.question.answer}
                  </code>
                </>
              ) : (
                <p>Select a question to view details.</p>
              )}


            </div>
          </div>
  );
};

export default QuestionItem;
