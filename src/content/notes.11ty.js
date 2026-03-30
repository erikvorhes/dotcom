import { DateTime } from 'luxon';

class NotesArchive {
  get data() {
    return {
      title: 'Note Archive',
      eleventyNavigation: {
        key: 'Note Archive',
        order: 3,
      },
      layout: 'layouts/note_archive.njk',
      noindex: true,
      templateEngineOverride: '11ty.js,md',
    };
  }

  render({ collections, title }) {
    const notes = collections.notes.toReversed();
    const notesByYear = new Map();

    for (const note of notes) {
      const year = DateTime.fromJSDate(new Date(note.date), { zone: 'utc' }).toLocaleString({ year: 'numeric' });
      const currentYearNotes = notesByYear.get(year) || [];
      notesByYear.set(year, [...currentYearNotes, note]);
    }

    let content = [`# ${title}`];
    notesByYear.forEach(function pushYearContent(items, key) {
      if (!items.length) {
        return;
      }

      const yearContent = items.map(item => {
        const dateString = DateTime.fromJSDate(new Date(item.date), { zone: 'utc' }).toLocaleString({ month: 'long', day: 'numeric' });
        return `* [${item.data.title}](${item.url})<br>*${dateString}*${item.data.summary ? ` --- ${item.data.summary}` : ''}`;
      });

      content.push(`<section class="flow">\n<h2 id="year-${key}">${key}</h2>\n\n${yearContent.join('\n')}\n\n</section>`);
    });

    return `<article class="flow note-archive">\n\n${content.join('\n\n')}\n\n</article>`;
  }
}

export default NotesArchive;
