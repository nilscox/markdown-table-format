import { MarkdownTableFormat, MarkdownTableFormatOptions } from './MarkdownTableFormat';

const options: MarkdownTableFormatOptions = {
  consistentCellsWidth: false,
  addPadding: false,
  removeHeader: false,
};

describe('MarkdownTableFormat', () => {
  it('should handle escaped pipes', () => {
    const input = [
      '|a1|b1|',
      '|a\\|2|b2|',
      '|a3|b\\|3\\||',
    ].join('\n');

    const expected = [
      '|a1|b1|',
      '|a\\|2|b2|',
      '|a3|b\\|3\\||',
    ].join('\n');

    const opts = {
      ...options,
    }

    expect(new MarkdownTableFormat(opts).format(input)).toEqual(expected);
  });

  it('should add leading / trailing pipes', () => {
    const input = [
      'a1|b1|',
      'a2|b2',
      '|a3|b3',
    ].join('\n');

    const expected = [
      '|a1|b1|',
      '|a2|b2|',
      '|a3|b3|',
    ].join('\n');

    const opts = {
      ...options,
    }

    expect(new MarkdownTableFormat(opts).format(input)).toEqual(expected);
  });

  it('should add missing cells in a table', () => {
    const input = [
      '| a1 | b1 |',
      '| a2 |',
      '| a3 | b3 |',
    ].join('\n');

    const expected = [
      '|a1|b1|',
      '|a2||',
      '|a3|b3|',
    ].join('\n');

    const opts = {
      ...options,
    }

    expect(new MarkdownTableFormat(opts).format(input)).toEqual(expected);
  });

  it('should keep consistent cells widths', () => {
    const input = [
      '| alpha1 | beta1 |',
      '| a2 | |',
      '| a3 | b3 |',
    ].join('\n');

    const expected = [
      '|alpha1|beta1|',
      '|a2    |     |',
      '|a3    |b3   |',
    ].join('\n');

    const opts = {
      ...options,
      consistentCellsWidth: true,
    };

    expect(new MarkdownTableFormat(opts).format(input)).toEqual(expected);
  });

  it('should keep consistent cells widths with header', () => {
    const input = [
      '| header1 | h2 |',
      '|---|---|---',
      '| alpha1 | beta1 |',
      '| a2 | |',
      '| a3 | b3 |',
    ].join('\n');

    const expected = [
      '|header1|h2   |   |',
      '|-------|-----|---|',
      '|alpha1 |beta1|   |',
      '|a2     |     |   |',
      '|a3     |b3   |   |',
    ].join('\n');

    const opts = {
      ...options,
      consistentCellsWidth: true,
    };

    expect(new MarkdownTableFormat(opts).format(input)).toEqual(expected);
  });

  it('should add padding', () => {
    const input = [
      '| a1 | b1 |',
      '| a2 | |',
      '| a3 | b3 |',
    ].join('\n');

    const expected = [
      '| a1 | b1 |',
      '| a2 | |',
      '| a3 | b3 |',
    ].join('\n');

    const opts = {
      ...options,
      addPadding: true,
    };

    expect(new MarkdownTableFormat(opts).format(input)).toEqual(expected);
  });

  it('should add padding to a line that looks like a separator', () => {
    const input = [
      '| alpha1 | beta1 |',
      '| a2 ||',
      '|---|---|',
      '| a4 | b4 |',
    ].join('\n');

    const expected = [
      '| alpha1 | beta1 |',
      '| a2 | |',
      '| --- | --- |',
      '| a4 | b4 |',
    ].join('\n');

    const opts = {
      ...options,
      addPadding: true,
    };

    expect(new MarkdownTableFormat(opts).format(input)).toEqual(expected);
  });

  it('should format the header correctly when adding padding', () => {
    const input = [
      '|h1|h2|',
      '|---|---|',
      '|a1|b1|',
    ].join('\n');

    const expected = [
      '| h1 | h2 |',
      '|----|----|',
      '| a1 | b1 |',
    ].join('\n');

    const opts = {
      ...options,
      addPadding: true,
    };

    expect(new MarkdownTableFormat(opts).format(input)).toEqual(expected);
  });

  it('should remove the header', () => {
    const input = [
      '|h1|h2|',
      '|---|---|',
      '|a1|b1|',
    ].join('\n');

    const expected = [
      '|a1|b1|',
    ].join('\n');

    const opts = {
      ...options,
      removeHeader: true,
    };

    expect(new MarkdownTableFormat(opts).format(input)).toEqual(expected);
  });

  it('should not remove the header when there is no header', () => {
    const input = [
      '|a1|b1|',
    ].join('\n');

    const expected = [
      '|a1|b1|',
    ].join('\n');

    const opts = {
      ...options,
      removeHeader: true,
    };

    expect(new MarkdownTableFormat(opts).format(input)).toEqual(expected);
  });

  it('should format a table with the default options', () => {
    const input = [
      '  Livre| Personnage |    Citation|',
      '|---|---|-------',
      '  IV  | Perceval | j\'apprécie les fruits au sirop |',
      '|II|Arthur|Mais vous êtes pas mort, espèce de connard ?',
      '| I | Merlin | Qu\'est-ce qui est petit et marron ? |',
    ].join('\n');

    const expected = [
      '| Livre | Personnage | Citation                                     |',
      '|-------|------------|----------------------------------------------|',
      '| IV    | Perceval   | j\'apprécie les fruits au sirop               |',
      '| II    | Arthur     | Mais vous êtes pas mort, espèce de connard ? |',
      '| I     | Merlin     | Qu\'est-ce qui est petit et marron ?          |',
    ].join('\n');

    expect(new MarkdownTableFormat().format(input)).toEqual(expected);
  })
});
