module.exports = (opts = { }) => {

  const parser = require('postcss-selector-parser');

  const createTransformer = suffix => {
    return selectors => {
      selectors.walk(selector => {
          if (selector.type == "class") {
            selector.value += `-${suffix}`
          }
      });
    };
  }

  opts.queries = opts.queries || [
    {name: "sm", query: "(--breakpoint-sm)"},
    {name: "md", query: "(--breakpoint-md)"},
    {name: "lg", query: "(--breakpoint-lg)"},
    {name: "xl", query: "(--breakpoint-xl)"}
  ]

  const createMedia = function(postcss, query) {
    return postcss.atRule({name: "media", params: query, raws: {before: "\n", after: "\n"}});
  }

  return {
    transform: function(rule, postcss) {
      this.nodes = this.nodes || {};
      opts.queries.forEach(query => {
        this.nodes[query.name] = this.nodes[query.name] || createMedia(postcss, query.query)
        const variant = rule.clone()
        variant.raws.before += "  ";
        variant.selectors = variant.selectors.map(selector => {
          return parser(createTransformer(query.name)).processSync(selector);
        });
        this.nodes[query.name].append(variant);
      })
    },
    getNodes: function() {
      const nodes = Object.values(this.nodes);
      delete this.nodes;
      return nodes;
    }
  }
}
