// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '=nil; Foundation Documentation Portal',
  tagline: '',
  favicon: 'img/nil-logo.png',

  // Set the production url of your site here
  url: 'https://docs.nil.foundation/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: '=nil; Foundation', // Usually your GitHub org/user name.
  projectName: 'docs.nil.foundation', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      (
        {
          theme: {
            customCss: './src/css/custom.css',
          },
        }
      ),
    ],
  ],
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'zkllvm',
        path: 'zkllvm',
        routeBasePath: 'zkllvm',
        sidebarPath: './sidebar-zkllvm.js'
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'proof-market',
        path: 'proof-market',
        routeBasePath: 'proof-market',
        sidebarPath: './sidebar-proof-market.js'
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'crypto3',
        path: 'crypto3',
        routeBasePath: 'crypto3',
        sidebarPath: './sidebar-crypto-3.js'
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'zksharding',
        path: 'zksharding',
        routeBasePath: 'zksharding',
        sidebarPath: './sidebars.js'
      }
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    (
      {
        algolia: {
          appId: 'KDQGY81FVN',
          apiKey: '8ad8d801f2775ff3cf8c4433dfe290e4',
          indexName: 'nil',
          contextualSearch: true,
          searchParameters: {},
          searchPagePath: 'search',
          insights: false,
        },
        colorMode: {
          defaultMode: 'dark',
          disableSwitch: true,

        },
        navbar: {
          title: '=nil; Foundation',
          logo: {
            src: 'img/nil-logo.png',
          },
          items: [
            {
              position: 'left',
              label: 'zkLLVM',
              to: '/zkllvm/overview/what-is-zkllvm'

            },
            {
              position: 'left',
              label: 'Proof Market',
              to: '/proof-market/intro'
            },
            {
              position: 'left',
              label: 'zkSharding',
              to: 'https://nil.foundation/blog/post/nil_zkSharding'
            },
            {
              position: 'left',
              label: 'Crypto3',
              to: '/crypto3/intro'
            },
          ],
        },
        footer: {
          links: [
            {
              title: 'Community',
              items: [
                {
                  label: 'Discord',
                  to: 'https://discord.gg/KmTAEjbmM3'
                },
                {
                  label: 'GitHub',
                  to: 'https://github.com/nilfoundation'
                },
                {
                  label: 'Telegram',
                  to: 'https://t.me/nilfoundation'
                }
              ],
            }
          ],
          style: 'dark',
          copyright: `Copyright © ${new Date().getFullYear()} =nil; Foundation`,
        },
        prism: {
          defaultLanguage: 'clike',
          theme: prismThemes.vsDark,
          darkTheme: prismThemes.vsDark,
        },
      }),
};

export default config;
