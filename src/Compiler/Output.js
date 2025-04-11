import { loadModule } from 'ace-builds/src-noconflict/ace';
import React from 'react'

function Output({ loading, output, closeOutput, toggleAssistant }) {
  return (
    <section className="absolute w-11/12 z-50 sm:w-1/3 h-[99vh] -top-8 right-0 bg-blue-950 rounded-lg px-4 py-2">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Output</h2>
        <button
          onClick={closeOutput}
          className=" text-2xl text-white p-2 rounded-md "
        >
          
          <b>x</b>
        </button>
        
      </div>
      {loading?(
        <textarea
        id="output"
        value={'Loading...'}
        readOnly
        className="w-full h-[86vh] p-4 relative rounded-lg bg-gray-900 border border-gray-700"
      >

      </textarea>
      ):(
        <div className='w-full relative'>        <textarea
        id="output"
        value={output}
        readOnly
        className="w-full h-[86vh] p-4 rounded-lg bg-gray-900 border border-gray-700"
      >
       
      </textarea>
      <button
              onClick={toggleAssistant}
              className="bg-blue-950 h-12 absolute bottom-3 right-1 hover:bg-blue-600 text-white px-4 py-1 whitespace-nowrap rounded-md transition"
            >
              AI Assistance
          </button> </div>)
      }
      
    </section>
  );
}

export default Output;
