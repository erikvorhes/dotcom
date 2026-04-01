class Robots {
  get data() {
    return {
      permalink: 'robots.txt',
      eleventyExcludeFromCollections: true,
      aiBots: [
        'GPTBot',
        'ChatGPT-User',
        'Google-Extended',
        'PerplexityBot',
        'Amazonbot',
        'ClaudeBot',
        'Omgilibot',
        'FacebookBot',
        'Applebot',
        'anthropic-ai',
        'Bytespider',
        'Claude-Web',
        'Diffbot',
        'ImagesiftBot',
        'Omgilibot',
        'Omgili',
        'YouBot',
      ],
    }
  }

  render({ aiBots }) {
    const remapped = aiBots.map(botName => `User-agent: ${botName}\nDisallow: /`);
    
    return `${remapped.join('\n\n')}\n\nUser-agent: *\nDisallow: /404.html\n\nUser-agent: *\nAllow: /\n`;
  }
}

export default Robots;
