import React, { useRef } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ace';
import "ace-builds/src-noconflict/theme-github";
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-golang';



import 'ace-builds/src-noconflict/ext-language_tools';

const Editor = ({ language, theme, setEditorValue, editorValue, handleRunCode, showOutput, output }) => {

  const editorRef = useRef(null);



  return (
    <div className="bg-blue-950 w-full rounded-lg px-4 py-2 flex flex-col lg:col-span-2">
      <h2 className="text-lg font-semibold mb-2">Code Editor</h2>
      <AceEditor
        mode={language}
        theme='github'
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
        value={editorValue}
        onChange={setEditorValue}
        ref={editorRef}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
        style={{
          width: '100%',
          height: '77vh',
          borderRadius: '8px',
          color: '#172554',
          backgroundColor: '#d1d5db',
          
        }}
      />
      
      
    </div>
  );
};

export default Editor;
