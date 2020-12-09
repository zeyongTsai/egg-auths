module.exports = {
  source: {
    include: [
      './lib', 
      './app/auth',
    ]
  },
  opts: {
    template: 'node_modules/docdash',
    destination: './docs',
    tutorials: "./tutorials"
  },
  docdash: {
    sectionOrder: [
      "Tutorials",
      "Classes",
      "Interfaces",
      "Namespaces",
      "Modules",
      "Externals",
      "Events",
      "Mixins"
    ],
    search: true,
    menu: {
      github: {
        href:"https://github.com/zeyongTsai/egg-auths",
        target:"_blank",
        class:"menu-item",
        id:"github_link"
      },
      gitlab: {
        href:"http://git.linker.cc/linkerfe/egg-auth",
        target:"_blank",
        class:"menu-item",
        id:"gitlab_link"
      }
    }
  }
}
