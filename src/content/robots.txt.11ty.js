class Robots {
  get data() {
    return {
      permalink: 'robots.txt',
      eleventyExcludeFromCollections: true,
      bots: [
        'anthropic-ai',
        'Claude-Web',
        'ClaudeBot',
        'Claude-SearchBot',
        'Claude-User',
        'GPTBot',
        'ChatGPT-User',
        'OAI-SearchBot',
        'Google-Extended',
        'PerplexityBot',
        'Amazonbot',
        'FacebookBot',
        'Applebot-Extended',
        'Bytespider',
        'Diffbot',
        'ImagesiftBot',
        'Omgili',
        'Omgilibot',
        'YouBot',
      ],
    }
  }

  render({ bots }) {
    const remapped = bots.map(botName => `User-agent: ${botName}`);
    
    return `${remapped.join('\n')}\nDisallow: /\n\nUser-agent: *\nDisallow: /404.html\n\nUser-agent: *\nAllow: /\n`;
  }
}

export default Robots;
