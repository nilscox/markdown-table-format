const isSeparatorLine = (line: string[]) => {
  return line.every(cell => cell.match(/^ *:?---+:? *$/));
};

const getCellsWidths = (table: string[][]) => {
  const widths: number[] = [];

  table.forEach((line, l) => {
    if (l === 1 && isSeparatorLine(line)) {
      return;
    }

    line.forEach((cell, n) => {
      if (widths[n] === undefined || widths[n] < cell.length) {
        widths[n] = cell.length;
      }
    });
  });

  return widths;
};

interface Transformer {
  transform(table: string[][]): string[][];
}

class TrimCellsContentTransformer implements Transformer {
  transform(table: string[][]): string[][] {
    return table.map(line => {
      return line.map(cell => cell.trim());
    });
  }
}

class TrimEmptyLinesTransformer implements Transformer {
  transform(table: string[][]): string[][] {
    return table
      .map(line => {
        if (line.length > 0) {
          return line;
        }
      })
      .filter(Boolean) as string[][];
  }
}

class CellsWidthTransformer implements Transformer {
  transform(table: string[][]): string[][] {
    const hasHeader = table.length >= 2 && isSeparatorLine(table[1]);
    const min = hasHeader ? 3 : 0;
    const widths = getCellsWidths(table);

    return table.map((line, l) => {
      const fillChar = l === 1 && isSeparatorLine(line) ? '-' : ' ';

      return line.map((cell, n) => {
        return cell.padEnd(Math.max(widths[n], min), fillChar);
      });
    });
  }
}

class AddMissingCellsTransformer implements Transformer {
  transform(table: string[][]): string[][] {
    let cellsCount = 0;

    table.forEach(line => {
      if (line.length > cellsCount) {
        cellsCount = line.length;
      }
    });

    return table.map(line => {
      return [...line, ...Array(cellsCount - line.length).fill('')];
    });
  }
}

class AddPaddingTransformer implements Transformer {
  transform(table: string[][]): string[][] {
    const widths = getCellsWidths(table);

    return table.map((line, l) => {
      if (l === 1 && isSeparatorLine(line)) {
        return line.map((_, n) => '---'.padEnd(widths[n] + 2, '-'));
      }

      return line.map(cell => {
        if (cell === '') {
          return ' ';
        }

        return ' ' + cell + ' ';
      });
    });
  }
}

class RemoveHeaderTransformer implements Transformer {
  transform(table: string[][]): string[][] {
    const hasHeader = table.length >= 2 && isSeparatorLine(table[1]);

    if (hasHeader) {
      return table.slice(2);
    }

    return table;
  }
}

export type MarkdownTableFormatOptions = Partial<{
  consistentCellsWidth: boolean;
  addPadding: boolean;
  removeHeader: boolean;
}>;

export const defaultMarkdownTableFormatOptions: MarkdownTableFormatOptions = {
  consistentCellsWidth: true,
  addPadding: true,
  removeHeader: false,
};

export class MarkdownTableFormat {
  private opts: MarkdownTableFormatOptions;

  constructor(opts: MarkdownTableFormatOptions = {}) {
    this.opts = {
      ...defaultMarkdownTableFormatOptions,
      ...opts,
    };
  }

  format(input: string): string {
    const transformers: Transformer[] = [];

    transformers.push(new TrimCellsContentTransformer());
    transformers.push(new TrimEmptyLinesTransformer());
    transformers.push(new AddMissingCellsTransformer());

    if (this.opts.consistentCellsWidth) {
      transformers.push(new CellsWidthTransformer());
    }

    if (this.opts.addPadding) {
      transformers.push(new AddPaddingTransformer());
    }

    if (this.opts.removeHeader) {
      transformers.push(new RemoveHeaderTransformer());
    }

    const table = input
      .split('\n')
      .map(line => line.replace(/(^\||\|$)/g, ''))
      .map(line => line.split(/(?<!\\)\|/g));

    const formatted = transformers.reduce((table, transformer) => transformer.transform(table), table);

    return formatted.map(line => '|' + line.join('|') + '|').join('\n');
  }
}
