import { useEffect, useMemo, useState } from "react";

// Import Yoopta Editor Core
import YooptaEditor, { createYooptaEditor, YooptaContentValue, YooptaOnChangeOptions } from '@yoopta/editor';

// Import Yoopta Plugins
import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Accordion from '@yoopta/accordion';
import Image from '@yoopta/image';
import Video from '@yoopta/video';
import Link from '@yoopta/link';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import Table from '@yoopta/table';
import Code from '@yoopta/code';
import { HeadingOne, HeadingTwo, HeadingThree } from '@yoopta/headings';
import Divider from '@yoopta/divider';

// Import Yoopta Tools
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import ActionMenu, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';

// Import Yoopta Marks
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';

// Import Markdown Serialization
import { markdown, html } from '@yoopta/exports';

// Import ShadCN UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// ✅ MARKS for Rich Text
const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

// ✅ TOOLS for Yoopta Editor
const TOOLS = {
    Toolbar: {
        tool: Toolbar,
        render: DefaultToolbarRender,
    },
    ActionMenu: {
        tool: ActionMenu,
        render: DefaultActionMenuRender,
    },
    LinkTool: {
        tool: LinkTool,
        render: DefaultLinkToolRender,
    },
};

// ✅ PLUGINS for Yoopta Editor
const plugins = [
    Paragraph,
    Blockquote,
    Link,
    Image,
    Divider,
    HeadingOne,
    HeadingTwo,
    HeadingThree,
    NumberedList,
    BulletedList,
    TodoList,
    Code,
];

const Editor = () => {
    // ✅ Initialize Yoopta Editor
    const [bIsReadOnly, setBIsReadOnly] = useState(false);
    const editor = useMemo(() => createYooptaEditor(), []);
    const [value, setValue] = useState<YooptaContentValue>();

  // ✅ Load content from localStorage when the component mounts
  useEffect(() => {
    const savedContent = localStorage.getItem('editor-value');
    if (savedContent) {
      const deserializedValue = html.deserialize(editor, savedContent);
      editor.setEditorValue(deserializedValue);
    }
  }, []);

    // ✅ HTML Serialization
    const serializeHTML = () => {
        const data = editor.getEditorValue();
        const htmlString = html.serialize(editor, data);
        console.log('html string', htmlString);
    };

    // ✅ HTML Deserialization
    const deserializeHTML = () => {
        const htmlString = `
        <body id="yoopta-clipboard" data-editor-id="7a0d626a-1d82-483a-871a-2ee3e4522e47"><h1 data-meta-align="left" data-meta-depth="0" style="margin-left: 0px; text-align: left">First title</h1><p data-meta-align="left" data-meta-depth="0" style="margin-left: 0px; text-align: left"><strong style="font-weight: bolder;">Microsoft Edge</strong> is moving towards a new experience that allows users to <u>choose</u> to browse without third-party <s>cookies</s> <code style="background-color: rgb(242 242 242); border-radius: .25rem; font-size: 75%; padding: 3px 6px;">code.</code></p><ul data-meta-align="left" data-meta-depth="0" style="margin-left: 0px; text-align: left"><li>[ ] This is item 1</li></ul><ul data-meta-align="left" data-meta-depth="0" style="margin-left: 0px; text-align: left"><li>[ ] This is item 2</li></ul><pre data-theme="Copilot" data-language="python" data-meta-align="left" data-meta-depth="0" style="margin-left: 0px; display: flex; width: 100%; justify-content: flex-start; background-color: #263238; color: #fff; padding: 20px 24px; white-space: pre-line;"><code>def func():
  print(&quot;Hello World.&quot;)</code></pre><hr data-meta-theme="solid" data-meta-color="#EFEFEE" style="background-color: #8383e0; height: 1.2px" /><h2 data-meta-align="left" data-meta-depth="0" style="margin-left: 0px; text-align: left">This is new section</h2><blockquote data-meta-align="left" data-meta-depth="0" style="margin-left: 0px; text-align: left; border-left: 3px solid; color: #292929; padding: 2px 14px; margin-top: 8px;">This is a blockquote</blockquote><p data-meta-align="left" data-meta-depth="0" style="margin-left: 0px; text-align: left"></p></body>
        `;
        const content = html.deserialize(editor, htmlString);
        console.log('content', content);

        editor.setEditorValue(content);
    };

    const onEditorChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
        localStorage.setItem('editor-value', html.serialize(editor, value));
        setValue(value);
    }


    const toggleReadOnly = () => {
        setBIsReadOnly(!bIsReadOnly);
        console.log('read only', bIsReadOnly);
    };

    return (
        <Card className="p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-4">Markdown Editor</h2>

            <div className="mt-4 flex gap-4">
                <Button onClick={deserializeHTML} variant="outline">
                    Import HTML
                </Button>
                <Button onClick={serializeHTML}>
                    Export HTML
                </Button>
                <Button onClick={toggleReadOnly}>
                    Toggle Read Only
                </Button>
            </div>

            <YooptaEditor
                key={bIsReadOnly.toString()}
                value={value}
                editor={editor}
                plugins={plugins}
                marks={MARKS}
                readOnly={bIsReadOnly}
                autoFocus={true}
                tools={TOOLS}
                onChange={onEditorChange}
            />
        </Card>
    );
}


export default Editor;