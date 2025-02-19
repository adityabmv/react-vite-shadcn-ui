import YooptaEditor, { createYooptaEditor, YooptaContentValue, YooptaOnChangeOptions } from '@yoopta/editor';
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

import { useMemo, useState } from 'react';
// IMPORT TOOLS
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import ActionMenu, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';

// IMPORT MARKS
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

// Tools should be defined outside component
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


const plugins = [Paragraph, Blockquote, Link, Image, Divider, HeadingOne, HeadingTwo, HeadingThree, NumberedList, BulletedList, TodoList];

export default function Editor() {
    const editor = useMemo(() => createYooptaEditor(), []);
    const [value, setValue] = useState<YooptaContentValue>();

    const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
        setValue(value);
    };

    return (
        <div>
            <YooptaEditor
                editor={editor}
                placeholder="Type text.."
                value={value}
                onChange={onChange}
                // here we go
                plugins={plugins}
                tools={TOOLS}
                marks={MARKS}
            />
        </div>
    );
}