import React, { HTMLProps, useMemo, useState } from 'react';

import {
  defaultMarkdownTableFormatOptions,
  MarkdownTableFormat,
  MarkdownTableFormatOptions,
} from './MarkdownTableFormat';

type CheckboxProps = {
  checked?: boolean;
  onChange?: (value: boolean) => void;
};

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, children }) => (
  <label style={{ display: 'block' }}>
    <input type="checkbox" checked={checked} onChange={e => onChange?.(e.target.checked)} />
    {children}
  </label>
);

type TextAreaProps = Omit<HTMLProps<HTMLTextAreaElement>, 'onChange'> & {
  onChange?: (text: string) => void;
};

const initialText = `  Livre| Personnage |    Citation|
|---|---|-------
  IV  | Perceval | j'apprécie les fruits au sirop |
|II|Arthur|Mais vous êtes pas mort, espèce de connard ?
| I | Merlin | Qu'est-ce qui est petit et marron ? |`;

const TextArea: React.FC<TextAreaProps> = ({ onChange, ...props }) => (
  <textarea rows={12} cols={80} onChange={e => onChange?.(e.target.value)} {...props} />
);

const App: React.FC = () => {
  const [opts, setOpts] = useState<MarkdownTableFormatOptions>(defaultMarkdownTableFormatOptions);
  const [text, setText] = useState(initialText);

  const setOption = (option: keyof MarkdownTableFormatOptions, value: boolean) => setOpts({ ...opts, [option]: value });

  const formatter = useMemo(() => new MarkdownTableFormat(opts), [opts]);
  const formatted = useMemo(() => (text ? formatter.format(text) : ''), [formatter, text]);

  return (
    <div style={{ width: '80%', margin: 'auto' }}>
      <div style={{ margin: '24px 0' }}>
        <Checkbox checked={opts.consistentCellsWidth} onChange={value => setOption('consistentCellsWidth', value)}>
          consistentCellsWidth
        </Checkbox>
        <Checkbox checked={opts.addPadding} onChange={value => setOption('addPadding', value)}>
          addPadding
        </Checkbox>
        <Checkbox checked={opts.removeHeader} onChange={value => setOption('removeHeader', value)}>
          removeHeader
        </Checkbox>
      </div>

      <div style={{ display: 'flex' }}>
        <TextArea
          placeholder="paste your markdown table here"
          value={text}
          onChange={setText}
          style={{ flex: 1, marginRight: 12 }}
        />
        <TextArea placeholder="" readOnly value={formatted} style={{ flex: 1, marginLeft: 12 }} />
      </div>

      <button style={{ marginTop: 24 }} onClick={() => navigator.clipboard.writeText(formatted)}>
        Copy formatted
      </button>
    </div>
  );
};

export default App;
